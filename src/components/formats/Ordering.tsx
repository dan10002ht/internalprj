'use client';

import clsx from 'clsx';
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import type { FormatProps } from './types';

/** Ghép câu: chạm các mảnh theo thứ tự */
export function WordOrdering({ q, given, onChange, locked, reveal, layout }: FormatProps) {
  const built = (given as number[] | null) ?? [];
  const pool = layout.order.filter((i) => !built.includes(i));
  const correct = reveal && built.map((i) => q.ordered![i]).join(' ') === q.ordered!.join(' ');

  return (
    <div className="space-y-4">
      <div className={clsx('min-h-16 rounded-xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center',
        reveal ? (correct ? 'border-emerald-500 bg-emerald-50' : 'border-rose-400 bg-rose-50') : 'border-indigo-300 bg-indigo-50/40')}>
        {built.length === 0 && <span className="text-sm text-slate-400">Chạm các mảnh bên dưới để ghép câu…</span>}
        {built.map((i) => (
          <button key={i} type="button" disabled={locked} onClick={() => onChange(built.filter((x) => x !== i))}
            className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 font-medium shadow-sm">
            {q.ordered![i]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map((i) => (
          <button key={i} type="button" disabled={locked} onClick={() => onChange([...built, i])}
            className="rounded-lg border-2 border-slate-200 bg-white px-3 py-1.5 font-medium enabled:hover:border-indigo-400">
            {q.ordered![i]}
          </button>
        ))}
      </div>
      {reveal && !correct && <p className="text-sm text-emerald-700">Câu đúng: <b>{q.ordered!.join(' ')}</b></p>}
    </div>
  );
}

function SortableRow({ id, index, text, locked, state, onMove, last }: {
  id: number; index: number; text: string; locked: boolean; state: 'ok' | 'bad' | 'idle'; last: boolean;
  onMove: (dir: -1 | 1) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: locked });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx('flex items-center gap-3 rounded-xl border-2 bg-white px-3 py-3 select-none',
        isDragging && 'z-10 shadow-lg border-indigo-400',
        state === 'ok' && 'border-emerald-500 bg-emerald-50', state === 'bad' && 'border-rose-400 bg-rose-50', state === 'idle' && 'border-slate-200')}>
      <span {...attributes} {...listeners} className={clsx('touch-none text-slate-400 text-xl px-1', !locked && 'cursor-grab')} aria-label="Kéo để sắp xếp">⠿</span>
      <span className="grid place-items-center size-7 shrink-0 rounded-full bg-slate-100 text-sm font-bold">{index + 1}</span>
      <span className="flex-1">{text}</span>
      {!locked && (
        <span className="flex flex-col">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)} className="px-2 text-slate-500 disabled:opacity-20">▲</button>
          <button type="button" disabled={last} onClick={() => onMove(1)} className="px-2 text-slate-500 disabled:opacity-20">▼</button>
        </span>
      )}
    </li>
  );
}

/** Sắp xếp câu/đoạn: kéo thả hoặc dùng mũi tên */
export function JumbledOrder({ q, given, onChange, locked, reveal, layout }: FormatProps) {
  const order = (given as number[] | null) ?? layout.order;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }));

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    onChange(arrayMove(order, order.indexOf(Number(e.active.id)), order.indexOf(Number(e.over.id))));
  };
  const move = (pos: number, dir: -1 | 1) => onChange(arrayMove(order, pos, pos + dir));

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Kéo biểu tượng ⠿ hoặc dùng ▲▼ để sắp xếp.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {order.map((i, pos) => (
              <SortableRow key={i} id={i} index={pos} text={q.ordered![i]} locked={locked} last={pos === order.length - 1}
                state={reveal ? (i === pos ? 'ok' : 'bad') : 'idle'} onMove={(d) => move(pos, d)} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
