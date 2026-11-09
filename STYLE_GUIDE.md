# STYLE GUIDE — VIC WEBSITE

> Hướng dẫn phong cách chung cho toàn website VIC, dựa trên design tokens và các component đang dùng; cập nhật ngày 05/11/2026.
> Tài liệu dùng chung cho thành viên CLB và được phép đưa lên Git.
> Khi thay đổi thiết kế đã được thống nhất, cập nhật cả tài liệu này.

## 1. Định hướng tổng thể

Website VIC có phong cách công nghệ, biên tập và gần gũi với sinh viên. Typography lớn, bố cục thoáng, hình học gợi kỹ thuật và các lớp bề mặt có chiều sâu tạo nên nhận diện chung. Các route có thể có bố cục riêng phù hợp nhiệm vụ của trang; hãy dùng chung màu sắc, chữ, khoảng cách, trạng thái tương tác và chất lượng chuyển động.

Các dấu hiệu nhận diện cần duy trì:

- Chữ đen lớn, đậm, khoảng cách chữ chặt; dùng xanh VIC để nhấn từ hoặc hành động.
- Nền trắng ngà, trắng và xám rất nhạt xen kẽ; section các ban dùng nền đen.
- Khoảng trống rộng; bố cục có chỗ lệch trục, xếp lớp hoặc nghiêng nhẹ có chủ đích.
- Hình tròn, quỹ đạo, đường nối, khung chữ nhật và mũi tên chéo là ngôn ngữ trang trí xuyên suốt.
- Card nội dung chủ yếu vuông cạnh; nút và thanh điều hướng dạng viên thuốc; bề mặt giấy/kính có thể bo mềm.
- Animation gồm xuất hiện khi cuộn, chuyển động nền chậm và phản hồi tương tác nhỏ.
- Liquid Glass tập trung ở thanh điều hướng, ghi chú nổi và một số bề mặt phụ; phần nội dung vẫn cần dễ đọc.

Token, header, footer, nút, trạng thái tương tác, accessibility và quy tắc animation trong tài liệu này áp dụng toàn website: trang chủ, nội dung, danh sách, chi tiết, tham gia và quản trị. Mục 5 ghi lại bố cục riêng của `/home-preview` làm ví dụ tham khảo có thật; không bắt các trang khác dùng cùng thứ tự hoặc cấu trúc section. Mục 7 cũng ghi riêng thông số Canvas của hero hiện tại. Trang `/home-preview1` là một hướng thử nghiệm riêng, không phải nguồn thay thế cho nhận diện chung.

### Nguyên tắc áp dụng cho mọi route

- Giữ header, footer, logo, font và palette nhất quán; dùng lại component chung trước khi tạo biến thể mới.
- Chọn bố cục theo mục đích: trang danh sách cần dễ quét, trang chi tiết ưu tiên đọc, biểu mẫu ưu tiên hoàn thành, trang quản trị ưu tiên tìm và xử lý thông tin.
- Giữ cùng ngôn ngữ thị giác nhưng điều chỉnh mật độ nội dung, nhịp section và mức trang trí cho đúng công việc của trang.
- Ưu tiên độ dễ đọc, tương phản, điều hướng rõ ràng và trạng thái tương tác trước hiệu ứng trang trí.
- Chỉ thêm màu, shadow, radius hoặc animation mới khi có lý do dùng lại được; cập nhật token/guide nếu nó trở thành quy ước chung.

## 2. Màu sắc và chất liệu

### Bảng màu hiện tại

| Token Tailwind | Giá trị | Vai trò |
| --- | --- | --- |
| `vic-bg` | `#FAFAF8` | Nền tổng thể, nền hero |
| `vic-surface` | `#F1F3F6` | Nền hoạt động, sơ đồ, bề mặt phụ |
| `vic-ink` | `#161616` | Chữ chính, section tối, nút chính |
| `vic-muted` | `#5B606B` | Mô tả, metadata, chữ phụ trên nền sáng |
| `vic-blue` | `#2457F5` | Màu nhấn, CTA, đường nối, icon |
| `vic-blue-soft` | `#EAF0FF` | Nền minh họa, badge, icon và trạng thái chọn |
| Trắng | `#FFFFFF` | Card, lớp giấy, chữ trên nền tối |

