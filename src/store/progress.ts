'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSyncExternalStore } from 'react';
import { reviewAfterAnswer } from '@/lib/review';
import type {
  QuestionFormat, SectionProgress, StudentProgress, TestMode, WordSource,
} from '@/types';

/** Khoá tiến độ theo ngày + bài — mỗi ngày đều có mini1, de1… */
export const secKey = (dayId: number, sectionId: string) => `${dayId}:${sectionId}`;

export interface AttemptWord {
  word: string;
  correct: boolean;
  hint3: boolean;
}

export interface AttemptWrong {
  questionId: string;
  format: QuestionFormat;
  strategyTag: string;
}

export interface AttemptResult {
  /** secKey(dayId, sectionId) */
  sectionId: string;
  dayId: number;
  mode: TestMode;
  /** % sau trừ hint */
  score: number;
  /** % thô */
  rawScore: number;
  hintsUsed: number;
  timeSpent: number;
  wrongQuestionIds: string[];
  /** Thông tin câu sai để ghi vào wrongBank (báo cáo giáo viên) */
  wrong: AttemptWrong[];
  passed: boolean;
  words: AttemptWord[];
}

interface ProgressState {
  student: StudentProgress;
  /** Tài khoản mà bản tiến độ trên máy này thuộc về — đổi người đăng nhập thì nạp lại từ server */
  ownerId: string | null;
  /** Chế độ giáo viên: mở khóa mọi bài */
  unlockAll: boolean;
  rename: (name: string) => void;
  /** Nạp tiến độ từ server (ghi đè bản trên máy) */
  replaceStudent: (ownerId: string | null, data: StudentProgress | null) => void;
  setUnlockAll: (v: boolean) => void;
  recordAttempt: (r: AttemptResult) => void;
  addLookup: (dayId: number, word: string) => void;
  addToWordBook: (dayId: number, word: string, source: WordSource) => void;
  removeFromWordBook: (word: string) => void;
  reset: () => void;
}

const emptySection = (): SectionProgress => ({
  attempts: 0, passed: false, bestScore: 0, lastRawScore: 0, lastScore: 0, hintsUsed: 0, timeSpent: 0, wrongQuestionIds: [],
});

/** Một học sinh duy nhất, tiến độ lưu localStorage của máy đang dùng */
const STUDENT_ID = 'student';
const blankStudent = (): StudentProgress => ({
  studentId: STUDENT_ID, studentName: 'Học sinh', sections: {}, vocabMastery: {},
  lookups: {}, wordBook: [], wrongBank: [], totalTimeSpent: 0, updatedAt: new Date().toISOString(),
});

