# Kế hoạch — Website Luyện Tiếng Anh THPT

> Ngày tạo: 02/10/2026 · Trạng thái: Đã chốt giải pháp, chờ file .md từ vựng
> Cập nhật 04/10/2026: plan lại dạng bài theo khuôn đề thi tốt nghiệp THPT từ 2025 (mục 3, 4); bỏ khung 7 ngày, chuẩn hoá cấu trúc 1 ngày học (mục 2.1); chia Unit 2 thành 2 ngày (mục 4.5); bỏ màn Công cụ (xuất JSON, mở khoá, đặt lại) vì app gửi trực tiếp cho học sinh — giáo viên xem trước mọi bài qua `/dashboard?gv=1`
> Deploy: Vercel · Lưu trữ: localStorage · Không đăng nhập

---

## 1. Bối cảnh & Phạm vi

| Hạng mục | Quyết định |
|---|---|
| Đối tượng | Học sinh ôn thi THPTQG môn Tiếng Anh, mỗi em một tài khoản đăng nhập |
| Nội dung | Theo ngày, giáo viên tự định nghĩa số ngày và nội dung. Mỗi ngày: 1 bộ từ vựng + 1 đề gốc (~50 câu, nhiều bài đọc) |
| Thời lượng/ngày | Warm-up 3' + 3 Mini Test (7–10'/bài) + 2 đề tổng hợp (~25 câu/đề) + Round cuối (15 giây/từ) |
| Người nhập liệu | Giáo viên gửi file .md từ vựng → Claude sinh đề → build vào app. Màn hình giáo viên `/gv` đã có (mục 15) |
| Nguồn câu hỏi | **Claude sinh từ vocab + passage giáo viên cung cấp, giáo viên review lại** |
| Dạng tự luận | KHÔNG có — mọi dạng bài chấm máy 100% |
| Lưu trữ | Server (Postgres) là bản chuẩn; localStorage giữ bản làm việc để làm bài khi mạng chập chờn — xem mục 16 |
| Backend / Database | Có — Next.js route handlers + Postgres, dùng cho đăng nhập và lưu kết quả (bổ sung 05/10/2026) |
| Repo | `github.com/nnht-dtt/internalprj` — tách riêng 05/10/2026, app nằm ở gốc repo |
| Deploy | Vercel, project `learn-english-daily` |

---

## 2. Mô hình học tập

### 2.1 Cấu trúc một ngày học

| Bước | Tên | Thời lượng | Mục tiêu | Điều kiện mở |
|---|---|---|---|---|
| 0 | Học từ vựng | tự do | Flashcard, IPA, ví dụ trong bài, mẹo nhớ | — |
| 1 | Warm-up | 3 phút | Ôn 10 từ từ các ngày trước (chỉ có từ ngày thứ 2) | — |
| 2 | Mini 1 — Nhận diện | 7 phút | Nhận ra nghĩa của từ | — |
| 3 | Mini 2 — Tái tạo | 8 phút | Tự nhớ lại và viết ra từ | Mini 1 ≥ 80% |
| 4 | Mini 3 — Vận dụng theo dạng đề | 10 phút | Dùng từ trong văn bản ngắn theo dạng P1–P6 | Mini 2 ≥ 80% |
| 5 | Đề tổng hợp 1 — Luyện | không giới hạn | Làm đề kèm trợ lực học từ | Mini 3 ≥ 80% |
| 6 | Đề tổng hợp 2 — Thi | 1,25 phút/câu | Làm như thi thật | Hoàn thành Đề 1 |
| 7 | Round cuối — Gõ từ | 15 giây/từ | Nhớ chủ động toàn bộ từ của ngày, không gợi ý | Hoàn thành Đề 2 · **Pass ≥ 90%** |

Logic sư phạm: học từ (Mini 1–2) → dùng từ theo dạng đề (Mini 3) → làm đề có trợ lực (Đề 1) → làm đề như thật (Đề 2) → tự nhớ lại toàn bộ từ không gợi ý (Round cuối). Chi tiết dạng bài ở mục 4.

### 2.2 Cơ chế "học đi học lại" — 3 tầng lặp

- **Lặp trong ngày**: mini test yêu cầu >=80% mới qua. Dưới ngưỡng → retry với câu hỏi đảo thứ tự + đổi distractor.
- **Lặp liên ngày (spaced review)**: Warm-up đầu mỗi ngày lấy từ pool các ngày trước.
  - Sai 1 lần → ôn lại sau 1 ngày
  - Sai 2 lần → ôn lại sau 3 ngày
  - Đúng 3 lần liên tiếp → `mastered`, rút khỏi pool
  - Dùng Hint bậc 3 → luôn quay lại pool ngày mai, bất kể đúng/sai

### 2.3 Chống học thuộc mẹo

Mỗi câu hỏi lưu dạng *template*; khi render thì shuffle đáp án + rotate distractor pool. Một từ có 3-4 câu hỏi ở 3-4 dạng khác nhau → làm lại 4 lần vẫn thấy mới.

---

## 3. Khuôn đề thi tốt nghiệp THPT môn Tiếng Anh (từ 2025)

> Căn cứ để thiết kế toàn bộ dạng bài. Áp dụng từ kỳ thi 2025 (chương trình GDPT 2018), giữ nguyên ở kỳ thi 2026.
> Nguồn tra cứu 04/10/2026: thuvienphapluat.vn, zim.vn, langgo.edu.vn (cấu trúc đề tiếng Anh tốt nghiệp THPT 2026).

**40 câu trắc nghiệm · 50 phút · 0,25 điểm/câu · 100% câu hỏi nằm trong văn bản** (không còn câu đơn lẻ).

| Phần | Câu | Số câu | Dạng | Kiến thức thường kiểm tra |
|---|---|---|---|---|
| P1 | 1–6 | 6 | Điền khuyết quảng cáo / thông báo | Từ loại, trật tự tính từ, giới từ, collocation, rút gọn mệnh đề quan hệ, V-ing / to V, bị động |
| P2 | 7–12 | 6 | Điền khuyết tờ rơi / poster | Lượng từ, từ hạn định (other/another…), từ nối, phrasal verb, chọn từ đúng nghĩa |
| P3 | 13–17 | 5 | Sắp xếp câu thành hội thoại, thư/email, đoạn văn (chọn 1 trong 4 thứ tự) | Mạch hội thoại, bố cục thư, từ nối, đại từ tham chiếu |
| P4 | 18–22 | 5 | Điền câu / mệnh đề còn thiếu vào đoạn văn | Cấu trúc câu (mệnh đề quan hệ, phân từ, đảo ngữ…) + mạch nghĩa |
| P5 | 23–30 | 8 | Đọc hiểu bài 1 | Chi tiết, NOT mentioned, từ vựng trong ngữ cảnh (đồng/trái nghĩa), tham chiếu, diễn đạt lại câu, câu đúng/sai |
| P6 | 31–40 | 10 | Đọc hiểu bài 2 (dài và khó hơn) | Như P5 + chèn câu, suy luận, tóm tắt đoạn/bài, xác định đoạn văn |

**Hệ quả với app:**
- Đề **không còn** phát âm, trọng âm, tìm lỗi sai, đồng/trái nghĩa câu đơn, giao tiếp câu đơn, viết lại câu → bỏ khỏi bài luyện.
- Ngữ pháp và từ vựng **vẫn thi**, nhưng qua văn bản thực tế (quảng cáo, tờ rơi, thư, hội thoại) → học sinh phải quen đọc các loại văn bản này.
- 22/40 câu (P1–P4) là dạng kế hoạch cũ chưa có → đưa vào Mini 3 dưới dạng thu nhỏ (mục 4.4).

---

## 4. Kho dạng bài cho một ngày học

> Cập nhật 04/10/2026 theo chốt của PO: giữ 3 mini test, thay Main Test bằng 2 đề tổng hợp, bỏ khung 7 ngày (số ngày và nội dung từng ngày do giáo viên tự định nghĩa).

Ký hiệu trạng thái (đối chiếu nội dung Ngày 1): ✅ đã có · 🔁 có, cần chuyển hình thức · 🆕 dạng mới · ❌ bỏ.

### 4.1 Quy tắc lọc dạng bài

- **Giữ** dạng nếu kiến thức nó kiểm tra **có trong đề mới**: nghĩa từ, từ loại, collocation, cấu trúc câu, các dạng câu hỏi đọc hiểu, và 4 dạng P1–P4. Hình thức tương tác (nối, kéo thả, chạm, gõ) được giữ để mini test đa dạng.
- **Bỏ** dạng kiểm tra kỹ năng đề **không thi**: phát âm, trọng âm, nghe chép, tìm lỗi sai, giao tiếp câu đơn, viết lại / kết hợp câu, True/False/Not Given, nối tiêu đề, phân loại quan điểm.
- Bỏ bước **Đọc sâu**. Dạng nào của bước này có trong đề (tham chiếu, tóm tắt, sắp xếp) thì chuyển vào Mini 3.

### 4.2 Mini 1 — Nhận diện (7 phút)

