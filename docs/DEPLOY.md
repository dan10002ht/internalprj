# Hướng dẫn deploy và vận hành

Ghi ngày 05/10/2026. Dành cho người cài đặt, không phải cho học sinh.

## Hiện trạng

| Hạng mục | Giá trị |
|---|---|
| Repo app | `github.com/nnht-dtt/internalprj` — nhánh `main`, app nằm ở gốc repo |
| Repo tài liệu | `github.com/nnht-dtt/BA-task`, thư mục `internalprj/` (bản sao để làm việc) |
| Vercel | Tài khoản cá nhân, project `learn-english-daily` |
| Database | Neon (Serverless Postgres), bản Free, region Singapore |

Hai repo cùng giữ một bản code. Sửa ở `BA-task/internalprj` thì đẩy sang repo app
bằng `git subtree push --prefix=internalprj app main`. Vercel chỉ theo dõi repo app.

---

## 1. Tạo project trên Vercel

1. vercel.com → **Add New** → **Project** → **Import Git Repository** → chọn
   `nnht-dtt/internalprj`. Lần đầu Vercel xin quyền GitHub: chọn **Only select
   repositories** và tick đúng repo này.
2. **Root Directory** để `./` — app nằm ở gốc repo nên không cần đổi.
   *(Nếu import từ repo `BA-task` thì bắt buộc đặt Root Directory là `internalprj`,
   không thì build lỗi "No Next.js version detected".)*
3. Framework tự nhận **Next.js**. Build Command và Output Directory để mặc định.

## 2. Tạo database

Tab **Storage** → **Create Database** → **Neon** → region **Singapore** → plan
**Free** → **Connect to Project**.

Trong hộp thoại Connect:

| Trường | Giá trị | Vì sao |
|---|---|---|
| Environments | Production + Preview | Sensitive không dùng được cho Development |
| Create database branch for deployment | **bỏ trống cả hai** | Tick vào là dữ liệu production và preview tách nhau, dễ rối |
| **Custom Prefix** | **`DATABASE`** | **Quan trọng nhất.** Để trống sẽ tạo biến `STORAGE_URL`, mà code chỉ đọc `DATABASE_URL` hoặc `POSTGRES_URL` |
| Sensitive | bật | Chuỗi kết nối có mật khẩu database |

Neon tạo ra `DATABASE_URL` cùng một loạt biến `DATABASE_PG*`, `DATABASE_POSTGRES_*`
— những biến thừa này không ảnh hưởng gì, cứ để đó.

Hai bảng `users` và `progress` do app tự tạo khi chạy lần đầu, không cần chạy SQL.

## 3. Biến môi trường

**Settings** → **Environment Variables**, cả hai chọn **Production and Preview**:

| Name | Giá trị | Bắt buộc |
|---|---|---|
| `SESSION_SECRET` | chuỗi ngẫu nhiên ≥ 16 ký tự | Có — thiếu là API đăng nhập lỗi |
| `TEACHER_USERNAMES` | `giaovien` (nhiều tên cách nhau bằng dấu phẩy) | Không, mặc định là `giaovien` |
| `DATABASE_URL` | Neon tự thêm ở bước 2 | Có |