Các token nằm trong [`src/styles/globals.css`](src/styles/globals.css), khai báo ở `@theme` và các biến `--vic-*`. Khi thêm thành phần, ưu tiên dùng token thay cho tạo một sắc xanh hoặc xám gần giống.

### Viền, bóng và lớp kính

| Thành phần | Cách xử lý hiện tại |
| --- | --- |
| Viền trên nền sáng | Chủ yếu `1px`, đen opacity khoảng `10%` |
| Viền trên nền tối | Trắng opacity khoảng `15–20%`, hoặc xanh trong suốt |
| Kính dùng chung | Trắng opacity `68%`, viền trắng `90%`, blur `22px`, saturation `160%` |
| Bóng kính | `0 20px 70px rgba(22,22,22,.09)` và highlight trắng phía trong |
| Card hoạt động | Bóng nền nhẹ; hover tăng độ sâu, viền chuyển xanh |
| Tờ giấy giới thiệu | Bóng rộng `0 28px 80px rgba(22,22,22,.13)` |
| CTA xanh cuối trang | Bóng xanh rộng `0 35px 90px rgba(36,87,245,.18)` |

Đặt glow và gradient phía sau nội dung, giữ opacity thấp. Các lớp trang trí dùng `pointer-events: none`, được giới hạn trong section và không che chữ hoặc vùng bấm. Kính có fallback nền trắng gần đặc khi trình duyệt không hỗ trợ backdrop blur.

## 3. Typography

| Mục đích | Thiết lập hiện tại |
| --- | --- |
| Font chính | **Be Vietnam Pro**, fallback `system-ui, sans-serif` |
| Nhãn kỹ thuật, mã, thông tin nhỏ | **IBM Plex Mono**, fallback `monospace` |
| Hero | `clamp(3.2rem, 8.3vw, 7rem)`, weight `800`, line-height `1.06`, tracking `-.065em` |
| Tiêu đề giới thiệu | `clamp(2.7rem, 6.2vw, 5.7rem)`, weight `700`, line-height `.98`, tracking `-.075em` |
| Tiêu đề hoạt động | `clamp(2.5rem, 5.6vw, 5rem)`, line-height `.98`, tracking `-.07em` |
| Tiêu đề các ban | `clamp(2.7rem, 6vw, 5.5rem)`, line-height `.95`, tracking `-.075em` |
| Tiêu đề sơ đồ | `clamp(2.5rem, 5.4vw, 4.8rem)`, line-height `.98`, tracking `-.07em` |
| Tiêu đề CTA cuối | `clamp(2.8rem, 7vw, 6.2rem)`, line-height `.92`, tracking `-.075em` |
| Nội dung mô tả | Thường `text-base`, line-height `1.75–2`; giới hạn chiều rộng để dễ đọc |
| Metadata/nhãn | Thường `text-xs` hoặc `text-sm`, weight `500–600` |

Tiêu đề ngắn, chia dòng để có nhịp. Các giá trị line-height chặt dành cho tiêu đề lớn; đoạn văn tiếng Việt cần khoảng dòng thoáng. Khi thay câu chữ, kiểm tra dấu tiếng Việt, xuống dòng và chữ bị cắt ở mọi kích thước.

## 4. Khoảng cách, kích thước và responsive

- Container chung rộng tối đa `77.5rem` (khoảng `1240px` ở cỡ chữ gốc `16px`), căn giữa.
- Desktop: chiều rộng container bằng `100% - 6rem`; dưới hoặc bằng `62rem` chuyển thành `100% - 3.5rem`; dưới hoặc bằng `42.5rem` còn `100% - 2.5rem`.
- `.section-space`: padding dọc `clamp(4.5rem, 8vw, 7rem)`; màn hình nhỏ dưới hoặc bằng `42.5rem` dùng `4.25rem`.
- Khoảng cách chính thường theo nhịp `12 / 16 / 20 / 24 / 32 / 48 / 64px`; tùy section dùng `gap-5`, `gap-7`, `gap-12`, `gap-16`.
- Radius dùng chung: `2rem / 1.5rem / .95rem`; nút dùng `rounded-full`. Card hoạt động và card ban hiện dùng cạnh vuông.
- Các breakpoint Tailwind đang dùng nhiều: `sm` (`640px`), `md` (`768px`), `lg` (`1024px`). Chúng tồn tại song song với breakpoint container CSS ở trên.
- Mobile chuyển các bố cục lớn thành một cột; giảm chữ bằng `clamp()`, giữ khoảng trống và vùng bấm.
- Lớp trang trí được phép tràn bên trong vùng đã clip; nội dung và các card phải nằm đúng luồng layout, không đè lên nhau.

