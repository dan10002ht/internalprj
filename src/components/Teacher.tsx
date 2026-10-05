'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from '@/components/auth/SessionProvider';
import { callApi, patchJson, postJson } from '@/lib/api';
import { useProgress } from '@/store/progress';
import type { StudentProgress } from '@/types';
import { StudentReport } from './StudentReport';
import { TopBar } from './ui/TopBar';

interface Row {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  updatedAt: string | null;
  progress: StudentProgress | null;
}

const fmtWhen = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'chưa có';

/**
 * Màn hình giáo viên — xem kết quả làm bài của mọi học sinh (lấy từ server),
 * tạo tài khoản, đặt lại mật khẩu, xóa tài khoản.
 */
export function Teacher() {
  const { user } = useSession();
  const { unlockAll, setUnlockAll } = useProgress();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ displayName: '', username: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  /** Học sinh đang được đặt lại mật khẩu, và mật khẩu mới đang gõ */
  const [resetting, setResetting] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchRows = async (): Promise<{ rows: Row[]; error: string | null }> => {
    const r = await callApi<{ students?: Row[] }>('/api/teacher/students');
    if (!r.ok) return { rows: [], error: r.error };
    return { rows: r.data?.students ?? [], error: null };
  };

  const load = useCallback(async () => {
    const d = await fetchRows();
    setRows(d.rows);
    setError(d.error);
  }, []);

  useEffect(() => {
    if (user?.role !== 'teacher') return;
    let alive = true;
    void fetchRows().then((d) => {
      if (!alive) return;
      setRows(d.rows);
      setError(d.error);
    });
    return () => { alive = false; };
  }, [user?.role]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await postJson('/api/teacher/students', form);
      if (!r.ok) { setError(r.error); return; }
      setNotice(`Đã tạo tài khoản "${form.username}". Đưa tên đăng nhập và mật khẩu này cho học sinh.`);
      setForm({ displayName: '', username: '', password: '' });
      setShowNew(false);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const act = async (id: string, action: 'resetPassword' | 'delete', password?: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await patchJson('/api/teacher/students', { id, action, password });
      if (!r.ok) { setError(r.error); return; }
      setNotice(action === 'delete' ? 'Đã xóa tài khoản học sinh.' : 'Đã đặt lại mật khẩu.');
      if (action === 'delete' && picked === id) setPicked(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (user && user.role !== 'teacher') {
    return (
      <div className="mx-auto max-w-md space-y-4 p-10 text-center">
        <p className="text-slate-600">Trang này chỉ dành cho giáo viên.</p>
        <Link href="/dashboard" className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Về các ngày học</Link>
      </div>
    );
  }

  const current = rows?.find((r) => r.id === picked);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar back={{ href: '/dashboard', label: 'Các ngày học' }} title="Giáo viên — Theo dõi học sinh" />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {notice && (
          <p className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <span className="flex-1">{notice}</span>
            <button type="button" onClick={() => setNotice(null)} className="text-emerald-700">×</button>
          </p>
        )}

        {/* Danh sách học sinh */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex-1 font-bold">Học sinh {rows ? `(${rows.length})` : ''}</p>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={unlockAll} onChange={(e) => setUnlockAll(e.target.checked)} className="size-4" />
              Mở sẵn mọi bài để xem trước
            </label>
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
              {showNew ? 'Đóng' : '+ Tạo tài khoản'}
            </button>
          </div>

          {showNew && (
            <form onSubmit={create} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tên học sinh</span>
                <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Nguyễn Thị Hoa"
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tên đăng nhập</span>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required
                  placeholder="hoa.nguyen" autoCapitalize="off" spellCheck={false}
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mật khẩu</span>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  placeholder="ít nhất 6 ký tự"
                  className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
              </label>
              <button type="submit" disabled={busy}
                className="rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:opacity-50 sm:col-span-3 sm:justify-self-start">
                {busy ? 'Đang tạo…' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          {rows === null ? (
            <p className="py-4 text-center text-sm text-slate-400">Đang tải…</p>
          ) : rows.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">Chưa có học sinh nào. Bấm “+ Tạo tài khoản” hoặc để học sinh tự tạo ở trang đăng nhập.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {rows.map((r) => (
                <div key={r.id} className={clsx('flex flex-wrap items-center gap-3 py-3', picked === r.id && 'bg-indigo-50/50')}>
                  <button type="button" onClick={() => setPicked(picked === r.id ? null : r.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-600 font-bold text-white">
                      {(r.displayName || r.username)[0]?.toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{r.displayName || r.username}</span>
                      <span className="block text-xs text-slate-500">{r.username} · hoạt động gần nhất: {fmtWhen(r.updatedAt)}</span>
                    </span>
                  </button>
                  <button type="button" disabled={busy}
                    onClick={() => { setResetting(resetting === r.id ? null : r.id); setNewPassword(''); }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    {resetting === r.id ? 'Thôi, không đổi' : 'Đặt lại mật khẩu'}
                  </button>
                  <button type="button" disabled={busy}
                    onClick={() => confirm(`Xóa tài khoản "${r.username}" cùng toàn bộ kết quả? Không thể hoàn lại.`) && void act(r.id, 'delete')}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                    Xóa
                  </button>
                  <button type="button" onClick={() => setPicked(picked === r.id ? null : r.id)}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                    {picked === r.id ? 'Ẩn kết quả' : 'Xem kết quả'}
                  </button>

                  {resetting === r.id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void act(r.id, 'resetPassword', newPassword).then(() => { setResetting(null); setNewPassword(''); });
                      }}
                      className="flex w-full flex-wrap items-end gap-2 rounded-xl bg-slate-50 p-3">
                      <label className="min-w-48 flex-1">
                        <span className="text-xs font-semibold text-slate-600">
                          Mật khẩu mới cho {r.displayName || r.username}
                        </span>
                        <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoFocus
                          placeholder="ít nhất 6 ký tự"
                          className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
                      </label>
                      <button type="submit" disabled={busy}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        Lưu mật khẩu
                      </button>
                      <p className="w-full text-xs text-slate-500">Nhớ nhắn mật khẩu mới cho học sinh.</p>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kết quả của học sinh được chọn */}
        {current && (
          current.progress ? (
            <>
              <h2 className="text-lg font-black">Kết quả của {current.displayName || current.username}</h2>
              <StudentReport student={current.progress} />
            </>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              {current.displayName || current.username} chưa làm bài nào.
            </p>
          )
        )}
      </main>
    </div>
  );
}
