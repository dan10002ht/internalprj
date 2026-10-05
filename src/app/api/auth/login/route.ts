import { getStore } from '@/lib/server/db';
import { normalizeUsername, verifyPassword } from '@/lib/server/password';
import { jsonHandler } from '@/lib/server/route';
import { publicUser, startSession } from '@/lib/server/session';

export async function POST(request: Request) {
  return jsonHandler(async () => {
  const body = (await request.json().catch(() => ({}))) as { username?: string; password?: string };
  const username = normalizeUsername(body.username ?? '');
  const password = body.password ?? '';

  const store = await getStore();
  const user = await store.findUserByUsername(username);
  // Không nói rõ sai tên hay sai mật khẩu, để không ai dò được danh sách tài khoản
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }, { status: 401 });
  }

  await startSession(user.id);
  return Response.json({ user: publicUser(user) });
  });
}
