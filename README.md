# VIC — VKU IT Club

Website giới thiệu VIC được xây dựng như một dự án mẫu để thành viên CLB có thể học, chỉnh sửa và tiếp tục phát triển.

## Công nghệ

- React 19, TypeScript và Vite.
- Tailwind CSS v4 cho styling và design tokens.
- Motion for React cho reveal, dialog và micro-interaction.
- shadcn/ui theo mô hình copy-to-own, sử dụng Radix UI primitives đã được tùy biến.
- Lucide React cho icon.
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
│   ├── sections/     # Mỗi section trang chủ là một component
│   ├── shared/       # Logo, heading, reveal và canvas grid
│   └── ui/           # shadcn/ui primitives đã tùy biến
├── config/           # Link chính thức và navigation
├── data/             # Nội dung hoạt động, dự án, FAQ, các ban
├── pages/            # Trang chủ và design system
├── styles/           # Design tokens và global styles
└── types/            # TypeScript types cho dữ liệu
```

## Chỉnh sửa nội dung

- Nội dung các ban, hoạt động, dự án và FAQ: `src/data/content.ts`.
- Facebook, email, GitHub và form đăng ký: `src/config/site.ts`.
- Màu sắc, font, radius và shadow: `src/styles/globals.css`.
- Logo gốc: `image/Logo VIC - cut.jpg`.

Các link chưa được VIC xác nhận đang để `null`; website sẽ không hiển thị link giả. Các dự án và hoạt động mẫu đều được ghi rõ là nội dung minh họa.

## Nguyên tắc đóng góp

- Ưu tiên component nhỏ, có trách nhiệm rõ ràng.
- Khai báo type cho dữ liệu mới, không dùng `any` nếu không thực sự cần thiết.
- Dùng component trong `components/ui` thay vì tạo lại style nút, dialog hoặc accordion ở từng section.
- Tôn trọng `prefers-reduced-motion` và kiểm tra thao tác bàn phím.
- Chạy `npm run typecheck` và `npm run build` trước khi gửi thay đổi.
