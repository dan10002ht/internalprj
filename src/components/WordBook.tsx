'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { days } from '@/data';
import { isDue } from '@/lib/review';
import { speak } from '@/lib/speech';
import { useCurrentStudent, useHydrated, useProgress } from '@/store/progress';
import type { VocabItem, WordSource } from '@/types';

/** yyyy-mm-dd → dd/MM cho dễ đọc */
const fmtDay = (iso: string) => iso.split('-').slice(1).reverse().join('/');
import { TopBar } from './ui/TopBar';

const SOURCE_LABEL: Record<WordSource, string> = {
  lookup: 'đã tra trong bài',
  wrong: 'làm sai',
  marked: 'tự đánh dấu',
};

const SOURCE_CLASS: Record<WordSource, string> = {
  lookup: 'bg-sky-50 text-sky-700 border-sky-200',
  wrong: 'bg-rose-50 text-rose-700 border-rose-200',
  marked: 'bg-amber-50 text-amber-800 border-amber-200',
};

const allVocab = () => new Map<string, VocabItem>(days.flatMap((d) => d.vocab.map((v) => [v.word, v] as const)));

/**
 * Sổ từ (V8) — gom từ đã tra, từ làm sai và từ tự đánh dấu.
 * Những từ này được hỏi trước ở Round cuối và vào Warm-up ngày sau.
 */
export function WordBook() {
  const hydrated = useHydrated();
  const student = useCurrentStudent();
  const remove = useProgress((s) => s.removeFromWordBook);
  const [filter, setFilter] = useState<'all' | WordSource>('all');

  if (!hydrated) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;

  const vocab = allVocab();
  const list = student.wordBook.filter((e) => filter === 'all' || e.source === filter);
  const counts = {
    all: student.wordBook.length,
    lookup: student.wordBook.filter((e) => e.source === 'lookup').length,
    wrong: student.wordBook.filter((e) => e.source === 'wrong').length,
    marked: student.wordBook.filter((e) => e.source === 'marked').length,
  };

  return (
    <div className="min-h-screen">
      <TopBar back={{ href: '/dashboard', label: 'Các ngày học' }} title="Sổ từ" />
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <p className="text-sm text-slate-500">
          Từ bạn đã tra trong bài, làm sai hoặc tự đánh dấu. Những từ này được hỏi trước ở Round cuối và quay lại trong Warm-up ngày sau.
        </p>

        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
          {(['all', 'lookup', 'wrong', 'marked'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setFilter(k)}
              className={clsx('rounded-lg px-3 py-1.5 text-sm font-semibold', filter === k ? 'bg-white text-slate-900 shadow' : 'text-slate-500')}>
              {k === 'all' ? 'Tất cả' : SOURCE_LABEL[k]} ({counts[k]})
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Chưa có từ nào ở đây. Chạm vào từ gạch chấm trong bài đọc, hoặc bấm “+ Sổ từ” ở phần giải thích để thêm.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {list.map((e) => {
              const v = vocab.get(e.word);
              const m = student.vocabMastery[e.word];
              return (
                <div key={e.word} className="flex items-start gap-3 p-4">
                  <span className="w-10 shrink-0 text-center text-2xl">{v?.emoji ?? '📝'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">
                      {e.word} {v && <span className="text-sm font-normal text-slate-400">{v.ipa} ({v.partOfSpeech})</span>}
                    </p>
                    {v && <p className="text-sm">{v.meaningVi} — <i className="text-slate-500">{v.meaningEn}</i></p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className={clsx('rounded-md border px-1.5 py-0.5 font-semibold', SOURCE_CLASS[e.source])}>{SOURCE_LABEL[e.source]}</span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600">Ngày {e.dayId}</span>
                      {m?.mastered ? <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">đã thuộc</span>
                        : isDue(m) ? <span className="rounded-md bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-800">đến hạn ôn</span>
                          : m?.nextReviewAt ? <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-500">ôn lại ngày {fmtDay(m.nextReviewAt)}</span> : null}
                      {m && <span className="text-slate-400">đúng {m.correct} · sai {m.wrong}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button type="button" onClick={() => speak(e.word)} className="text-lg" aria-label={`Nghe ${e.word}`}>🔊</button>
                    <button type="button" onClick={() => remove(e.word)} className="text-xs text-slate-400 hover:text-rose-600">Bỏ khỏi sổ</button>
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
