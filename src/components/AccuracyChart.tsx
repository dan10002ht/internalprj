'use client';

import clsx from 'clsx';
import { useId, useState } from 'react';

export interface AccuracyRow {
  key: string;
  label: string;
  got: number;
  total: number;
}

/** Ngưỡng coi là "còn yếu" — dưới mức này thì tô màu cảnh báo và kèm nhãn */
const WEAK = 0.7;

/**
 * Tỉ lệ đúng theo từng dạng bài — thanh ngang, một trục, nhãn số đặt trực tiếp.
 * Dạng còn yếu được tô màu trạng thái kèm chữ "cần ôn" nên nghĩa không chỉ nằm ở màu.
 */
export function AccuracyChart({ rows, title }: { rows: AccuracyRow[]; title: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const titleId = useId();

  if (rows.length < 2) return null;
  const sorted = [...rows].sort((a, b) => a.got / a.total - b.got / b.total);

  return (
    <figure className="space-y-3" role="group" aria-labelledby={titleId}>
      <figcaption id={titleId} className="font-bold">{title}</figcaption>
      <ul className="space-y-2.5">
        {sorted.map((r) => {
          const pct = r.total ? r.got / r.total : 0;
          const weak = pct < WEAK;
          const on = hover === r.key;
          return (
            <li
              key={r.key}
              onMouseEnter={() => setHover(r.key)}
              onMouseLeave={() => setHover(null)}
              className="grid grid-cols-[minmax(7rem,11rem)_1fr_auto] items-center gap-3 py-0.5"
              title={`${r.label}: đúng ${r.got}/${r.total} câu (${Math.round(pct * 100)}%)`}
            >
              <span className="truncate text-sm text-slate-700">{r.label}</span>
              {/* Rãnh nền recessive, thanh dữ liệu neo vào trục trái, bo 4px ở đầu dữ liệu */}
              <span className="relative block h-2.5 rounded-r-[4px] bg-slate-100">
                <span
                  aria-hidden
                  style={{ width: `${Math.max(pct * 100, pct > 0 ? 2 : 0)}%`, backgroundColor: weak ? '#d03b3b' : '#2a78d6' }}
                  className={clsx('absolute inset-y-0 left-0 rounded-r-[4px] transition-opacity', on ? 'opacity-100' : 'opacity-90')}
                />
              </span>
              <span className="flex items-center gap-1.5 justify-self-end text-sm tabular-nums">
                <b className="text-slate-800">{r.got}/{r.total}</b>
                {weak && <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">cần ôn</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-400">Thanh càng ngắn là dạng bài bạn còn sai nhiều. Dạng dưới {Math.round(WEAK * 100)}% được đánh dấu “cần ôn”.</p>
    </figure>
  );
}
