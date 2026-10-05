import { getStore, isTeacherUsername } from '@/lib/server/db';
import { checkPassword, checkUsername, hashPassword, normalizeUsername } from '@/lib/server/password';
import { jsonHandler } from '@/lib/server/route';
import { publicUser, startSession } from '@/lib/server/session';

/** Tạo tài khoản mới rồi đăng nhập luôn */
export async function POST(request: Request) {
  return jsonHandler(async () => {
  const body = (await request.json().catch(() => ({}))) as { username?: string; password?: string; displayName?: string };
  const username = normalizeUsername(body.username ?? '');
  const password = body.password ?? '';
  const displayName = (body.displayName ?? '').trim() || username;

  const bad = checkUsername(username) ?? checkPassword(password);
  if (bad) return Response.json({ error: bad }, { status: 400 });

  const store = await getStore();
  if (await store.findUserByUsername(username)) {
    return Response.json({ error: 'Tên đăng nhập này đã có người dùng. Chọn tên khác nhé.' }, { status: 409 });
  }

  const user = await store.createUser({
    username,
    passwordHash: await hashPassword(password),
    displayName,
    role: isTeacherUsername(username) ? 'teacher' : 'student',
  });
  await startSession(user.id);
  return Response.json({ user: publicUser(user) });
  });
}