| Mã | Dạng | Cách làm | Trạng thái |
|---|---|---|---|
| M1.1 | Nối từ ↔ định nghĩa EN | Nối 6 từ với 6 định nghĩa | ✅ |
| M1.2 | Chọn nghĩa đúng | MCQ 4 đáp án | ✅ |
| M1.3 | Từ khác nhóm | Chọn 1 từ khác nghĩa với 3 từ còn lại | ✅ |
| M1.4 | Đúng / Sai về nghĩa từ | Câu dùng từ mới → True / False | ✅ |
| — | Nối từ ↔ emoji (m1-2) | — | ❌ PO bỏ 04/10/2026 |
| — | Trọng âm, phát âm (m1-10, m1-11) | — | ❌ IPA / trọng âm chuyển sang màn Học từ |

### 4.3 Mini 2 — Tái tạo (8 phút)

| Mã | Dạng | Cách làm | Trạng thái |
|---|---|---|---|
| M2.1 | Điền từ có gợi ý chữ đầu | Gõ 1 từ vào chỗ trống | ✅ |
| M2.2 | Xếp chữ cái | Gõ lại từ từ các chữ bị đảo | ✅ |
| M2.3 | Dịch Việt → Anh | Gõ 1 từ tiếng Anh | ✅ |
| M2.4 | Word form | Gõ dạng đúng của từ trong ngoặc | ✅ |
| M2.5 | Collocation | Chọn động từ / giới từ đi đúng với từ | ✅ |
| M2.6 | Ghép câu kéo thả | Kéo các mảnh thành câu đúng | ✅ |
| — | Nghe chép (m2-10) | — | ❌ đề không thi nghe |

### 4.4 Mini 3 — Vận dụng theo dạng đề (10 phút)

Mỗi câu là bản thu nhỏ của một phần đề, đặt trong văn bản ngắn 40–80 từ, cho phép thao tác tương tác.

| Mã | Dạng | Ứng với đề | Cách làm | Trạng thái |
|---|---|---|---|---|
| M3.1 | Cloze thông báo | P1 | Thông báo ngắn 3 chỗ trống, mỗi chỗ MCQ (từ loại, giới từ, V-ing / to V, bị động) | 🆕 |
| M3.2 | Cloze tờ rơi | P2 | Tờ rơi ngắn 3 chỗ trống (lượng từ, từ nối, phrasal verb) | 🆕 |
| M3.3 | Sắp xếp hội thoại / thư | P3 | Kéo 3–5 câu a–e về đúng thứ tự | 🆕 (thay m3-11 giao tiếp) |
| M3.4 | Điền mệnh đề vào đoạn | P4 | Đoạn ngắn khuyết 1 mệnh đề, chọn 1 trong 4 | 🔁 (đổi từ m3-10 kết hợp câu) |
| M3.5 | Từ trong ngữ cảnh | P1–P2 | Chọn từ hợp nghĩa trong đoạn | ✅ |
| M3.6 | Đồng / trái nghĩa trong đoạn | P5–P6 | Từ in đậm nằm trong đoạn, chọn từ gần / trái nghĩa | 🔁 (m3-3, m3-4 đang là câu đơn) |
| M3.7 | Tham chiếu dạng chạm | P5–P6 | Chạm vào cụm từ mà "it / they" thay thế | 🔁 (chuyển từ Đọc sâu) |
| M3.8 | Hoàn thành tóm tắt | P6 | Điền từ trong khung vào bản tóm tắt | 🔁 (chuyển từ Đọc sâu) |
| M3.9 | Chèn câu dạng chạm | P6 | Chạm vị trí [I]–[IV] trong đoạn | 🆕 (dùng lại hiển thị chèn câu có sẵn) |
| M3.10 | Collocation chọn nhiều | P1–P2 | Chọn TẤT CẢ từ đi được với từ cho trước | ✅ |
| M3.11 | Phân loại loại từ | P1 | Kéo từ vào cột Noun / Verb / Adjective | ✅ |
| — | Tìm lỗi sai (m3-6, m3-7) | — | Lỗi ngữ pháp điển hình chuyển thành phương án nhiễu của M3.1, M3.2, M3.4 | ❌ |

### 4.5 Hai đề tổng hợp

**Nguồn và cách chia (chốt 04/10/2026):**
- Material: `material/Unit 2 - Reading.md` — 6 bài đọc (bài 1–3 dạng "bài đọc 1" 8 câu, bài 4–6 dạng "bài đọc 2" 10 câu).
- **Ngày 1** dùng bài 1–3, **Ngày 2** dùng bài 4–6. Từ vựng, mini test và phần P1–P4 của mỗi ngày soạn từ từ vựng các bài đọc của ngày đó.
- Phần đọc hiểu lấy trực tiếp câu hỏi đề gốc; phần P1–P4 soạn mới theo quy tắc lệnh `/soan-de` (độ dài văn bản, điểm kiến thức, chỉ một đáp án đúng).
- Đánh số lại câu liên tục trong từng đề (Question 1 → hết), giống đề thật.

| Ngày | Đề tổng hợp 1 | Đề tổng hợp 2 |
|---|---|---|
| 1 | P1 thông báo (6) · P2 tờ rơi (6) · Bài 1 (8) · Bài 2 (8) = 28 câu | P3 sắp xếp (5) · P4 điền câu (5) · Bài 3 (8) = 18 câu |
| 2 | P1 (6) · P2 (6) · Bài 4 (10) · Bài 5 (10) = 32 câu | P3 (5) · P4 (5) · Bài 6 (10) = 20 câu |

**Vai trò hai đề:**

| | Đề tổng hợp 1 — Luyện | Đề tổng hợp 2 — Thi |
|---|---|---|
| Mục tiêu | Học từ ngay trong lúc làm đề | Quen áp lực và hình thức phòng thi |
| Chế độ | Practice: chấm từng câu, có hint | Exam: chấm cuối bài, không hint |
| Thời gian | Không giới hạn, hiện đồng hồ đếm lên | 1,25 phút/câu như đề thật (Ngày 1: 23 phút) |
| Điều kiện mở | Mini 3 ≥ 80% | Hoàn thành Đề 1 |

### 4.6 Cơ chế vừa học từ vừa quen form đề

Thay vì chỉ "bài đọc một bên, câu hỏi một bên", mỗi đề được bọc thêm các lớp trước / trong / sau khi làm:

| Mã | Cơ chế | Mô tả | Đề 1 | Đề 2 |
|---|---|---|---|---|
| V1 | Mồi từ trước bài đọc | Trước mỗi bài, nối nhanh 5 từ khóa của bài với nghĩa (30 giây, không tính điểm) | ✅ | — |
| V2 | Tra từ ngay trong bài | Từ của ngày được gạch chân chấm trong bài đọc. Chạm → xem nghĩa EN miễn phí, nghĩa VN tính như 1 hint. Từ đã tra tự vào Sổ từ | ✅ | — |
| V3 | Câu hỏi nối tiếp | Sau câu từ vựng / paraphrase, hiện 1 câu nhanh 10 giây về chính từ đó (nghĩa / collocation / word form). Không tính điểm đề | ✅ | — |
| V4 | Câu luyện từ theo form đề | Mỗi bài đọc chèn thêm 2 câu "The word X in paragraph N is CLOSEST / OPPOSITE in meaning to…" cho từ của ngày chưa có trong đề gốc. Đánh dấu "câu luyện thêm", không tính điểm | ✅ | — |
| V5 | Giải thích có lớp từ vựng | Sau khi chấm, mỗi câu có thêm "Từ cần nhớ" (từ khó trong câu hỏi / đáp án) và "Cặp paraphrase" giữa bài và đáp án (VD *older generation* ↔ *the elderly*). Nút thêm vào Sổ từ | ✅ ngay sau từng câu | ✅ sau khi nộp |
| V6 | Phiếu tô đáp án | Lưới số câu × A–D như phiếu trả lời trắc nghiệm, tô / nhảy câu, câu chưa tô hiện rõ | — | ✅ |
| V7 | Đọc lại dạng cloze | Sau khi nộp, bài đọc hiện lại với 6–8 từ bị che (ưu tiên từ đã tra và từ nằm trong câu sai), chọn từ trong khung để điền | ✅ | ✅ |
| V8 | Sổ từ | Gom từ đã tra (V2), từ trong câu sai, từ đánh dấu (V5). Từ trong Sổ từ được hỏi trước ở Round cuối (4.7) và vào Warm-up ngày sau | ✅ | ✅ |

**Bố cục màn làm đề:**
1. **Đọc trước:** mở bài đọc toàn màn hình (có V1, V2), bấm "Làm câu hỏi" khi sẵn sàng.
2. **Làm câu:** bài đọc thu thành ngăn mở / đóng (máy tính: cột bên; điện thoại: ngăn kéo dưới). Câu hỏi nhắc "paragraph N" → chạm để cuộn tới và tô sáng đoạn đó (chỉ Đề 1).
3. **Chuyển bài:** hết câu của một bài thì sang màn đọc trước của bài tiếp theo.

**Ưu tiên làm:**
1. Dùng được dữ liệu sẵn có: V2, V5, V6, V7, V8.
2. Cần soạn thêm ít dữ liệu: V1 (5 từ khóa / bài), V3.
3. Cần soạn thêm câu hỏi: V4.

