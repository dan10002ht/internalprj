'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getDay } from '@/data';
import { HINT_PENALTY, gradeFraction, isAnswered } from '@/lib/grade';
import { resolveHint } from '@/lib/hints';
import { scrambleWord, shuffle, shuffledIndexes } from '@/lib/random';
import { secKey, useCurrentStudent, useHydrated, useProgress } from '@/store/progress';
import type { AnswerRecord, DayContent, Given, Question, TestMode, TestSection } from '@/types';
import { PassagePanel } from './PassagePanel';
import { FORMAT_LABEL, QuestionView } from './formats/QuestionView';
import type { Layout } from './formats/types';
import { ResultView } from './ResultView';
import { Explanation } from './Explanation';
import { isUnlocked, requiredSection } from '@/lib/unlock';
import { FinalRound } from './FinalRound';
import { WarmUp } from './WarmUp';
import { Prime } from './Prime';
import { FollowUp } from './FollowUp';
import { AnswerSheet } from './AnswerSheet';
import { bonusQuestions, followUpQuestion, primeWords } from '@/lib/generate';
import type { AttemptWord } from '@/store/progress';

const HINT_DELAY_MS = 5000;
/** Chỉ gọi trong event handler / timer */
const clock = () => Date.now();
const MODE_LABEL: Record<TestMode, string> = { practice: 'Luyện tập', exam: 'Làm như thi thật', review: 'Làm lại câu sai' };
/** V3 — chỉ các câu về nghĩa / paraphrase mới có câu nhanh nối tiếp */
const FOLLOWUP_SKILLS = ['vocabulary', 'synonym', 'antonym', 'collocation', 'wordForm'];

function makeLayout(q: Question): Layout {
  const len = q.options?.length ?? q.items?.length ?? q.ordered?.length ?? 0;
  return {
    order: shuffledIndexes(len),
    order2: shuffledIndexes(q.optionsRight?.length ?? q.bank?.length ?? 0),
    scrambled: q.format === 'scramble' ? scrambleWord(q.answers![0]) : undefined,
  };
}

const fmtTime = (sec: number) => `${Math.floor(Math.max(0, sec) / 60)}:${String(Math.max(0, sec) % 60).padStart(2, '0')}`;

export function TestRunner({ dayId, sectionId, review }: { dayId: number; sectionId: string; review: boolean }) {
  const hydrated = useHydrated();
  const student = useCurrentStudent();
  const unlockAll = useProgress((s) => s.unlockAll);
  const [run, setRun] = useState(0);
  const day = getDay(dayId);
  const section = day?.sections.find((s) => s.id === sectionId);

  if (!hydrated) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  if (!day || !section) return <Notice text="Không tìm thấy bài này. Bạn quay lại chọn bài khác nhé." href="/dashboard" />;
  if (!student) return <Notice text="Bạn cần đăng nhập để làm bài." href="/login" />;
  if (!isUnlocked(day, section, student, unlockAll)) {
    return <Notice text={`Bài này chưa mở. Bạn làm xong "${requiredSection(day, section)?.title}" trước nhé.`} href={`/day/${dayId}`} />;
  }
  if (section.kind === 'warmup') return <WarmUp key={run} day={day} section={section} />;
  if (section.kind === 'final') return <FinalRound key={run} day={day} section={section} onRestart={() => setRun((r) => r + 1)} />;

  const mode: TestMode = review ? 'review' : section.mode;
  const ids = review ? student.sections[secKey(dayId, sectionId)]?.wrongQuestionIds ?? [] : section.questionIds;
  if (ids.length === 0) return <Notice text="Bạn không còn câu sai nào ở bài này." href={`/day/${dayId}`} />;

  return <Session key={run} day={day} section={section} mode={mode} ids={ids} onRestart={() => setRun((r) => r + 1)} />;
}

function Notice({ text, href }: { text: string; href: string }) {
  return (
    <div className="mx-auto max-w-md p-10 text-center space-y-4">
      <p className="text-slate-600">{text}</p>
      <Link href={href} className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Quay lại</Link>
    </div>
  );
}

