import { getStore } from '@/lib/server/db';
import { checkPassword, checkUsername, hashPassword, normalizeUsername } from '@/lib/server/password';
import { jsonHandler } from '@/lib/server/route';
import { currentUser } from '@/lib/server/session';

async function requireTeacher() {
  const user = await currentUser();
  if (!user) return { error: Response.json({ error: 'Phiên đăng nhập đã hết. Bạn đăng nhập lại để tiếp tục nhé.' }, { status: 401 }) };
  if (user.role !== 'teacher') return { error: Response.json({ error: 'Chỉ giáo viên xem được trang này.' }, { status: 403 }) };
  return { user };
}

/** Danh sách học sinh kèm tiến độ — dữ liệu cho màn hình giáo viên */
export async function GET() {
  return jsonHandler(async () => {
  const { error } = await requireTeacher();
  if (error) return error;

  const store = await getStore();
  const [users, progress] = await Promise.all([store.listUsers(), store.listProgress()]);
  const byUser = new Map(progress.map((p) => [p.userId, p]));

  return Response.json({
    students: users
      .filter((u) => u.role === 'student')
      .map((u) => {
        const row = byUser.get(u.id);
        return {
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          createdAt: u.createdAt,
          updatedAt: row?.updatedAt ?? null,
          progress: row?.data ?? null,
        };
      }),
  });
  });
}

/** Giáo viên tạo tài khoản cho học sinh */
export async function POST(request: Request) {
  return jsonHandler(async () => {
  const { error } = await requireTeacher();
  if (error) return error;

  const body = (await request.json().catch(() => ({}))) as { username?: string; password?: string; displayName?: string };
  const username = normalizeUsername(body.username ?? '');
  const password = body.password ?? '';
  const displayName = (body.displayName ?? '').trim() || username;

  const bad = checkUsername(username) ?? checkPassword(password);
  if (bad) return Response.json({ error: bad }, { status: 400 });

  const store = await getStore();
  if (await store.findUserByUsername(username)) {
    return Response.json({ error: 'Tên đăng nhập này đã có người dùng.' }, { status: 409 });
  }
  const user = await store.createUser({
    username, passwordHash: await hashPassword(password), displayName, role: 'student',
  });
  return Response.json({ student: { id: user.id, username: user.username, displayName: user.displayName } });
  });
}

/** Đặt lại mật khẩu, hoặc xóa tài khoản học sinh */
export async function PATCH(request: Request) {
  return jsonHandler(async () => {
  const { error } = await requireTeacher();
  if (error) return error;

  const body = (await request.json().catch(() => ({}))) as { id?: string; action?: 'resetPassword' | 'delete'; password?: string };
  const store = await getStore();
  const target = body.id ? await store.findUserById(body.id) : undefined;
  if (!target || target.role !== 'student') {
    return Response.json({ error: 'Không tìm thấy học sinh này.' }, { status: 404 });
  }

  if (body.action === 'delete') {
    await store.deleteUser(target.id);
    return Response.json({ ok: true });
  }

  if (body.action === 'resetPassword') {
    const bad = checkPassword(body.password ?? '');
    if (bad) return Response.json({ error: bad }, { status: 400 });
    await store.setPassword(target.id, await hashPassword(body.password!));
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Thao tác không hợp lệ. Bạn thử lại nhé.' }, { status: 400 });
  });
}