## 5. Bố cục tham chiếu riêng: `/home-preview`

Các tiểu mục dưới đây ghi lại cách `/home-preview` đang kể câu chuyện trang chủ. Đây là tham khảo bố cục của route đó, không phải template bắt buộc cho toàn bộ website.

### Về VIC — hồ sơ cộng đồng

- Trang `/gioi-thieu` dùng cùng bảng màu, font và chất liệu chung nhưng có bố cục kể chuyện riêng.
- Mở đầu bằng typography lớn và ảnh tập thể thật trên khung giấy; nội dung tiếp tục qua câu chuyện, định hướng, hai ban và đội ngũ.
- Lớp giấy có thể lệch nhẹ, nhưng chữ luôn nằm thẳng trên mặt phẳng dễ đọc. Liquid Glass dùng cho ghi chú nhỏ; không phủ lên toàn ảnh hoặc đoạn văn.
- Phần định hướng trong `src/data/home-preview-content.ts` vẫn là đề xuất, cần CLB xác nhận trước khi coi là thông điệp chính thức.
- Dùng lại `OrganizationChart` / `LeadershipGallery`; không nhân bản hồ sơ hoặc sửa gallery dùng chung chỉ để đổi giao diện trang About.
- CTA cuối dẫn tới `/tuyen-thanh-vien`; không trỏ về form cũ `/tham-gia`.

### Header — thanh điều hướng kính nổi

- Thanh fixed, căn giữa, cách đỉnh khoảng `16px`; desktop khoảng `1.1rem`.
- Dạng viên thuốc, cao `4.65rem`, rộng tối đa `72.5rem`.
- Logo bên trái, điều hướng ở giữa, nút tham gia bên phải; cuộn trang làm nền và bóng đậm hơn.
- Mobile dùng nút menu và panel kính; giữ nhãn, trạng thái mở và thao tác đóng bằng Escape.

### Hero — lưới Canvas nhận diện

- Nền caro phủ riêng vùng hero, typography là trọng tâm.
- Thông điệp hai dòng: **“We dream it.” / “We make it.”**; dòng hai lệch phải trên màn hình từ `md`, từ **make** màu xanh.
- Phía dưới là mô tả ngắn, nút **Khám phá VIC**, nút **Tham gia VIC** và công tắc chuyển động của nền hero.
- Hero desktop có min-height `55rem`; mobile dùng chiều cao theo nội dung.
- Giữ nguyên cảm giác lưới của bản hiện tại. Khi sửa bố cục hero, không scale Canvas hoặc phần tử cha bằng CSS transform.

### Giới thiệu — câu chuyện và bàn làm việc

- Nền trắng, hai vùng ánh sáng xanh rất nhẹ và một vòng tròn viền mảnh.
- Desktop chia hai cột gần cân bằng: câu chuyện lớn bên trái, cụm giấy/ghi chú bên phải.
- Câu nhấn **“Một ý tưởng lớn lên khi có người cùng làm.”** có nét gạch chân SVG tự vẽ khi xuất hiện.
- Mô tả, các giá trị CLB và hai CTA nằm dưới tiêu đề.
- Cụm minh họa gồm lớp giấy xanh nghiêng, tờ giấy trắng, hai khối định hướng **Trước mắt / Về lâu dài**, ghi chú kính và nhãn xanh.
- Sự lệch góc, bóng và chuyển động nổi tạo chiều sâu; phần chữ vẫn cần nằm trong vùng an toàn.

### Hoạt động — bốn card đều nhau

