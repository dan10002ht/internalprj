'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { getDay } from '@/data';
import { isUnlocked, requiredSection } from '@/lib/unlock';
import { secKey, useCurrentStudent, useHydrated, useProgress } from '@/store/progress';
import type { DayContent, StudentProgress, TestSection } from '@/types';
import { TopBar } from './ui/TopBar';

function meta(s: TestSection) {
  if (s.kind === 'warmup') return `tối đa ${s.maxWords ?? 10} từ của những ngày trước · ${Math.round(s.durationSec / 60)} phút · không tính vào điều kiện mở bài`;
  if (s.kind === 'final') return `${s.maxWords ?? 20} từ · 15 giây mỗi từ · cần đúng từ ${s.passThreshold}%`;
  const parts = [`${s.questionIds.length} câu`];
  parts.push(s.durationSec > 0 ? `${Math.round(s.durationSec / 60)} phút` : 'không giới hạn thời gian');
  if (s.passThreshold > 0) parts.push(`cần đúng từ ${s.passThreshold}%`);
  if (s.kind === 'exam') parts.push(s.mode === 'exam' ? 'chấm khi nộp bài, không gợi ý' : 'chấm từng câu, có gợi ý');
  return parts.join(' · ');
}

function SectionCard({ day, s, student, unlockAll, index }: { day: DayContent; s: TestSection; student: StudentProgress; unlockAll: boolean; index: number }) {
  const p = student.sections[secKey(day.dayId, s.id)];
  const open = isUnlocked(day, s, student, unlockAll);
  const wrong = p?.wrongQuestionIds.length ?? 0;
  const base = `/day/${day.dayId}/test/${s.id}`;
  const done = !!p && (s.passThreshold === 0 || p.passed);

  return (
    <div className={clsx('rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-3', !open && 'opacity-60')}>
      <div className="flex items-start gap-3">
        <span className={clsx('grid size-9 shrink-0 place-items-center rounded-xl font-black text-white',
          done ? 'bg-emerald-500' : p ? 'bg-amber-500' : open ? 'bg-indigo-600' : 'bg-slate-300')}>
          {done ? '✓' : index}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-snug">{s.title}</p>
          <p className="text-sm text-slate-500">{s.subtitle}</p>
          <p className="mt-1 text-xs text-slate-400">{meta(s)}</p>
        </div>
        {p && (
          <div className="text-right">
            <p className={clsx('text-xl font-black tabular-nums', p.bestScore >= 80 ? 'text-emerald-600' : p.bestScore >= 50 ? 'text-amber-600' : 'text-rose-600')}>{p.bestScore}%</p>
            <p className="text-[11px] text-slate-400">tốt nhất · {p.attempts} lần</p>
          </div>
        )}
      </div>
      {open ? (
        <div className="flex flex-wrap gap-2">
          <Link href={base} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{p ? 'Làm lại' : 'Bắt đầu'}</Link>
          {wrong > 0 && s.kind !== 'final' && s.kind !== 'warmup' && (
            <Link href={`${base}?mode=review`} className="rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">Làm lại {wrong} câu sai</Link>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Làm xong <b>{requiredSection(day, s)?.title}</b> để mở bài này.</p>
      )}
    </div>
  );
}

export function DayView({ dayId }: { dayId: number }) {
  const hydrated = useHydrated();
  const student = useCurrentStudent();
  const unlockAll = useProgress((s) => s.unlockAll);
  const day = getDay(dayId);

  if (!hydrated) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  if (!day) return <div className="p-10 text-center">Chưa có nội dung cho ngày {dayId}. <Link href="/dashboard" className="text-indigo-600">Quay lại</Link></div>;
  if (!student) return null;

  const warmups = day.sections.filter((s) => s.kind === 'warmup');
  const minis = day.sections.filter((s) => s.kind === 'mini');
  const exams = day.sections.filter((s) => s.kind === 'exam');
  const finals = day.sections.filter((s) => s.kind === 'final');
  const mastered = day.vocab.filter((v) => student.vocabMastery[v.word]?.mastered).length;
  const card = (s: TestSection, i: number) => <SectionCard key={s.id} day={day} s={s} student={student} unlockAll={unlockAll} index={i} />;

  return (
    <div className="min-h-screen">
      <TopBar back={{ href: '/dashboard', label: 'Các ngày học' }} title={`Ngày ${day.dayId}`} />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-10">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Ngày {day.dayId} · {day.topic}</p>
          <h1 className="text-3xl font-black tracking-tight">{day.title}</h1>
        </div>

        {warmups.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Ôn từ ngày trước</h2>
            {warmups.map((s, i) => card(s, i + 1))}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Học từ vựng</h2>
          <Link href={`/day/${day.dayId}/vocab`}
            className="flex items-center gap-4 rounded-2xl bg-indigo-600 p-5 text-white shadow-md transition hover:bg-indigo-700">
            <span className="flex-1">
              <span className="block text-lg font-bold">{day.vocab.length} từ mới</span>
              <span className="block text-sm opacity-90">Lật thẻ, nghe phát âm, xem ví dụ trong bài đọc</span>
            </span>
            <span className="text-right text-sm">
              <span className="block text-2xl font-black">{mastered}/{day.vocab.length}</span>đã thuộc
            </span>
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Mini test</h2>
          <div className="grid gap-4 md:grid-cols-3">{minis.map((s, i) => card(s, i + 1))}</div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Đề tổng hợp</h2>
          <div className="grid gap-4 md:grid-cols-2">{exams.map((s, i) => card(s, minis.length + i + 1))}</div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Round cuối</h2>
          {finals.map((s, i) => card(s, minis.length + exams.length + i + 1))}
        </section>
      </main>
    </div>
  );
}
