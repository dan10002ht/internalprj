'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { shuffle } from '@/lib/random';
import { speak } from '@/lib/speech';
import type { Passage, VocabItem } from '@/types';

const SECONDS = 30;

/**
 * V1 — Mồi từ trước bài đọc: nối nhanh 5 từ khóa với nghĩa trong 30 giây.
 * Không tính điểm; hết giờ hoặc nối xong thì mở bài đọc.
 */
export function Prime({ passage, words, onDone }: { passage: Passage; words: VocabItem[]; onDone: () => void }) {
  const [right] = useState(() => shuffle(words.map((v) => v.meaningVi)));
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string | null>(null);
  const [left, setLeft] = useState(SECONDS);

  const allDone = words.every((v) => picked[v.word]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const usedMeanings = new Set(Object.values(picked));

  const choose = (meaning: string) => {
    if (!active) return;
    setPicked((p) => {
      const next = { ...p };
      // Một nghĩa chỉ gắn cho một từ
      for (const k of Object.keys(next)) if (next[k] === meaning) delete next[k];
      next[active] = meaning;
      return next;
    });
    setActive(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Làm nóng 30 giây · không tính điểm</p>
          <h1 className="text-xl font-black">Nối nhanh 5 từ khóa của bài “{passage.title}”</h1>
          <p className="text-sm text-slate-500">Chạm một từ bên trên, rồi chạm nghĩa của nó bên dưới. Nối sai cũng không sao — đây chỉ là bước làm quen từ.</p>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className={clsx('h-full transition-all duration-1000 ease-linear', left <= 5 ? 'bg-rose-500' : 'bg-indigo-500')}
            style={{ width: `${(left / SECONDS) * 100}%` }} />
        </div>

        <div className="flex flex-wrap gap-2">
          {words.map((v) => {
            const got = picked[v.word];
            return (
              <button key={v.word} type="button" onClick={() => setActive(active === v.word ? null : v.word)}
                className={clsx('rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition',
                  active === v.word ? 'border-indigo-600 bg-indigo-600 text-white'
                    : got ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-800')}>
                <span className="flex items-center gap-1.5">
                  {v.word}
                  <span className="text-base" aria-hidden>{v.emoji}</span>
                </span>
                {got && <span className="block text-[11px] font-normal opacity-80">{got}</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-600">Nghĩa</p>
          <div className="flex flex-wrap gap-2">
            {right.map((m) => (
              <button key={m} type="button" disabled={!active} onClick={() => choose(m)}
                className={clsx('rounded-xl border px-3 py-2 text-sm transition',
                  usedMeanings.has(m) ? 'border-slate-200 bg-slate-100 text-slate-400'
                    : active ? 'border-indigo-300 bg-white text-slate-800 hover:bg-indigo-50' : 'border-slate-200 bg-white text-slate-500')}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {(allDone || left <= 0) && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-700">Đáp án để bạn đối chiếu</p>
            <ul className="space-y-1 text-sm">
              {words.map((v) => (
                <li key={v.word} className="flex items-center gap-2">
                  <button type="button" onClick={() => speak(v.word)} aria-label={`Nghe ${v.word}`}>🔊</button>
                  <b>{v.word}</b>
                  <span className="text-slate-400">{v.ipa}</span>
                  <span className="text-slate-600">— {v.meaningVi}</span>
                  {picked[v.word] === v.meaningVi && <span className="text-xs text-emerald-600">bạn nối đúng</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" onClick={onDone}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700">
          {left > 0 && !allDone ? 'Bỏ qua, vào bài đọc →' : 'Đọc bài →'}
        </button>
      </main>
    </div>
  );
}