**Dữ liệu cần bổ sung (Claude soạn, giáo viên duyệt):**
- Passage: `keyVocab[]` (5 từ mồi cho V1).
- Câu đề gốc: `keyWords[]` (từ cần nhớ) và `paraphrasePairs[]` (cặp bài ↔ đáp án) cho V5.

### 4.6b Tình trạng cài đặt (cập nhật 05/10/2026)

**Đã làm 04/10/2026**
- **V2 Tra từ ngay trong bài** (Đề 1): từ của ngày gạch chấm, chạm xem nghĩa EN + VN + phát âm. Từ đang được hỏi bị ẩn tra cứu cho tới khi kiểm tra xong. Từ đã tra được lưu và hỏi trước ở Round cuối.
- **Dịch nghĩa sau khi kiểm tra**: mỗi câu có dịch câu hỏi + nghĩa từng đáp án. Bản dịch cả bài đọc chỉ mở khi đã làm xong các câu của bài đó (tránh lộ đáp án câu khác); trang kết quả luôn mở.

**Làm xong 05/10/2026 — V1, V3, V4, V5, V6, V7, V8 đều đã chạy**

| Mã | Cách cài đặt | Nguồn dữ liệu |
|---|---|---|
| V1 | Màn mồi từ 30 giây trước mỗi bài đọc của Đề 1, nối 5 từ ↔ nghĩa, hết giờ hoặc nối xong thì mở bài | `Passage.keyVocab` nếu khai báo, không thì tự lấy từ của ngày xuất hiện trong bài |
| V3 | Sau khi bấm Kiểm tra ở câu nghĩa / paraphrase trong Đề 1, hiện một câu nhanh 10 giây về chính từ đó; không tính điểm đề nhưng vẫn vào lịch ôn từ | Sinh runtime từ `VocabItem` (nghĩa / collocation / word family), xoay vòng theo vị trí câu |
| V4 | Cuối nhóm câu của mỗi bài đọc trong Đề 1, chèn 2 câu CLOSEST / OPPOSITE in meaning, gắn nhãn “Câu luyện thêm · không tính điểm” | Sinh runtime từ `synonyms` / `antonyms` của từ xuất hiện trong bài mà đề gốc chưa hỏi |
| V5 | Khối “Từ cần nhớ ở câu này” + “Cặp paraphrase” trong phần giải thích, mỗi từ có nút **+ Sổ từ** | `Question.keyWords` / `paraphrasePairs` nếu khai báo, không thì tự quét từ của ngày trong đề bài & đáp án |
| V6 | Phiếu tô đáp án bật / tắt ở Đề 2: lưới số câu × A–D, tô trực tiếp, câu chưa tô nền hồng, chạm số câu để nhảy tới | Tự sinh từ danh sách câu của đề |
| V7 | Sau khi nộp Đề 1 và Đề 2: bài đọc hiện lại, che tối đa 7 từ (ưu tiên từ đã tra và từ ở câu sai), chọn từ trong khung để điền; không tính điểm | Sinh runtime, `clozePassage()` |
| V8 | Trang **Sổ từ** `/wordbook`: gom từ đã tra (V2), từ làm sai hoặc phải xem nghĩa VN, từ tự đánh dấu (V5). Lọc theo nguồn, bỏ từ khỏi sổ, xem lịch ôn từng từ | `StudentProgress.wordBook` |

**Các phần khác đã làm 05/10/2026**
- **Warm-up liên ngày**: mục 2.2 đã chạy. `VocabMastery` có thêm `level`, `nextReviewAt`, `lastAt`; khoảng ôn 1 / 1 / 3 / 7 ngày, sai thì tụt bậc, dùng hint bậc 3 thì luôn quay lại ngày mai, đúng 3 lần liên tiếp thì `mastered` và rút khỏi pool. Warm-up xuất hiện từ ngày thứ hai, lấy tối đa 10 từ đến hạn của các ngày trước (ưu tiên từ trong Sổ từ), câu hỏi sinh runtime, không gate bài sau.
- **Biểu đồ kết quả**: thay vì radar, dùng **thanh ngang một trục** cho tỉ lệ đúng theo dạng bài — dễ đọc hơn khi có 5–8 dạng, nhãn số đặt trực tiếp, dạng dưới 70% tô màu cảnh báo kèm chữ “cần ôn” nên nghĩa không chỉ nằm ở màu.
- **Màn hình giáo viên** `/gv`: xem toàn bộ dữ liệu làm bài (xem mục 15).
- **Đăng nhập + lưu kết quả trên server** (mục 16): mỗi học sinh một tài khoản; tiến độ vẫn giữ bản localStorage để làm bài khi mạng chập chờn, đồng thời đẩy lên server. Khoá localStorage `td-english:v2`, có migrate từ `v1`.

### 4.7 Round cuối — Gõ từ

> Chốt của PO 04/10/2026.

| Hạng mục | Quy tắc |
|---|---|
| Phạm vi | Tối đa 20 từ của ngày: từ đã tra trong bài đọc và từ hay sai được chọn trước, phần còn lại lấy ngẫu nhiên |
| Đề bài | Mỗi từ hiện **một** trong hai dạng, xen kẽ ngẫu nhiên: (a) **nghe** — máy đọc từ (Web Speech API), có nút nghe lại; (b) **nghĩa tiếng Việt**. Đã xác nhận với PO 04/10/2026 |
| Ô trả lời | Gạch `_ _ _` thể hiện số ký tự của từ. Cụm nhiều từ hiện khoảng cách giữa các từ (VD *nuclear family* → `_ _ _ _ _ _ _   _ _ _ _ _ _`); dấu gạch nối hiện sẵn (VD *open-minded*) |
| Gợi ý | **Không có**, kể cả nút hint và nghĩa EN |
| Thời gian | Đếm ngược **15 giây/từ**. Hết giờ → tính sai, tự sang từ tiếp theo |
| Chấm | So khớp chính xác sau khi bỏ khoảng trắng thừa, không phân biệt hoa / thường; chấp nhận các biến thể đã khai báo (`answers: ["colour","color"]`) |
| Phản hồi | Sau mỗi từ hiện đúng / sai kèm đáp án 1,5 giây rồi tự chuyển; không dừng để giải thích |
| Điều kiện pass | Số từ đúng / tổng số từ **≥ 90%** |
| Chưa đạt | Làm lại cả round: xáo lại thứ tự, đổi dạng đề bài (từ đã hỏi bằng nghe thì lần sau hỏi bằng nghĩa và ngược lại). Từ sai vào Sổ từ |
| Hoàn thành ngày | Ngày học chỉ tính hoàn thành khi pass Round cuối |

Lưu ý: nghĩa tiếng Việt có thể ứng với nhiều từ tiếng Anh (VD "giữ gìn" → preserve / maintain). Số gạch giúp phân biệt; nếu vẫn trùng độ dài thì khai báo thêm đáp án chấp nhận.

### 4.8 Tác động lên nội dung Ngày 1

| Hạng mục | Xử lý |
|---|---|
| m1-2 (nối emoji), m1-10, m1-11 (trọng âm, phát âm), m2-10 (nghe chép), m3-6, m3-7 (tìm lỗi sai) | Bỏ |
| m3-11 (giao tiếp) | Viết lại thành M3.3 |
| m3-10 (kết hợp câu) | Viết lại thành M3.4 |
| m3-3, m3-4 (đồng / trái nghĩa câu đơn) | Đặt vào đoạn ngắn (M3.6) |
| Bước Đọc sâu (s1–s15) | Bỏ bước. Chuyển s9–s12 vào Mini 3 (M3.7, M3.8); bỏ s1–s8, s13–s15 |
| Soạn mới | M3.1, M3.2, M3.3, M3.9 |
| 6 section bài đọc hiện tại | Gộp thành Đề tổng hợp 1 và 2 theo 4.5 |
| Round cuối | Làm mới theo 4.7, dùng dữ liệu từ vựng sẵn có (nghĩa VN, phát âm) |

---

## 5. Ràng buộc chấm máy 100%

### 5.1 Dạng được dùng

**Chấm bằng so khớp lựa chọn**
- MCQ 4 đáp án (dùng cho hầu hết dạng)
- True / False / Not Given
- Odd one out
- Chọn nhiều đáp án (checkbox)

**Chấm bằng so khớp vị trí (kéo thả / sắp xếp)**
- Match 2 cột (từ ↔ nghĩa, từ ↔ hình, câu ↔ đoạn)
- Sắp xếp câu thành đoạn / hội thoại (jumbled sentences) — Exam hiển thị thành MCQ chọn thứ tự A–D
- Sắp xếp từ thành câu (word ordering)
- Insert sentence (chọn vị trí)
- Phân loại vào nhóm (drag to category)
- Paragraph matching

**Chấm bằng so khớp chuỗi đơn — CHỈ 1 TỪ**
- Điền 1 từ vào chỗ trống
- Scrambled letters → gõ lại từ
- Dịch ngược VN → EN
- Word form
- Dictation 1 từ

> Chuẩn hóa trước khi so: bỏ khoảng trắng dư, không phân biệt hoa/thường, chấp nhận danh sách đáp án hợp lệ (`answers: ["colour","color"]`).

