'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { previousVocab } from '@/data';
import { useSession } from '@/components/auth/SessionProvider';
import { meaningQuestion } from '@/lib/generate';
import { dueWords } from '@/lib/review';
import { speak } from '@/lib/speech';
import { secKey, useCurrentStudent, useProgress } from '@/store/progress';
import type { DayContent, Question, TestSection } from '@/types';

const fmt = (s: number) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

/**
 * Warm-up đầu ngày — ôn lại các từ của những ngày trước đã đến hạn (mục 2.2).
 * Câu hỏi sinh tại runtime từ từ vựng, kết quả ghi vào lịch ôn nhưng không gate bài sau.
 */
export function WarmUp(props: { day: DayContent; section: TestSection }) {
  const { user } = useSession();
  const ownerId = useProgress((s) => s.ownerId);
  // Build the fixed question pool only after this account's progress is loaded.
  if (!user || ownerId !== user.id) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  return <WarmUpSession key={user.id} {...props} />;
}

function WarmUpSession({ day, section }: { day: DayContent; section: TestSection }) {
  const student = useCurrentStudent();
  const recordAttempt = useProgress((s) => s.recordAttempt);

  const [qs] = useState<Question[]>(() => {
    const pool = previousVocab(day.dayId);
    const words = dueWords(pool, student, section.maxWords ?? 10);
    const byWord = new Map(pool.map((v) => [v.word, v]));
    // Câu hỏi lấy nhiễu từ toàn bộ từ các ngày trước
    const scope: DayContent = { ...day, vocab: pool };
    return words.map((w) => meaningQuestion(scope, byWord.get(w.word)!, 'warmup'));
  });

  const [idx, setIdx] = useState(0);
  const [given, setGiven] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [left, setLeft] = useState(section.durationSec);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const finishRef = useRef<() => void>(() => {});

  const finish = () => {
    if (done || qs.length === 0) return;
    const words = qs.map((q) => ({ word: q.targetWords[0], correct: given[q.id] === q.answer, hint3: false }));
    const correct = words.filter((w) => w.correct).length;
    const score = Math.round((correct / qs.length) * 100);
    recordAttempt({
      sectionId: secKey(day.dayId, section.id), dayId: day.dayId, mode: 'practice',
      score, rawScore: score, hintsUsed: 0,
      timeSpent: Math.round((Date.now() - startedAt) / 1000),
      wrongQuestionIds: [], wrong: [], passed: true, words,
    });
    setDone(true);
  };

  useEffect(() => { finishRef.current = finish; });

  useEffect(() => {
    if (done || qs.length === 0) return;
    if (left <= 0) { finishRef.current(); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, done, qs.length]);

  if (qs.length === 0) {
    return (
      <div className="mx-auto max-w-md p-10 text-center space-y-4">
        <p className="text-4xl">🎉</p>
        <p className="text-slate-600">Không có từ nào đến hạn ôn hôm nay. Bạn vào thẳng Mini 1 nhé.</p>
        <Link href={`/day/${day.dayId}`} className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Về ngày học</Link>
      </div>
    );
  }

  if (done) {
    const correct = qs.filter((q) => given[q.id] === q.answer).length;
    const wrong = qs.filter((q) => given[q.id] !== q.answer);
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <Link href={`/day/${day.dayId}`} className="text-sm text-slate-500 hover:text-slate-900">← Về ngày học</Link>
          <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-lg sm:p-8">
            <p className="text-sm opacity-90">{section.title}</p>
            <p className="mt-2 text-5xl font-black tabular-nums">{correct}/{qs.length}</p>
            <p className="mt-2 opacity-95">
              Những từ bạn còn sai sẽ được hỏi lại vào ngày mai. Giờ bắt đầu từ mới của ngày {day.dayId} nhé.
            </p>
          </div>
          {wrong.length > 0 && (
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              <h2 className="p-4 font-bold">Từ cần ôn lại</h2>
              {wrong.map((q) => (
                <div key={q.id} className="flex items-start gap-3 p-4 text-sm">
                  <button type="button" onClick={() => speak(q.targetWords[0])} aria-label={`Nghe ${q.targetWords[0]}`}>🔊</button>
                  <div>
                    <p className="font-bold">{q.targetWords[0]}</p>
                    <p className="text-slate-600">{q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href={`/day/${day.dayId}`} className="inline-block rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white">Vào bài học →</Link>
        </div>
      </div>
    );
  }

  const q = qs[idx];
  const isChecked = !!checked[q.id];
  const chosen = given[q.id];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20">
        <div aria-hidden className="absolute inset-0 -z-10 border-b border-slate-200 bg-white/95 backdrop-blur" />
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href={`/day/${day.dayId}`} className="text-sm text-slate-500 hover:text-slate-900">← Về ngày học</Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{section.title}</p>
            <p className="text-xs text-slate-500">Câu {idx + 1}/{qs.length} · từ của những ngày trước</p>
          </div>
          <div className={clsx('rounded-lg px-3 py-1.5 font-mono text-sm font-bold tabular-nums',
            left < 30 ? 'animate-pulse bg-rose-100 text-rose-700' : 'bg-slate-900 text-white')}>⏱ {fmt(left)}</div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{q.stem}</h1>
            <button type="button" onClick={() => speak(q.targetWords[0])} aria-label="Nghe từ" className="text-lg">🔊</button>
          </div>
          <div className="grid gap-2">
            {q.options!.map((o, i) => (
              <button key={i} type="button" disabled={isChecked}
                onClick={() => setGiven((g) => ({ ...g, [q.id]: i }))}
                className={clsx('rounded-xl border-2 px-4 py-3 text-left transition',
                  isChecked && i === q.answer ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-800'
                    : isChecked && i === chosen ? 'border-rose-400 bg-rose-50 text-rose-800'
                      : chosen === i ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300')}>
                {o}
              </button>
            ))}
          </div>
          {isChecked && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{q.explanation}</p>}
        </div>

        <div className="flex gap-2">
          <div className="flex-1" />
          <button type="button" disabled={chosen === undefined}
            onClick={() => {
              if (!isChecked) return setChecked((c) => ({ ...c, [q.id]: true }));
              if (idx < qs.length - 1) return setIdx(idx + 1);
              finish();
            }}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white disabled:opacity-40">
            {!isChecked ? 'Kiểm tra' : idx < qs.length - 1 ? 'Câu tiếp →' : 'Xong'}
          </button>
        </div>
      </main>
    </div>
  );
}
