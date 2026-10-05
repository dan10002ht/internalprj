'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { getDay } from '@/data';
import { speak } from '@/lib/speech';
import { useCurrentStudent, useHydrated } from '@/store/progress';
import type { VocabItem } from '@/types';
import { TopBar } from './ui/TopBar';

const POS: Record<string, string> = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', phrase: 'phrase' };

function Stress({ v }: { v: VocabItem }) {
  return (
    <span className="inline-flex gap-1">
      {Array.from({ length: v.syllableCount }, (_, i) => (
        <span key={i} className={clsx('rounded-full', i + 1 === v.stressPosition ? 'size-3 bg-indigo-600' : 'size-2 bg-slate-300 self-center')} />
      ))}
    </span>
  );
}

function Card({ v, flipped, onFlip }: { v: VocabItem; flipped: boolean; onFlip: () => void }) {
  return (
    <div className="[perspective:1200px]">
      <div onClick={onFlip}
        className={clsx('relative h-96 w-full cursor-pointer transition-transform duration-500 [transform-style:preserve-3d]', flipped && '[transform:rotateY(180deg)]')}>
        {/* Mặt trước */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-lg [backface-visibility:hidden]">
          <span className="text-6xl">{v.emoji}</span>
          <p className="text-4xl font-black tracking-tight text-center">{v.word}</p>
          <p className="text-slate-500">{v.ipa} · <i>{POS[v.partOfSpeech]}</i></p>
          <Stress v={v} />
          <button type="button" onClick={(e) => { e.stopPropagation(); speak(v.word); }} className="rounded-full bg-indigo-50 px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-100">🔊 Nghe</button>
          <p className="absolute bottom-4 text-xs text-slate-400">Chạm thẻ để lật</p>
        </div>
        {/* Mặt sau */}
        <div className="absolute inset-0 overflow-y-auto rounded-3xl bg-indigo-950 p-6 text-indigo-50 shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] space-y-3 text-sm">
          <p className="text-2xl font-black text-white">{v.meaningVi}</p>
          <p className="italic text-indigo-200">{v.meaningEn}</p>
          {v.synonyms.length > 0 && <p><b className="text-emerald-300">≈</b> {v.synonyms.join(', ')}</p>}
          {v.antonyms.length > 0 && <p><b className="text-rose-300">≠</b> {v.antonyms.join(', ')}</p>}
          {v.wordFamily.length > 0 && <p><b className="text-amber-300">Họ từ:</b> {v.wordFamily.join(' · ')}</p>}
          {v.collocations.length > 0 && <p><b className="text-sky-300">Cụm:</b> {v.collocations.join(' · ')}</p>}
          <p className="rounded-xl bg-white/10 p-3">📖 {v.exampleFromPassage}</p>
          <p className="rounded-xl bg-white/10 p-3">✍️ {v.exampleNew}</p>
          {v.mnemonicVi && <p className="text-amber-200">💡 {v.mnemonicVi}</p>}
        </div>
      </div>
    </div>
  );
}

export function VocabStudy({ dayId }: { dayId: number }) {
  const hydrated = useHydrated();
  const student = useCurrentStudent();
  const day = getDay(dayId);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [kind, setKind] = useState<'all' | 'word' | 'phrase'>('all');

  if (!hydrated) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  if (!day) return null;

  // Tách từ đơn và cụm từ: hai nhóm này học theo cách khác nhau
  const items = day.vocab.filter((w) =>
    kind === 'all' ? true : kind === 'phrase' ? w.partOfSpeech === 'phrase' : w.partOfSpeech !== 'phrase',
  );
  const idx = Math.min(i, Math.max(0, items.length - 1));
  const v = items[idx];
  const go = (d: number) => {
    setFlipped(false);
    setI((x) => (Math.min(x, items.length - 1) + d + items.length) % items.length);
  };

  return (
    <div className="min-h-screen">
      <TopBar back={{ href: `/day/${dayId}`, label: `Ngày ${dayId}` }} title="Học từ vựng" />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {(['cards', 'list'] as const).map((k) => (
              <button key={k} type="button" onClick={() => setView(k)}
                className={clsx('rounded-lg px-4 py-1.5 text-sm font-semibold', view === k ? 'bg-white shadow text-slate-900' : 'text-slate-500')}>
                {k === 'cards' ? '🃏 Thẻ từ' : '📋 Danh sách'}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {([['all', 'Tất cả'], ['word', 'Từ đơn'], ['phrase', 'Cụm từ']] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => { setKind(k); setI(0); setFlipped(false); }}
                className={clsx('rounded-lg px-3 py-1.5 text-sm font-semibold', kind === k ? 'bg-white shadow text-slate-900' : 'text-slate-500')}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === 'cards' ? (
          <div className="mx-auto max-w-md space-y-4">
            <p className="text-center text-sm text-slate-500">{idx + 1} / {items.length}</p>
            <Card v={v} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
            <div className="flex gap-3">
              <button type="button" onClick={() => go(-1)} className="flex-1 rounded-xl border-2 border-slate-200 bg-white py-3 font-semibold">← Trước</button>
              <button type="button" onClick={() => go(1)} className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white">Tiếp →</button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
            {items.map((w) => {
              const m = student?.vocabMastery[w.word];
              return (
                <div key={w.word} className="flex items-start gap-3 p-4">
                  <span className="text-2xl w-12 text-center shrink-0">{w.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">
                      {w.word} <span className="font-normal text-slate-400 text-sm">{w.ipa} ({w.partOfSpeech})</span>
                    </p>
                    <p className="text-sm">{w.meaningVi} — <i className="text-slate-500">{w.meaningEn}</i></p>
                    <p className="text-xs text-slate-500 mt-1">📖 {w.exampleFromPassage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button type="button" onClick={() => speak(w.word)} className="text-lg" aria-label={`Nghe ${w.word}`}>🔊</button>
                    {m?.mastered ? <span className="text-xs text-emerald-600 font-semibold">Đã thuộc</span>
                      : m?.wrong ? <span className="text-xs text-rose-600 font-semibold">Cần ôn</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