- Nền xám nhạt với lưới phụ `48px`, chuyển động rất chậm; đây là nền riêng của section hoạt động.
- Tiêu đề bên trái, mô tả và link **Mở kho hoạt động** bên phải trên desktop.
- Hiển thị tối đa **4 hoạt động được đánh dấu `featured`**, layout `2 × 2` từ `sm`, một cột trên mobile.
- Card cùng chiều cao trong mỗi hàng; phần nội dung dùng flex để đường thông tin ngày ở đáy được căn đều.
- Phần artwork có tỷ lệ `16:10`: tên hoạt động lớn, icon nét mảnh, hình tròn/khung hình học và mũi tên trong nút tròn trắng.
- Màu artwork luân phiên xanh nhạt, xanh chủ đạo, đen rồi xanh nhạt theo dữ liệu hiện tại.
- Có badge trạng thái, nhãn minh họa khi cần, loại hoạt động, tiêu đề, mô tả và ngày.
- Cả card dẫn tới trang chi tiết `/hoat-dong/:slug`; chuyển động hover nhỏ, giữ khoảng cách giữa các card.

### Các ban — nhịp tối của trang

- Toàn section nền `vic-ink`; ánh sáng xanh, vòng tròn và các đường SVG tạo không khí công nghệ.
- Tiêu đề **“Học cho sâu. Kể cho chạm.”** ở trái; hai card Ban Học tập và Ban Truyền thông xếp dọc bên phải.
- Ban Học tập dùng xanh làm điểm nhấn; Ban Truyền thông dùng trắng/kính nhẹ.
- Mỗi card có icon, câu dẫn, tên ban, mô tả, tối đa bốn hướng hoạt động và link khám phá.
- Card đi vào từ hai hướng khác nhau, có dải sáng lướt qua khi hover/focus và quỹ đạo chuyển động chậm.

### Tổ chức — bản đồ kết nối

- Nền xám nhạt có ánh sáng xanh ở trung tâm.
- Ban Chủ nhiệm ở trên, hai nhóm ban bên dưới trên desktop; có đường nối SVG và dòng chấm chạy dọc đường nối.
- Node là khối trắng viền mảnh; icon đặt trong ô xanh nhạt bo mềm.
- Node có nhân sự đã gắn dữ liệu thì dẫn tới hồ sơ; node chưa có nhân sự hiển thị chức danh/ghi chú.
- Mobile xếp dọc và ẩn đường nối SVG phức tạp, giữ nguyên thứ bậc nội dung.
- Có link **Xem đội ngũ đầy đủ** dẫn tới trang giới thiệu.

### CTA cuối và FAQ

- Khối xanh lớn với tiêu đề **“Ý tưởng tiếp theo có thể bắt đầu từ bạn.”**; nền có gradient, quỹ đạo và ánh sáng xoay chậm.
- Nút **Đăng ký tham gia VIC** nền trắng, chữ đen, có mũi tên. Kiểm tra độ tương phản cả hover và focus để tránh nút trắng mất chữ.
- CTA cuối trang dẫn tới `/tuyen-thanh-vien`, trang thông báo tuyển thành viên theo từng Gen. Trang form cũ `/tham-gia` vẫn được giữ lại nhưng không còn là đích của CTA tham gia.
- Footer dùng nền đen, logo sáng, link chữ trắng giảm opacity và các kênh liên hệ đã có dữ liệu.

## 6. Quy tắc component và trạng thái

| Thành phần | Cách dùng theo thiết kế hiện tại |
| --- | --- |
| Nút chính | Viên thuốc đen/chữ trắng, hover chuyển xanh, bóng tăng nhẹ |
| Nút phụ | Viền đen mờ, nền trắng trong suốt, chữ đen |
| Nút trên CTA xanh | Variant `light`: nền trắng/chữ đen; hover xanh/chữ trắng |
| Link xem thêm | Chữ đen, gạch dưới xanh `2px`, icon mũi tên chéo |
| Icon | Lucide React, thường `16–20px`; artwork có thể lớn hơn và dùng stroke mảnh |
| Hover card | Nâng nhẹ, tăng bóng/viền, chuyển động artwork; giữ nguyên vùng đọc |
| Focus | Outline hoặc ring xanh rõ; trên nền tối có thể dùng ring trắng |
| Disabled | Nút dùng opacity `45%`, không nhận pointer; vẫn giữ nhãn đọc được |
| Vùng bấm | Nút chính cao tối thiểu `48px`; nút nhỏ/icon và nhiều link hành động tối thiểu `44px` |

Dùng [`Button`](src/components/ui/button.tsx) và các component UI chung để giữ trạng thái đồng bộ. Logo dùng [`VicLogo`](src/components/shared/vic-logo.tsx) từ asset hiện có; phiên bản nền tối dùng cách xử lý trong component.

