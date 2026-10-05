import { shuffle } from '@/lib/random';
import { vocabInPassage } from '@/lib/vocabText';
import type { DayContent, Passage, Question, VocabItem } from '@/types';

/**
 * Các câu / bài tập sinh tại runtime từ dữ liệu từ vựng sẵn có.
 * Nhờ vậy V1, V3, V4, V7 và Warm-up không cần giáo viên soạn thêm dữ liệu.
 */

const pick = <T>(arr: T[], n: number) => shuffle(arr).slice(0, n);

/** V1 — 5 từ mồi của một bài đọc. Dùng `keyVocab` nếu có, không thì lấy từ của ngày xuất hiện trong bài */
export function primeWords(day: DayContent, passage: Passage, n = 5): VocabItem[] {
  if (passage.keyVocab?.length) {
    const byWord = new Map(day.vocab.map((v) => [v.word, v]));
    const named = passage.keyVocab.map((w) => byWord.get(w)).filter((v): v is VocabItem => !!v);
    if (named.length) return named.slice(0, n);
  }
  return vocabInPassage(passage, day.vocab).slice(0, n);
}

/** 3 nghĩa nhiễu khác nghĩa của từ đang hỏi */
const distractorMeanings = (day: DayContent, v: VocabItem, n = 3) =>
  pick(day.vocab.filter((x) => x.word !== v.word && x.meaningVi !== v.meaningVi), n).map((x) => x.meaningVi);

/** Câu MCQ "từ này nghĩa là gì" — dùng cho Warm-up và V3 */
export function meaningQuestion(day: DayContent, v: VocabItem, idPrefix: string): Question {
  const options = shuffle([v.meaningVi, ...distractorMeanings(day, v)]);
  return {
    id: `${idPrefix}:${v.word}:meaning`,
    skillType: 'vocabulary',
    format: 'mcq',
    difficulty: 1,
    targetWords: [v.word],
    stem: `"${v.word}" nghĩa là gì?`,
    options,
    answer: options.indexOf(v.meaningVi),
    hintLevels: [{ type: 'image' }, { type: 'meaningEn' }],
    explanation: `${v.word} ${v.ipa} (${v.partOfSpeech}) = ${v.meaningVi} — ${v.meaningEn}`,
    strategyTag: 'vocab-meaning',
  };
}

/** Câu MCQ collocation — chọn cụm đúng */
function collocationQuestion(day: DayContent, v: VocabItem, idPrefix: string): Question | null {
  if (!v.collocations.length) return null;
  const right = v.collocations[0];
  const wrong = pick(
    day.vocab.filter((x) => x.word !== v.word).flatMap((x) => x.collocations),
    3,
  );
  if (wrong.length < 3) return null;
  const options = shuffle([right, ...wrong]);
  return {
    id: `${idPrefix}:${v.word}:colloc`,
    skillType: 'collocation',
    format: 'mcq',
    difficulty: 2,
    targetWords: [v.word],
    stem: `Cụm nào đi với "${v.word}"?`,
    options,
    answer: options.indexOf(right),
    hintLevels: [{ type: 'meaningEn' }, { type: 'meaningVi' }],
    explanation: `Cụm hay gặp của ${v.word}: ${v.collocations.join(' · ')}`,
    strategyTag: 'vocab-collocation',
  };
}

/** Câu MCQ word family — chọn dạng từ đúng */
function wordFormQuestion(day: DayContent, v: VocabItem, idPrefix: string): Question | null {
  if (!v.wordFamily.length) return null;
  const right = v.wordFamily[0];
  const wrong = pick(day.vocab.filter((x) => x.word !== v.word).flatMap((x) => x.wordFamily), 3);
  if (wrong.length < 3) return null;
  const options = shuffle([right, ...wrong]);
  return {
    id: `${idPrefix}:${v.word}:family`,
    skillType: 'wordForm',
    format: 'mcq',
    difficulty: 2,
    targetWords: [v.word],
    stem: `Dạng nào cùng họ từ với "${v.word}"?`,
    options,
    answer: options.indexOf(right),
    hintLevels: [{ type: 'wordFamily' }, { type: 'meaningVi' }],
    explanation: `Họ từ của ${v.word}: ${v.wordFamily.join(' · ')}`,
    strategyTag: 'vocab-wordform',
  };
}

/**
 * V3 — câu hỏi nối tiếp 10 giây về chính từ vừa gặp.
 * Xoay vòng nghĩa / collocation / word form để làm lại không bị trùng.
 */
