'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { correctAnswerText } from '@/lib/grade';
import { useCurrentStudent } from '@/store/progress';
import type { AnswerRecord, DayContent, Question, TestMode, TestSection } from '@/types';
import { AccuracyChart } from './AccuracyChart';
import { ClozeReview } from './ClozeReview';
import { Explanation } from './Explanation';
import { PassagePanel } from './PassagePanel';

const fmtGiven = (q: Question, r: AnswerRecord) => {
  const g = r.given;
  if (g === null || g === undefined) return '(bỏ trống)';
  if (typeof g === 'string') return g;
  if (typeof g === 'number') {
    if (q.format === 'tapSegment') return q.segments![g].text;
    return (q.fixedOrder ? `${'ABCD'[g]}. ` : '') + (q.options?.[g] ?? '').replace(/[{}]/g, '');
  }
  return `đúng ${Math.round(r.fraction * 100)}%`;
};

/** Lời nhận xét ngắn theo điểm */
function comment(score: number, passThreshold: number, mode: TestMode) {
  if (mode === 'review') return 'Làm lại câu sai là cách tiến bộ nhanh nhất. Câu nào vẫn chưa chắc thì mở phần giải thích đọc lại nhé.';
  if (passThreshold > 0 && score < passThreshold) return `Cần đạt từ ${passThreshold}% để mở bài tiếp theo. Xem lại các câu sai bên dưới rồi làm lại nhé.`;
  if (score >= 90) return 'Rất tốt! Bạn nắm chắc dạng bài này rồi.';
  if (score >= 70) return 'Khá tốt, xem lại vài câu sai là ổn.';
  return 'Bài này nhiều câu mới, chưa quen là chuyện bình thường. Đọc phần giải thích từng câu rồi làm lại, lần sau sẽ khác ngay.';
}

