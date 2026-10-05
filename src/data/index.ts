import type { DayContent, TestSection } from '@/types';
import { day1 } from './day1';
import { day2 } from './day2';

/** Warm-up — ôn lại từ của các ngày trước, chỉ có từ ngày thứ hai trở đi */
const warmupSection = (): TestSection => ({
  id: 'warmup',
  kind: 'warmup',
  mode: 'practice',
  title: 'Warm-up — Ôn từ ngày trước',
  subtitle: 'Nhắc lại các từ đã đến hạn ôn',
  durationSec: 3 * 60,
  passThreshold: 0,
  questionIds: [],
  maxWords: 10,
});

/** Các ngày học — giáo viên tự định nghĩa, thêm ngày mới vào đây */
const raw: DayContent[] = [day1, day2];

export const days: DayContent[] = raw.map((d, i) =>
  i === 0 ? d : { ...d, sections: [warmupSection(), ...d.sections] },
);

export function getDay(dayId: number): DayContent | undefined {
  return days.find((d) => d.dayId === dayId);
}

export function getQuestion(day: DayContent, id: string) {
  return day.questions.find((q) => q.id === id);
}

/** Từ vựng của các ngày TRƯỚC ngày này — pool cho Warm-up */
export function previousVocab(dayId: number) {
  return days.filter((d) => d.dayId < dayId).flatMap((d) => d.vocab);
}

/** Tra một câu hỏi ở bất kỳ ngày nào — dùng cho báo cáo giáo viên */
export function findQuestion(id: string) {
  for (const d of days) {
    const q = d.questions.find((x) => x.id === id);
    if (q) return { day: d, q };
  }
  return undefined;
}
