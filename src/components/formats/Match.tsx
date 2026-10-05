'use client';

import clsx from 'clsx';
import { useState } from 'react';
import type { FormatProps } from './types';

const PAIR_COLORS = [
  'bg-sky-100 border-sky-400', 'bg-amber-100 border-amber-400', 'bg-violet-100 border-violet-400',
  'bg-lime-100 border-lime-500', 'bg-pink-100 border-pink-400', 'bg-teal-100 border-teal-400',
];

/** Nối 2 cột: chạm 1 ô bên trái, rồi chạm ô bên phải */
export function Match({ q, given, onChange, locked, reveal, layout }: FormatProps) {
  const n = q.options!.length;
  const pairs = (given as number[] | null) ?? Array(n).fill(-1);
  const [active, setActive] = useState<number | null>(null);

  const leftOf = (r: number) => pairs.indexOf(r);

  const pickLeft = (l: number) => {
    if (locked) return;
    if (pairs[l] >= 0) {
      const next = [...pairs];
      next[l] = -1;
      onChange(next);
    }
    setActive(l);
  };

  const pickRight = (r: number) => {
    if (locked) return;
    const next = [...pairs];
    const owner = leftOf(r);
    if (owner >= 0) next[owner] = -1;
    const l = active ?? next.findIndex((x) => x < 0);
    if (l < 0) return;
    next[l] = r;
    onChange(next);
    const free = next.findIndex((x) => x < 0);
    setActive(free >= 0 ? free : null);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Chạm 1 ô bên trái, rồi chạm ô tương ứng bên phải. Chạm lại ô đã nối để gỡ.</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="space-y-2">
          {q.options!.map((left, l) => {
            const r = pairs[l];
            const ok = reveal && r === l;
            return (
              <button key={l} type="button" onClick={() => pickLeft(l)} disabled={locked}
                className={clsx('w-full min-h-14 rounded-xl border-2 px-3 py-2 text-left font-semibold transition',
                  reveal ? (ok ? 'border-emerald-500 bg-emerald-50' : 'border-rose-400 bg-rose-50')
                    : r >= 0 ? PAIR_COLORS[l % PAIR_COLORS.length] : active === l ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 bg-white')}>
                <span className={left.length <= 4 ? 'text-2xl' : ''}>{left}</span>
                {reveal && !ok && <span className="block text-xs font-normal text-emerald-700 mt-1">→ {q.optionsRight![l]}</span>}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {layout.order2.map((r) => {
            const owner = leftOf(r);
            return (
              <button key={r} type="button" onClick={() => pickRight(r)} disabled={locked}
                className={clsx('w-full min-h-14 rounded-xl border-2 px-3 py-2 text-left text-sm transition',
                  owner >= 0 ? PAIR_COLORS[owner % PAIR_COLORS.length] : 'border-dashed border-slate-300 bg-white enabled:hover:border-indigo-300')}>
                {q.optionsRight![r]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
