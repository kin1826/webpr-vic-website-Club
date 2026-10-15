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

Lệnh build tạo thêm `index.html` cho các route mẫu và `404.html`, giúp refresh URL con hoạt động trên hosting tĩnh.

## Nguyên tắc đóng góp

- Ưu tiên component nhỏ, có trách nhiệm rõ ràng.
- Khai báo type cho dữ liệu mới, không dùng `any` nếu không thực sự cần thiết.
- Dùng component trong `components/ui` thay vì tạo lại style nút, dialog hoặc accordion ở từng section.
- Tôn trọng `prefers-reduced-motion` và kiểm tra thao tác bàn phím.
- Chạy `npm run typecheck` và `npm run build` trước khi gửi thay đổi.