function Session({ day, section, mode, ids, onRestart }: {
  day: DayContent; section: TestSection; mode: TestMode; ids: string[]; onRestart: () => void;
}) {
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const addLookup = useProgress((s) => s.addLookup);
  const vocabByWord = useMemo(() => Object.fromEntries(day.vocab.map((v) => [v.word, v])), [day]);
  const isExam = section.kind === 'exam';
  const timed = mode === 'exam' && section.durationSec > 0;

  // Mini test: xáo thứ tự câu mỗi lần làm. Bài đọc giữ nguyên thứ tự như đề.
  const [qs] = useState<Question[]>(() => {
    const list = ids.map((id) => day.questions.find((q) => q.id === id)!).filter(Boolean);
    if (section.kind === 'mini') return shuffle(list);
    if (mode === 'review' || !section.bonusQuestions) return list;
    // V4 — sau nhóm câu của mỗi bài đọc, chèn 2 câu luyện từ theo form đề
    const asked = new Set(list.flatMap((q) => q.targetWords));
    const out: Question[] = [];
    list.forEach((q, i) => {
      out.push(q);
      const next = list[i + 1];
      if (q.passageId && next?.passageId !== q.passageId) {
        const p = day.passages.find((x) => x.id === q.passageId);
        if (p) out.push(...bonusQuestions(day, p, asked));
      }
    });
    return out;
  });
  const [layouts] = useState<Record<string, Layout>>(() => Object.fromEntries(qs.map((q) => [q.id, makeLayout(q)])));
  const [givens, setGivens] = useState<Record<string, Given>>(() =>
    Object.fromEntries(qs.filter((q) => q.format === 'jumbledOrder').map((q) => [q.id, layouts[q.id].order])),
  );
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [idx, setIdx] = useState(0);
  const [startedAt] = useState(() => clock());
  const [arrivedAt, setArrivedAt] = useState(() => clock());
  const [now, setNow] = useState(() => clock());
  const [records, setRecords] = useState<AnswerRecord[] | null>(null);
  /** V1 — các bài đọc đã qua bước mồi từ */
  const [primed, setPrimed] = useState<string[]>([]);
  /** V3 — các câu nhanh đã làm, chỉ dùng để cập nhật lịch ôn từ */
  const [followUpDone, setFollowUpDone] = useState<Record<string, boolean>>({});
  const [followUpWords, setFollowUpWords] = useState<AttemptWord[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  /** Câu nhanh V3 sinh một lần lúc bấm Kiểm tra, giữ nguyên đáp án khi re-render */
  const [fuMap, setFuMap] = useState<Record<string, Question | null>>({});

  const q = qs[idx];
  const n = qs.length;
  const given = givens[q.id] ?? null;
  const isPractice = mode !== 'exam';
  const isChecked = !!checked[q.id];
  const level = hintLevel[q.id] ?? 0;
  const hintsUsedCount = Object.values(hintLevel).filter((l) => l > 0).length;
  const quota = Math.ceil(n * 0.5);
  const elapsedSec = Math.floor((now - startedAt) / 1000);
  const remaining = section.durationSec - elapsedSec;

  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const t = setInterval(() => {
      const ts = clock();
      setNow(ts);
      if (timed && section.durationSec - Math.floor((ts - startedAt) / 1000) <= 0) finishRef.current();
    }, 1000);
    return () => clearInterval(t);
  }, [timed, section.durationSec, startedAt]);

  const flushTime = () => {
    const delta = Math.round((clock() - arrivedAt) / 1000);
    setTimeSpent((t) => ({ ...t, [q.id]: (t[q.id] ?? 0) + delta }));
    setArrivedAt(clock());
    return { ...timeSpent, [q.id]: (timeSpent[q.id] ?? 0) + delta };
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= n || i === idx) return;
    flushTime();
    setIdx(i);
  };

  const finish = () => {
    if (records) return;
    const times = flushTime();
    const recs: AnswerRecord[] = qs.map((qq) => {
      const g = givens[qq.id] ?? null;
      const fraction = gradeFraction(qq, g);
      const lv = hintLevel[qq.id] ?? 0;
      return {
        questionId: qq.id, given: g, fraction, correct: fraction === 1, hintLevelUsed: lv,
        score: fraction * (1 - HINT_PENALTY[lv]), timeSpentSec: times[qq.id] ?? 0,
      };
    });
    // Câu luyện thêm (V4) không tính vào điểm đề
    const scored = qs.map((qq, i) => ({ qq, r: recs[i] })).filter(({ qq }) => !qq.bonus);
    const m = Math.max(1, scored.length);
    const raw = (scored.reduce((s, x) => s + x.r.fraction, 0) / m) * 100;
    const score = (scored.reduce((s, x) => s + x.r.score, 0) / m) * 100;
    recordAttempt({
      sectionId: secKey(day.dayId, section.id), dayId: day.dayId, mode,
      score: Math.round(score), rawScore: Math.round(raw),
      hintsUsed: scored.filter((x) => x.r.hintLevelUsed > 0).length,
      timeSpent: Math.round((clock() - startedAt) / 1000),
      wrongQuestionIds: scored.filter((x) => !x.r.correct).map((x) => x.r.questionId),
      wrong: scored.filter((x) => !x.r.correct).map(({ qq }) => ({ questionId: qq.id, format: qq.format, strategyTag: qq.strategyTag })),
      passed: score >= section.passThreshold,
      words: [
        ...qs.flatMap((qq, i) => qq.targetWords.map((w) => ({ word: w, correct: recs[i].correct, hint3: recs[i].hintLevelUsed >= 3 }))),
        ...followUpWords,
      ],
    });
    setRecords(recs);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    finishRef.current = finish;
  });

  const hints = useMemo(
    () => q.hintLevels.slice(0, level).map((h) => resolveHint(q, h, vocabByWord)),
    [q, level, vocabByWord],
  );
  const eliminated = hints.flatMap((h) => h.eliminate ?? []);
  const hintReadyIn = Math.ceil((HINT_DELAY_MS - (now - arrivedAt)) / 1000);
  const maxLevel = Math.min(3, q.hintLevels.length);
  const hintBlockedReason =
    mode === 'exam' ? 'Thi thật — không dùng gợi ý'
      : isChecked ? null
        : level >= maxLevel ? 'Câu này không còn gợi ý nào'
          : level === 0 && hintsUsedCount >= quota ? 'Đã dùng hết lượt gợi ý — thử đoán theo ngữ cảnh nhé'
            : hintReadyIn > 0 ? `Gợi ý (${hintReadyIn}s)`
              : null;

  if (records) {
    return <ResultView day={day} section={section} mode={mode} qs={qs} records={records} onRestart={onRestart} />;
  }

  // V1 — mồi 5 từ khóa trước khi vào nhóm câu của một bài đọc mới
  if (section.prime && q.passageId && !primed.includes(q.passageId)) {
    const p = day.passages.find((x) => x.id === q.passageId);
    const words = p ? primeWords(day, p) : [];
    const pid = q.passageId;
    if (p && words.length >= 3) {
      return <Prime passage={p} words={words} onDone={() => setPrimed((list) => [...list, pid])} />;
    }
  }

  const answered = isAnswered(q, given);
  const reveal = isPractice && isChecked;
  const fraction = reveal ? gradeFraction(q, given) : 0;
  const passage = q.passageId ? day.passages.find((p) => p.id === q.passageId) : undefined;
  const answeredCount = qs.filter((qq) => isAnswered(qq, givens[qq.id] ?? null)).length;

  // V3 — sau câu từ vựng / paraphrase, hiện một câu nhanh 10 giây về chính từ đó
  const fu = reveal && !followUpDone[q.id] ? fuMap[q.id] ?? null : null;

  const setGiven = (g: Given) => setGivens((s) => ({ ...s, [q.id]: g }));
  const check = () => {
    if (!answered || isChecked) return;
    setChecked((c) => ({ ...c, [q.id]: true }));
    if (section.followUp && q.targetWords.length > 0 && FOLLOWUP_SKILLS.includes(q.skillType)) {
      setFuMap((m) => (q.id in m ? m : { ...m, [q.id]: followUpQuestion(day, q.targetWords[0], idx) }));
    }
  };
  const primary = () => {
    if (isPractice && !isChecked) return check();
    if (idx < n - 1) return goTo(idx + 1);
    trySubmit();
  };
  const trySubmit = () => {
    const missing = n - answeredCount;
    const unchecked = isPractice ? qs.filter((qq) => !checked[qq.id]).length : 0;
    if ((missing > 0 || unchecked > 0) && !confirm(`Bạn còn ${Math.max(missing, unchecked)} câu chưa làm. Vẫn nộp bài chứ?`)) return;
    finish();
  };

  // Bản dịch cả bài chỉ mở khi đã kiểm tra hết các câu của bài đó — tránh lộ đáp án câu khác
  const viReady = !!passage && isPractice && qs.filter((qq) => qq.passageId === passage.id).every((qq) => checked[qq.id]);

  const passagePanel = passage && (
    <PassagePanel
      passage={passage}
      focus={q.focus}
      sourceRef={reveal ? q.sourceRef : undefined}
      selectedMarker={q.format === 'insertSentence' && typeof given === 'number' ? q.options![given] : undefined}
      correctMarker={q.format === 'insertSentence' && reveal ? q.options![q.answer!] : undefined}
      onMarker={q.format === 'insertSentence' && !(isPractice && isChecked) ? (m) => setGiven(q.options!.indexOf(m)) : undefined}
      vocab={section.lookup && isPractice ? (isChecked ? day.vocab : day.vocab.filter((v) => !q.targetWords.includes(v.word))) : undefined}
      onLookup={(w) => addLookup(day.dayId, w)}
      allowVi={viReady}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20">
        {/* Nền đặt ở lớp con để Safari 26 không phủ toolbar lên header sticky */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-white/95 backdrop-blur border-b border-slate-200" />
        <div className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:flex">
          <Link href={`/day/${day.dayId}`} className="min-h-10 flex items-center whitespace-nowrap text-slate-500 hover:text-slate-900 text-sm sm:shrink-0">← Về ngày học</Link>
          <div className="col-span-2 row-start-2 flex-1 min-w-0 sm:order-none">
            <p className="font-bold truncate">{section.title}</p>
            <p className="text-xs text-slate-500">{MODE_LABEL[mode]} · Câu {idx + 1}/{n} · Đã làm {answeredCount}</p>
          </div>
          <div className={clsx('col-start-2 row-start-1 shrink-0 rounded-lg px-3 py-1.5 font-mono font-bold text-sm tabular-nums',
            timed ? (remaining < 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-900 text-white') : 'bg-slate-100 text-slate-600')}>
            ⏱ {timed ? fmtTime(remaining) : fmtTime(elapsedSec)}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-1 pb-2 flex gap-1 overflow-x-auto">
          {qs.map((qq, i) => {
            const done = isAnswered(qq, givens[qq.id] ?? null);
            const res = isPractice && checked[qq.id] ? gradeFraction(qq, givens[qq.id] ?? null) === 1 : null;
            return (
              <button key={qq.id} type="button" onClick={() => goTo(i)} title={`Câu ${i + 1}`}
                className={clsx('h-2 min-w-5 flex-1 rounded-full transition',
                  i === idx && 'ring-2 ring-offset-1 ring-indigo-500',
                  res === true ? 'bg-emerald-500' : res === false ? 'bg-rose-500' : done ? 'bg-indigo-400' : 'bg-slate-200')} />
            );
          })}
        </div>
      </header>

      <main className={clsx('mx-auto px-4 py-5', passage ? 'max-w-6xl lg:grid lg:grid-cols-2 lg:gap-6' : 'max-w-2xl')}>
        {passage && (
          <>
            <div className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">{passagePanel}</div>
            <details open className="lg:hidden mb-4 group">
              <summary className="cursor-pointer select-none text-sm font-semibold text-indigo-700 mb-2">Bài đọc (chạm để ẩn/hiện)</summary>
              <div className="max-h-[45vh] overflow-y-auto rounded-2xl">{passagePanel}</div>
            </details>
          </>
        )}

        <section className="space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {isExam ? (
                <span className="rounded-full bg-slate-900 text-white px-2.5 py-1 font-semibold">Question {idx + 1}</span>
              ) : (
                <span className="rounded-full bg-indigo-100 text-indigo-700 px-2.5 py-1 font-semibold">{FORMAT_LABEL[q.format]}</span>
              )}
              <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-1">{day.strategies[q.strategyTag]?.name ?? q.strategyTag}</span>
              {q.bonus && <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">Câu luyện thêm · không tính điểm</span>}
            </div>
            {q.instruction && <p className="text-sm italic text-slate-500">{q.instruction}</p>}
            <h1 className="whitespace-pre-line text-lg font-semibold leading-relaxed text-slate-900">{q.stem}</h1>
            <QuestionView key={q.id} q={q} given={given} onChange={setGiven} locked={isPractice && isChecked}
              reveal={reveal} eliminated={eliminated} layout={layouts[q.id]} onEnter={primary} />
          </div>

          {/* Gợi ý */}
          {hints.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2">
              {hints.map((h, i) => (
                <p key={i} className="text-sm text-amber-900">
                  <b>Gợi ý {i + 1}:</b> {h.text}
                </p>
              ))}
            </div>
          )}

          {/* Giải thích */}
          {reveal && <Explanation day={day} q={q} given={given} fraction={fraction} level={level} passageViReady={viReady} dayId={day.dayId} />}

          {/* V3 — câu nhanh về từ vừa gặp, không tính vào điểm đề */}
          {fu && (
            <FollowUp
              key={fu.id}
              q={fu}
              onDone={(ok) => {
                setFollowUpWords((w) => [...w, { word: fu.targetWords[0], correct: ok, hint3: false }]);
                setFollowUpDone((d) => ({ ...d, [q.id]: true }));
              }}
            />
          )}

          {/* Thanh hành động */}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => goTo(idx - 1)} disabled={idx === 0}
              className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-600 disabled:opacity-40">←</button>
            {mode !== 'exam' && !isChecked && (
              <button type="button" disabled={!!hintBlockedReason}
                onClick={() => setHintLevel((h) => ({ ...h, [q.id]: level + 1 }))}
                className="rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-2.5 font-semibold text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed">
                {hintBlockedReason ?? `Xem gợi ý (câu này còn tính ${100 - HINT_PENALTY[level + 1] * 100}% điểm)`}
              </button>
            )}
            <div className="flex-1" />
            {section.answerSheet && mode === 'exam' && (
              <button type="button" onClick={() => setSheetOpen(!sheetOpen)}
                className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700">
                {sheetOpen ? 'Ẩn phiếu' : 'Phiếu tô đáp án'}
              </button>
            )}
            {(idx < n - 1 || (isPractice && !isChecked)) && (
              <button type="button" onClick={trySubmit} className="rounded-xl border-2 border-slate-900 px-4 py-2.5 font-semibold">Nộp bài</button>
            )}
            <button type="button" onClick={primary} disabled={isPractice && !isChecked && !answered}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-sm disabled:opacity-40 hover:bg-indigo-700">
              {isPractice && !isChecked ? 'Kiểm tra' : idx < n - 1 ? 'Câu tiếp →' : 'Nộp bài'}
            </button>
          </div>
          {section.answerSheet && mode === 'exam' && sheetOpen && (
            <AnswerSheet qs={qs} givens={givens} idx={idx} onJump={goTo} onSet={(id, v) => setGivens((g) => ({ ...g, [id]: v }))} />
          )}

          {mode !== 'exam' && (
            <p className="text-xs text-slate-400">
              Còn {Math.max(0, quota - hintsUsedCount)} lượt gợi ý.{section.lookup && ' Chạm vào từ có gạch chấm trong bài đọc để xem nghĩa.'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
