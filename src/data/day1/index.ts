import type { DayContent } from '@/types';
import { passageById, readingQuestions, strategies } from '../unit2';
import { exam1, exam1Ids, exam2, exam2Ids, examPassages } from './exam';
import { mini1, mini2, mini3 } from './practice';
import { phraseMini1, phraseMini2, phraseMini3, phraseVocab } from './phrases';
import { vocab } from './vocab';

const ids = (qs: { id: string }[]) => qs.map((q) => q.id);

// Mỗi mini test gồm phần từ vựng và phần cụm từ / cấu trúc rút từ cùng bài đọc
const m1 = [...mini1, ...phraseMini1];
const m2 = [...mini2, ...phraseMini2];
const m3 = [...mini3, ...phraseMini3];

// Ngày 1 — Unit 2, bài đọc 1–3
export const day1: DayContent = {
  dayId: 1,
  title: 'The Generation Gap (1)',
  topic: 'Unit 2 · Bài đọc 1–3',
  passages: [passageById('p1'), passageById('p2'), passageById('p3'), ...examPassages],
  vocab: [...vocab, ...phraseVocab],
  questions: [...m1, ...m2, ...m3, ...exam1, ...exam2, ...readingQuestions.filter((q) => ['p1', 'p2', 'p3'].includes(q.passageId!))],
  sections: [
    { id: 'mini1', kind: 'mini', mode: 'practice', title: 'Mini 1 — Nhận diện', subtitle: 'Nhận ra nghĩa của từ và cụm từ', durationSec: 9 * 60, passThreshold: 80, questionIds: ids(m1) },
    { id: 'mini2', kind: 'mini', mode: 'practice', title: 'Mini 2 — Tự nhớ lại', subtitle: 'Viết lại từ, nhớ giới từ đi kèm trong cụm', durationSec: 11 * 60, passThreshold: 80, requires: 'mini1', questionIds: ids(m2) },
    { id: 'mini3', kind: 'mini', mode: 'practice', title: 'Mini 3 — Vận dụng', subtitle: 'Dùng từ và cụm trong các dạng bài của đề thi', durationSec: 13 * 60, passThreshold: 80, requires: 'mini2', questionIds: ids(m3) },
    { id: 'de1', kind: 'exam', mode: 'practice', title: 'Đề tổng hợp 1', subtitle: 'Thông báo · Tờ rơi · Bài đọc 1, 2', durationSec: 0, passThreshold: 0, requires: 'mini3', questionIds: exam1Ids, lookup: true, prime: true, followUp: true, bonusQuestions: true, clozeReview: true },
    { id: 'de2', kind: 'exam', mode: 'exam', title: 'Đề tổng hợp 2', subtitle: 'Sắp xếp câu · Điền câu · Bài đọc 3', durationSec: Math.round(exam2Ids.length * 1.25) * 60, passThreshold: 0, requires: 'de1', questionIds: exam2Ids, answerSheet: true, clozeReview: true },
    { id: 'final', kind: 'final', mode: 'exam', title: 'Round cuối — Gõ từ', subtitle: 'Nghe hoặc đọc nghĩa, gõ lại từ tiếng Anh', durationSec: 0, passThreshold: 90, requires: 'de2', questionIds: [], maxWords: 20 },
  ],
  strategies,
};
