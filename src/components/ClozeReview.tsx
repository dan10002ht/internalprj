'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { clozePassage } from '@/lib/generate';
import { normalize } from '@/lib/grade';
import type { DayContent, Passage } from '@/types';

/**
 * V7 — đọc lại bài sau khi nộp, với 6–8 từ bị che (ưu tiên từ đã tra và từ nằm trong câu sai).
 * Chọn từ trong khung để điền. Không tính vào điểm đề.
 */
export function ClozeReview({ day, passage, priority }: { day: DayContent; passage: Passage; priority: string[] }) {
  const cloze = useMemo(() => clozePassage(day, passage, priority), [day, passage, priority]);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  if (!cloze) return null;
  const { paragraphs, blanks, bank } = cloze;
  const used = new Set(Object.values(filled));
  const correct = blanks.filter((b, i) => normalize(filled[i] ?? '') === normalize(b)).length;

  const place = (w: string) => {
    if (active === null) return;
    setFilled((f) => {
      const next = { ...f };
      for (const k of Object.keys(next)) if (next[+k] === w) delete next[+k];
      next[active] = w;
      return next;
    });
    setActive(null);
  };

  const render = (text: string) =>
    text.split(/(\{\d+\})/).map((piece, k) => {
      const m = piece.match(/^\{(\d+)\}$/);
      if (!m) return <span key={k}>{piece}</span>;
      const i = +m[1];
      const v = filled[i];
      const ok = checked && normalize(v ?? '') === normalize(blanks[i]);
      return (
        <button key={k} type="button" onClick={() => setActive(active === i ? null : i)}
          className={clsx('mx-0.5 min-w-24 rounded-md border-b-2 px-1.5 align-baseline text-sm font-semibold transition',
            checked ? (ok ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-400 bg-rose-50 text-rose-800')
              : active === i ? 'border-indigo-600 bg-indigo-100 text-indigo-800'
                : v ? 'border-indigo-400 bg-indigo-50 text-indigo-800' : 'border-slate-400 bg-slate-50 text-slate-400')}>
          {v ?? `(${i + 1})`}
          {checked && !ok && <span className="ml-1 font-normal text-emerald-700">→ {blanks[i]}</span>}
        </button>
      );
    });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <div>
        <p className="font-bold">Đọc lại bài — điền từ vào chỗ trống</p>
        <p className="text-sm text-slate-500">
          Bài “{passage.title}” được che {blanks.length} từ, ưu tiên những từ bạn đã tra hoặc làm sai. Chạm chỗ trống rồi chọn từ trong khung. Phần này không tính điểm.
        </p>
      </div>

      <div className="space-y-3 text-[15px] leading-8 text-slate-800">
        {paragraphs.map((p, i) => <p key={i}>{render(p)}</p>)}
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl bg-slate-50 p-3">
        {bank.map((w) => (
          <button key={w} type="button" disabled={checked || active === null} onClick={() => place(w)}
            className={clsx('rounded-lg border px-2.5 py-1 text-sm font-medium transition',
              used.has(w) ? 'border-slate-200 bg-slate-100 text-slate-400'
                : active !== null ? 'border-indigo-300 bg-white text-slate-800 hover:bg-indigo-50'
                  : 'border-slate-200 bg-white text-slate-500')}>
            {w}
          </button>
        ))}
      </div>

      {checked ? (
        <p className={clsx('text-sm font-semibold', correct === blanks.length ? 'text-emerald-700' : 'text-slate-700')}>
          Bạn điền đúng {correct}/{blanks.length} từ. Chỗ sai đã hiện từ đúng bên cạnh.
        </p>
      ) : (
        <button type="button" onClick={() => setChecked(true)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Kiểm tra</button>
      )}
    </div>
  );
}
