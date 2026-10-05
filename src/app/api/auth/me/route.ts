import { jsonHandler } from '@/lib/server/route';
import { currentUser, publicUser } from '@/lib/server/session';

export async function GET() {
  return jsonHandler(async () => {
    const user = await currentUser();
    return Response.json({ user: user ? publicUser(user) : null });
  });
}
