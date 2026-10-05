import type { HintLevel, Question, VocabItem } from '@/types';

export interface ResolvedHint {
  text?: string;
  /** index các lựa chọn bị loại (options hoặc segments) */
  eliminate?: number[];
}

function wrongIndexes(q: Question): number[] {
  if (q.format === 'tapSegment') {
    return q.segments!.map((s, i) => (s.selectable && i !== q.answer ? i : -1)).filter((i) => i >= 0);
  }
  if (q.format === 'multiSelect') {
    return q.options!.map((_, i) => i).filter((i) => !q.answerIndexes!.includes(i));
  }
  return (q.options ?? []).map((_, i) => i).filter((i) => i !== q.answer);
}

const blankOut = (sentence: string, word: string) =>
  sentence.replace(new RegExp(word.split(' ')[0].slice(0, -1) + '\\w*', 'i'), '_____');

export function resolveHint(q: Question, level: HintLevel, vocab: Record<string, VocabItem>): ResolvedHint {
  const v = q.targetWords.length ? vocab[q.targetWords[0]] : undefined;
  const ans = q.answers?.[0];
  switch (level.type) {
    case 'custom':
    case 'locate':
      return { text: level.text };
    case 'eliminate': {
      const w = wrongIndexes(q);
      return { eliminate: w.slice(0, 1), text: 'Đã loại 1 đáp án sai.' };
    }
    case 'eliminateTwo': {
      const w = wrongIndexes(q);
      const n = Math.min(2, w.length);
      return { eliminate: w.slice(0, n), text: `Đã loại ${n} đáp án sai.` };
    }
    case 'firstLetter': {
      const word = ans ?? v?.word ?? '';
      return { text: `Bắt đầu bằng "${word[0]?.toUpperCase()}", gồm ${word.replace(/\s/g, '').length} chữ cái.` };
    }
    case 'syllables':
      return v ? { text: `${v.syllableCount} âm tiết, trọng âm rơi vào âm ${v.stressPosition}.` } : {};
    case 'wordFamily':
      return v ? { text: `Họ từ: ${v.word} (${v.partOfSpeech}) · ${v.wordFamily.join(' · ')}` } : {};
    case 'meaningEn':
      return v ? { text: `"${v.word}" = ${v.meaningEn}` } : {};
    case 'meaningVi':
      return v ? { text: `Nghĩa tiếng Việt: "${v.word}" = ${v.meaningVi}` } : {};
    case 'image':
      return v ? { text: `${v.emoji}  (${v.synonyms.length ? 'gần nghĩa: ' + v.synonyms.join(', ') : v.meaningEn})` } : {};
    case 'synonym':
      return v ? { text: `Đồng nghĩa: ${v.synonyms.join(', ')}` } : {};
    case 'collocation':
      return v ? { text: `Cụm hay gặp: ${v.collocations.join(' · ')}` } : {};
    case 'examplePassage':
      return v ? { text: `Trong bài: "${blankOut(v.exampleFromPassage, v.word)}"` } : {};
    case 'exampleNew':
      return v ? { text: `Ví dụ: "${blankOut(v.exampleNew, v.word)}"` } : {};
    case 'ipa':
      return v ? { text: `Phát âm: ${v.ipa}` } : {};
    case 'mnemonic':
      return v?.mnemonicVi ? { text: `Mẹo nhớ: ${v.mnemonicVi}` } : {};
    default:
      return {};
  }
}