### 5.2 Dạng bị loại & phương án thay thế

| Dạng bỏ | Thay bằng |
|---|---|
| Sentence rewriting tự do | Bỏ — đề từ 2025 không còn dạng viết lại câu |
| Sentence combining tự do | Word ordering (kéo thả mảnh câu) |
| Summary completion tự viết | Điền 1 từ / chọn từ trong word bank |
| Viết đoạn | Bỏ hoàn toàn |

Giữ đủ kiến thức thi THPTQG — chỉ đổi **cách trả lời**, không đổi **kiến thức kiểm tra**.

---

## 6. Hệ thống Hint (áp dụng cho TẤT CẢ Mini Test)

Nguyên tắc: hint luôn có, nhưng **có giá**. Dùng hint vẫn tính đúng, chỉ giảm điểm và **từ đó không được `mastered`** → vẫn quay lại warm-up ngày sau.

### 6.1 Thang 3 bậc

| Bậc | Nội dung | Trừ điểm |
|---|---|---|
| Hint 1 — Nhẹ | Loại 1 đáp án sai / chữ cái đầu / số âm tiết | -10% |
| Hint 2 — Trung bình | Hình/emoji · câu ví dụ khoét từ · định nghĩa tiếng Anh | -25% |
| Hint 3 — Mạnh | **Nghĩa tiếng Việt** · phát âm · còn 2 lựa chọn | -50% |

Tiếng Việt đặt ở bậc cuối để tránh học sinh dịch thay vì ghi nhớ bằng tiếng Anh — nó là lưới an toàn, không phải đường tắt.

### 6.2 Thư viện loại hint (mỗi từ 4-6 loại)

- **Ngữ nghĩa**: nghĩa tiếng Việt · định nghĩa tiếng Anh đơn giản · synonym dễ hơn · antonym
- **Hình ảnh**: ảnh minh họa · emoji/icon · sơ đồ nhỏ cho từ trừu tượng
- **Cấu trúc từ**: chữ cái đầu + số ký tự · số âm tiết + trọng âm · word family · gốc từ/tiền tố-hậu tố
- **Ngữ cảnh**: câu trong passage có khoét từ · câu ví dụ mới · collocation thường gặp
- **Âm thanh**: phát âm từ (Web Speech API) · phát âm câu · IPA
- **Mnemonic**: liên tưởng tiếng Việt (`reluctant` → "rị lại, không chịu tiến") · câu chuyện nhỏ

### 6.3 Hint theo từng dạng bài

| Dạng bài | Hint 1 | Hint 2 | Hint 3 |
|---|---|---|---|
| Chọn nghĩa đúng | Loại 1 đáp án | Hình / emoji | Nghĩa tiếng Việt |
| Match nghĩa | Nối sẵn 1 cặp dễ nhất | Hình cho các từ | Nghĩa tiếng Việt toàn bộ |
| Odd one out | "3 từ cùng chủ đề X" | Nghĩa tiếng Anh 4 từ | Nghĩa tiếng Việt 4 từ |
| Điền chỗ trống | Chữ cái đầu + số ký tự | Câu ví dụ khác | Nghĩa VN + 3 từ để chọn |
| Scrambled letters | Hiện chữ cái đầu | Số âm tiết + nghĩa EN | Nghĩa tiếng Việt |
| Dịch ngược VN→EN | Chữ đầu + số ký tự | Phát âm | Hiện 3 đáp án để chọn |
| Word form | Cho biết loại từ cần (n/v/adj) | Hiện word family | Hiện đáp án, gõ lại |
| Collocation | Loại 2 đáp án | Câu mẫu cùng cấu trúc | Nghĩa VN của cả cụm |
| Cloze thông báo / tờ rơi | Loại 1 đáp án | Nêu loại kiến thức cần ("chỗ này cần danh từ", "sau *look forward to* là V-ing") | Còn 2 lựa chọn |
| Sắp xếp câu / hội thoại | Cho sẵn câu mở đầu | Chỉ ra từ nối / đại từ nối các câu | Còn 2 thứ tự |
| Điền câu / mệnh đề | Nêu chức năng chỗ trống (bổ nghĩa cho danh từ, chỉ kết quả…) | Loại 1 đáp án sai ngữ pháp | Còn 2 lựa chọn |
| Synonym / Antonym | Loại 1 đáp án | Nghĩa EN của từ in đậm | Nghĩa tiếng Việt |
| Vocab in context | Highlight từ khóa trong câu | Nghĩa EN của từ | Nghĩa VN + loại 2 đáp án |
| Flashcard tốc độ | — (đo phản xạ) | — | 1 lần "skip" miễn phí |
| Dictation | Phát lại chậm 0.7x | Số từ còn thiếu | Chữ cái đầu mỗi từ |

### 6.4 Chống lạm dụng hint

- **Quota**: tối đa dùng hint cho 50% số câu/bài. Hết quota → khóa nút hint.
- **Minh bạch**: sau khi chấm báo rõ "Điểm thô 9/10 → Sau hint 7.5/10. Dùng 3 hint."
- **Exam Mode (Đề tổng hợp 2) và Round cuối không có hint** — giống thi thật.
- **Hint delay 5 giây**: nút hint chỉ sáng sau khi ở câu đó 5 giây → chống bấm theo phản xạ.
- Từ dùng Hint 3 → tự động vào pool ôn lại ngày mai.

---

## 7. Tầng giải thích đáp án (Đề tổng hợp)

Mỗi câu hỏi có 4 lớp hỗ trợ:

1. **Hint** — dùng trong lúc làm, trừ điểm nhẹ. VD "Chú ý từ *although* đầu câu" / "Tìm ở đoạn 3". Dạy kỹ năng định vị thông tin.
2. **Giải thích đáp án đúng** — kèm **trích dẫn chính xác câu trong passage**, highlight lên bài đọc khi bấm vào.
3. **Phân tích bẫy của đáp án sai (distractor analysis)** — mỗi đáp án sai ghi rõ lý do. VD: *"B sai vì bài nói 'some students', không phải 'all students' — bẫy khái quát hóa quá mức."*
4. **Chiến lược làm dạng bài** — tái sử dụng cho mọi câu cùng `strategyTag`. VD Inference: *"Đáp án đúng luôn suy ra được từ bài, không thêm thông tin mới. Loại ngay đáp án có 'always', 'never', 'the only'."*

### 3 chế độ làm bài

| Mode | Hành vi |
|---|---|
| **Practice** | Làm từng câu, chấm ngay, xem giải thích liền → để học |
| **Exam** | Làm hết mới chấm, đồng hồ đếm ngược, không hint → thi thử |
| **Review** | Chỉ làm lại các câu đã sai trước đó → sửa lỗi |

### Báo cáo sau mỗi bài
- Điểm theo **từng dạng bài** (biểu đồ radar) → biết yếu Inference hay yếu Word form
- Điểm theo **phần đề P1–P6** → biết yếu phần nào của đề thật
- **Thời gian trung bình/câu** → phát hiện dạng làm quá chậm
- **Danh sách từ chưa vững** → đẩy vào pool warm-up ngày mai
- **Gợi ý hành động**: "Bạn sai 3/4 câu Reference. Đọc lại chiến lược và làm Review Mode."

---

## 8. Kiến trúc màn hình (9 màn)

```
1. Profile Picker      → chọn 1 trong 5 học sinh
2. Dashboard          → danh sách ngày học, trạng thái từng ngày, streak
3. Day Detail          → Warm-up · Mini 1/2/3 · Đề tổng hợp 1/2 · Round cuối (unlock dần)
4. Vocab Study         → danh sách từ + hint đầy đủ
5. Test Runner         → màn làm bài chung mọi dạng (timer, hint, progress)
6. Result              → điểm, radar theo dạng bài, từ cần ôn, gợi ý
7. Review Mode         → làm lại riêng câu đã sai
8. Progress            → tổng quan các ngày, biểu đồ, từ đã mastered, Sổ từ
9. (Bỏ 04/10/2026) Export JSON — app gửi trực tiếp cho học sinh
```

---

## 9. Tech Stack

| Thành phần | Lựa chọn | Lý do |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Deploy Vercel 1 lệnh |
| CSS | Tailwind CSS | UI nhanh, responsive sẵn (học sinh dùng điện thoại) |
| State | Zustand + persist middleware | Tự đồng bộ localStorage |
| Kéo thả | dnd-kit | Hoạt động tốt trên mobile |
| Biểu đồ | Recharts | Radar + tiến độ |
| Âm thanh | Web Speech API | Miễn phí, có sẵn trong browser |
| Backend | Không | Không cần |

---

## 10. Cấu trúc dữ liệu

### 10.1 Nội dung (build-time, từ file .md → JSON)

**VocabItem** — hint gắn vào TỪ VỰNG, không gắn vào từng câu hỏi → nhập 1 lần dùng cho 15 dạng bài:

```
word, ipa, partOfSpeech, meaningVi, meaningEn,
synonyms[], antonyms[], wordFamily[], emoji, imageUrl,
collocations[], exampleFromPassage, exampleNew,
syllableCount, stressPosition, mnemonicVi, etymology
```

**Question**:

```
id, dayId, skillType, format, difficulty (1-3),
targetWords[], stem, options[], answer | answers[],
hint, explanation, distractorNotes[], strategyTag, sourceRef
hintLevels: [{type:'eliminate'},{type:'image'},{type:'meaningVi'}]
```

`hintLevels` chỉ khai báo **loại** hint — hệ thống tự lấy dữ liệu tương ứng từ `VocabItem`.
`strategyTag` là chìa khóa để sinh báo cáo theo dạng bài và gợi ý ôn tập.

**Bổ sung cho khuôn đề mới (đề xuất 04/10/2026):**

- **Passage** thêm `kind`: `article | notice | leaflet | dialogue | letter | paragraph` → app trình bày đúng kiểu văn bản (thông báo, tờ rơi, thư…).
- Văn bản P1, P2, P4 đánh dấu chỗ trống trong text bằng `(1)`, `(2)`…; **Question** thêm `blankNo` để liên kết câu hỏi với chỗ trống.
- **Question** thêm `examPart`: `P1`–`P6` (bỏ trống với câu thuần học từ) → báo cáo điểm theo phần đề.
- Câu sắp xếp (P3) lưu thứ tự đúng một lần; Exam tự sinh 3 thứ tự nhiễu để thành MCQ A–D.

### 10.2 Tiến độ (runtime, localStorage per student)

```
key: "eng7d:v1:<studentId>"
{
  studentId, studentName,
  days: { 1: { warmup:{...}, mini1:{...}, mini2:{...}, mini3:{...}, de1:{...}, de2:{...}, final:{...} } },
  wordBook: [ { word, dayId, source: "lookup" | "wrong" | "marked", addedAt } ],  // Sổ từ (mục 4.6 V8)
  // mỗi bài: { status, attempts, bestScore, rawScore, hintsUsed, timeSpent, wrongQuestionIds[], lastAt }
  vocabMastery: { "reluctant": { correct, wrong, hint3Used, level, nextReviewAt, mastered } },
  wrongBank: [ { questionId, dayId, format, strategyTag, wrongCount, lastWrongAt } ],
  streak, totalTimeSpent, updatedAt
}
```

Cập nhật 05/10/2026: localStorage chỉ là **bản làm việc** của tài khoản đang đăng nhập (một khoá duy nhất `td-english:v2`, có thêm `ownerId` để biết tiến độ thuộc về ai). Bản chuẩn nằm trên server theo từng tài khoản — xem mục 16. Đã bỏ nút Export JSON 04/10/2026.

---

## 11. Định dạng file .md giáo viên cung cấp

Giáo viên **chỉ cần gửi Passage + bảng Vocabulary**. Phần Questions do Claude sinh, giáo viên review lại.

````markdown
# Day 1: [Tiêu đề bài học]

## Passage
[Toàn văn bài đọc]

## Vocabulary
| Word | IPA | POS | Nghĩa VN | Nghĩa EN | Synonym | Antonym | Word family | Emoji | Collocation | Câu trong bài | Câu ví dụ mới | Mnemonic VN |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| reluctant | /rɪˈlʌktənt/ | adj | do dự, không muốn | not willing to do sth | unwilling, hesitant | eager, willing | reluctance (n), reluctantly (adv) | 😕 | be reluctant to V | She was reluctant to leave. | He was reluctant to answer. | "rị lại" - không chịu tiến |
````

Nếu giáo viên chỉ có `Word + Nghĩa VN`, Claude sẽ tự bổ sung các cột còn lại (IPA, synonym, mnemonic...) để giáo viên review.

---

## 12. Quyết định về ảnh minh họa

MVP dùng **emoji + icon** thay ảnh thật — không cần hosting, load tức thì, vẫn hiệu quả ghi nhớ. Field `imageUrl` để trống sẵn, sau này điền link Unsplash/Pexels nếu cần.

---

## 13. Việc còn mở (chờ giáo viên chốt)

- [x] **Số học sinh** — chốt 05/10/2026: mỗi học sinh một tài khoản đăng nhập, không còn Profile Picker chọn trong máy
- [x] **Số ngày & chủ đề** — giáo viên tự định nghĩa theo ngày (chốt 04/10/2026); bỏ hẳn khung 7 ngày 05/10/2026
- [ ] **File .md từ vựng + passage cho các ngày tiếp theo** — đang chờ (giáo viên gửi, Claude sinh đề)
- [ ] **Review bộ câu hỏi Ngày 1 & Ngày 2** — Claude đã sinh, giáo viên chưa duyệt
- [x] **Đăng nhập để giữ kết quả khi đổi máy** — chốt 05/10/2026: **tên đăng nhập + mật khẩu**, kết quả lưu trên server (xem mục 16)
- [ ] **Cắm database khi deploy** — cần tạo một Postgres (Neon / Supabase / Vercel Postgres) và đặt `DATABASE_URL` + `SESSION_SECRET` trên Vercel
- [x] Nguồn câu hỏi — Claude sinh, giáo viên review
- [x] Chấm tự luận — không có dạng tự luận
- [x] Vị trí project — repo riêng `nnht-dtt/internalprj`, deploy Vercel tên `learn-english-daily` (chốt 05/10/2026)

### Số dạng bài cho MVP (cập nhật 04/10/2026)
Giữ: MCQ · fill-blank · match · scramble · odd-one-out · word-form · flashcard · reading MCQ · cloze khung từ · jumbled-order · insert-sentence · true-false (nghĩa từ) · tap-segment (tham chiếu)
Thêm: cloze thông báo / tờ rơi (P1–P2) · sắp xếp hội thoại / thư (P3) · điền mệnh đề vào đoạn (P4) · phiếu tô đáp án (Exam) · Round cuối gõ từ (nghe / nghĩa VN, 15 giây, không hint)
Bỏ: error-ID · rewrite-MCQ · phát âm · trọng âm · dictation · True/False/Not Given · nối tiêu đề · phân loại quan điểm

---

## 14. Các bước triển khai

1. Dựng khung Next.js + Tailwind + Zustand, deploy Vercel lấy URL sớm
2. Nhận file .md từ vựng → viết script convert .md → JSON
3. Claude sinh bộ câu hỏi theo từng ngày → giáo viên review
4. Làm Profile Picker + Dashboard + Vocab Study (chạy được với dữ liệu thật)
5. Làm Test Runner — ưu tiên format MCQ trước, rồi fill-blank, match, ordering
6. Làm hệ thống Hint 3 bậc + logic trừ điểm
7. Làm Result + biểu đồ radar + Review Mode
8. Làm spaced repetition (vocabMastery + warm-up)
9. ~~Làm Export JSON~~ (bỏ 04/10/2026)
10. Nhập nội dung các ngày giáo viên định nghĩa, test với 1 học sinh thật, điều chỉnh

---

## 15. Màn hình giáo viên (`/gv`)

Chỉ tài khoản giáo viên vào được (xem mục 16). Dữ liệu lấy từ server nên giáo viên xem được
mọi học sinh từ máy của mình, không cần ngồi đúng máy học sinh.

| Khối | Nội dung |
|---|---|
| Danh sách học sinh | Tên, tên đăng nhập, hoạt động gần nhất · **+ Tạo tài khoản** · **Đặt lại mật khẩu** · **Xóa** (có hỏi lại) · **Xem kết quả** |
| Công cụ xem trước | Công tắc **Mở khóa mọi bài trên máy này** |
| Tổng quan | Bài đã xong / tổng số · tổng thời gian học · số từ đã thuộc · số từ đến hạn ôn và số từ trong Sổ từ |
| Từng ngày (mở / đóng) | Bảng mỗi bài: trạng thái, số lần làm, điểm tốt nhất, điểm lần cuối, điểm chưa trừ hint, số câu dùng gợi ý, thời gian, số câu còn sai, thời điểm làm |
| Câu từng làm sai | Theo ngày, sắp theo số lần sai: đề bài, đáp án đúng, dạng bài, lần sai gần nhất |
| Số lần sai theo dạng bài | Thanh ngang, dài nhất là dạng cần ôn thêm |
| Điểm tốt nhất từng bài | Thanh ngang so sánh mọi bài của mọi ngày |
| Từ vựng | Bảng lọc **Đã học / Cần ôn / Đã thuộc**: số lần đúng, sai, đúng liên tiếp, có phải xem nghĩa VN không, ngày ôn kế tiếp, trạng thái |

Lối tắt cũ `/dashboard?gv=1` vẫn dùng được để bật nhanh chế độ mở khóa.

## 16. Đăng nhập và lưu kết quả (chốt 05/10/2026)

Chốt của giáo viên: **tài khoản tên đăng nhập + mật khẩu đơn giản**, không dùng email / Google.

### 16.1 Tài khoản

