'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useProgress } from '@/store/progress';
import type { StudentProgress } from '@/types';

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  role: 'student' | 'teacher';
}

interface SessionValue {
  user: SessionUser | null;
  /** Chưa biết đã đăng nhập chưa (đang gọi /api/auth/me) */
  loading: boolean;
  /** Trạng thái đồng bộ tiến độ lên server */
  saving: boolean;
  savedAt: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<SessionValue>({
  user: null, loading: true, saving: false, savedAt: null,
  refresh: async () => {}, logout: async () => {},
});

export const useSession = () => useContext(Ctx);

/** Trang không cần đăng nhập */
const PUBLIC_PATHS = ['/login'];

const SAVE_DELAY_MS = 1200;

const fetchMe = async (): Promise<SessionUser | null> => {
  try {
    const r = await fetch('/api/auth/me', { cache: 'no-store' });
    const d = (await r.json()) as { user: SessionUser | null };
    return d.user;
  } catch {
    return null;
  }
};

/**
 * Giữ phiên đăng nhập và đồng bộ tiến độ: nạp từ server khi vào app,
 * đẩy lên server mỗi khi tiến độ đổi (gộp các thay đổi liên tiếp trong ~1 giây).
 * Bản trên máy vẫn là bản làm việc nên mất mạng vẫn làm bài được.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  /** Id tài khoản đã nạp xong tiến độ — chỉ khi khớp user.id mới được đẩy lên server */
  const [syncedFor, setSyncedFor] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Trang đăng nhập không cần dò phiên; sau đăng nhập form gọi refresh.
  useEffect(() => {
    let alive = true;
    void (isPublic ? Promise.resolve(null) : fetchMe()).then((u) => {
      if (!alive) return;
      setUser(u);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [isPublic]);

  const refresh = useCallback(async () => {
    const u = await fetchMe();
    setUser(u);
    setLoading(false);
  }, []);

  // Chưa đăng nhập mà vào trang cần đăng nhập → đẩy về /login
  useEffect(() => {
    if (!loading && !user && !isPublic) router.replace('/login');
  }, [loading, user, isPublic, router]);

  // Nạp tiến độ của tài khoản vừa đăng nhập
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const userId = user.id;

    void (async () => {
      const { ownerId, student, replaceStudent } = useProgress.getState();
      try {
        const r = await fetch('/api/progress', { cache: 'no-store' });
        if (!r.ok) throw new Error('không tải được');
        const d = (await r.json()) as { progress: StudentProgress | null; updatedAt: string | null };
        if (!alive) return;

        if (ownerId !== userId) {
          // Máy này đang giữ tiến độ của người khác (hoặc chưa của ai) → lấy bản trên server
          replaceStudent(userId, d.progress);
        } else if (d.updatedAt && d.updatedAt > student.updatedAt) {
          // Server mới hơn (học sinh vừa làm ở máy khác) → lấy bản server
          replaceStudent(userId, d.progress);
        }
        setSavedAt(d.updatedAt);
      } catch {
        // Không gọi được server thì vẫn cho làm bài với bản trên máy
        if (alive && ownerId !== userId) replaceStudent(userId, null);
      } finally {
        if (alive) setSyncedFor(userId);
      }
    })();

    return () => { alive = false; };
  }, [user]);

  // Đẩy tiến độ lên server mỗi khi đổi
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSent = useRef<string>('');
  useEffect(() => {
    if (!user || syncedFor !== user.id) return;

    const push = async (data: StudentProgress) => {
      const body = JSON.stringify({ progress: data });
      if (body === lastSent.current) return;
      lastSent.current = body;
      setSaving(true);
      try {
        const r = await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body,
        });
        if (r.ok) {
          const d = (await r.json()) as { updatedAt: string };
          setSavedAt(d.updatedAt);
        }
      } catch {
        // Lần đổi tiếp theo sẽ gửi lại
        lastSent.current = '';
      } finally {
        setSaving(false);
      }
    };

    return useProgress.subscribe((state, prev) => {
      if (state.student === prev.student) return;
      if (timer.current) clearTimeout(timer.current);
      const snapshot = state.student;
      timer.current = setTimeout(() => void push(snapshot), SAVE_DELAY_MS);
    });
  }, [user, syncedFor]);

  const logout = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    lastSent.current = '';
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    useProgress.getState().replaceStudent(null, null);
    setUser(null);
    setSavedAt(null);
    setSyncedFor(null);
    router.replace('/login');
  }, [router]);

  if (loading) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  if (!user && !isPublic) return <div className="p-10 text-center text-slate-400">Đang chuyển tới trang đăng nhập…</div>;

  return (
    <Ctx.Provider value={{ user, loading, saving, savedAt, refresh, logout }}>
      {children}
    </Ctx.Provider>
  );
}
