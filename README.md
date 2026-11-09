# VIC — VKU IT Club

Website giới thiệu VIC được xây dựng như một dự án mẫu để thành viên CLB có thể học, chỉnh sửa và tiếp tục phát triển.

## Công nghệ

- React 19, TypeScript và Vite.
- Tailwind CSS v4 cho styling và design tokens.
- Motion for React cho reveal, dialog và micro-interaction.
- shadcn/ui theo mô hình copy-to-own, sử dụng Radix UI primitives đã được tùy biến.
- Lucide React cho icon.
- React Router cho điều hướng đa trang và URL chi tiết.
- Canvas API cho nền caro tương tác ở hero.
- Express + TypeScript làm API công khai; Google Apps Script ghi đơn vào Google Sheet và gửi email qua hàng đợi nền.

## Cài đặt và chạy

Yêu cầu Node.js phiên bản 20.19 trở lên.

```bash
npm install
cp .env.example .env.local
cp backend/.env.example backend/.env
npm run dev:backend
```

Điền hai file env theo [hướng dẫn backend](backend/README.md). Mở terminal thứ hai tại repo và chạy `npm run dev` để khởi động Vite. Vite in địa chỉ local trong terminal; trang design system nằm tại `/design-system`.

## Kiểm tra và build

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Lệnh build typecheck và biên dịch Express sang `backend/dist/`, sau đó build frontend vào `dist/`.

## Cấu trúc chính

```text
src/
├── components/
│   ├── layout/       # Header và footer
│   ├── content/      # Card và thành phần nội dung dùng chung
│   ├── organization/ # Sơ đồ tổ chức
│   ├── sections/     # Các section trang chủ
│   ├── shared/       # Logo, heading, reveal và canvas grid
│   └── ui/           # shadcn/ui primitives đã tùy biến
├── config/           # Cấu hình cũ đang được giữ tương thích
├── data/             # Dữ liệu quan hệ dùng chung cho toàn website
├── features/         # Hệ thống tuyển thành viên, API client và validation
├── pages/            # Trang chủ, danh sách, chi tiết và design system
├── styles/           # Design tokens và global styles
└── types/            # TypeScript types cho dữ liệu
backend/
├── src/config/        # Env và giới hạn triển khai
├── src/middleware/    # Auth admin, error handling và rate limit
├── src/routes/        # API form, applications và admin
├── src/services/      # Apps Script HMAC client, Google auth, Turnstile
├── src/validation/    # Request schemas
└── README.md          # Thiết lập và triển khai backend
```

## Chỉnh sửa nội dung

- Thông tin ban, nhân sự, hoạt động chi tiết, sản phẩm, bài viết và FAQ: `src/data/site-data.ts`.
- Bốn nhóm hoạt động ở trang chủ: `src/data/home-activity-groups.ts`. Ảnh web dùng `cover.webp` trong từng thư mục `image/activities/`, được nén từ `cover.png`; khi thay ảnh, tạo lại WebP bằng `cwebp -m 6 -q 82 -resize 1600 0 image/activities/tech-sharing-2026/cover.png -o image/activities/tech-sharing-2026/cover.webp` (đổi đường dẫn theo nhóm). Ảnh nền workshop dùng `image/vic-workshop-2526.webp`, tạo từ file PNG cùng tên.
- Hồ sơ sáu thành viên Ban Chủ nhiệm và các ban: cập nhật trường dữ liệu tương ứng trong `members`; thông tin tùy chọn chưa có sẽ tự ẩn. Poster gốc nằm trong `image/image-bcn/`, bản WebP dùng trên web trong `src/assets/leadership/`. Khi thay poster, tạo lại bản WebP cùng tên bằng `cwebp -q 82 -resize 960 960 image/image-bcn/President.png -o src/assets/leadership/President.webp` (thay tên file theo người).
- Facebook, email, GitHub, trạng thái tuyển và form đăng ký: `clubSettings` trong `src/data/site-data.ts`.
- Kiểu dữ liệu và quan hệ ID: `src/types/content-model.ts`.
- Màu sắc, font, radius và shadow: `src/styles/globals.css`.
- Logo gốc: `image/Logo VIC - cut.png`.

Các link chưa được VIC xác nhận đang để `null`; website sẽ không hiển thị link giả. Các dự án và hoạt động mẫu đều được ghi rõ là nội dung minh họa.

## Các route chính

- `/`, `/gioi-thieu`, `/hoctap`, `/truyenthong`, `/tuyen-thanh-vien`, `/tham-gia`.
- `/tuyen-thanh-vien` là trang thông báo tuyển theo từng Gen; chỉnh nội dung và link Google Form trong `src/data/recruitment-announcement.ts`.
- `/tham-gia` vẫn được giữ nguyên làm trang form tuyển thành viên cũ.
- `/hoat-dong` và `/hoat-dong/:slug`.
- `/san-pham` và `/san-pham/:slug`.
- `/hoc-thuat` và `/hoc-thuat/:slug`.
- `/thanh-vien/:slug`.
- `/design-system` và trang 404.
- `/default`: trang xem trước trạng thái “Trang chưa sẵn sàng”. Để tạm đưa một trang bất kỳ về trạng thái này, thêm route của trang đó vào `defaultPagePaths` trong `src/config/page-availability.ts` (ví dụ `"/san-pham"` hoặc `"/san-pham/:slug"`); bỏ route khỏi danh sách để khôi phục nội dung cũ.
- `/admin/tuyen-thanh-vien`: quản trị đợt tuyển; khi dùng API thật cần Google Sign-In và email trong allowlist.

