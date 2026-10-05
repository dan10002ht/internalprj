'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { normalize } from '@/lib/grade';
import { speak } from '@/lib/speech';
import type { FormatProps } from './types';

const CAT_STYLES = ['bg-sky-600', 'bg-amber-500', 'bg-violet-600'];
const CAT_SOFT = ['bg-sky-50 border-sky-300', 'bg-amber-50 border-amber-300', 'bg-violet-50 border-violet-300'];

/** Phân loại: mỗi mục chọn 1 nhóm */
export function Categorize({ q, given, onChange, locked, reveal, layout }: FormatProps) {
  const cats = (given as number[] | null) ?? Array(q.items!.length).fill(-1);
  const set = (i: number, c: number) => {
    const next = [...cats];
    next[i] = next[i] === c ? -1 : c;
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {q.categories!.map((c, ci) => (
          <span key={ci} className={clsx('rounded-full px-3 py-1 text-white font-semibold', CAT_STYLES[ci])}>{c}</span>
        ))}
      </div>
      <ul className="space-y-2">
        {layout.order.map((i) => {
          const item = q.items![i];
          const c = cats[i];
          return (
            <li key={i} className={clsx('rounded-xl border-2 px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2',
              reveal ? (c === item.cat ? 'border-emerald-500 bg-emerald-50' : 'border-rose-400 bg-rose-50') : c >= 0 ? CAT_SOFT[c] : 'border-slate-200 bg-white')}>
              <span className="flex-1 font-medium">
                {item.text}
                {reveal && c !== item.cat && <span className="ml-2 text-xs text-emerald-700">→ {q.categories![item.cat]}</span>}
              </span>
              <span className="flex gap-1.5 flex-wrap">
                {q.categories!.map((cn, ci) => (
                  <button key={ci} type="button" disabled={locked} onClick={() => set(i, ci)}
                    className={clsx('rounded-lg px-2.5 py-1 text-xs font-semibold border transition',
                      c === ci ? `${CAT_STYLES[ci]} text-white border-transparent` : 'bg-white border-slate-300 text-slate-600 enabled:hover:border-slate-500')}>
                    {cn}
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Điền đoạn văn từ word bank: chạm chỗ trống rồi chạm từ */
export function ClozeBank({ q, given, onChange, locked, reveal, layout }: FormatProps) {
  const fills = (given as string[] | null) ?? Array(q.blanks!.length).fill('');
  const [active, setActive] = useState(() => Math.max(0, fills.findIndex((f) => !f)));
  const parts = q.clozeText!.split(/(\{\d+\})/g);

  const choose = (w: string) => {
    if (locked) return;
    const next = [...fills];
    const prevIdx = next.indexOf(w);
    if (prevIdx >= 0) next[prevIdx] = '';
    next[active] = w;
    onChange(next);
    const free = next.findIndex((f) => !f);
    if (free >= 0) setActive(free);
  };

  return (
    <div className="space-y-4">
      <p className="leading-9 text-[15px] rounded-xl bg-white border border-slate-200 p-4">
        {parts.map((p, i) => {
          const m = p.match(/^\{(\d+)\}$/);
          if (!m) return <span key={i}>{p}</span>;
          const b = Number(m[1]);
          const ok = reveal && normalize(fills[b]) === normalize(q.blanks![b]);
          return (
            <button key={i} type="button" disabled={locked}
              onClick={() => (fills[b] && active === b ? (onChange(fills.map((f, j) => (j === b ? '' : f)))) : setActive(b))}
              className={clsx('mx-1 inline-flex min-w-24 justify-center rounded-md border-b-2 px-2 leading-7 font-semibold align-baseline',
                reveal ? (ok ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-rose-100 border-rose-500 text-rose-700')
                  : active === b ? 'bg-indigo-100 border-indigo-600 ring-2 ring-indigo-200' : fills[b] ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-100 border-slate-400 text-slate-400')}>
              <sup className="mr-1 text-[10px] text-slate-400">{b + 1}</sup>
              {fills[b] || '……'}
              {reveal && !ok && <span className="ml-1 text-emerald-700">({q.blanks![b]})</span>}
            </button>
          );
        })}
      </p>
      <div className="flex flex-wrap gap-2">
        {layout.order2.map((wi) => {
          const w = q.bank![wi];
          const used = fills.includes(w);
          return (
            <button key={wi} type="button" disabled={locked} onClick={() => choose(w)}
              className={clsx('rounded-lg border-2 px-3 py-1.5 font-medium transition', used ? 'border-slate-200 bg-slate-100 text-slate-400 line-through' : 'border-indigo-200 bg-white enabled:hover:border-indigo-500')}>
              {w}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-500">Chạm vào chỗ trống để chọn vị trí, rồi chạm từ. Chạm 2 lần vào chỗ đã điền để xóa.</p>
    </div>
  );
}

/** Chạm vào cụm từ trong câu (tìm lỗi sai / quy chiếu) */
export function TapSegment({ q, given, onChange, locked, reveal, eliminated }: FormatProps) {
  return (
    <p className="rounded-xl bg-white border border-slate-200 p-5 text-lg leading-[3rem]">
      {q.segments!.map((s, i) => {
        if (!s.selectable) {
          const isPronoun = q.format === 'tapSegment' && !s.label && /^(it|them|they)$/i.test(s.text.trim());
          return <span key={i} className={isPronoun ? 'font-bold text-indigo-700 underline decoration-wavy' : ''}>{s.text}</span>;
        }
        const selected = given === i;
        const correct = i === q.answer;
        return (
          <button key={i} type="button" disabled={locked || eliminated.includes(i)} onClick={() => onChange(i)}
            className={clsx('relative mx-0.5 rounded-md px-1.5 border-b-2 border-dashed transition',
              eliminated.includes(i) && 'opacity-30 line-through',
              reveal && correct && 'bg-emerald-100 border-emerald-600 border-solid',
              reveal && selected && !correct && 'bg-rose-100 border-rose-600 border-solid',
              !reveal && selected && 'bg-indigo-100 border-indigo-600 border-solid',
              !reveal && !selected && 'border-slate-400 enabled:hover:bg-indigo-50')}>
            {s.text}
            {s.label && <span className="absolute left-1/2 -translate-x-1/2 -bottom-6 text-xs font-bold text-slate-500">{s.label}</span>}
          </button>
        );
      })}
    </p>
  );
}

/** fillBlank · scramble · translateToEn · wordFormInput · dictation */
export function TextAnswer({ q, given, onChange, locked, reveal, layout, onEnter }: FormatProps) {
  const val = (given as string | null) ?? '';
  const ok = reveal && (q.answers ?? []).some((a) => normalize(a) === normalize(val));
  return (
    <div className="space-y-4">
      {q.format === 'dictation' && (
        <div className="flex gap-2">
          <button type="button" onClick={() => speak(q.speak!)} className="rounded-xl bg-indigo-600 text-white px-4 py-2.5 font-semibold">🔊 Nghe</button>
          <button type="button" onClick={() => speak(q.speak!, 0.6)} className="rounded-xl border-2 border-indigo-200 px-4 py-2.5 font-semibold text-indigo-700">🐢 Nghe chậm</button>
        </div>
      )}
      {q.format === 'scramble' && layout.scrambled && (
        <div className="flex flex-wrap gap-1.5">
          {layout.scrambled.split('').map((c, i) => (
            <span key={i} className="grid place-items-center size-10 rounded-lg bg-amber-100 border-2 border-amber-300 text-lg font-bold text-amber-900 shadow-sm">{c}</span>
          ))}
        </div>
      )}
      {q.sentence && <p className="rounded-xl bg-white border border-slate-200 p-4 text-lg">{q.sentence}</p>}
      <input
        value={val}
        disabled={locked}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        placeholder="Gõ đáp án…"
        className={clsx('w-full rounded-xl border-2 px-4 py-3 text-lg font-semibold outline-none transition',
          reveal ? (ok ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50') : 'border-slate-300 focus:border-indigo-500 bg-white')}
      />
    </div>
  );
}

/** Điền khuyết có lựa chọn cho từng chỗ trống (thu nhỏ của Phần 1–2 trong đề) */
export function ClozeChoice({ q, given, onChange, locked, reveal }: FormatProps) {
  const fills = (given as string[] | null) ?? Array(q.blanks!.length).fill('');
  const [active, setActive] = useState(() => Math.max(0, fills.findIndex((f) => !f)));
  const parts = q.clozeText!.split(/(\{\d+\})/g);

  const choose = (opt: string) => {
    if (locked) return;
    const next = fills.map((f, i) => (i === active ? opt : f));
    onChange(next);
    const free = next.findIndex((f) => !f);
    if (free >= 0) setActive(free);
  };

  return (
    <div className="space-y-4">
      <div className="whitespace-pre-line leading-9 text-[15px] rounded-xl bg-white border border-slate-200 p-4">
        {parts.map((p, i) => {
          const m = p.match(/^\{(\d+)\}$/);
          if (!m) return <span key={i}>{p}</span>;
          const b = Number(m[1]);
          const ok = reveal && normalize(fills[b]) === normalize(q.blanks![b]);
          return (
            <button key={i} type="button" disabled={locked} onClick={() => setActive(b)}
              className={clsx('mx-1 inline-flex min-w-20 justify-center rounded-md border-b-2 px-2 leading-7 font-semibold align-baseline',
                reveal ? (ok ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-rose-100 border-rose-500 text-rose-700')
                  : active === b ? 'bg-indigo-100 border-indigo-600 ring-2 ring-indigo-200' : fills[b] ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-100 border-slate-400 text-slate-400')}>
              <sup className="mr-1 text-[10px] text-slate-400">{b + 1}</sup>
              {fills[b] || '……'}
              {reveal && !ok && <span className="ml-1 text-emerald-700">({q.blanks![b]})</span>}
            </button>
          );
        })}
      </div>
      {!locked && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-600">Chỗ trống ({active + 1})</p>
          <div className="grid grid-cols-2 gap-2">
            {q.blankOptions![active].map((opt, oi) => (
              <button key={opt} type="button" onClick={() => choose(opt)}
                className={clsx('flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left font-medium transition',
                  fills[active] === opt ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300')}>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{'ABCD'[oi]}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
