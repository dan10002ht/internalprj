'use client';

import clsx from 'clsx';
import { isAnswered } from '@/lib/grade';
import type { Given, Question } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * V6 — phiếu tô đáp án như phòng thi. Câu trắc nghiệm tô trực tiếp;
 * câu dạng khác (sắp xếp, điền câu) chỉ nhảy tới câu đó để làm.
 */
export function AnswerSheet({ qs, givens, idx, onJump, onSet }: {
  qs: Question[];
  givens: Record<string, Given>;
  idx: number;
  onJump: (i: number) => void;
  onSet: (questionId: string, value: number) => void;
}) {
  const blank = qs.filter((q) => !isAnswered(q, givens[q.id] ?? null)).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <p className="font-bold">Phiếu tô đáp án</p>
        <p className={clsx('ml-auto text-sm font-semibold', blank > 0 ? 'text-rose-600' : 'text-emerald-600')}>
          {blank > 0 ? `Còn ${blank} câu chưa tô` : 'Đã tô hết'}
        </p>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {qs.map((q, i) => {
          const g = givens[q.id] ?? null;
          const mcq = !!q.options && !q.optionsRight && q.format !== 'multiSelect';
          const done = isAnswered(q, g);
          return (
            <div key={q.id}
              className={clsx('flex items-center gap-1.5 rounded-lg px-2 py-1',
                i === idx && 'bg-indigo-50 ring-1 ring-indigo-300',
                !done && i !== idx && 'bg-rose-50/60')}>
              <button type="button" onClick={() => onJump(i)}
                className="w-7 shrink-0 text-right text-xs font-bold tabular-nums text-slate-500 hover:text-indigo-700">
                {i + 1}
              </button>
              {mcq ? (
                <div className="flex gap-1">
                  {q.options!.slice(0, 5).map((_, k) => (
                    <button key={k} type="button" onClick={() => { onJump(i); onSet(q.id, k); }}
                      aria-label={`Câu ${i + 1} đáp án ${LETTERS[k]}`}
                      className={clsx('grid size-7 place-items-center rounded-full border text-[11px] font-bold transition',
                        g === k ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-500 hover:border-slate-600')}>
                      {LETTERS[k]}
                    </button>
                  ))}
                </div>
              ) : (
                <button type="button" onClick={() => onJump(i)}
                  className={clsx('rounded-full border px-2.5 py-1 text-[11px] font-semibold',
                    done ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-500')}>
                  {done ? 'đã làm' : 'chạm để làm'}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">Câu chưa tô có nền hồng. Tô ở đây hoặc chạm số câu để quay lại làm.</p>
    </div>
  );
}
