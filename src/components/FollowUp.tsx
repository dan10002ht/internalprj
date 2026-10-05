'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import type { Question } from '@/types';

const SECONDS = 10;

/**
 * V3 — câu hỏi nối tiếp 10 giây về chính từ vừa gặp. Không tính vào điểm đề,
 * nhưng kết quả vẫn được ghi vào lịch ôn của từ đó.
 */
export function FollowUp({ q, onDone }: { q: Question; onDone: (correct: boolean) => void }) {
  const [left, setLeft] = useState(SECONDS);
  const [chosen, setChosen] = useState<number | null>(null);

  // Hết 10 giây cũng coi như đã trả lời (tính là chưa đúng)
  const timeUp = left <= 0;
  const answered = chosen !== null || timeUp;

  useEffect(() => {
    if (chosen !== null || timeUp) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, chosen, timeUp]);

  const correct = chosen === q.answer;

  return (
    <div className="rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">Câu nhanh · không tính điểm</span>
        <span className={clsx('ml-auto text-sm font-bold tabular-nums', left <= 3 && !answered ? 'text-rose-600' : 'text-slate-500')}>
          {answered ? '' : `${left}s`}
        </span>
      </div>
      <p className="font-semibold text-slate-900">{q.stem}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options!.map((o, i) => (
          <button key={i} type="button" disabled={answered} onClick={() => setChosen(i)}
            className={clsx('rounded-xl border-2 px-3 py-2 text-left text-sm transition',
              answered && i === q.answer ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-800'
                : answered && i === chosen ? 'border-rose-400 bg-rose-50 text-rose-800'
                  : 'border-white bg-white text-slate-800 hover:border-indigo-300')}>
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <div className="space-y-2">
          <p className={clsx('text-sm font-semibold', correct ? 'text-emerald-700' : 'text-rose-700')}>
            {correct ? 'Đúng!' : chosen === null ? 'Hết thời gian rồi, không sao.' : 'Chưa đúng.'} {q.explanation}
          </p>
          <button type="button" onClick={() => onDone(correct)}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white">Tiếp tục làm đề →</button>
        </div>
      )}
    </div>
  );
}
