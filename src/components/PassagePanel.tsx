'use client';

import clsx from 'clsx';
import { useState, type ReactNode } from 'react';
import { speak } from '@/lib/speech';
import { escapeRe, surfaceForms } from '@/lib/vocabText';
import type { Passage, VocabItem } from '@/types';

interface Mark {
  start: number;
  end: number;
  kind: 'focus' | 'source' | 'underline' | 'marker' | 'vocab';
  word?: string;
}

interface Props {
  passage: Passage;
  /** từ/cụm đang hỏi → tô vàng */
  focus?: string;
  /** câu trích dẫn khi xem giải thích → tô xanh */
  sourceRef?: string;
  /** insertSentence: marker đang được chọn, và callback chạm marker */
  selectedMarker?: string;
  correctMarker?: string;
  onMarker?: (marker: string) => void;
  /** Tra từ: từ vựng của ngày được gạch chấm, chạm để xem nghĩa */
  vocab?: VocabItem[];
  onLookup?: (word: string) => void;
  /** Cho phép xem bản dịch (sau khi đã kiểm tra đáp án) */
  allowVi?: boolean;
}

function findAll(text: string, needle: string, kind: Mark['kind'], out: Mark[], firstOnly = false) {
  if (!needle) return;
  let from = 0;
  while (true) {
    const i = text.indexOf(needle, from);
    if (i < 0) break;
    out.push({ start: i, end: i + needle.length, kind });
    if (firstOnly) break;
    from = i + needle.length;
  }
}

function findVocab(text: string, vocab: VocabItem[], out: Mark[]) {
  const taken: [number, number][] = [];
  // Ưu tiên cụm dài trước (extended family trước family)
  const entries = vocab.flatMap((v) => surfaceForms(v).map((f) => ({ f, word: v.word }))).sort((a, b) => b.f.length - a.f.length);
  for (const { f, word } of entries) {
    const re = new RegExp(`\\b${escapeRe(f)}\\b`, 'gi');
    for (const m of text.matchAll(re)) {
      const s = m.index!;
      const e = s + m[0].length;
      if (taken.some(([a, b]) => s < b && e > a)) continue;
      taken.push([s, e]);
      out.push({ start: s, end: e, kind: 'vocab', word });
    }
  }
}

function renderParagraph(text: string, props: Props, onWord: (w: string) => void): ReactNode[] {
  const marks: Mark[] = [];
  for (const m of text.matchAll(/\[(I|II|III|IV)\]/g)) marks.push({ start: m.index!, end: m.index! + m[0].length, kind: 'marker' });
  findAll(text, props.focus ?? '', 'focus', marks);
  findAll(text, props.sourceRef ?? '', 'source', marks, true);
  for (const u of props.passage.underlines ?? []) findAll(text, u, 'underline', marks, true);
  if (props.vocab) findVocab(text, props.vocab, marks);

  // Các lớp tô có thể chồng nhau (focus nằm trong câu gạch chân) → cắt theo mọi ranh giới,
  // mỗi mảnh mang tập kind áp dụng
  const cuts = new Set<number>([0, text.length]);
  marks.forEach((m) => { cuts.add(m.start); cuts.add(m.end); });
  const points = [...cuts].sort((a, b) => a - b);
  const nodes: ReactNode[] = [];
  for (let k = 0; k < points.length - 1; k++) {
    const s = points[k];
    const e = points[k + 1];
    const piece = text.slice(s, e);
    const covering = marks.filter((m) => m.start <= s && m.end >= e);
    const kinds = new Set(covering.map((m) => m.kind));
    if (kinds.has('marker')) {
      const label = piece.slice(1, -1);
      const sel = props.selectedMarker === piece;
      const correct = props.correctMarker === piece;
      nodes.push(
        <button key={k} type="button" disabled={!props.onMarker} onClick={() => props.onMarker?.(piece)}
          className={clsx('mx-0.5 rounded-md px-1.5 text-xs font-bold align-middle border transition',
            correct ? 'bg-emerald-500 text-white border-emerald-600'
              : sel ? 'bg-indigo-600 text-white border-indigo-700'
                : props.onMarker ? 'bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200' : 'bg-slate-100 border-slate-300 text-slate-500')}>
          {label}
        </button>,
      );
      continue;
    }
    const cls = clsx(
      kinds.has('underline') && 'underline decoration-slate-500 underline-offset-4',
      kinds.has('source') && 'bg-emerald-100 rounded',
      kinds.has('focus') && 'bg-yellow-200 font-bold rounded px-0.5',
    );
    const vocabWord = covering.find((m) => m.kind === 'vocab')?.word;
    if (vocabWord) {
      nodes.push(
        <button key={k} type="button" onClick={() => onWord(vocabWord)}
          className={clsx(cls, 'cursor-pointer border-b-2 border-dotted border-indigo-400 hover:bg-indigo-50')}>
          {piece}
        </button>,
      );
      continue;
    }
    nodes.push(<span key={k} className={cls}>{piece}</span>);
  }
  return nodes;
}