Lệnh build tạo thêm `index.html` cho các route mẫu và `404.html`, giúp refresh URL con hoạt động trên hosting tĩnh.

## Hệ thống tuyển thành viên

Kiến trúc hiện tại:

```text
React/Vite → Express API → HMAC-signed Google Apps Script → Google Sheet + MailApp
```

React chỉ gọi Express. Express kiểm tra Origin/CORS, kích thước và cấu trúc request, giới hạn theo IP, xác minh admin/Turnstile rồi gọi Apps Script bằng HMAC. Apps Script kiểm tra chữ ký và nonce, xác thực admin lần nữa, kiểm tra form, cooldown 600 giây và idempotency. Đơn cùng email job được ghi trước khi trả kết quả; trigger Apps Script gửi email nền sau đó.

Tab ẩn `TrangThaiKyThuat` tiếp tục lưu cooldown/idempotency và lưu hash nonce có hạn để chặn replay; nonce được dọn định kỳ. Không có Apps Script URL, HMAC secret, Turnstile secret, Google credential hay admin secret trong frontend. Google Client ID và Turnstile site key là public config.

Nếu chưa cấu hình `VITE_API_BASE_URL`, `/tham-gia` local dùng dữ liệu prototype có ghi chú; không ghi Sheet và không gửi email. Khi muốn local dùng data thật, chạy Express, cấu hình Apps Script HMAC và đặt API base URL local.

### Kết nối Google Sheet

1. Mở Sheet VIC: `https://docs.google.com/spreadsheets/d/1CQiNWk2YZxKLlXA3asiB6K6ADqJSWwIFEymM156ol-A/edit`.
2. Chọn **Extensions → Apps Script**, cập nhật các file trong `apps-script/`, thêm `EXPRESS_HMAC_SECRET`, `GOOGLE_OAUTH_CLIENT_ID`, `ADMIN_EMAILS` trong Script Properties.
3. Chạy `initializeVicRecruitment` một lần và cấp quyền.
4. Chạy `installConfirmationEmailTrigger` một lần để bật hàng đợi gửi email. Cập nhật deployment Web App sang version mới; xem checklist trong [hướng dẫn Apps Script](apps-script/README.md).
5. Điền `APPS_SCRIPT_URL`, shared HMAC secret và cấu hình Google/admin trong `backend/.env` theo [hướng dẫn backend](backend/README.md).
6. Cấu hình `VITE_API_BASE_URL` và `VITE_GOOGLE_CLIENT_ID` trong `.env.local`; chạy backend và frontend ở hai terminal.

`is_open` đang là `FALSE`; không đổi thành `TRUE` cho đến khi hoàn tất checklist bên dưới.

### Email và Turnstile

- Đơn được ghi vào Sheet trước; email xác nhận được gửi nền bằng `MailApp` của tài khoản cài trigger. Dùng hộp thư test và kiểm tra quota.
- Nếu phản hồi gửi đơn bị mất, form kiểm tra trạng thái bằng mã idempotency và không tự nộp lại. Admin xử lý email `Cần kiểm tra` sau khi xem hộp thư gửi.
- Tạo Cloudflare Turnstile widget cho hostname website, đặt site key ở `VITE_TURNSTILE_SITE_KEY` và secret ở `TURNSTILE_SECRET_KEY` của Express.
- Bật `TURNSTILE_REQUIRED=true` sau khi cấu hình hostname/action cho phép; secret không đặt ở frontend hoặc Script Properties.

### Checklist mở nhận đơn

- Kiểm tra ba tab cấu hình và các label/help text/lựa chọn trên Sheet.
- Cấu hình cùng Google Client ID ở Express và Script Properties; cấu hình `ADMIN_EMAILS` ở cả hai lớp và đăng nhập được trang admin.
- Kiểm tra form thật vẫn đóng và frontend đọc đúng `form_version`.
- Gửi đơn bằng email test thuộc `udn.vn`; xác nhận chỉ có một dòng và email nhận đúng.
- Kiểm tra retry cùng idempotency key và cooldown đủ 10 phút.
- Cấu hình, kiểm tra Turnstile hostname/action trên domain production.
- Kiểm tra quota Apps Script/MailApp và kênh liên hệ.
- Cuối cùng mới đổi `is_open` thành `TRUE` qua trang admin.

## Nguyên tắc đóng góp

- Ưu tiên component nhỏ, có trách nhiệm rõ ràng.
- Khai báo type cho dữ liệu mới, không dùng `any` nếu không thực sự cần thiết.
- Dùng component trong `components/ui` thay vì tạo lại style nút, dialog hoặc accordion ở từng section.
- Tôn trọng `prefers-reduced-motion` và kiểm tra thao tác bàn phím.
- Chạy `npm run typecheck` và `npm run build` trước khi gửi thay đổi.
