import type { VocabItem, VocabMastery, StudentProgress } from '@/types';

/**
 * Lịch ôn liên ngày (mục 2.2 của kế hoạch).
 * Bậc 0 = chưa vào lịch. Trả lời đúng thì lên bậc, sai thì tụt về bậc 1.
 */
const SPACING_DAYS = [1, 1, 3, 7];
export const MASTER_STREAK = 3;

export const todayISO = () => new Date().toISOString().slice(0, 10);

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const emptyMastery = (): VocabMastery => ({
  correct: 0, wrong: 0, streak: 0, hint3Used: false, mastered: false, level: 0,
});

/**
 * Cập nhật một từ sau khi được hỏi.
 * - Sai 1 lần → ôn lại sau 1 ngày; sai lần nữa (bậc đã tụt) → sau 3 ngày
 * - Đúng 3 lần liên tiếp, không dùng hint bậc 3 → mastered, rút khỏi pool
 * - Dùng hint bậc 3 → luôn quay lại pool ngày mai, bất kể đúng/sai
 */
export function reviewAfterAnswer(prev: VocabMastery | undefined, correct: boolean, hint3: boolean): VocabMastery {
  const m = { ...(prev ?? emptyMastery()) };
  m.lastAt = new Date().toISOString();
  if (hint3) m.hint3Used = true;

  if (correct) {
    m.correct++;
    m.streak++;
    m.level = Math.min(SPACING_DAYS.length - 1, Math.max(1, m.level + 1));
  } else {
    m.wrong++;
    m.streak = 0;
    // Sai lần đầu về bậc 1 (ôn sau 1 ngày); sai tiếp khi đang ở bậc 1 → bậc 2 (sau 3 ngày)
    m.level = m.level <= 1 ? (m.wrong >= 2 ? 2 : 1) : 1;
  }

  m.mastered = correct && m.streak >= MASTER_STREAK && !m.hint3Used;
  // Hint bậc 3 → ngày mai ôn lại. Mastered → rút khỏi lịch.
  m.nextReviewAt = m.mastered ? undefined : hint3 ? addDays(1) : addDays(SPACING_DAYS[m.level]);
  return m;
}

/** Từ này có đến hạn ôn chưa */
export function isDue(m: VocabMastery | undefined, onDate = todayISO()): boolean {
  if (!m || m.mastered) return false;
  if (!m.nextReviewAt) return m.wrong > 0 || m.hint3Used;
  return m.nextReviewAt <= onDate;
}

/**
 * Chọn từ cho Warm-up: lấy từ các ngày TRƯỚC ngày đang học.
 * Ưu tiên từ trong Sổ từ, rồi từ đến hạn ôn sớm nhất, rồi từ sai nhiều nhất.
 */
export function dueWords(pool: VocabItem[], student: StudentProgress, max: number): VocabItem[] {
  const inBook = new Set(student.wordBook.map((e) => e.word));
  return pool
    .filter((v) => isDue(student.vocabMastery[v.word]) || inBook.has(v.word))
    .map((v) => {
      const m = student.vocabMastery[v.word];
      return {
        v,
        rank:
          (inBook.has(v.word) ? 0 : 1) * 100 +
          (m?.nextReviewAt ? 0 : 10) +
          Math.max(0, 5 - (m?.wrong ?? 0)),
      };
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, max)
    .map((x) => x.v);
}
