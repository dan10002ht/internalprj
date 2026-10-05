import type { Passage, VocabItem } from '@/types';

export const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Các dạng của từ có thể xuất hiện trong bài: từ gốc, -s/-es/-d/-ed và `forms` khai báo thêm */
export function surfaceForms(v: VocabItem) {
  const w = v.word;
  return [w, `${w}s`, `${w}es`, `${w}d`, `${w}ed`, ...(v.forms ?? [])];
}

/** Từ này có xuất hiện trong đoạn text không */
export function appearsIn(text: string, v: VocabItem) {
  return surfaceForms(v).some((f) => new RegExp(`\\b${escapeRe(f)}\\b`, 'i').test(text));
}

/** Các từ của ngày xuất hiện trong một bài đọc, theo thứ tự khai báo từ vựng */
export function vocabInPassage(passage: Passage, vocab: VocabItem[]): VocabItem[] {
  const text = [passage.title, ...passage.paragraphs].join('\n');
  return vocab.filter((v) => appearsIn(text, v));
}
