# Luyện Tiếng Anh THPTQG

Web app ôn thi THPTQG môn Tiếng Anh. Số ngày học do giáo viên tự định nghĩa (hiện có 2 ngày từ Unit 2);
mỗi ngày gồm Warm-up → 3 mini test → 2 đề tổng hợp → Round cuối gõ từ.
Đăng nhập bằng tên đăng nhập + mật khẩu; kết quả lưu trên server nên đổi máy vẫn còn tiến độ. Deploy Vercel.

## Chạy local

```bash
npm install
cp .env.example .env.local   # rồi điền SESSION_SECRET
npm run dev                  # http://localhost:3000
```

Chạy trên máy mà để trống `DATABASE_URL` thì app tự lưu tài khoản + tiến độ vào `.data/db.json`.
File này chỉ để thử, **không dùng khi deploy** (Vercel không cho ghi file và mỗi lần deploy là mất dữ liệu).

## Kiểm tra trước khi đẩy code

```bash
npm run check-data   # tính toàn vẹn nội dung đề
npm run lint
npx tsc --noEmit
npm run build
```

Test giao diện tự động (Playwright): xem mục 17.9 trong [docs/PLAN-english.md](docs/PLAN-english.md).

## Đăng nhập & tài khoản

| | |
|---|---|
| Học sinh | Tự tạo tài khoản ở `/login` (tab **Tạo tài khoản**), hoặc giáo viên tạo sẵn rồi đưa tên đăng nhập + mật khẩu |
| Giáo viên | Tài khoản có tên nằm trong `TEACHER_USERNAMES` (mặc định `giaovien`). Đăng nhập rồi vào `/gv` |
| Mật khẩu | Băm bằng scrypt. Quên mật khẩu thì giáo viên đặt lại ở `/gv` |
| Phiên | Cookie HttpOnly ký bằng `SESSION_SECRET`, hạn 60 ngày |

Tiến độ vẫn giữ một bản trong localStorage để làm bài khi mạng chập chờn, và được đẩy
lên server khoảng 1 giây sau mỗi thay đổi. Đăng nhập ở máy khác thì lấy bản mới hơn.

## Biến môi trường

Xem `.env.example`. Khi deploy cần `SESSION_SECRET` và `DATABASE_URL` (Postgres: Neon / Supabase / Vercel Postgres đều được).

Hướng dẫn deploy từng bước, cách tạo tài khoản giáo viên đầu tiên và bảng xử lý sự cố:
[docs/DEPLOY.md](docs/DEPLOY.md).

## Cấu trúc

```
content/              file .md giáo viên nhập (passage + vocabulary)
  TEMPLATE-day.md     mẫu để copy thành day-1.md, day-2.md…
scripts/              script convert .md → JSON
src/
  types/              định nghĩa VocabItem, Question, StudentProgress
  data/day1, day2…    nội dung từng ngày (TS); data/index.ts khai báo danh sách ngày
  lib/                chấm điểm, hint, spaced repetition
  store/              Zustand store (progress + test session)
  components/
    formats/          1 component cho mỗi dạng câu hỏi
    ui/               component dùng chung
  app/                các màn hình (App Router) + `api/` cho đăng nhập và lưu tiến độ
  lib/server/         chỉ chạy phía server: database, băm mật khẩu, phiên đăng nhập
docs/
  PLAN-english.md     kế hoạch & thiết kế đầy đủ
  DEPLOY.md           hướng dẫn deploy, vận hành và xử lý sự cố
scripts/
  check-data.mjs      kiểm tra tính toàn vẹn nội dung đề (npm run check-data)
```

## Tài liệu

Đọc [docs/PLAN-english.md](docs/PLAN-english.md) để nắm mô hình học tập,
kho dạng bài, hệ thống hint 3 bậc và cấu trúc dữ liệu. Trong đó:

- Mục 16 — đăng nhập và cách lưu kết quả
- Mục 17 — việc còn tồn đọng, chờ sửa sau
- Mục 18 — nhật ký rà soát 05/10/2026 (lỗi đã sửa và vì sao)

Deploy và vận hành: [docs/DEPLOY.md](docs/DEPLOY.md).

## Lưu ý môi trường

Máy này bị Application Control chặn native binary của Next.js (`@next/swc-win32-x64-msvc`),
nên Next tự fallback sang WASM. Build/dev vẫn chạy, chỉ chậm hơn. Trên Vercel không bị.