/** Thêm từ vào Sổ từ, không trùng lặp (giữ nguồn đầu tiên) */
function pushWord(s: StudentProgress, dayId: number, word: string, source: WordSource) {
  if (s.wordBook.some((e) => e.word === word)) return s.wordBook;
  return [...s.wordBook, { word, dayId, source, addedAt: new Date().toISOString() }];
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      student: blankStudent(),
      ownerId: null,
      unlockAll: false,
      rename: (name) =>
        set((s) => ({ student: { ...s.student, studentName: name.trim() || 'Học sinh' } })),
      replaceStudent: (ownerId, data) =>
        set({ ownerId, student: data ? { ...blankStudent(), ...data } : blankStudent() }),
      setUnlockAll: (v) => set({ unlockAll: v }),
      reset: () => set((s) => ({ student: { ...blankStudent(), studentName: s.student.studentName } })),
      removeFromWordBook: (word) =>
        set((s) => ({ student: { ...s.student, wordBook: s.student.wordBook.filter((e) => e.word !== word) } })),
      addToWordBook: (dayId, word, source) =>
        set((s) => ({ student: { ...s.student, wordBook: pushWord(s.student, dayId, word, source) } })),
      addLookup: (dayId, word) =>
        set((s) => {
          const list = s.student.lookups?.[dayId] ?? [];
          if (list.includes(word)) return s;
          return {
            student: {
              ...s.student,
              lookups: { ...s.student.lookups, [dayId]: [...list, word] },
              // Từ đã tra tự vào Sổ từ (V2 → V8)
              wordBook: pushWord(s.student, dayId, word, 'lookup'),
            },
          };
        }),
      recordAttempt: (r) =>
        set((s) => {
          const p = s.student;
          const prev = p.sections[r.sectionId] ?? emptySection();
          // Review mode chỉ làm lại câu sai → cập nhật danh sách câu sai, không ghi đè điểm
          const wrongIds =
            r.mode === 'review'
              ? prev.wrongQuestionIds.filter((id) => r.wrongQuestionIds.includes(id))
              : r.wrongQuestionIds;
          const section: SectionProgress =
            r.mode === 'review'
              ? { ...prev, wrongQuestionIds: wrongIds, timeSpent: prev.timeSpent + r.timeSpent, lastAt: new Date().toISOString() }
              : {
                  attempts: prev.attempts + 1,
                  passed: prev.passed || r.passed,
                  bestScore: Math.max(prev.bestScore, r.score),
                  lastRawScore: r.rawScore,
                  lastScore: r.score,
                  hintsUsed: r.hintsUsed,
                  timeSpent: prev.timeSpent + r.timeSpent,
                  wrongQuestionIds: wrongIds,
                  lastAt: new Date().toISOString(),
                };

          // Từ vựng: cập nhật lịch ôn liên ngày
          const vm = { ...p.vocabMastery };
          let wordBook = p.wordBook;
          for (const w of r.words) {
            vm[w.word] = reviewAfterAnswer(vm[w.word], w.correct, w.hint3);
            // Từ sai hoặc phải dùng nghĩa tiếng Việt → vào Sổ từ
            if (!w.correct || w.hint3) {
              wordBook = pushWord({ ...p, wordBook }, r.dayId, w.word, 'wrong');
            }
          }

          // Câu sai tích lũy
          const bank = [...p.wrongBank];
          for (const w of r.wrong) {
            const i = bank.findIndex((e) => e.questionId === w.questionId);
            if (i >= 0) bank[i] = { ...bank[i], wrongCount: bank[i].wrongCount + 1, lastWrongAt: new Date().toISOString() };
            else bank.push({ ...w, dayId: r.dayId, sectionId: r.sectionId, wrongCount: 1, lastWrongAt: new Date().toISOString() });
          }

          return {
            student: {
              ...p,
              sections: { ...p.sections, [r.sectionId]: section },
              vocabMastery: vm,
              wordBook,
              wrongBank: bank,
              totalTimeSpent: p.totalTimeSpent + r.timeSpent,
              updatedAt: new Date().toISOString(),
            },
          };
        }),
    }),
    {
      name: 'td-english:v2',
      version: 2,
      // Bản v1 lưu nhiều hồ sơ; nay chỉ còn 1 học sinh → lấy hồ sơ đang chọn
      migrate: (state: unknown) => {
        const old = state as { profiles?: StudentProgress[]; currentId?: string; unlockAll?: boolean };
        const first = old.profiles?.find((p) => p.studentId === old.currentId) ?? old.profiles?.[0];
        return {
          student: { ...blankStudent(), ...first, studentId: STUDENT_ID, wordBook: first?.wordBook ?? [], wrongBank: first?.wrongBank ?? [] },
          ownerId: null,
          unlockAll: old.unlockAll ?? false,
        } as ProgressState;
      },
    },
  ),
);

/** Giữ tên cũ để các màn hình không phải sửa — luôn trả về học sinh duy nhất */
export function useCurrentStudent() {
  return useProgress((s) => s.student);
}

/** localStorage chỉ có ở client → chờ mount xong mới render dữ liệu tiến độ */
const noopSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
