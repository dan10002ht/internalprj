/**
 * Bọc một route handler để lỗi luôn trả về JSON đọc được.
 * Không có nó thì lỗi phía server thành trang HTML 500, phía client parse JSON
 * thất bại và báo nhầm thành "không kết nối được tới server".
 */
/** Thông báo gửi cho người dùng khi có lỗi không lường trước */
const FRIENDLY = 'Hệ thống đang gặp sự cố. Bạn thử lại sau một chút nhé.';

export async function jsonHandler(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    // Thông điệp lỗi gốc có thể lộ tên bảng, đường dẫn hay cấu hình → chỉ ghi vào log
    console.error('[api]', e);
    const message = e instanceof Error ? e.message : '';
    // Riêng lỗi thiếu cấu hình thì nói rõ, vì chỉ người cài đặt mới gặp
    const isSetup = message.startsWith('Chưa cấu hình');
    return Response.json({ error: isSetup ? message : FRIENDLY }, { status: 500 });
  }
}