| Hạng mục | Quy tắc |
|---|---|
| Tên đăng nhập | 3–32 ký tự, chỉ chữ không dấu, số, `.`, `_`, `-`; không phân biệt hoa thường |
| Mật khẩu | Ít nhất 6 ký tự, băm bằng **scrypt** (có sẵn trong Node, không cần thư viện ngoài) |
| Ai tạo được | Học sinh tự tạo ở `/login`, **hoặc** giáo viên tạo sẵn trong `/gv` rồi đưa tên đăng nhập + mật khẩu |
| Quên mật khẩu | Giáo viên đặt lại trong `/gv`. Không có email nên không có luồng tự khôi phục |
| Ai là giáo viên | Tên đăng nhập nằm trong biến môi trường `TEACHER_USERNAMES` (mặc định `giaovien`) |
| Phiên đăng nhập | Cookie `td_session` HttpOnly + SameSite=Lax, ký HMAC-SHA256 bằng `SESSION_SECRET`, hạn 60 ngày |
| Báo lỗi đăng nhập | Luôn nói chung “tên đăng nhập hoặc mật khẩu không đúng”, để không ai dò được danh sách tài khoản |

### 16.2 Cách lưu tiến độ

localStorage vẫn là **bản làm việc** (làm bài không bị đứng khi mạng chập chờn), server giữ **bản chuẩn**:

1. Đăng nhập → gọi `GET /api/progress`. Nếu máy đang giữ tiến độ của tài khoản khác, hoặc bản server mới hơn (`updatedAt`), thì lấy bản server.
2. Mỗi lần tiến độ đổi → sau ~1,2 giây đẩy cả khối lên `PUT /api/progress` (gộp các thay đổi liên tiếp). Thanh trên hiện “Đang lưu… / Đã lưu”.
3. Đăng xuất → xóa tiến độ khỏi máy để người sau không thấy kết quả của người trước.

Cách giải xung đột: **bản mới hơn thắng**. Đủ cho một học sinh một tài khoản; nếu cùng một tài khoản làm bài trên hai máy cùng lúc thì bản lưu sau ghi đè bản trước.

### 16.3 Kỹ thuật

| Phần | Chi tiết |
|---|---|
| API | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `GET`/`PUT /api/progress` · `GET`/`POST`/`PATCH /api/teacher/students` |
| Bảng dữ liệu | `users(id, username, password_hash, display_name, role, created_at)` · `progress(user_id, data jsonb, updated_at)` — tự tạo khi khởi động |
| Nơi lưu | Postgres khi có `DATABASE_URL` (Neon / Supabase / Vercel Postgres). Để trống thì lưu `.data/db.json` — **chỉ dùng khi chạy thử trên máy** |
| Biến môi trường | `SESSION_SECRET` (bắt buộc khi deploy), `DATABASE_URL`, `TEACHER_USERNAMES`. Xem `.env.example` |

### 16.4 Còn thiếu

- Chưa có đổi mật khẩu từ phía học sinh (hiện phải nhờ giáo viên đặt lại).
- Chưa giới hạn số lần đăng nhập sai. Với lớp nội bộ thì tạm ổn; mở rộng ra ngoài thì nên thêm.

---

## 17. Việc tồn đọng — chờ sửa sau

> Ghi ngày 05/10/2026 sau đợt rà soát bằng ba lượt kiểm tra song song: chất lượng
> nội dung đề (đối chiếu `material/Unit 2 - Reading.md`), câu chữ hiển thị, và
> test tự động. **Những lỗi đã sửa không ghi ở đây** — mục này chỉ liệt kê việc
> còn mở, để làm sau.

### 17.1 Cụm từ còn thiếu trong đề

Phần cụm từ hiện có (28 cụm Ngày 1, 24 cụm Ngày 2) phủ tốt nhóm *phrasal verb +
giới từ*, nhưng còn thiếu hai nhóm: **collocation danh–động** và **cấu trúc ngữ
pháp bị hỏi trực tiếp trong đề**. Danh sách dưới đây do lượt rà soát đề xuất,
**giáo viên cần duyệt lại trước khi đưa vào**.

**Ngày 1 (bài đọc 1–3)**

| Cụm | Câu gốc trong bài | Vì sao nên thêm |
|---|---|---|
| `insist that sb + V (nguyên thể)` | "A grandmother may insist that everyone **eat** dinner together at six" | Giả định thức — điểm ngữ pháp hay ra thi |
| `the advantages outweigh the disadvantages` | "many families report that the advantages outweigh the disadvantages" | Chính là từ được hỏi ở Question 5 |
| `the main breadwinner(s)` | "the parents are the main breadwinners" | Collocation cố định |
| `create lasting tension` | "can create lasting tension" | Collocation danh–động |
| `set clear rules about` | "Families that set clear rules about privacy, chores and money" | |
| `look for compromises` | "they look for compromises that everyone can accept" | |
| `be cared for` | "the elderly are cared for at home" | Bị động của cụm động từ |
| `make one's own decisions` | "greater freedom to make their own decisions" | |
| `be imposed without discussion` | "When rules are imposed without discussion" | |
| `damage trust` | "which damages trust even further" | |
| `struggle at school` | "more likely to lose sleep and struggle at school" | |
| `approach adulthood` · `be given more independence` | "they should be given more independence… as they approach adulthood" | |
| `be described as` | "Today's teenagers are often described as digital natives" | |
| `be centred on` | "one that is centred not on music or clothes but on screens" | |
| `bring sb together` ↔ `push sb apart` | "screens can bring generations together rather than pushing them apart" | Cặp trái nghĩa, hay hỏi OPPOSITE |

Thêm cả `be advised to`, `set strict limits on`, `take sth away as a punishment`.

**Ngày 2 (bài đọc 4–6)** — nhóm "band cao", nơi lấy điểm 8–9:

| Cụm | Câu gốc trong bài |
|---|---|
| `carry symbolic weight` | "career choices carry symbolic weight" |
| `be shaped by` | "an older generation shaped by economic hardship" |
| `be viewed with suspicion` | "Careers in digital media… are viewed with suspicion by older relatives" |
| `abandon one's ambitions in order to please sb` | "young people who abandon their own ambitions in order to please their families" |
| `a loss of direction` · `last well into adulthood` | "a loss of direction that can last well into adulthood" |
| `an unprecedented range of options` | "the modern economy offers young people an unprecedented range of options" |
| `treat sth as` | "When families treat career choice as a conversation instead of a command" |
| `gain autonomy` · `retain an asset` | "the young person gains autonomy while the family retains its most valuable asset" |
| `the division of labour` | "the division of labour within the family" |
| `leave few alternatives` | "economic conditions left few alternatives" |
| `retain its assumptions` | "often retain its assumptions" (từ được hỏi ở Question 37) |
| `be resolved through negotiation` | "is usually resolved through negotiation" (từ được hỏi ở Question 47) |
| `hold sth sacred` | "a rejection of what it holds sacred" |
| `interpret sth through that lens` · `label sb as` | "will interpret everything she says through that lens" |
| `a different vantage point` | "a different vantage point is not a moral failure" |

### 17.2 Nhóm từ nối gần như vắng mặt

Cả hai ngày **chưa có cụm từ nối nào**, dù đề thi luôn có câu điền từ nối. Các
từ sau đều xuất hiện trong bài và nên được đưa vào: `whereas`, `nevertheless`,
`however`, `moreover`, `furthermore`, `conversely`, `ironically`, `by contrast`
(đã có), `instead of` (đã có), `rather than` (đã có).

### 17.3 Phương án nhiễu còn quá dễ loại

Nhiều câu dạng `clozeChoice` dùng nhiễu kiểu "ghép giới từ bừa" — `lead for`,
`rooted at`, `In the eye for`, `At the eyes of`, `a key at`. Những cụm này
**không tồn tại trong tiếng Anh**, nên học sinh trung bình loại được ngay mà
không cần biết cụm đúng, làm câu hỏi mất khả năng đo lường.

Hướng sửa: thay ít nhất 1/4 số phương án bằng giới từ **thực sự tồn tại trong
một cụm khác**. Ví dụ với `the key to`: thay `a key at` bằng `the solution to`
hoặc `the key in`.

### 17.4 Câu chữ còn lại

Thuật ngữ tiếng Anh vẫn đứng một mình trong giao diện tiếng Việt, học sinh trung
bình có thể không nắm:

| Vị trí | Chữ hiện tại | Gợi ý |
|---|---|---|
| `DayView.tsx`, `WordBook.tsx` | "Mini test", "Warm-up", "Round cuối" | Giữ nếu coi là tên riêng của sản phẩm; nếu không thì Việt hóa |

### 17.5 Hạn chế kỹ thuật đã biết

- **Mật khẩu thật không được để trong `.env.example`** — file này được commit lên
  GitHub nên mọi giá trị trong đó là công khai, và xóa sau cũng không mất vì
  lịch sử git còn giữ. File chỉ nên chứa tên biến với giá trị rỗng.
- Token GitHub đang nằm trong URL remote của repo `BA-task`; nên thu hồi và
  chuyển sang Windows Credential Manager.
- Chưa có đổi mật khẩu từ phía học sinh (phải nhờ giáo viên đặt lại) — xem 16.4.
- Chưa giới hạn số lần đăng nhập sai — xem 16.4.
- Đường chạy qua Postgres thật chưa được test trên máy (không có Postgres local);
  chỉ test qua bản lưu file JSON. Được kiểm chứng gián tiếp khi deploy.

### 17.6 Cách tự kiểm tra nội dung đề

