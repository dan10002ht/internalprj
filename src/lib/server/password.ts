import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const KEYLEN = 64;

/** Băm mật khẩu bằng scrypt (có sẵn trong Node, không cần thư viện ngoài) */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEYLEN);
  return `scrypt:${salt.toString('base64')}:${key.toString('base64')}`;
}

/** So sánh mật khẩu, chống dò theo thời gian phản hồi */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, keyB64] = stored.split(':');
  if (scheme !== 'scrypt' || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, 'base64');
  const actual = await scryptAsync(password, Buffer.from(saltB64, 'base64'), expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Yêu cầu tối thiểu cho mật khẩu — đủ chặt cho lớp nội bộ, không làm khó học sinh */
export function checkPassword(password: string): string | null {
  if (password.length < 6) return 'Mật khẩu cần ít nhất 6 ký tự.';
  if (password.length > 200) return 'Mật khẩu quá dài.';
  return null;
}

/** Tên đăng nhập: chữ, số, dấu chấm, gạch dưới, gạch nối */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function checkUsername(username: string): string | null {
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return 'Tên đăng nhập cần 3–32 ký tự, chỉ gồm chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch nối.';
  }
  return null;
}
