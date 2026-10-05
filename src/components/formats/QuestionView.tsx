'use client';

import type { FormatProps } from './types';
import { Choice, MultiSelect } from './Choice';
import { Match } from './Match';
import { JumbledOrder, WordOrdering } from './Ordering';
import { Categorize, ClozeBank, ClozeChoice, TapSegment, TextAnswer } from './Misc';

export const FORMAT_LABEL: Record<string, string> = {
  mcq: 'Trắc nghiệm', trueFalse: 'Đúng / Sai', oddOneOut: 'Từ khác nhóm', multiSelect: 'Chọn nhiều',
  insertSentence: 'Chèn câu', tapSegment: 'Chạm chọn', match: 'Nối cặp', wordOrdering: 'Ghép câu',
  jumbledOrder: 'Sắp xếp', categorize: 'Phân loại', clozeBank: 'Điền từ cho sẵn', clozeChoice: 'Điền khuyết', fillBlank: 'Điền từ',
  scramble: 'Xếp chữ cái', translateToEn: 'Dịch Việt → Anh', wordFormInput: 'Dạng từ (word form)', dictation: 'Nghe & chép',
};

export function QuestionView(props: FormatProps) {
  switch (props.q.format) {
    case 'multiSelect':
      return <MultiSelect {...props} />;
    case 'match':
      return <Match {...props} />;
    case 'wordOrdering':
      return <WordOrdering {...props} />;
    case 'jumbledOrder':
      return <JumbledOrder {...props} />;
    case 'categorize':
      return <Categorize {...props} />;
    case 'clozeBank':
      return <ClozeBank {...props} />;
    case 'clozeChoice':
      return <ClozeChoice {...props} />;
    case 'tapSegment':
      return <TapSegment {...props} />;
    case 'fillBlank':
    case 'scramble':
    case 'translateToEn':
    case 'wordFormInput':
    case 'dictation':
      return <TextAnswer {...props} />;
    default:
      return <Choice {...props} />;
  }
}