export function followUpQuestion(day: DayContent, word: string, seed: number): Question | null {
  const v = day.vocab.find((x) => x.word === word);
  if (!v) return null;
  const makers = [meaningQuestion, collocationQuestion, wordFormQuestion];
  for (let i = 0; i < makers.length; i++) {
    const q = makers[(seed + i) % makers.length](day, v, 'v3');
    if (q) return q;
  }
  return null;
}

/**
 * V4 — 2 câu "CLOSEST / OPPOSITE in meaning" theo form đề, cho từ của ngày
 * xuất hiện trong bài nhưng chưa được đề gốc hỏi tới.
 */
export function bonusQuestions(day: DayContent, passage: Passage, alreadyAsked: Set<string>): Question[] {
  const inPassage = vocabInPassage(passage, day.vocab).filter((v) => !alreadyAsked.has(v.word));
  const out: Question[] = [];

  const closest = inPassage.find((v) => v.synonyms.length > 0);
  if (closest) {
    const wrong = pick(day.vocab.filter((x) => x.word !== closest.word).flatMap((x) => x.synonyms), 3);
    if (wrong.length === 3) {
      const options = shuffle([closest.synonyms[0], ...wrong]);
      out.push({
        id: `v4:${passage.id}:closest`,
        skillType: 'synonym', format: 'mcq', difficulty: 2, bonus: true,
        targetWords: [closest.word], passageId: passage.id, focus: closest.word,
        instruction: 'Câu luyện thêm — không tính vào điểm đề',
        stem: `The word "${closest.word}" in the passage is CLOSEST in meaning to ______.`,
        options, answer: options.indexOf(closest.synonyms[0]),
        hintLevels: [{ type: 'meaningEn' }, { type: 'examplePassage' }, { type: 'meaningVi' }],
        explanation: `${closest.word} = ${closest.meaningEn} (${closest.meaningVi}) → gần nghĩa nhất với ${closest.synonyms[0]}.`,
        strategyTag: 'exam-synonym',
      });
    }
  }

  const opposite = inPassage.find((v) => v.antonyms.length > 0 && v.word !== closest?.word);
  if (opposite) {
    const wrong = pick(day.vocab.filter((x) => x.word !== opposite.word).flatMap((x) => x.synonyms), 3);
    if (wrong.length === 3) {
      const options = shuffle([opposite.antonyms[0], ...wrong]);
      out.push({
        id: `v4:${passage.id}:opposite`,
        skillType: 'antonym', format: 'mcq', difficulty: 2, bonus: true,
        targetWords: [opposite.word], passageId: passage.id, focus: opposite.word,
        instruction: 'Câu luyện thêm — không tính vào điểm đề',
        stem: `The word "${opposite.word}" in the passage is OPPOSITE in meaning to ______.`,
        options, answer: options.indexOf(opposite.antonyms[0]),
        hintLevels: [{ type: 'meaningEn' }, { type: 'examplePassage' }, { type: 'meaningVi' }],
        explanation: `${opposite.word} = ${opposite.meaningVi} → trái nghĩa với ${opposite.antonyms[0]}.`,
        strategyTag: 'exam-antonym',
      });
    }
  }
  return out;
}

/**
 * V7 — bài đọc dạng cloze sau khi nộp: che 6–8 từ, ưu tiên từ đã tra và từ trong câu sai.
 * Trả về từng đoạn đã khoét `{0}`, danh sách đáp án và khung từ để chọn.
 */
export interface ClozePassage {
  paragraphs: string[];
  blanks: string[];
  bank: string[];
}

export function clozePassage(
  day: DayContent,
  passage: Passage,
  priority: string[],
  count = 7,
): ClozePassage | null {
  const candidates = vocabInPassage(passage, day.vocab);
  if (candidates.length < 3) return null;
  const score = (v: VocabItem) => (priority.includes(v.word) ? 0 : 1);
  const chosen = [...candidates].sort((a, b) => score(a) - score(b)).slice(0, Math.min(count, candidates.length));

  const blanks: string[] = [];
  const paragraphs = passage.paragraphs.map((p) => {
    let text = p;
    for (const v of chosen) {
      const re = new RegExp(`\\b(${v.word})\\b`, 'i');
      if (!re.test(text)) continue;
      const m = text.match(re)!;
      text = text.replace(re, `{${blanks.length}}`);
      blanks.push(m[1]);
    }
    return text;
  });
  if (blanks.length < 3) return null;
  return { paragraphs, blanks, bank: shuffle([...new Set(blanks)]) };
}
