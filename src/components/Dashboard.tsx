'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { days } from '@/data';
import { secKey, useCurrentStudent, useHydrated, useProgress } from '@/store/progress';
import type { DayContent, StudentProgress } from '@/types';
import { TopBar } from './ui/TopBar';

export function dayStats(day: DayContent, student: StudentProgress) {
  const done = day.sections.filter((s) => {
    const p = student.sections[secKey(day.dayId, s.id)];
    return p && (s.passThreshold === 0 || p.passed);
  }).length;
  const practicing = day.sections.filter((s) => {
    const p = student.sections[secKey(day.dayId, s.id)];
    return p && p.attempts > 0 && s.passThreshold > 0 && !p.passed;
  }).map((s) => ({ title: s.title, bestScore: student.sections[secKey(day.dayId, s.id)].bestScore }));
  const mastered = day.vocab.filter((v) => student.vocabMastery[v.word]?.mastered).length;
  return { done, practicing, total: day.sections.length, mastered, vocabTotal: day.vocab.length };
}

export function Dashboard() {
  const hydrated = useHydrated();
  const student = useCurrentStudent();
  const { user } = useSession();
  const setUnlockAll = useProgress((s) => s.setUnlockAll);

  // Lối tắt cho giáo viên xem trước mọi bài: /dashboard?gv=1 để mở, ?gv=0 để tắt
  useEffect(() => {
    const gv = new URLSearchParams(window.location.search).get('gv');
    if (gv === '1' || gv === '0') setUnlockAll(gv === '1');
  }, [setUnlockAll]);

  if (!hydrated || !student) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;

  const weakWords = Object.entries(student.vocabMastery).filter(([, m]) => m.wrong > 0 && !m.mastered).map(([w]) => w);

  return (
    <div className="min-h-screen">
      <TopBar title="" />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="flex-1 text-2xl font-black">Các ngày học</h1>
          <Link href="/wordbook" className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300">
            Sổ từ ({student.wordBook.length})
          </Link>
          {user?.role === 'teacher' && (
            <Link href="/gv" className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300">
              Giáo viên
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => {
            const st = dayStats(day, student);
            return (
              <Link key={day.dayId} href={`/day/${day.dayId}`}
                className="group rounded-2xl bg-white border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300">
                <p className="text-sm font-semibold text-indigo-600">Ngày {day.dayId}</p>
                <p className="mt-1 text-lg font-bold leading-snug">{day.title}</p>
                <p className="text-sm text-slate-500">{day.topic} · {day.vocab.length} từ</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(st.done / st.total) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">Xong {st.done}/{st.total} bài · thuộc {st.mastered}/{st.vocabTotal} từ</p>
                {st.practicing.map((p) => (
                  <p key={p.title} className="mt-1 text-xs text-indigo-600">Đang luyện: {p.title} · {p.bestScore}% tốt nhất</p>
                ))}
              </Link>
            );
          })}
        </div>

        {weakWords.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <h2 className="font-bold mb-2">Từ bạn hay sai</h2>
            <div className="flex flex-wrap gap-2">
              {weakWords.map((w) => <span key={w} className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-sm text-rose-700">{w}</span>)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
