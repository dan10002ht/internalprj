import { getStore } from '@/lib/server/db';
import { jsonHandler } from '@/lib/server/route';
import { currentUser } from '@/lib/server/session';
import type { StudentProgress } from '@/types';

/** Tiến độ của chính người đang đăng nhập */
export async function GET() {
  return jsonHandler(async () => {
    const user = await currentUser();
    if (!user) return Response.json({ error: 'Phiên đăng nhập đã hết. Bạn đăng nhập lại để tiếp tục nhé.' }, { status: 401 });
    const row = await (await getStore()).getProgress(user.id);
    return Response.json({ progress: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
  });
}

/** Ghi đè toàn bộ tiến độ. Bản trên máy là bản làm việc, server giữ bản sao mới nhất */
export async function PUT(request: Request) {
  return jsonHandler(async () => {
  const user = await currentUser();
  if (!user) return Response.json({ error: 'Phiên đăng nhập đã hết. Bạn đăng nhập lại để tiếp tục nhé.' }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { progress?: StudentProgress };
  if (!body.progress || typeof body.progress !== 'object') {
    return Response.json({ error: 'Chưa lưu được kết quả bài làm. Bạn thử lại thao tác vừa rồi nhé.' }, { status: 400 });
  }
  const row = await (await getStore()).saveProgress(user.id, body.progress);
  return Response.json({ updatedAt: row.updatedAt });
  });
}
