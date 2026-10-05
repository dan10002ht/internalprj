import type { Given, Question } from '@/types';

export const HINT_PENALTY = [0, 0.1, 0.25, 0.5];

export function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?,]$/, '');
}

/** Đã trả lời đủ để chấm chưa */
export function isAnswered(q: Question, given: Given): boolean {
  if (given === null || given === undefined) return false;
  switch (q.format) {
    case 'multiSelect':
      return Array.isArray(given) && given.length > 0;
    case 'match':
    case 'categorize':
      return Array.isArray(given) && (given as number[]).every((v) => v >= 0);
    case 'clozeBank':
    case 'clozeChoice':
      return Array.isArray(given) && (given as string[]).every((v) => !!v);
    case 'wordOrdering':
      return Array.isArray(given) && given.length === q.ordered!.length;
    case 'jumbledOrder':
      return Array.isArray(given);
    case 'fillBlank':
    case 'scramble':
    case 'translateToEn':
    case 'wordFormInput':
    case 'dictation':
      return typeof given === 'string' && given.trim().length > 0;
    default:
      return typeof given === 'number';
  }
}

/** Trả về tỉ lệ đúng 0..1 (chấm từng phần với match/categorize/cloze/ordering) */
export function gradeFraction(q: Question, given: Given): number {
  if (!isAnswered(q, given)) return 0;
  switch (q.format) {
    case 'multiSelect': {
      const g = new Set(given as number[]);
      const a = new Set(q.answerIndexes);
      return g.size === a.size && [...a].every((x) => g.has(x)) ? 1 : 0;
    }
    case 'match': {
      const g = given as number[];
      return g.filter((r, l) => r === l).length / g.length;
    }
    case 'categorize': {
      const g = given as number[];
      return q.items!.filter((it, i) => g[i] === it.cat).length / q.items!.length;
    }
    case 'clozeBank':
    case 'clozeChoice': {
      const g = given as string[];
      return q.blanks!.filter((b, i) => normalize(g[i] ?? '') === normalize(b)).length / q.blanks!.length;
    }
    case 'wordOrdering': {
      const g = given as number[];
      const built = g.map((i) => q.ordered![i]).join(' ');
      return normalize(built) === normalize(q.ordered!.join(' ')) ? 1 : 0;
    }
    case 'jumbledOrder': {
      const g = given as number[];
      return g.filter((v, i) => v === i).length / g.length;
    }
    case 'fillBlank':
    case 'scramble':
    case 'translateToEn':
    case 'wordFormInput':
    case 'dictation': {
      const g = normalize(given as string);
      return (q.answers ?? []).some((a) => normalize(a) === g) ? 1 : 0;
    }
    default:
      return given === q.answer ? 1 : 0;
  }
}

/** Đáp án đúng dạng chữ — hiển thị khi xem giải thích */
export function correctAnswerText(q: Question): string {
  switch (q.format) {
    case 'multiSelect':
      return q.answerIndexes!.map((i) => q.options![i]).join(', ');
    case 'match':
      return q.options!.map((l, i) => `${l} → ${q.optionsRight![i]}`).join(' · ');
    case 'categorize':
      return q.categories!.map((c, ci) => `${c}: ${q.items!.filter((it) => it.cat === ci).map((it) => it.text).join(', ')}`).join(' | ');
    case 'clozeBank':
    case 'clozeChoice':
      return q.blanks!.map((b, i) => `(${i + 1}) ${b}`).join(' · ');
    case 'wordOrdering':
      return q.ordered!.join(' ');
    case 'jumbledOrder':
      return q.ordered!.map((s, i) => `${i + 1}. ${s}`).join('\n');
    case 'tapSegment':
      return q.segments![q.answer!].text;
    case 'fillBlank':
    case 'scramble':
    case 'translateToEn':
    case 'wordFormInput':
    case 'dictation':
      return q.answers!.join(' / ');
    default: {
      const letter = q.fixedOrder ? `${'ABCD'[q.answer!]}. ` : '';
      return letter + (q.options![q.answer!] ?? '').replace(/[{}]/g, '');
    }
  }
}
