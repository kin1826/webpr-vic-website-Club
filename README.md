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
- Google Apps Script làm API trung gian tới Google Sheet và gửi email.

## Cài đặt và chạy

Yêu cầu Node.js phiên bản 20.19 trở lên.

```bash
npm install
npm run dev
```

Vite sẽ in địa chỉ local trong terminal. Trang design system nằm tại `/design-system`.

## Kiểm tra và build

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Thư mục kết quả production là `dist/`.

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
```

## Chỉnh sửa nội dung

- Thông tin ban, nhân sự, chức danh, hoạt động, sản phẩm, bài viết và FAQ: `src/data/site-data.ts`.
- Facebook, email, GitHub, trạng thái tuyển và form đăng ký: `clubSettings` trong `src/data/site-data.ts`.
- Kiểu dữ liệu và quan hệ ID: `src/types/content-model.ts`.
- Màu sắc, font, radius và shadow: `src/styles/globals.css`.
- Logo gốc: `image/Logo VIC - cut.jpg`.

Các link chưa được VIC xác nhận đang để `null`; website sẽ không hiển thị link giả. Các dự án và hoạt động mẫu đều được ghi rõ là nội dung minh họa.

## Các route chính

- `/`, `/gioi-thieu`, `/hoctap`, `/truyenthong`, `/tham-gia`.
- `/hoat-dong` và `/hoat-dong/:slug`.
- `/san-pham` và `/san-pham/:slug`.
- `/hoc-thuat` và `/hoc-thuat/:slug`.
- `/thanh-vien/:slug`.
- `/design-system` và trang 404.
- `/admin/tuyen-thanh-vien`: quản trị đợt tuyển; local dùng prototype, dữ liệu thật bắt buộc Google Sign-In.

Lệnh build tạo thêm `index.html` cho các route mẫu và `404.html`, giúp refresh URL con hoạt động trên hosting tĩnh.

## Hệ thống tuyển thành viên

Kiến trúc được chọn:

```text
React/Vite → Google Apps Script Web App → Google Sheet + MailApp
```

Google Sheet là nguồn cấu hình và đơn ứng tuyển. Tab ẩn `TrangThaiKyThuat` lưu cooldown, idempotency và rate limit bền vững. Backend dùng `LockService` để không cho hai request đồng thời vượt kiểm tra. Không có credential Google, email secret hoặc admin secret trong frontend.

Nếu chưa cấu hình API, `/tham-gia` production hiển thị trạng thái đóng an toàn; local chạy form và admin bằng dữ liệu prototype có ghi chú rõ ràng. Prototype không ghi Sheet và không gửi email.

### Kết nối Google Sheet

1. Mở Sheet VIC: `https://docs.google.com/spreadsheets/d/1CQiNWk2YZxKLlXA3asiB6K6ADqJSWwIFEymM156ol-A/edit`.
2. Chọn **Extensions → Apps Script** và chép các file trong `apps-script/`.
3. Làm theo [hướng dẫn backend](apps-script/README.md), chạy `initializeVicRecruitment` một lần và cấp quyền.
4. Deploy Apps Script dạng Web App. Không công khai quyền chỉnh sửa Sheet.
5. Sao chép `.env.example` thành `.env.local`, điền URL `/exec` và Google OAuth Client ID.
6. Khởi động lại Vite hoặc build lại website.

`is_open` đang là `FALSE`; không đổi thành `TRUE` cho đến khi hoàn tất checklist bên dưới.

### Email và Turnstile

- Email được gửi bằng `MailApp` của tài khoản triển khai Apps Script. Hãy kiểm tra quota và dùng hộp thư test trước; code không gửi email cho đến khi có lần nộp thật vào API đã cấu hình.
- Tạo Cloudflare Turnstile widget cho domain website, đặt site key ở `VITE_TURNSTILE_SITE_KEY`, đặt secret ở Script property `TURNSTILE_SECRET_KEY`.
- Chỉ cấu hình secret sau khi frontend đã có site key tương ứng; backend sẽ từ chối submit thiếu token khi secret tồn tại.

### Checklist mở nhận đơn

- Kiểm tra ba tab cấu hình và các label/help text/lựa chọn trên Sheet.
- Cấu hình `GOOGLE_OAUTH_CLIENT_ID`, `ADMIN_EMAILS` và đăng nhập được trang admin.
- Kiểm tra form thật vẫn đóng và frontend đọc đúng `form_version`.
- Gửi đơn bằng email test thuộc `udn.vn`; xác nhận chỉ có một dòng và email nhận đúng.
- Kiểm tra retry cùng idempotency key và cooldown đủ 10 phút.
- Cấu hình, kiểm tra Turnstile trên domain production.
- Kiểm tra quota Apps Script/MailApp và kênh liên hệ.
- Cuối cùng mới đổi `is_open` thành `TRUE` qua trang admin.

## Nguyên tắc đóng góp

- Ưu tiên component nhỏ, có trách nhiệm rõ ràng.
- Khai báo type cho dữ liệu mới, không dùng `any` nếu không thực sự cần thiết.
- Dùng component trong `components/ui` thay vì tạo lại style nút, dialog hoặc accordion ở từng section.
- Tôn trọng `prefers-reduced-motion` và kiểm tra thao tác bàn phím.
- Chạy `npm run typecheck` và `npm run build` trước khi gửi thay đổi.
