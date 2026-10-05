'use client';

import clsx from 'clsx';
import { HINT_PENALTY, correctAnswerText } from '@/lib/grade';
import { appearsIn } from '@/lib/vocabText';
import { useCurrentStudent, useProgress } from '@/store/progress';
import type { DayContent, Given, Question, VocabItem } from '@/types';

/** Nghĩa tiếng Việt của từng đáp án: lấy từ optionsVi, nếu không có thì tra trong từ vựng của ngày */
function optionMeanings(day: DayContent, q: Question): string[] | undefined {
  if (!q.options) return undefined;
  if (q.optionsVi) return q.optionsVi;
  const byWord = new Map(day.vocab.map((v) => [v.word.toLowerCase(), v.meaningVi]));
  const found = q.options.map((o) => byWord.get(o.toLowerCase()) ?? '');
  return found.some(Boolean) ? found : undefined;
}

/** V5 — từ cần nhớ của câu: lấy `keyWords` nếu có, không thì quét từ của ngày trong đề bài & đáp án */
function keyWordsOf(day: DayContent, q: Question): VocabItem[] {
  if (q.keyWords?.length) {
    return q.keyWords.map((w) => day.vocab.find((v) => v.word === w)).filter((v): v is VocabItem => !!v);
  }
  const text = [q.stem, ...(q.options ?? []), ...(q.blanks ?? []), ...(q.ordered ?? [])].join(' | ');
  const target = new Set(q.targetWords);
  return day.vocab.filter((v) => target.has(v.word) || appearsIn(text, v)).slice(0, 6);
}

export function Explanation({ day, q, given, fraction, level, passageViReady = true, dayId }: { day: DayContent; q: Question; given: Given; fraction: number; level: number; passageViReady?: boolean; dayId?: number }) {
  const student = useCurrentStudent();
  const addToWordBook = useProgress((s) => s.addToWordBook);
  const keyWords = keyWordsOf(day, q);
  const inBook = new Set(student.wordBook.map((e) => e.word));
  const ok = fraction === 1;
  const note = typeof given === 'number' && !ok ? q.distractorNotes?.[given] : undefined;
  const strat = day.strategies[q.strategyTag];
  const meanings = optionMeanings(day, q);
  const showOptions = meanings && q.format !== 'match' && q.format !== 'trueFalse';

  return (
    <div className={clsx('rounded-2xl border-2 p-5 space-y-3', ok ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50')}>
      <p className={clsx('font-bold', ok ? 'text-emerald-700' : 'text-rose-700')}>
        {ok ? 'Đúng rồi!' : fraction > 0 ? `Đúng một phần (${Math.round(fraction * 100)}%)` : 'Chưa đúng'}
        {level > 0 && <span className="ml-2 text-xs font-normal text-slate-500">(có dùng gợi ý, trừ {HINT_PENALTY[level] * 100}%)</span>}
      </p>
      <p className="text-sm whitespace-pre-line"><b>Đáp án:</b> {correctAnswerText(q)}</p>
      <p className="text-sm text-slate-700">{q.explanation}</p>
      {note && <p className="text-sm text-rose-800"><b>Vì sao đáp án bạn chọn chưa đúng:</b> {note}</p>}
      {q.sourceRef && <p className="text-xs text-emerald-800">Câu chứa đáp án đã được tô xanh trong bài đọc.</p>}

      {(q.stemVi || showOptions || q.format === 'match') && (
        <div className="rounded-xl bg-white/80 p-3 space-y-1.5 text-sm">
          <p className="font-semibold text-slate-700">Dịch nghĩa</p>
          {q.stemVi && <p className="whitespace-pre-line text-slate-700">{q.stemVi}</p>}
          {showOptions && (
            <ul className="space-y-0.5 text-slate-600">
              {q.options!.map((o, i) => meanings![i] && (
                <li key={i}>
                  {q.fixedOrder && <b>{'ABCDE'[i]}. </b>}
                  {meanings![i].includes(o) ? meanings![i] : <><span className="text-slate-800">{o.replace(/[{}]/g, '')}</span> — {meanings![i]}</>}
                </li>
              ))}
            </ul>
          )}
          {q.format === 'match' && q.optionsVi && (
            <ul className="space-y-0.5 text-slate-600">
              {q.options!.map((o, i) => <li key={i}><span className="text-slate-800">{o}</span> — {q.optionsVi![i]}</li>)}
            </ul>
          )}
          {q.passageId && (
            <p className="text-xs text-slate-500">
              {passageViReady ? 'Bấm “Xem bản dịch tiếng Việt” ở cuối bài đọc để đọc lại cả bài.' : 'Bản dịch cả bài sẽ mở khi bạn làm xong các câu của bài này.'}
            </p>
          )}
        </div>
      )}

      {/* V5 — lớp từ vựng: từ cần nhớ + cặp paraphrase, kèm nút thêm vào Sổ từ */}
      {(keyWords.length > 0 || q.paraphrasePairs?.length) && (
        <div className="space-y-2 rounded-xl bg-white/80 p-3 text-sm">
          {keyWords.length > 0 && (
            <>
              <p className="font-semibold text-slate-700">Từ cần nhớ ở câu này</p>
              <ul className="space-y-1.5">
                {keyWords.map((v) => (
                  <li key={v.word} className="flex items-start gap-2">
                    <span className="flex-1">
                      <b>{v.word}</b> <span className="text-slate-400">{v.ipa}</span> — {v.meaningVi}
                    </span>
                    {inBook.has(v.word) ? (
                      <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">đã có trong Sổ từ</span>
                    ) : (
                      <button type="button" onClick={() => addToWordBook(dayId ?? day.dayId, v.word, 'marked')}
                        className="shrink-0 rounded-md border border-indigo-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50">
                        + Sổ từ
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
          {q.paraphrasePairs?.length ? (
            <>
              <p className="pt-1 font-semibold text-slate-700">Cặp từ đồng nghĩa giữa bài đọc và đáp án (paraphrase)</p>
              <ul className="space-y-0.5 text-slate-600">
                {q.paraphrasePairs.map(([a, b], i) => (
                  <li key={i}><span className="text-slate-800">{a}</span> ↔ <span className="text-slate-800">{b}</span></li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      )}

      {strat && <p className="text-sm rounded-xl bg-white/70 p-3"><b>Mẹo cho dạng {strat.name}:</b> {strat.tip}</p>}
    </div>
  );
}
