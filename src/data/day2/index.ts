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

// Ngày 2 — Unit 2, bài đọc 4–6
export const day2: DayContent = {
  dayId: 2,
  title: 'The Generation Gap (2)',
  topic: 'Unit 2 · Bài đọc 4–6',
  passages: [passageById('p4'), passageById('p5'), passageById('p6'), ...examPassages],
  vocab: [...vocab, ...phraseVocab],
  questions: [...m1, ...m2, ...m3, ...exam1, ...exam2, ...readingQuestions.filter((q) => ['p4', 'p5', 'p6'].includes(q.passageId!))],
  sections: [
    { id: 'mini1', kind: 'mini', mode: 'practice', title: 'Mini 1 — Nhận diện', subtitle: 'Nhận ra nghĩa từ về nghề nghiệp, vai trò giới và sự tò mò', durationSec: 9 * 60, passThreshold: 80, questionIds: ids(m1) },
    { id: 'mini2', kind: 'mini', mode: 'practice', title: 'Mini 2 — Tự nhớ lại', subtitle: 'Viết ra từ, dùng đúng dạng và cụm từ cố định', durationSec: 11 * 60, passThreshold: 80, requires: 'mini1', questionIds: ids(m2) },
    { id: 'mini3', kind: 'mini', mode: 'practice', title: 'Mini 3 — Vận dụng', subtitle: 'Dùng từ bài đọc 4–6 trong các dạng bài của đề thi', durationSec: 13 * 60, passThreshold: 80, requires: 'mini2', questionIds: ids(m3) },
    { id: 'de1', kind: 'exam', mode: 'practice', title: 'Đề tổng hợp 1', subtitle: 'Thông báo · Tờ rơi · Bài đọc 4, 5', durationSec: 0, passThreshold: 0, requires: 'mini3', questionIds: exam1Ids, lookup: true, prime: true, followUp: true, bonusQuestions: true, clozeReview: true },
    { id: 'de2', kind: 'exam', mode: 'exam', title: 'Đề tổng hợp 2', subtitle: 'Sắp xếp câu · Điền câu · Bài đọc 6', durationSec: Math.round(exam2Ids.length * 1.25) * 60, passThreshold: 0, requires: 'de1', questionIds: exam2Ids, answerSheet: true, clozeReview: true },
    { id: 'final', kind: 'final', mode: 'exam', title: 'Round cuối — Gõ từ', subtitle: 'Nghe hoặc đọc nghĩa, gõ lại từ tiếng Anh', durationSec: 0, passThreshold: 90, requires: 'de2', questionIds: [], maxWords: 20 },
  ],
  strategies,
};
