import type { Given, Question } from '@/types';

/** Bố cục ngẫu nhiên cố định trong 1 phiên làm bài */
export interface Layout {
  /** thứ tự hiển thị options / items / tokens */
  order: number[];
  /** thứ tự hiển thị cột phải (match) / word bank (cloze) */
  order2: number[];
  scrambled?: string;
}

export interface FormatProps {
  q: Question;
  given: Given;
  onChange: (g: Given) => void;
  /** đã chấm → không cho sửa */
  locked: boolean;
  /** hiện đúng/sai */
  reveal: boolean;
  eliminated: number[];
  layout: Layout;
  onEnter?: () => void;
}
