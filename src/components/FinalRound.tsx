'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { shuffle } from '@/lib/random';
import { speak } from '@/lib/speech';
import { secKey, useCurrentStudent, useProgress } from '@/store/progress';
import type { DayContent, TestSection, VocabItem } from '@/types';

const SECONDS = 15;
const FEEDBACK_MS = 1500;

type Prompt = 'listen' | 'meaning';
interface Item { v: VocabItem; prompt: Prompt }
interface Result { v: VocabItem; typed: string; correct: boolean }

/** Cách hỏi lần trước của từng từ — làm lại thì đổi cách hỏi */
const lastPrompt = new Map<string, Prompt>();

const lettersOf = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

/**
 * Cụm dài quá thì gõ trong 15 giây là không thực tế → không đưa vào Round cuối.
 * Vẫn học chúng ở flashcard và mini test.
 */
const typable = (v: VocabItem) => v.word.trim().split(/\s+/).length <= 2 && lettersOf(v.word).length <= 18;

function buildItems(day: DayContent, looked: string[], weak: string[], max: number): Item[] {
  const pool = day.vocab.filter(typable);
  const inDay = (w: string) => pool.find((v) => v.word === w);
  const first = [...new Set([...looked, ...weak])].map(inDay).filter((v): v is VocabItem => !!v);
  const rest = shuffle(pool.filter((v) => !first.includes(v)));
  const picked = shuffle([...first, ...rest].slice(0, max));
  return picked.map((v) => {
    const prev = lastPrompt.get(v.word);
    const prompt: Prompt = prev ? (prev === 'listen' ? 'meaning' : 'listen') : Math.random() < 0.5 ? 'listen' : 'meaning';
    lastPrompt.set(v.word, prompt);
    return { v, prompt };
  });
}

/** Ô gạch theo số chữ cái; dấu cách và gạch nối hiện sẵn */
function Slots({ word, typed }: { word: string; typed: string }) {
  let k = 0;
  return (
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-3">
      {word.split('').map((ch, i) => {
        if (ch === ' ') return <span key={i} className="w-5" />;
        if (!/[a-z]/i.test(ch)) return <span key={i} className="self-end pb-1 text-2xl font-bold text-slate-500">{ch}</span>;
        const c = typed[k++];
        return (
          <span key={i} className={clsx('grid h-11 w-8 place-items-end justify-center border-b-4 pb-1 text-2xl font-bold uppercase',
            c ? 'border-indigo-500 text-slate-900' : 'border-slate-300')}>
            {c ?? ''}
          </span>
        );
      })}
    </div>
  );
}

