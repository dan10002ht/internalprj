'use client';

import clsx from 'clsx';
import type { FormatProps } from './types';

/** Gạch chân phần trong {} — dùng cho câu phát âm */
export function Marked({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('{') ? (
          <u key={i} className="decoration-2 underline-offset-4 font-bold">
            {p.slice(1, -1)}
          </u>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function optionClass(opts: { selected: boolean; correct: boolean; reveal: boolean; eliminated: boolean }) {
  const { selected, correct, reveal, eliminated } = opts;
  const state = reveal ? (correct ? 'ok' : selected ? 'bad' : 'idle') : selected ? 'sel' : 'idle';
  return clsx(
    'w-full text-left rounded-xl border-2 px-4 py-3 transition-all flex items-start gap-3',
    eliminated && 'opacity-30 line-through pointer-events-none',
    state === 'ok' && 'border-emerald-500 bg-emerald-50',
    state === 'bad' && 'border-rose-500 bg-rose-50',
    state === 'sel' && 'border-indigo-500 bg-indigo-50 shadow-sm',
    state === 'idle' && 'border-slate-200 bg-white enabled:hover:border-indigo-300 enabled:hover:bg-indigo-50/40',
  );
}

/** mcq · trueFalse · oddOneOut · insertSentence */
export function Choice({ q, given, onChange, locked, reveal, eliminated, layout }: FormatProps) {
  const order = q.fixedOrder ? q.options!.map((_, i) => i) : layout.order;
  const grid = q.format === 'oddOneOut' || q.format === 'trueFalse' || q.options!.every((o) => o.length < 18);

  return (
    <div className="space-y-4">
      {q.insertText && (
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 italic font-medium text-slate-800">
          {q.insertText}
          <p className="mt-1 not-italic text-xs text-amber-700">Mẹo: bạn có thể bấm trực tiếp vào vị trí [I]–[IV] trong bài đọc.</p>
        </div>
      )}
      <div className={clsx('grid gap-3', grid ? 'grid-cols-2' : 'grid-cols-1', q.format === 'trueFalse' && q.options!.length === 3 && 'sm:grid-cols-3')}>
        {order.map((oi, pos) => {
          const selected = given === oi;
          return (
            <button
              key={oi}
              type="button"
              disabled={locked}
              onClick={() => onChange(oi)}
              className={optionClass({ selected, correct: oi === q.answer, reveal, eliminated: eliminated.includes(oi) })}
            >
              {q.format !== 'trueFalse' && (
                <span className={clsx('shrink-0 grid place-items-center size-7 rounded-full text-sm font-bold', selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600')}>
                  {'ABCDE'[pos]}
                </span>
              )}
              <span className={clsx('pt-0.5', q.format === 'trueFalse' && 'w-full text-center font-semibold')}>
                <Marked text={q.options![oi]} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MultiSelect({ q, given, onChange, locked, reveal, eliminated, layout }: FormatProps) {
  const sel = (given as number[] | null) ?? [];
  const toggle = (i: number) => onChange(sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]);
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Chọn nhiều đáp án.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {layout.order.map((oi) => {
          const selected = sel.includes(oi);
          return (
            <button key={oi} type="button" disabled={locked} onClick={() => toggle(oi)}
              className={optionClass({ selected, correct: q.answerIndexes!.includes(oi), reveal, eliminated: eliminated.includes(oi) })}>
              <span className={clsx('shrink-0 grid place-items-center size-6 rounded-md border-2 text-xs', selected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300')}>
                {selected ? '✓' : ''}
              </span>
              <span>{q.options![oi]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
