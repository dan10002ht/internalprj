/**
 * Gọi API và luôn trả về lỗi đọc được.
 *
 * Trước đây dùng thẳng `await r.json()`: khi server trả 500 kèm trang HTML thì
 * chính câu đó ném lỗi, rơi vào catch và báo nhầm thành "không kết nối được tới
 * server". Ở đây đọc text trước rồi mới thử parse, nên lỗi hiện đúng nguyên nhân.
 */
export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
}

const serverMessageOrText = (data: { error?: string } | null, text: string) => data?.error ?? text.slice(0, 300);

export async function callApi<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  let r: Response;
  try {
    r = await fetch(url, { cache: 'no-store', ...init });
  } catch {
    return { ok: false, status: 0, data: null, error: 'Hiện chưa kết nối được. Bạn kiểm tra wifi hoặc 4G rồi thử lại nhé.' };
  }

  const text = await r.text().catch(() => '');
  let data: (T & { error?: string }) | null = null;
  try {
    data = text ? (JSON.parse(text) as T & { error?: string }) : null;
  } catch {
    // Server trả về HTML (thường là trang lỗi) → giữ nguyên text để báo lỗi
  }

  if (r.ok) return { ok: true, status: r.status, data, error: null };

  const serverMessage = data?.error;
  // Thông báo cho người dùng không nhắc tới mã lỗi hay hạ tầng — chi tiết kỹ thuật nằm ở console
  const fallback =
    r.status >= 500
      ? 'Hệ thống đang gặp sự cố. Bạn chờ một lát rồi thử lại, nếu vẫn lỗi thì nhắn cho giáo viên nhé.'
      : 'Không gửi được thông tin. Bạn kiểm tra lại các ô đã nhập rồi thử lại nhé.';
  if (!r.ok) console.error(`[api] ${init?.method ?? 'GET'} ${url} → ${r.status}`, serverMessageOrText(data, text));
  return { ok: false, status: r.status, data, error: serverMessage ?? fallback };
}

export const postJson = <T>(url: string, body: unknown) =>
  callApi<T>(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

export const patchJson = <T>(url: string, body: unknown) =>
  callApi<T>(url, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