export function FinalRound({ day, section, onRestart }: { day: DayContent; section: TestSection; onRestart: () => void }) {
  const student = useCurrentStudent();
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const [items] = useState<Item[]>(() => {
    // Ưu tiên từ trong Sổ từ (đã tra / làm sai / tự đánh dấu) rồi tới từ hay sai
    const book = student.wordBook.filter((e) => e.dayId === day.dayId).map((e) => e.word);
    const looked = [...new Set([...book, ...(student.lookups?.[day.dayId] ?? [])])];
    const weak = day.vocab.filter((v) => { const m = student.vocabMastery[v.word]; return m && m.wrong > 0 && !m.mastered; }).map((v) => v.word);
    return buildItems(day, looked, weak, section.maxWords ?? 20);
  });
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [left, setLeft] = useState(SECONDS);
  const [feedback, setFeedback] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<() => void>(() => {});

  const item = items[idx];
  const target = item ? lettersOf(item.v.word) : '';

  const submit = () => {
    if (feedback || done || !item) return;
    const r: Result = { v: item.v, typed, correct: lettersOf(typed) === target };
    setFeedback(r);
    const all = [...results, r];
    setResults(all);
    setTimeout(() => {
      setFeedback(null);
      setTyped('');
      setLeft(SECONDS);
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
      } else {
        const correct = all.filter((x) => x.correct).length;
        const score = Math.round((correct / all.length) * 100);
        recordAttempt({
          sectionId: secKey(day.dayId, section.id), dayId: day.dayId, mode: 'exam', score, rawScore: score, hintsUsed: 0,
          timeSpent: Math.round((Date.now() - startedAt) / 1000), wrongQuestionIds: [], wrong: [],
          passed: score >= section.passThreshold,
          words: all.map((x) => ({ word: x.v.word, correct: x.correct, hint3: false })),
        });
        setDone(true);
      }
    }, FEEDBACK_MS);
  };

  useEffect(() => {
    submitRef.current = submit;
  });

  // Đếm ngược từng từ; hết giờ → tính sai
  useEffect(() => {
    if (done || feedback) return;
    if (left <= 0) {
      submitRef.current();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, done, feedback]);

  // Từ hỏi bằng cách nghe → đọc ngay khi hiện
  useEffect(() => {
    if (item && !done && item.prompt === 'listen') speak(item.v.word);
    inputRef.current?.focus();
  }, [item, done]);

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const score = Math.round((correct / results.length) * 100);
    const passed = score >= section.passThreshold;
    const wrong = results.filter((r) => !r.correct);
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <Link href={`/day/${day.dayId}`} className="text-sm text-slate-500 hover:text-slate-900">← Về ngày học</Link>
          <div className={clsx('rounded-3xl p-6 sm:p-8 text-white shadow-lg', passed ? 'bg-emerald-600' : 'bg-rose-500')}>
            <p className="text-sm opacity-90">{section.title}</p>
            <p className="mt-2 text-5xl font-black tabular-nums">{correct}/{results.length}</p>
            <p className="mt-2">
              {passed
                ? `Bạn gõ đúng ${score}% số từ. Xong ngày ${day.dayId} rồi!`
                : `Bạn gõ đúng ${score}%. Cần từ ${section.passThreshold}% trở lên để hoàn thành ngày học — ôn lại các từ bên dưới rồi làm lại nhé.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onRestart} className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Làm lại</button>
            <Link href={`/day/${day.dayId}/vocab`} className="rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700">Xem lại từ vựng</Link>
          </div>
          {wrong.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
              <h2 className="p-4 font-bold">Từ cần ôn lại</h2>
              {wrong.map((r) => (
                <div key={r.v.word} className="flex items-start gap-3 p-4">
                  <div className="flex-1">
                    <p className="font-bold">{r.v.word} <span className="font-normal text-sm text-slate-400">{r.v.ipa}</span></p>
                    <p className="text-sm text-slate-600">{r.v.meaningVi}</p>
                    <p className="text-xs text-rose-600">Bạn gõ: {r.typed || '(bỏ trống)'}</p>
                  </div>
                  <button type="button" onClick={() => speak(r.v.word)} aria-label={`Nghe ${r.v.word}`}>🔊</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20">
        <div aria-hidden className="absolute inset-0 -z-10 bg-white/95 backdrop-blur border-b border-slate-200" />
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link href={`/day/${day.dayId}`} className="text-sm text-slate-500 hover:text-slate-900">← Về ngày học</Link>
          <p className="flex-1 font-bold">{section.title}</p>
          <p className="text-sm text-slate-500 tabular-nums">{idx + 1}/{items.length}</p>
        </div>
        <div className="h-1.5 bg-slate-100">
          <div className={clsx('h-full transition-all duration-1000 ease-linear', left <= 5 ? 'bg-rose-500' : 'bg-indigo-500')}
            style={{ width: `${(left / SECONDS) * 100}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 space-y-8 text-center">
        <p className={clsx('text-sm font-bold tabular-nums', left <= 5 ? 'text-rose-600' : 'text-slate-400')}>{left}s</p>

        {item.prompt === 'listen' ? (
          <div className="space-y-2">
            <p className="text-slate-500">Nghe và gõ lại từ</p>
            <button type="button" onClick={() => speak(item.v.word)} className="rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-md">🔊 Nghe lại</button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-slate-500">Gõ từ tiếng Anh có nghĩa là</p>
            <p className="text-2xl font-black">{item.v.meaningVi}</p>
          </div>
        )}

        <div className="relative" onClick={() => inputRef.current?.focus()}>
          <Slots word={item.v.word} typed={lettersOf(feedback ? feedback.typed : typed)} />
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(lettersOf(e.target.value).slice(0, target.length))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            disabled={!!feedback}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Gõ từ"
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          />
        </div>

        {feedback ? (
          <p className={clsx('text-lg font-bold', feedback.correct ? 'text-emerald-600' : 'text-rose-600')}>
            {feedback.correct ? 'Đúng!' : <>Đáp án: <span className="text-slate-900">{feedback.v.word}</span></>}
          </p>
        ) : (
          <button type="button" onClick={submit} className="rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white">Xong</button>
        )}
      </main>
    </div>
  );
}
