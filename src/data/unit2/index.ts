import type { Passage, Question } from '@/types';
import { passages as rawPassages } from './passages';
import { readingQuestions as rawReading } from './reading';
import { passagesVi, readingVi } from './translations';

export { strategies } from './strategies';

/** 6 bài đọc Unit 2, kèm bản dịch từng đoạn */
export const passages: Passage[] = rawPassages.map((p) => ({ ...p, paragraphsVi: passagesVi[p.id] }));

/** 54 câu đọc hiểu đề gốc, kèm bản dịch câu hỏi và đáp án */
export const readingQuestions: Question[] = rawReading.map((q) => ({ ...q, ...readingVi[q.id] }));

export const passageById = (id: string) => passages.find((p) => p.id === id)!;
export const readingFor = (passageId: string) => readingQuestions.filter((q) => q.passageId === passageId);