## 7. Ngôn ngữ animation

### Xuất hiện và phản hồi tương tác

- Dùng **Motion for React** cho reveal, vẽ SVG, spring, tilt và tương tác. CSS keyframes phục vụ các loop trang trí đang có.
- Reveal dùng chung [`PreviewReveal`](src/components/sections/home-preview/preview-reveal.tsx): opacity `0 → 1`, đi lên mặc định `28px`, duration `.7s`, easing `[.22, 1, .36, 1]`, chạy một lần khi khoảng `18%` phần tử vào vùng nhìn.
- Các section tùy chỉnh chủ yếu xuất hiện trong khoảng `.65–.9s`; SVG có thể kéo dài `1.1–2.1s`.
- Stagger thường khoảng `.08–.18s` giữa phần tử liên quan, tránh kéo dài thời gian chờ đọc nội dung.
- Spring dùng cho nhãn, icon, nút và nghiêng card; giữ chuyển động có kiểm soát, không nảy liên tục ở chữ chính.
- Card hoạt động dùng perspective `1000px`; độ nghiêng theo chuột tối đa khoảng `±2.5deg` mỗi trục, hover nâng `8px`.
- Ghi chú kính có parallax nhỏ theo chuột. Pointer tương tác chỉ áp dụng khi phù hợp với thiết bị, có kiểm tra reduced motion.

### Các loop hiện tại

| Vị trí | Chu kỳ và cảm giác |
| --- | --- |
| Ánh sáng giới thiệu | `30s`, qua lại chậm |
| Vòng tròn giới thiệu | `34s`, xoay đều |
| Tờ giấy / ghi chú | `8s / 5.2s`, nổi lên lần lượt khoảng `5px / 8px` |
| Lưới phụ hoạt động | `42s`, dịch một ô `48px` ở mỗi trục |
| Quỹ đạo artwork | `28s`, xoay đều |
| Lõi / khung / mũi tên artwork | `4.8s / 7.6s / 4.2s`, biên độ vài pixel |
| Glint artwork | `10s`; thêm sweep khi hover/focus |
| Không khí section tối | `25s`, qua lại chậm |
| Vòng nền / quỹ đạo card ban | `42s / 30s` |
| Dòng chấm sơ đồ | `5.8s`, chạy dọc đường nối |
| Ánh sáng xoay CTA cuối | `32s` |

Tách lớp chịu trách nhiệm cho reveal, loop và tương tác khi cần để tránh các animation ghi đè cùng một transform. Animation hỗ trợ việc đọc và cảm nhận chiều sâu; thứ tự nội dung phải rõ ngay cả khi chuyển động bị tắt.

### Hợp đồng nền caro hero

Nguồn triển khai hiện tại: [`InteractiveGrid`](src/components/shared/interactive-grid.tsx). Những thông số dưới đây mô tả hiệu ứng đang có; thay đổi chúng là thay đổi thiết kế nền.

| Thuộc tính | Giá trị/công thức hiện tại |
| --- | --- |
| Kích thước ô | `64 CSS px` |
| Đường lưới | `rgba(20,20,20,.13)`, width `.7` |
| Bán kính chuột | `190 CSS px` |
| Influence đích | `max(0, 1 - distance / 190)` |
| Smoothing mỗi frame | `v = v + (target - v) * .12` |
| Kích thước ô tương tác | `s = 64 * (1 - v * .19)` |
| Căn giữa ô | Offset mỗi cạnh bằng `(64 - s) / 2` |
| Ambient | `pow(max(0, sin(timestamp * .0007 + column * .75 + row * .5)), 18) * .045` |
| Điều kiện vẽ ô | `v > .008` hoặc `ambient > .002` |
| Fill | `rgba(36,87,245, v * .14 + ambient)` |
| Stroke ô tương tác | Khi `v > .04`: `rgba(20,20,20, v * .5)`; inset `.5px`, cạnh `s - 1` |
| Thứ tự lớp | Xóa frame → lưới nền → fill và stroke từng ô theo hàng/cột |
| DPR | `min(devicePixelRatio || 1, 2)`; giữ kích thước hiển thị theo CSS pixel |