Chạy `npm run check-data`. Script `scripts/check-data.mjs` biên dịch dữ liệu thật
rồi kiểm tra: từ vựng trùng, thiếu trường bắt buộc, trọng âm nằm ngoài số âm
tiết, id câu hỏi trùng, `targetWords` trỏ tới từ không có trong ngày,
`strategyTag` chưa có mẹo làm bài, đáp án nằm ngoài danh sách lựa chọn, số chỗ
trống lệch số đáp án, và section trỏ tới câu không tồn tại.

Chạy lần đầu (05/10/2026) phát hiện 4 lỗi thật đã sửa: hai câu `clozeChoice`
đánh dấu chỗ trống sai kiểu nên không chấm được, câu `r29` nhắm tới từ chưa có
trong từ vựng Ngày 2, và một cụm bị khai trùng hai lần.

---

### 17.7 Lỗi từ test tự động — còn mở

Các lỗi chức năng, console, vùng chạm và header được nêu ở lượt test 05/10/2026
đã sửa; xem mục 18.5. Phạm vi chưa kiểm chứng vẫn ghi riêng ở 17.8.

### 17.8 Phạm vi test chưa phủ

Bộ test hiện có **không** chạm tới những phần sau — chưa có nghĩa là hỏng, chỉ là
chưa ai kiểm:

- **Postgres thật**: test chỉ chạy qua bản lưu file `.data/db.json`. Đường chạy
  khi có `DATABASE_URL` chưa được kiểm chứng trên máy.
- **Bản production (`next start`)**: bị chặn bản lưu file nên không chạy được
  trên máy khi chưa có Postgres.
- Mini 2, Mini 3.
- Đề tổng hợp 1 và 2: mồi từ (V1), câu nhanh 10 giây (V3), câu luyện thêm (V4),
  phiếu tô đáp án (V6), đọc lại dạng cloze (V7).
- Round cuối — Gõ từ; Warm-up đầu ngày.
- Màn giáo viên: đặt lại mật khẩu, xóa học sinh, xem kết quả của một học sinh.
- Phát âm `speak()` — trình duyệt headless không có audio.
- Các dạng câu kéo–thả dùng `@dnd-kit`; test mới xử lý được trắc nghiệm, nhập
  chữ và nối cột.

**Rủi ro phát hiện khi test:** app dùng `next/font/google` trong
`src/app/layout.tsx`, nên **máy không có mạng thì `next dev` trả lỗi 500 cho toàn
trang** vì không tải được `fonts.gstatic.com`. Trên Vercel không ảnh hưởng (font
được tải lúc build), nhưng nếu muốn chạy offline trên máy giáo viên thì phải
chuyển sang font nhúng sẵn.

### 17.9 Cách chạy lại test tự động

```bash
rm -rf .data
SESSION_SECRET=test-secret-at-least-16-chars TEACHER_USERNAMES=giaovien npx next dev -p 3210
# cửa sổ khác:
npx playwright test
```

Phải chạy `next dev`, **không dùng `next start`**: bản production chặn hẳn bản lưu
file nên không có Postgres thì không đăng nhập được. Tài khoản test:
`giaovien` / `Giaovien@1234` và `hoa.nguyen` / `hoa12345`.

Cấu hình ở `playwright.config.ts`, kịch bản ở `e2e/app.spec.ts`. Ảnh chụp và báo
cáo máy sinh ra nằm trong `e2e/screenshots/` và `e2e/findings.json`, cả hai đều
được gitignore.

---

## 18. Nhật ký rà soát 05/10/2026

> Ghi lại **toàn bộ** kết quả đợt kiểm tra, gồm cả lỗi đã sửa — để sau này còn
> truy được vì sao một đoạn code hay một câu chữ lại như hiện tại. Việc còn mở
> nằm ở mục 17.

Cách làm: ba lượt rà soát chạy song song, mỗi lượt một góc nhìn — chất lượng nội
dung đề (đối chiếu `material/Unit 2 - Reading.md`), câu chữ hiển thị cho người
dùng, và test tự động trên trình duyệt.

### 18.1 Nội dung đề — đã sửa

| Vấn đề | Hậu quả nếu để nguyên | Đã sửa |
|---|---|---|
| `point of view` khai 4 âm tiết, trọng âm đặt ở âm 4 | Trọng âm vượt số âm tiết → sơ đồ trọng âm ở màn học từ vẽ sai | 3 âm tiết, trọng âm 3. Thêm luật kiểm tra `stressPosition <= syllableCount` |
| Gợi ý của `d1p2-3` đánh số chỗ trống lệch với đáp án | Học sinh làm theo gợi ý sẽ điền sai | Đánh lại số cho khớp |
| `caution against` giải thích "thấy chữ to trong against" | Trong `against` không có "to" — câu giải thích vô nghĩa | Viết lại: `against` là giới từ nên sau nó bắt buộc V-ing |
| `be rooted in` lấy câu minh họa không chứa giới từ `in` | Dạy một đằng, minh họa một nẻo | Đổi headword thành `be deeply rooted` cho khớp câu trong bài |
| `optionsVi` chứa lời phê ("sai trật tự từ") | Khối tiêu đề "Dịch nghĩa" lại không có nghĩa dịch | Trả `optionsVi` về đúng nghĩa, lời phê chuyển sang `distractorNotes` |
| Thiếu dấu sở hữu: `sb footsteps`, `one distance` | Học sinh chép nguyên si sẽ viết sai tiếng Anh | `sb's footsteps`, `one's distance`, `one's own way` |
| `follow in sb's footsteps` khai trùng hai lần ở Ngày 2 | Hiện hai lần trong danh sách từ vựng | Bỏ bản trùng trong `phrases.ts`, giữ bản gốc trong `vocab.ts` |
| Trọng âm phrasal verb đặt ở động từ | Sai quy tắc: trọng âm rơi vào tiểu từ (grow **UP**) | `turn into`, `grow up`, `point out`, `switch off` về vị trí 2 |
| Số âm tiết lệch với IPA ở 4 cụm | Số liệu hiển thị sai | Đếm lại theo IPA |
| `be followed by` định nghĩa "to come before something else" | Đúng logic nhưng đọc ngược với nghĩa tiếng Việt | "to have something else come after it" |
| `would rather` chỉ chấp nhận đáp án `rather` | Học sinh viết `would sooner` (đúng) bị chấm sai | Thêm `sooner` vào đáp án chấp nhận |
| `stare at` khai `glance at` là trái nghĩa | Không phải trái nghĩa, chỉ khác thời lượng nhìn | Bỏ khỏi `antonyms`, nói rõ trong mẹo nhớ |

**Kết quả tích cực cần ghi nhận:** rà hết 14 câu hỏi mới × 2 ngày, **không có câu
nào sai đáp án, không có câu nào hai đáp án cùng đúng** — đây là lỗi nặng nhất
trong đề trắc nghiệm. Nguồn trích cũng trung thực với bài đọc gốc.

### 18.2 Một phát hiện SAI của lượt rà soát

Lượt rà soát nội dung báo rằng `optionsVi` **làm lộ đáp án** vì chứa các chuỗi
như "sai trật tự từ", và kết luận câu hỏi "mất hết giá trị đo lường".

**Kết luận này sai.** Kiểm chứng lại: `optionsVi` chỉ được đọc ở `Explanation.tsx`,
mà component đó chỉ render khi `reveal = isPractice && isChecked` — tức là **sau**
khi học sinh bấm Kiểm tra. Component hiển thị lựa chọn (`formats/Choice.tsx`)
không hề đọc `optionsVi`. Học sinh không bao giờ thấy mấy chữ đó trước khi trả lời.

Bản thân báo cáo cũng viết "**nếu** UI hiện `optionsVi` cùng lúc với lựa chọn" —
tức là suy đoán chứ không kiểm tra code. Vẫn sửa, nhưng vì lý do khác (sai vai trò
của khối "Dịch nghĩa"), không phải vì lộ đáp án.

**Bài học:** mỗi phát hiện phải kiểm chứng lại trên code trước khi sửa, nhất là
khi báo cáo dùng chữ "nếu". Đây cũng là lý do viết `scripts/check-data.mjs` chạy
trên dữ liệu thật thay vì chỉ tin vào việc đọc file — chính script này bắt được
lỗi khai trùng mà lượt rà soát bỏ sót.

### 18.3 Câu chữ — đã sửa

**Thông báo lỗi nói tiếng của lập trình viên**

| Trước | Sau |
|---|---|
| "Server gặp lỗi (mã 500). Nếu vừa deploy xong, nhiều khả năng chưa cấu hình database — xem Logs trên Vercel." | "Hệ thống đang gặp sự cố. Bạn chờ một lát rồi thử lại, nếu vẫn lỗi thì nhắn cho giáo viên nhé." |
| "Yêu cầu không hợp lệ (mã 400)." | "Không gửi được thông tin. Bạn kiểm tra lại các ô đã nhập rồi thử lại nhé." |
| "Không kết nối được tới server. Kiểm tra mạng rồi thử lại." | "Hiện chưa kết nối được. Bạn kiểm tra wifi hoặc 4G rồi thử lại nhé." |
| "Chưa đăng nhập." | "Phiên đăng nhập đã hết. Bạn đăng nhập lại để tiếp tục nhé." |
| "Thiếu dữ liệu tiến độ." | "Chưa lưu được kết quả bài làm. Bạn thử lại thao tác vừa rồi nhé." |
| "Không rõ cần làm gì." | "Thao tác không hợp lệ. Bạn thử lại nhé." |