function WordCard({ v, onClose }: { v: VocabItem; onClose: () => void }) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-30 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-lg font-black">
            {v.word} <span className="text-sm font-normal text-slate-400">{v.ipa} · {v.partOfSpeech}</span>
          </p>
          <p className="font-semibold text-indigo-700">{v.meaningVi}</p>
          <p className="text-sm italic text-slate-500">{v.meaningEn}</p>
          {v.collocations.length > 0 && <p className="mt-1 text-xs text-slate-500">Cụm hay gặp: {v.collocations.join(' · ')}</p>}
        </div>
        <button type="button" onClick={() => speak(v.word)} className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700" aria-label={`Nghe ${v.word}`}>🔊</button>
        <button type="button" onClick={onClose} className="px-1 text-xl leading-none text-slate-400 hover:text-slate-700" aria-label="Đóng">×</button>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Từ này sẽ có trong Round cuối để bạn ôn lại.</p>
    </div>
  );
}

export function PassagePanel(props: Props) {
  const { passage } = props;
  const [word, setWord] = useState<string | null>(null);
  const [showVi, setShowVi] = useState(false);
  const kind = passage.kind ?? 'article';
  const card = word ? props.vocab?.find((v) => v.word === word) : undefined;
  const vi = props.allowVi && showVi ? passage.paragraphsVi : undefined;

  const openWord = (w: string) => {
    setWord(w);
    props.onLookup?.(w);
  };

  return (
    <article className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 text-[15px] leading-7 text-slate-800 space-y-3">
      {passage.instruction && <p className="text-sm italic text-slate-500">{passage.instruction}</p>}
      <div className={clsx(kind === 'notice' || kind === 'leaflet' ? 'rounded-xl border-2 border-slate-300 p-4 sm:p-5' : '')}>
        <h2 className={clsx('font-bold text-slate-900 mb-3', kind !== 'article' && 'text-center uppercase tracking-wide')}>{passage.title}</h2>
        <div className={clsx(kind === 'leaflet' ? 'space-y-2' : 'space-y-4')}>
          {passage.paragraphs.map((p, i) => (
            <div key={i}>
              <p>
                {kind === 'article' && (
                  <span className="mr-2 inline-grid place-items-center size-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500 align-middle">{i + 1}</span>
                )}
                {renderParagraph(p, props, openWord)}
              </p>
              {vi?.[i] && <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">{vi[i]}</p>}
            </div>
          ))}
        </div>
      </div>
      {passage.source && <p className="text-xs italic text-slate-400">({passage.source})</p>}
      {props.allowVi && passage.paragraphsVi && (
        <button type="button" onClick={() => setShowVi(!showVi)} className="text-sm font-semibold text-indigo-700 hover:underline">
          {showVi ? 'Ẩn bản dịch' : 'Xem bản dịch tiếng Việt'}
        </button>
      )}
      {card && <WordCard v={card} onClose={() => setWord(null)} />}
    </article>
  );
}