Canvas phủ hero, lấy tọa độ chuột theo vùng hero và được đặt sau nội dung. Không thêm một lưới CSS trùng lên Canvas. Công tắc ở hero hiện điều khiển chuyển động của **nền hero**, không phải công tắc toàn bộ animation của trang.

## 8. Khả năng truy cập và hiệu năng

- Tôn trọng `prefers-reduced-motion`; reduced motion giữ bố cục đọc được và giảm/tắt chuyển động trang trí.
- Vẫn phải dùng được bằng bàn phím; trạng thái focus có độ tương phản rõ.
- Đồ họa trang trí dùng `aria-hidden`; heading, nhãn link và cấu trúc tổ chức giữ ý nghĩa bằng HTML.
- Loop CSS có cơ chế tạm dừng khi section ra ngoài vùng nhìn hoặc tab bị ẩn; Canvas cũng có cơ chế dừng RAF khi không cần chạy.
- Dùng MotionValue/ref cho cập nhật theo frame, không dùng React state cho từng frame.
- Ưu tiên transform/opacity khi bổ sung chuyển động; hạn chế animate layout và blur diện rộng. Cấp `will-change` có mục đích thay vì gắn cho mọi thành phần.
- Giữ cleanup đầy đủ cho observer, listener và RAF; kiểm tra React Strict Mode khi sửa Canvas.
- Mục tiêu là cảm giác mượt trên màn hình tần số cao. Các tối ưu hiện có chưa phải bằng chứng trang luôn đạt `120fps`; khi đổi hiệu ứng lớn, cần đo trên bản production và thiết bị thực tế.

## 9. Nội dung và đường dẫn nguồn

| Cần sửa | Nguồn tham chiếu |
| --- | --- |
| Thứ tự section của trang | [`src/pages/home-preview-page.tsx`](src/pages/home-preview-page.tsx) |
| Nội dung giới thiệu và định hướng | [`src/data/home-preview-content.ts`](src/data/home-preview-content.ts) |
| Hoạt động, ban, nhân sự, chức danh, FAQ | [`src/data/site-data.ts`](src/data/site-data.ts) |
| Các section, reveal, visibility | [`src/components/sections/home-preview/`](src/components/sections/home-preview/) |
| Hero dùng chung | [`src/components/sections/hero-section.tsx`](src/components/sections/hero-section.tsx) |
| Loop, background và trạng thái riêng preview | [`src/styles/home-preview.css`](src/styles/home-preview.css) |
| Token, container, kính và style chung | [`src/styles/globals.css`](src/styles/globals.css) |
| Button và các UI primitives | [`src/components/ui/`](src/components/ui/) |
| Header / footer | [`src/components/layout/`](src/components/layout/) |

Nội dung định hướng trong preview vẫn là đề xuất cần CLB xác nhận. Giữ nhãn **Nội dung minh họa / Hình minh họa** cho hoạt động mẫu; chỉ hiển thị tên nhân sự, lịch và kênh liên hệ khi có dữ liệu được xác nhận.

Tài liệu này độc lập với các kế hoạch và thư mục tham khảo cục bộ. Thành viên clone repository có thể đọc và follow mà không cần các file đang bị Git bỏ qua.

## 10. Checklist khi đóng góp giao diện cùng phong cách

- [ ] Dùng đúng font, token màu và nhịp container hiện có.
- [ ] Giữ phân cấp tiêu đề/mô tả/CTA rõ, câu chữ ngắn và đọc tốt bằng tiếng Việt.
- [ ] Chọn đúng chất liệu cho thành phần: card nội dung, giấy, kính hoặc nền nhấn.
- [ ] Card và chữ không chồng nhau; lớp trang trí không nhận pointer hoặc che vùng bấm.
- [ ] Kiểm tra mobile, tablet, desktop, nội dung dài và thay đổi kích thước cửa sổ.
- [ ] Có hover, focus, disabled phù hợp; link và nút có nhãn, độ tương phản và vùng bấm đủ lớn.
- [ ] Reveal, loop, tương tác và reduced motion hoạt động cùng nhau.
- [ ] Nếu sửa hero, đối chiếu lại hợp đồng Canvas ở mục 7.
- [ ] Khi thay hiệu ứng, kiểm tra cuộn/rê chuột trên bản production và đo hiệu năng nếu có nghi ngờ giật.
- [ ] Cập nhật tài liệu này nếu quyết định thiết kế dùng chung thay đổi.