export function ResultView({ day, section, mode, qs, records, onRestart }: {
  day: DayContent; section: TestSection; mode: TestMode; qs: Question[]; records: AnswerRecord[]; onRestart: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const student = useCurrentStudent();
  const n = records.length;
  // Câu luyện thêm (V4) hiển thị riêng, không tính vào điểm đề
  const scored = qs.map((q, i) => ({ q, r: records[i] })).filter((x) => !x.q.bonus);
  const m = Math.max(1, scored.length);
  const raw = Math.round((scored.reduce((s, x) => s + x.r.fraction, 0) / m) * 100);
  const score = Math.round((scored.reduce((s, x) => s + x.r.score, 0) / m) * 100);
  const correct = scored.filter((x) => x.r.correct).length;
  const bonusTotal = qs.length - scored.length;
  const bonusCorrect = qs.map((q, i) => ({ q, r: records[i] })).filter((x) => x.q.bonus && x.r.correct).length;
  const hints = records.filter((r) => r.hintLevelUsed > 0).length;
  // Bài không có ngưỡng (đề tổng hợp): tô xanh khi đúng từ một nửa trở lên
  const passed = section.passThreshold > 0 ? score >= section.passThreshold : score >= 50;

  // Số câu đúng theo dạng bài
  const byTag = new Map<string, { total: number; got: number }>();
  scored.forEach(({ q, r }) => {
    const t = byTag.get(q.strategyTag) ?? { total: 0, got: 0 };
    t.total += 1;
    t.got += r.correct ? 1 : 0;
    byTag.set(q.strategyTag, t);
  });
  const tags = [...byTag.entries()].map(([tag, v]) => ({ tag, name: day.strategies[tag]?.name ?? tag, ...v })).sort((a, b) => a.got / a.total - b.got / b.total);
  const weak = tags.filter((t) => t.got / t.total < 0.7);
  const weakWords = [...new Set(qs.flatMap((q, i) => (!records[i].correct || records[i].hintLevelUsed >= 3 ? q.targetWords : [])))];
  // V7 — từ ưu tiên che khi đọc lại: từ đã tra trong bài + từ ở câu làm sai
  const clozePriority = [...new Set([...(student.lookups?.[day.dayId] ?? []), ...weakWords])];
  const sectionPassages = [...new Set(qs.map((q) => q.passageId).filter((x): x is string => !!x))]
    .map((id) => day.passages.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p && (p.kind ?? 'article') === 'article');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Link href={`/day/${day.dayId}`} className="text-sm text-slate-500 hover:text-slate-900">← Về ngày học</Link>

        <div className={clsx('rounded-3xl p-6 sm:p-8 text-white shadow-lg', passed ? 'bg-emerald-600' : 'bg-rose-500')}>
          <p className="text-sm opacity-90">{section.title}</p>
          <p className="mt-2 text-5xl font-black tabular-nums">{correct}/{m} <span className="text-2xl font-bold">câu đúng</span></p>
          <p className="mt-2 opacity-95">{comment(score, section.passThreshold, mode)}</p>
          {score !== raw && <p className="mt-1 text-sm opacity-90">Bạn có dùng gợi ý ở {hints} câu nên điểm tính là {score}%. Nếu tự làm hết thì sẽ là {raw}% — lần sau thử tự nghĩ thêm 10 giây trước khi mở gợi ý nhé.</p>}
          {bonusTotal > 0 && <p className="mt-1 text-sm opacity-90">Câu luyện thêm: đúng {bonusCorrect}/{bonusTotal} (không tính vào điểm đề).</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onRestart} className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Làm lại</button>
          {correct < n && mode !== 'review' && (
            <Link href={`/day/${day.dayId}/test/${section.id}?mode=review`} className="rounded-xl border-2 border-indigo-200 bg-white px-5 py-2.5 font-semibold text-indigo-700">Làm lại {n - correct} câu sai</Link>
          )}
          <Link href="/wordbook" className="rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700">Sổ từ</Link>
          <Link href={`/day/${day.dayId}`} className="rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700">Về ngày học</Link>
        </div>

        {tags.length > 1 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
            <AccuracyChart title="Theo từng dạng bài"
              rows={tags.map((t) => ({ key: t.tag, label: t.name, got: t.got, total: t.total }))} />
            {weak.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-semibold">Mẹo cho dạng bạn còn sai nhiều</p>
                {weak.map((t) => day.strategies[t.tag] && (
                  <p key={t.tag} className="text-sm rounded-xl bg-amber-50 border border-amber-200 p-3"><b>{t.name}:</b> {day.strategies[t.tag].tip}</p>
                ))}
              </div>
            )}
            {weakWords.length > 0 && (
              <p className="pt-2 text-sm"><b>Từ nên ôn lại:</b> {weakWords.map((w) => <span key={w} className="mr-1.5 inline-block rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-rose-700">{w}</span>)}</p>
            )}
          </div>
        )}

        {section.clozeReview && sectionPassages.map((p) => (
          <ClozeReview key={p.id} day={day} passage={p} priority={clozePriority} />
        ))}

        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
          <h2 className="font-bold p-5 pb-3">Xem lại từng câu</h2>
          {qs.map((q, i) => {
            const r = records[i];
            const isOpen = open === q.id;
            return (
              <div key={q.id} className="p-4">
                <button type="button" onClick={() => setOpen(isOpen ? null : q.id)} className="w-full text-left flex items-start gap-3">
                  <span className={clsx('shrink-0 grid place-items-center size-7 rounded-full text-sm font-bold text-white', r.correct ? 'bg-emerald-500' : r.fraction > 0 ? 'bg-amber-500' : 'bg-rose-500')}>{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium line-clamp-2">{q.stem}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Bạn chọn: {fmtGiven(q, r)}{!r.correct && <> · Đáp án: <span className="text-emerald-700">{correctAnswerText(q).split('\n')[0]}</span></>}
                    </span>
                  </span>
                  <span className="text-slate-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="mt-3 space-y-3">
                    <Explanation day={day} q={q} given={r.given} fraction={r.fraction} level={r.hintLevelUsed} dayId={day.dayId} />
                    {q.passageId && (() => {
                      const p = day.passages.find((x) => x.id === q.passageId);
                      return p && <PassagePanel passage={p} focus={q.focus} sourceRef={q.sourceRef} allowVi />;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
