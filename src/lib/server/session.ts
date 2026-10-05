import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { getStore, type User } from './db';

const COOKIE = 'td_session';
const DAYS = 60;

/**
 * Khóa ký cookie. Khi deploy phải đặt `SESSION_SECRET`;
 * thiếu nó thì mỗi lần khởi động lại server là mọi người bị đăng xuất.
 */
function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Thiếu biến môi trường SESSION_SECRET (ít nhất 16 ký tự).');
  }
  return 'dev-only-secret-khong-dung-khi-deploy';
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

/** Token dạng `userId.hếtHạn.chữKý` */
function makeToken(userId: string): string {
  const exp = Date.now() + DAYS * 24 * 3600 * 1000;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): string | null {
  const i = token.lastIndexOf('.');
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const given = Buffer.from(token.slice(i + 1));
  const want = Buffer.from(sign(payload));
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  const [userId, exp] = payload.split('.');
  if (!userId || !exp || Number(exp) < Date.now()) return null;
  return userId;
}

export async function startSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: DAYS * 24 * 3600,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Người đang đăng nhập, hoặc undefined */
export async function currentUser(): Promise<User | undefined> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return undefined;
  const userId = readToken(token);
  if (!userId) return undefined;
  return (await getStore()).findUserById(userId);
}

export const publicUser = (u: User) => ({
  id: u.id,
  username: u.username,
  displayName: u.displayName,
  role: u.role,
});

export type PublicUser = ReturnType<typeof publicUser>;
