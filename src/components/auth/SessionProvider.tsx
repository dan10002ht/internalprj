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
  isLoggingOut: boolean;
  savedAt: string | null;
  /** Đã nạp thành công tiến độ server; chỉ cờ này được mở khóa PUT. */
  syncedFor: string | null;
  /** Đủ dữ liệu chọn pool Warm-up, gồm bản local khi lỗi/timeout. */
  progressReadyFor: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<SessionValue>({
  user: null, loading: true, saving: false, isLoggingOut: false, savedAt: null, syncedFor: null, progressReadyFor: null,
  refresh: async () => {}, logout: async () => {},
});

export const useSession = () => useContext(Ctx);

/** Trang không cần đăng nhập */
const PUBLIC_PATHS = ['/login'];

const SAVE_DELAY_MS = 1200;
const LOGOUT_FLUSH_MS = 3000;
// Mạng treo vẫn cho vào bài với bản local sau tối đa 4 giây.
const PROGRESS_LOAD_TIMEOUT_MS = 4000;

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  /** Id tài khoản đã nạp xong tiến độ — chỉ khi khớp user.id mới được đẩy lên server */
  const [syncedFor, setSyncedFor] = useState<string | null>(null);
  const [progressReadyFor, setProgressReadyFor] = useState<string | null>(null);
  const loggingOut = useRef(false);
  const pendingLocalSaveFor = useRef<string | null>(null);
  const logoutPromise = useRef<Promise<void> | null>(null);
  const flushProgress = useRef<(() => Promise<void>) | null>(null);
  const stopProgressLoad = useRef<(() => void) | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Trang đăng nhập không cần dò phiên; sau đăng nhập form gọi refresh.
  useEffect(() => {
    let alive = true;
    void (isPublic ? Promise.resolve(null) : fetchMe()).then((u) => {
      if (!alive || loggingOut.current) return;
      setUser(u);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [isPublic]);

  const refresh = useCallback(async () => {
    setSyncedFor(null);
    setProgressReadyFor(null);
    const u = await fetchMe();
    loggingOut.current = false;
    setUser(u);
    setLoading(false);
  }, []);

  // Chưa đăng nhập mà vào trang cần đăng nhập → đẩy về /login
  useEffect(() => {
    if (!loading && !user && !isPublic) router.replace('/login');
  }, [loading, user, isPublic, router]);

  // Nạp tiến độ của tài khoản vừa đăng nhập
  useEffect(() => {
    if (!user || loggingOut.current) return;
    let alive = true;
    const userId = user.id;
    const controller = new AbortController();
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryAttempt = 0;
    let inFlight = false;
    let synced = false;
    let unauthorized = false;
    const readyWithLocal = () => {
      if (!alive || loggingOut.current) return;
      const { ownerId, replaceStudent } = useProgress.getState();
      if (ownerId !== userId) replaceStudent(userId, null);
      setProgressReadyFor(userId);
    };
    // Timeout only unlocks the UI. Keep GET alive to hydrate before allowing PUT.
    const loadTimeout = setTimeout(readyWithLocal, PROGRESS_LOAD_TIMEOUT_MS);

    const loadProgress = async () => {
      if (!alive || loggingOut.current || inFlight || synced || unauthorized) return;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = null;
      inFlight = true;
      const studentBeforeLoad = useProgress.getState().student;
      try {
        const r = await fetch('/api/progress', { cache: 'no-store', signal: controller.signal });
        if (r.status === 401) unauthorized = true;
        if (!r.ok) throw new Error('không tải được');
        const d = (await r.json()) as { progress: StudentProgress | null; updatedAt: string | null };
        if (!alive || loggingOut.current) return;

        // GET may finish after a local attempt: compare against the current store.
        const { ownerId, student, replaceStudent } = useProgress.getState();
        pendingLocalSaveFor.current = null;
        if (ownerId !== userId) {
          // Máy này đang giữ tiến độ của người khác (hoặc chưa của ai) → lấy bản trên server
          replaceStudent(userId, d.progress);
        } else if (d.updatedAt && d.updatedAt > student.updatedAt) {
          // Server mới hơn (học sinh vừa làm ở máy khác) → lấy bản server
          replaceStudent(userId, d.progress);
        } else if (d.updatedAt ? student.updatedAt > d.updatedAt : student !== studentBeforeLoad) {
          // The PUT queue starts only after this successful GET.
          pendingLocalSaveFor.current = userId;
        }
        synced = true;
        setSavedAt(d.updatedAt);
        setSyncedFor(userId);
        setProgressReadyFor(userId);
      } catch {
        // Không gọi được server thì vẫn cho làm bài với bản trên máy
        readyWithLocal();
        if (alive && !loggingOut.current && !unauthorized) {
          const delays = [2000, 5000, 10000, 30000];
          const delay = delays[Math.min(retryAttempt++, delays.length - 1)];
          retryTimer = setTimeout(() => void loadProgress(), delay);
        }
      } finally {
        inFlight = false;
        clearTimeout(loadTimeout);
      }
    };
    const retryNow = () => { void loadProgress(); };
    const retryWhenVisible = () => {
      if (document.visibilityState === 'visible') retryNow();
    };
    window.addEventListener('online', retryNow);
    document.addEventListener('visibilitychange', retryWhenVisible);
    void loadProgress();

    const stopLoad = () => {
      alive = false;
      clearTimeout(loadTimeout);
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener('online', retryNow);
      document.removeEventListener('visibilitychange', retryWhenVisible);
      controller.abort();
    };
    stopProgressLoad.current = stopLoad;
    return () => {
      stopLoad();
      if (stopProgressLoad.current === stopLoad) stopProgressLoad.current = null;
    };
  }, [user]);

  // Mỗi phiên sở hữu hàng đợi riêng; đóng hàng đợi trước khi xoá cookie phiên.
  useEffect(() => {
    if (!user || syncedFor !== user.id || loggingOut.current) return;
    const userId = user.id;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();
    let lastSent = '';
    let inFlight: Promise<void> = Promise.resolve();

    const push = (data: StudentProgress) => {
      // Gửi tuần tự để bản cũ không ghi đè bản mới khi mạng chậm.
      inFlight = inFlight.then(async () => {
        if (controller.signal.aborted) return;
        const body = JSON.stringify({ progress: data });
        if (body === lastSent) return;
        setSaving(true);
        try {
          const r = await fetch('/api/progress', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body,
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]),
          });
          if (r.ok) {
            const d = (await r.json()) as { updatedAt: string };
            lastSent = body;
            setSavedAt(d.updatedAt);
          }
        } catch {
          // Giữ bản local để lần gửi tiếp theo có thể thử lại.
        } finally {
          setSaving(false);
        }
      });
      return inFlight;
    };

    const stop = () => {
      active = false;
      if (timer) clearTimeout(timer);
      timer = null;
    };
    const flush = async () => {
      stop();
      let deadline: ReturnType<typeof setTimeout> | undefined;
      const expired = new Promise<void>(resolve => {
        deadline = setTimeout(() => {
          controller.abort();
          resolve();
        }, LOGOUT_FLUSH_MS);
      });
      try {
        await Promise.race([expired, (async () => {
          await inFlight;
          // Tiến độ có thể đổi trong lúc chờ lượt gửi trước hoàn tất.
          const { ownerId, student } = useProgress.getState();
          if (!controller.signal.aborted && ownerId === userId) await push(student);
        })()]);
      } finally {
        clearTimeout(deadline);
        controller.abort();
      }
    };
    flushProgress.current = flush;
    const unsubscribe = useProgress.subscribe((state, prev) => {
      if (!active || loggingOut.current || state.ownerId !== userId || state.student === prev.student) return;
      if (timer) clearTimeout(timer);
      const snapshot = state.student;
      timer = setTimeout(() => {
        timer = null;
        if (active && !loggingOut.current) void push(snapshot);
      }, SAVE_DELAY_MS);
    });

    // Changes made while GET was pending predate the subscription. Flush them now.
    if (pendingLocalSaveFor.current === userId) {
      pendingLocalSaveFor.current = null;
      const { ownerId, student } = useProgress.getState();
      if (ownerId === userId) void push(student);
    }

    return () => {
      stop();
      unsubscribe();
      controller.abort();
      if (flushProgress.current === flush) flushProgress.current = null;
    };
  }, [user, syncedFor]);

  const logout = useCallback(() => {
    if (logoutPromise.current) return logoutPromise.current;
    loggingOut.current = true;
    setIsLoggingOut(true);
    stopProgressLoad.current?.();
    logoutPromise.current = (async () => {
      await flushProgress.current?.();
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      // Giữ tiến độ và ownerId trên máy nếu flush lỗi; tài khoản khác vẫn nạp bản riêng.
      setUser(null);
      setSavedAt(null);
      setSyncedFor(null);
      setProgressReadyFor(null);
      router.replace('/login');
    })().finally(() => { logoutPromise.current = null; setIsLoggingOut(false); });
    return logoutPromise.current;
  }, [router]);

  if (loading) return <div className="p-10 text-center text-slate-400">Đang tải…</div>;
  if (!user && !isPublic) return <div className="p-10 text-center text-slate-400">Đang chuyển tới trang đăng nhập…</div>;

  return (
    <Ctx.Provider value={{ user, loading, saving, isLoggingOut, savedAt, syncedFor, progressReadyFor, refresh, logout }}>
      {children}
    </Ctx.Provider>
  );
}
