'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { days, findQuestion } from '@/data';
import { correctAnswerText } from '@/lib/grade';
import { isDue } from '@/lib/review';
import { secKey } from '@/store/progress';
import type { StudentProgress, VocabItem, WordSource } from '@/types';
import { AccuracyChart } from './AccuracyChart';

const fmtMin = (sec: number) =>
  sec >= 3600 ? `${Math.floor(sec / 3600)}h${String(Math.floor((sec % 3600) / 60)).padStart(2, '0')}` : `${Math.round(sec / 60)} phút`;
const fmtWhen = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

const SOURCE_LABEL: Record<WordSource, string> = { lookup: 'đã tra', wrong: 'làm sai', marked: 'tự đánh dấu' };

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black tabular-nums text-slate-900">{value}</p>
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  );
}

/** Toàn bộ số liệu làm bài của một học sinh — dùng ở màn hình giáo viên */
export function StudentReport({ student }: { student: StudentProgress }) {
  const [vocabFilter, setVocabFilter] = useState<'all' | 'due' | 'mastered'>('all');
  const [openDay, setOpenDay] = useState<number | null>(days[0]?.dayId ?? null);

  const allVocab: VocabItem[] = days.flatMap((d) => d.vocab);
  const sectionsDone = days.flatMap((d) =>
    d.sections.filter((s) => {
      const p = student.sections[secKey(d.dayId, s.id)];
      return p && (s.passThreshold === 0 || p.passed);
    }),
  ).length;
  const sectionsTotal = days.reduce((n, d) => n + d.sections.length, 0);
  const mastered = allVocab.filter((v) => student.vocabMastery[v.word]?.mastered).length;
  const due = allVocab.filter((v) => isDue(student.vocabMastery[v.word])).length;

  // Câu sai gom theo dạng bài
  const byTag = new Map<string, { name: string; count: number }>();
  for (const e of student.wrongBank ?? []) {
    const found = findQuestion(e.questionId);
    const name = found?.day.strategies[e.strategyTag]?.name ?? e.strategyTag;
    const t = byTag.get(e.strategyTag) ?? { name, count: 0 };
    t.count += e.wrongCount;
    byTag.set(e.strategyTag, t);
  }
  const maxWrong = Math.max(1, ...[...byTag.values()].map((t) => t.count));

  const vocabRows = allVocab
    .map((v, index) => ({ v, index, m: student.vocabMastery[v.word] }))
    .filter(({ m }) => (vocabFilter === 'all' ? !!m : vocabFilter === 'mastered' ? !!m?.mastered : isDue(m)));

  return (
    <div className="space-y-6">
      {/* Tổng quan */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Bài đã xong" value={`${sectionsDone}/${sectionsTotal}`} />
        <Tile label="Tổng thời gian" value={fmtMin(student.totalTimeSpent)} />
        <Tile label="Từ đã thuộc" value={`${mastered}/${allVocab.length}`} note="đúng 3 lần liên tiếp và không phải mở nghĩa tiếng Việt" />
        <Tile label="Từ cần ôn" value={String(due)} note={`Sổ từ: ${student.wordBook?.length ?? 0} từ`} />
      </div>

      {/* Tiến độ từng ngày */}
      {days.map((d) => {
        const open = openDay === d.dayId;
        const wrongOfDay = (student.wrongBank ?? []).filter((e) => e.dayId === d.dayId);
        return (
          <div key={d.dayId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button type="button" onClick={() => setOpenDay(open ? null : d.dayId)}
              className="flex w-full items-center gap-3 p-5 text-left">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-600 font-black text-white">{d.dayId}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{d.title}</span>
                <span className="block text-sm text-slate-500">{d.sections.length} bài · {d.vocab.length} từ · {wrongOfDay.length} câu từng sai</span>
              </span>
              <span className="text-slate-400">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
              <div className="space-y-5 border-t border-slate-100 p-5">
                <div className="-mx-5 overflow-x-auto px-5">
                  <table className="w-full min-w-[46rem] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-2 pr-3 font-semibold">Bài</th>
                        <th className="py-2 pr-3 font-semibold">Trạng thái</th>
                        <th className="py-2 pr-3 text-right font-semibold">Lần làm</th>
                        <th className="py-2 pr-3 text-right font-semibold">Tốt nhất</th>
                        <th className="py-2 pr-3 text-right font-semibold">Lần cuối</th>
                        <th className="py-2 pr-3 text-right font-semibold">Điểm chưa trừ gợi ý</th>
                        <th className="py-2 pr-3 text-right font-semibold">Số câu dùng gợi ý</th>
                        <th className="py-2 pr-3 text-right font-semibold">Thời gian</th>
                        <th className="py-2 pr-3 text-right font-semibold">Còn sai</th>
                        <th className="py-2 font-semibold">Lúc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.sections.map((s) => {
                        const p = student.sections[secKey(d.dayId, s.id)];
                        return (
                          <tr key={s.id} className="border-b border-slate-100 last:border-0">
                            <td className="py-2 pr-3 font-medium">{s.title}</td>
                            <td className="py-2 pr-3">
                              {!p ? <span className="text-slate-400">chưa làm</span>
                                : s.passThreshold === 0 || p.passed
                                  ? <span className="font-semibold text-emerald-600">xong</span>
                                  : <span className="font-semibold text-amber-600">chưa đạt {s.passThreshold}%</span>}
                            </td>
                            <td className="py-2 pr-3 text-right tabular-nums">{p?.attempts ?? 0}</td>
                            <td className="py-2 pr-3 text-right font-semibold tabular-nums">{p ? `${p.bestScore}%` : '—'}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">{p ? `${p.lastScore}%` : '—'}</td>
                            <td className="py-2 pr-3 text-right tabular-nums text-slate-500">{p ? `${p.lastRawScore}%` : '—'}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">{p?.hintsUsed ?? 0}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">{p ? fmtMin(p.timeSpent) : '—'}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">{p?.wrongQuestionIds.length ?? 0}</td>
                            <td className="py-2 text-slate-500">{fmtWhen(p?.lastAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {wrongOfDay.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-bold">Câu học sinh từng làm sai</p>
                    <ul className="space-y-2">
                      {[...wrongOfDay].sort((a, b) => b.wrongCount - a.wrongCount).map((e) => {
                        const found = findQuestion(e.questionId);
                        return (
                          <li key={e.questionId} className="rounded-xl border border-slate-200 p-3 text-sm">
                            <p className="flex items-start gap-2">
                              <span className="shrink-0 rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-bold text-rose-700">sai {e.wrongCount}×</span>
                              <span className="flex-1">{found?.q.stem ?? e.questionId}</span>
                            </p>
                            {found && (
                              <p className="mt-1 text-xs text-slate-500">
                                Đáp án: <span className="text-emerald-700">{correctAnswerText(found.q).split('\n')[0]}</span>
                                {' · '}Dạng: {found.day.strategies[e.strategyTag]?.name ?? e.strategyTag}
                                {' · '}Lần sai gần nhất: {fmtWhen(e.lastWrongAt)}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Dạng bài hay sai */}
      {byTag.size > 1 && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Số lần sai theo dạng bài</p>
          <ul className="space-y-2.5">
            {[...byTag.entries()].sort((a, b) => b[1].count - a[1].count).map(([tag, t]) => (
              <li key={tag} className="grid grid-cols-[minmax(7rem,12rem)_1fr_auto] items-center gap-3 text-sm">
                <span className="truncate text-slate-700">{t.name}</span>
                <span className="relative block h-2.5 rounded-r-[4px] bg-slate-100">
                  <span aria-hidden style={{ width: `${(t.count / maxWrong) * 100}%`, backgroundColor: '#d03b3b' }}
                    className="absolute inset-y-0 left-0 rounded-r-[4px]" />
                </span>
                <b className="justify-self-end tabular-nums text-slate-800">{t.count}</b>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400">Thanh dài là dạng bài học sinh sai nhiều nhất — nên ôn thêm dạng đó.</p>
        </div>
      )}

      {/* Điểm tốt nhất từng bài */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <AccuracyChart title="Điểm tốt nhất từng bài"
          rows={days.flatMap((d) => d.sections.map((s) => {
            const p = student.sections[secKey(d.dayId, s.id)];
            return { key: `${d.dayId}:${s.id}`, label: `N${d.dayId} · ${s.title.split('—')[0].trim()}`, got: p?.bestScore ?? 0, total: 100 };
          }))} />
      </div>

      {/* Từ vựng */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">Từ vựng</p>
          <div className="ml-auto flex gap-1 rounded-xl bg-slate-100 p-1">
            {([['all', 'Đã học'], ['due', 'Cần ôn'], ['mastered', 'Đã thuộc']] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => setVocabFilter(k)}
                className={clsx('rounded-lg px-3 py-1 text-sm font-semibold', vocabFilter === k ? 'bg-white text-slate-900 shadow' : 'text-slate-500')}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {vocabRows.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">Chưa có từ nào trong nhóm này.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Từ</th>
                  <th className="py-2 pr-3 text-right font-semibold">Đúng</th>
                  <th className="py-2 pr-3 text-right font-semibold">Sai</th>
                  <th className="py-2 pr-3 text-right font-semibold">Đúng liên tiếp</th>
                  <th className="py-2 pr-3 font-semibold">Đã phải xem nghĩa tiếng Việt</th>
                  <th className="py-2 pr-3 font-semibold">Ôn lại</th>
                  <th className="py-2 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {vocabRows.map(({ v, m, index }) => (
                  <tr key={`${index}:${v.word}`} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-3">
                      <span className="font-semibold">{v.word}</span>
                      <span className="ml-1.5 text-slate-500">{v.meaningVi}</span>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums text-emerald-700">{m?.correct ?? 0}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-rose-700">{m?.wrong ?? 0}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{m?.streak ?? 0}</td>
                    <td className="py-2 pr-3">{m?.hint3Used ? 'có' : '—'}</td>
                    <td className="py-2 pr-3 text-slate-600">{m?.nextReviewAt ?? '—'}</td>
                    <td className="py-2">
                      {m?.mastered ? <span className="font-semibold text-emerald-600">đã thuộc</span>
                        : isDue(m) ? <span className="font-semibold text-amber-600">đến hạn ôn</span>
                          : <span className="text-slate-500">đang học</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sổ từ */}
      {(student.wordBook?.length ?? 0) > 0 && (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Sổ từ ({student.wordBook.length} từ)</p>
          <div className="flex flex-wrap gap-1.5">
            {student.wordBook.map((e) => (
              <span key={e.word} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-sm">
                {e.word} <span className="text-[11px] text-slate-400">· {SOURCE_LABEL[e.source]} · N{e.dayId}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