Chi tiết kỹ thuật (mã lỗi, phương thức, đường dẫn) chuyển vào `console.error`.

**Lỗi rò rỉ thông tin:** `jsonHandler` đang trả thông điệp lỗi gốc của Node thẳng
ra màn hình — có thể lộ tên bảng, đường dẫn, cấu hình. Nay chỉ ghi log, người dùng
nhận một câu cố định. Riêng lỗi thiếu `DATABASE_URL` vẫn nói rõ, vì chỉ người cài
đặt mới gặp.

**"Thoát" mang hai nghĩa:** ở thanh trên là đăng xuất khỏi tài khoản, trong lúc
làm bài là rời bài. Học sinh bấm giữa giờ có thể tưởng mất bài. Nay là "Đăng xuất"
và "Về ngày học".

**Giọng văn khi học sinh làm sai**

| Trước | Sau |
|---|---|
| "Bài này còn khó với bạn." (nhận định về năng lực) | "Bài này nhiều câu mới, chưa quen là chuyện bình thường." |
| "Rất tốt!" | "Rất tốt! Bạn nắm chắc dạng bài này rồi." |
| "Bạn vừa làm lại các câu sai." | "Làm lại câu sai là cách tiến bộ nhanh nhất…" |
| Nút "Gợi ý (trừ 20% điểm câu này)" | "Xem gợi ý (câu này còn tính 80% điểm)" |
| "Không có gợi ý" (đọc như app lỗi) | "Thi thật — không dùng gợi ý" |
| "Hết 10 giây." | "Hết thời gian rồi, không sao." |

**Khác:** bỏ câu "Hãy chọn học sinh trước" còn sót từ bản chưa có đăng nhập; thống
nhất tên trang "Các ngày học"; Việt hóa "Word family" → "Họ từ", "Flashcard" →
"Thẻ từ"; màn giáo viên đổi `window.prompt` sang ô nhập trong trang để mật khẩu
mới không hiện rõ trên màn hình.

**Slogan trang đăng nhập:** câu cũ dài 15 từ, xuống dòng trên điện thoại. Rút gọn
thành *"Today's words are tomorrow's answers."*, giữ câu phụ *"Show up daily.
Small steps, big scores."*

**Điểm được đánh giá tốt, giữ nguyên:** xưng hô "bạn" nhất quán toàn app; câu
"Nối sai cũng không sao — đây chỉ là bước làm quen từ" (Prime) và "Những từ bạn
còn sai sẽ được hỏi lại vào ngày mai" (Warm-up) được lấy làm chuẩn giọng văn;
thông báo đăng nhập sai không tiết lộ sai ở đâu — đúng chuẩn bảo mật.

### 18.4 Test tự động — đã sửa

Lượt test Playwright chạy 11 luồng trên Chromium, **tất cả đều đạt**: chặn truy
cập khi chưa đăng nhập, ẩn form tự đăng ký, lối tắt `?dangky=1`, tạo tài khoản
giáo viên và học sinh, phân quyền giáo viên/học sinh, làm bài Mini 1 với gợi ý và
giải thích, trang kết quả, lưu tiến độ và giữ được sau khi đăng nhập lại, Sổ từ
và màn học từ vựng (bộ lọc Tất cả 52 / Từ đơn 24 / Cụm từ 28 — cộng khớp).

**Lỗi đã sửa:** thanh trên cùng vỡ ở viewport 390px — link quay lại và nút Đăng
xuất xuống dòng làm header cao gấp đôi, tiêu đề trang bị cắt còn một ký tự
("Học từ vựng" hiện thành "H…") vì thua chỗ cho tên người dùng. Phần lớn học sinh
dùng điện thoại nên đây là lỗi gặp hàng ngày. Đã sửa: tên người dùng trên màn hẹp
chỉ còn chữ cái đầu, link và nút thêm `shrink-0` + `whitespace-nowrap`, tiêu đề
thêm `min-w-0` để truncate đúng, trạng thái lưu trước đây ẩn hẳn dưới `sm` nay rút
thành chấm tròn, vùng chạm nâng lên khoảng 40px.

**Một lỗi tự gây ra, chặn được trước khi push:** bản sửa đầu dùng class `xs:`
nhưng Tailwind v4 không có breakpoint đó và cũng chưa khai báo được, nên nhãn nút
quay lại sẽ hỏng trên mọi màn hình. Đã đổi sang `sm:` và build lại trước khi đẩy
lên. Bài học: thêm breakpoint tuỳ chỉnh thì phải khai báo trong `@theme` của
`globals.css` rồi kiểm tra lại, đừng cho rằng Tailwind có sẵn.

Phần lỗi còn mở và những gì test chưa phủ: xem mục 17.7 và 17.8.

### 18.5 Luồng giáo viên → học sinh và giao diện điện thoại — đã sửa

**Điểm kết quả trùng nhau:** dùng gợi ý ở câu sai có thể khiến điểm thô và điểm
sau trừ gợi ý đều bằng 0; làm tròn cũng có thể khiến hai số bằng nhau. Câu nhắc
“nếu tự làm hết” khi đó không cung cấp thông tin. Đã sửa: chỉ hiện khi hai điểm
hiển thị khác nhau (`score !== raw`).

**Dashboard chỉ đếm bài đạt:** học sinh nộp Mini 1 giữa chừng thấy “Xong 0/6” và
thanh tiến độ rỗng, dễ tưởng kết quả bị mất. Đã sửa: thẻ ngày thêm “Đang luyện”
với tên bài chưa đạt và điểm tốt nhất đã lưu. Số bài xong, thanh tiến độ và
`passThreshold` giữ nguyên; đây là kết quả luyện đã nộp, không phải lưu bản nháp
câu trả lời khi rời màn làm bài.

**Luyện tập thiếu đường nộp bài:** phải đi tới câu cuối và kiểm tra mới nộp được,
khó chủ động dừng buổi học. Đã sửa: có nút “Nộp bài” riêng cả khi đang luyện và
chưa kiểm tra câu hiện tại; vẫn xác nhận nếu còn câu chưa làm, và tránh hai nút
cùng tên ở câu cuối đã kiểm tra.

**Request không cần thiết:** học sinh mở `/gv` gọi API giáo viên rồi nhận 403,
còn mở `/login` chưa có phiên gọi `/api/auth/me` rồi nhận 401 trong console trình
duyệt. Đã sửa: effect nạp học sinh chỉ chạy với role giáo viên; trang đăng nhập
không dò phiên, sau đăng nhập form vẫn gọi `refresh` và các trang riêng vẫn xác
thực với server. Không bỏ kiểm tra quyền phía API.

**Vùng chạm và header 390px:** nút “Bỏ khỏi sổ”, nút nghe và các bộ lọc Sổ từ /
Học từ vựng nhỏ khiến dễ bấm hụt; link quay lại và đồng hồ ép dòng trạng thái
bài làm xuống hai dòng. Đã sửa: các nút này có vùng chạm tối thiểu 40×40px,
header màn hẹp đưa tiêu đề và trạng thái xuống một hàng riêng dưới link / đồng hồ.

**Tên dạng bài:** “Điền từ (word bank)” và “Word form” khiến học sinh phải đoán
thuật ngữ. Đã sửa: “Điền từ cho sẵn” và “Dạng từ (word form)”.

**Test hồi quy:** thêm `e2e/teacher-student.spec.ts` với đăng nhập giáo viên,
tạo học sinh ở `/gv`, đăng nhập học sinh, Mini 1 → kết quả → Dashboard, reload
vẫn giữ điểm tốt nhất, không gọi API giáo viên khi học sinh mở `/gv`, không dò
phiên trên `/login`, kiểm vùng chạm 40px và header không tràn ngang ở 390×844.
Playwright nhận `PLAYWRIGHT_BASE_URL` để chạy cổng riêng cho từng worktree.


**Kiểm chứng lượt sửa:** `npm ci`, `check-data`, lint, tsc và build đều exit 0;
Playwright `app.spec.ts` + `teacher-student.spec.ts` đạt 2/2 ở cổng 3211 với
`next dev` và kho JSON local mới. Lần tsc trước khi chạy Next thiếu
`PageProps` / `LayoutProps`; sau khi Next sinh kiểu thì tsc đạt, không cần sửa
các trang ngoài phạm vi. Kiểm ảnh header 390px xác nhận trạng thái nằm một dòng.

**Phát hiện ngoài các mục được sửa:** test cũ vẫn ghi vùng chạm nhỏ ở dải chấm
chuyển câu (22×8px), và một 401 của `PUT /api/progress` sau đăng xuất do lịch
đồng bộ còn chờ; đây không phải request `/api/auth/me` trên trang đăng nhập.
Không có request 403 API giáo viên trong luồng học sinh mới. Hai phát hiện này
cần lượt sửa riêng; không thay logic đồng bộ hay dải chấm trong lượt này.