Sinh `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Nên đánh dấu `SESSION_SECRET` là **Sensitive**. Đổi nó thì mọi người đang đăng
nhập bị đăng xuất, ngoài ra không mất dữ liệu.

> **Không bao giờ ghi mật khẩu thật vào `.env.example`** — file đó được commit lên
> GitHub nên mọi giá trị trong nó là công khai, và xóa sau cũng không mất vì lịch
> sử git vẫn giữ. File chỉ nên chứa tên biến với giá trị rỗng.

## 4. Tạo tài khoản giáo viên đầu tiên

Form tự đăng ký đã **bị ẩn** trên giao diện (`ALLOW_SELF_REGISTER = false` trong
`src/components/auth/LoginForm.tsx`) — tài khoản học sinh do giáo viên cấp.

Để lập tài khoản giáo viên đầu tiên, mở **`/login?dangky=1`** — lối tắt này hiện
lại tab **Tạo tài khoản**:

- Tên đăng nhập: phải khớp đúng một giá trị trong `TEACHER_USERNAMES` (mặc định `giaovien`)
- Mật khẩu: từ 6 ký tự

Làm việc này **ngay sau khi deploy, trước khi gửi link cho học sinh** — ai đăng ký
tên `giaovien` trước thì người đó thành giáo viên.

Đăng nhập xong, Dashboard sẽ có nút **Giáo viên** dẫn sang `/gv` để tạo tài khoản
cho từng học sinh.

## 5. Đổi URL

Domain `.vercel.app` **không tự đổi theo tên project**. Đổi tên project xong vẫn
phải gán domain mới bằng tay:

- **Settings** → **Domains** → **Add Domain** → gõ `<tên>.vercel.app` → **Add**
- Gỡ domain cũ: **•••** → **Remove**

Nút **＋** cạnh chữ Domains ở trang Overview mở panel **mua tên miền** — không
dùng; bấm **Connect an existing domain** trong panel đó rồi gõ đuôi `.vercel.app`.

Domain `.vercel.app` miễn phí, không cần trỏ DNS.

## 6. Nếu import từ repo chung

Bật **Settings** → **Git** → **Ignored Build Step** chỉ build khi Root Directory
có thay đổi, để commit tài liệu BA không kích hoạt build lại app.

---

## Chạy trên máy

```bash
npm install
cp .env.example .env.local   # điền SESSION_SECRET
npm run dev                  # http://localhost:3000
```

Để trống `DATABASE_URL` thì app lưu vào `.data/db.json`. **Chỉ dùng để thử trên
máy** — trên Vercel thư mục chỉ đọc nên bản lưu file bị chặn hẳn (`getStore()` báo
lỗi rõ ràng thay vì hỏng âm thầm).

Form tự đăng ký trên máy cũng ẩn; dùng `http://localhost:3000/login?dangky=1`.

### Lệnh kiểm tra

```bash
npm run check-data   # kiểm tra tính toàn vẹn nội dung đề
npm run lint
npx tsc --noEmit
npm run build
```

---

## Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Build lỗi "No Next.js version detected" | Root Directory sai | Đặt về `./` (hoặc `internalprj` nếu import từ repo chung) |
| Đăng nhập báo "Hệ thống đang gặp sự cố" | Bản deploy chưa nhận `DATABASE_URL` | Kiểm tra biến đã có chưa, rồi **Deployments** → **•••** → **Redeploy**. Biến môi trường chỉ có tác dụng với deploy mới |
| Thông báo nhắc "Chưa cấu hình DATABASE_URL" | Chưa cắm Neon, hoặc Custom Prefix không phải `DATABASE` | Làm lại bước 2 |
| Đăng nhập xong lại bị đẩy ra | `SESSION_SECRET` đổi giữa chừng, hoặc chưa đặt | Đặt lại rồi deploy lại |
| Vào `/gv` báo chỉ dành cho giáo viên | Tên đăng nhập không nằm trong `TEACHER_USERNAMES` | Sửa biến rồi deploy lại; tài khoản đã tạo giữ nguyên vai trò cũ cho tới lần đăng nhập sau |
| Học sinh đổi máy mất tiến độ | Chưa đăng nhập, hoặc đăng nhập nhầm tài khoản | Tiến độ gắn với tài khoản, không gắn với máy |

Xem log lỗi thật: Vercel → **Logs**, lọc **Runtime**. Thông báo trên màn hình đã
được viết lại cho học sinh đọc nên không còn mã lỗi; chi tiết kỹ thuật nằm ở đây.

---

## Tài liệu liên quan

- [PLAN-english.md](PLAN-english.md) — thiết kế đầy đủ. Mục 16 nói về đăng nhập và
  lưu kết quả, mục 17 là việc còn tồn đọng, mục 18 là nhật ký rà soát 05/10/2026.
- [../README.md](../README.md) — tổng quan và cấu trúc thư mục.
