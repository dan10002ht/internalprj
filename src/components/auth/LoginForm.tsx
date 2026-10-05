'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { postJson } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';
import { useSession } from './SessionProvider';

type Mode = 'login' | 'register';

/**
 * Tạm tắt tự đăng ký: tài khoản do giáo viên tạo ở /gv.
 * Vẫn mở được form đăng ký bằng `/login?dangky=1` — dùng để tạo tài khoản
 * giáo viên đầu tiên, vì lúc đó chưa có ai tạo tài khoản hộ.
 * Bật lại cho mọi người bằng cách đổi thành true.
 */
const ALLOW_SELF_REGISTER = false;

export function LoginForm({ allowRegister = false }: { allowRegister?: boolean }) {
  const router = useRouter();
  const { refresh } = useSession();
  const [mode, setMode] = useState<Mode>('login');
  // `allowRegister` do trang /login đọc từ ?dangky=1 phía server rồi truyền xuống
  const showRegister = ALLOW_SELF_REGISTER || allowRegister;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await postJson(`/api/auth/${mode}`, { username, password, displayName });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      await refresh();
      router.replace('/dashboard');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Logo className="size-12" />
          <h1 className="text-xl font-black">Luyện tiếng Anh THPT</h1>
          <p className="text-sm font-semibold text-indigo-700">
            Today&apos;s words are tomorrow&apos;s answers.
          </p>
          <p className="text-xs text-slate-500">Show up daily. Small steps, big scores.</p>
        </div>

        {showRegister && (
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {([['login', 'Đăng nhập'], ['register', 'Tạo tài khoản']] as const).map(([k, label]) => (
              <button key={k} type="button" onClick={() => { setMode(k); setError(null); }}
                className={clsx('flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                  mode === k ? 'bg-white text-slate-900 shadow' : 'text-slate-500')}>
                {label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {showRegister && mode === 'register' && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tên của bạn</span>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ví dụ: Nguyễn Thị Hoa" autoComplete="name"
                className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 focus:border-indigo-500 focus:outline-none" />
              <span className="mt-1 block text-xs text-slate-400">Tên này hiện cho giáo viên thấy. Để trống cũng được.</span>
            </label>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Tên đăng nhập</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required
              autoComplete="username" autoCapitalize="off" spellCheck={false} placeholder="ví dụ: hoa.nguyen"
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 focus:border-indigo-500 focus:outline-none" />
            {showRegister && mode === 'register' && (
              <span className="mt-1 block text-xs text-slate-400">Dài 3–32 ký tự, chỉ gồm chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch nối.</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Mật khẩu</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 focus:border-indigo-500 focus:outline-none" />
            {mode === 'register' && <span className="mt-1 block text-xs text-slate-400">Ít nhất 6 ký tự.</span>}
          </label>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
            {busy ? (mode === 'login' ? 'Đang đăng nhập…' : 'Đang tạo tài khoản…') : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản và vào học'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          {showRegister
            ? 'Quên mật khẩu thì nhờ giáo viên đặt lại giúp.'
            : 'Chưa có tài khoản hoặc quên mật khẩu? Nhắn cho giáo viên để được cấp lại.'}
        </p>
      </div>
    </div>
  );
}
