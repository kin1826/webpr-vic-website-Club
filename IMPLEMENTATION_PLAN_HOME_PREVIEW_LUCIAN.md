# HOME PREVIEW — Nâng cấp chi tiết tương tác với Lucian UX/UI

Ngày lập: 07/11/2026.

**Trạng thái: đã triển khai; kiểm tra trực quan một phần.**

## 1. Mục tiêu

Hoàn thiện `/home-preview` đang dùng palette đen `#030407`, xanh dương `#1558C9`, xanh chanh `#D4FF24`. Tập trung vào cảm giác sử dụng: CTA có phản hồi rõ, chuyển động có thứ tự, card có chiều sâu vừa đủ, FAQ mở/đóng mượt và dễ dùng bằng bàn phím.

Giữ composition trang: hero → ruy băng → giới thiệu/định hướng → bốn hoạt động → hai ban → đội ngũ → CTA/FAQ → footer. Giữ nội dung, ảnh, dữ liệu, font và các liên kết thật. Canvas hero tiếp tục dùng logic và palette hiện tại.

Phạm vi mới cho phép sửa thiết kế và animation của chi tiết tương tác; bố cục tổng thể tiếp tục lấy bản home-preview hiện tại làm chuẩn. Những thay đổi kích thước cục bộ của mẫu Lucian được chỉ rõ ở mục 4, không được âm thầm áp vào toàn trang.

Chỉ triển khai trên `/home-preview`. `/`, `/tuyen-thanh-vien`, `/tuyen-thanh-vien-preview`, `/home-preview1` và các trang khác tiếp tục dùng component/hành vi mặc định.

## 2. Nguồn đã đọc

- Skill: `/Users/admin/.agents/skills/lucian-uxui/SKILL.md` và `references/porting.md`.
- `src/pages/home-color-preview-page.tsx`, `src/pages/home-preview-page.tsx`.
- `src/styles/home-color-preview.css`, `src/styles/color-preview-theme.css`.
- `HeroSection`, các section home-preview, `PreviewReveal`, `Button`, `Accordion`, `LeadershipGallery`, Header/Footer.
- Thư viện Lucian: đã chạy CLI search cho button, card hover, scroll reveal, FAQ và link hover; đã tải code gốc và tokens để đối chiếu, không chọn chỉ dựa trên tên mẫu.

Nguồn Lucian đã tải nằm trong `/tmp` để nghiên cứu. Khi triển khai cần chạy lại CLI `get` và lưu bản gốc được chọn vào thư mục tài liệu của dự án; không phụ thuộc vào file tạm còn tồn tại.

## 3. Mẫu chọn và mẫu không phù hợp

### Chọn cho đợt triển khai này

| Element | Dùng ở đâu | Lý do |
| --- | --- | --- |
| [#002 Magnetic arrow button](https://lucianlabs.dev/uxui-prompt/#002) | CTA “Đăng ký tham gia VIC” ở khối cuối trang | Capsule, orb mũi tên, lớp màu lan khi hover/focus và lực hút con trỏ tạo một điểm nhấn rõ; chỉ dùng một CTA magnetic để giữ phân cấp. |
| [#044 FAQ accordion](https://lucianlabs.dev/uxui-prompt/#044) | Ba câu hỏi hiện tại trong khối FAQ | Panel nổi nhẹ khi mở; dấu cộng thành trừ; câu trả lời mở mượt; hỗ trợ bàn phím và chỉ mở một câu mỗi lần. |

### Đã đọc nhưng không đưa vào bản mặc định

| Element | Lý do |
| --- | --- |
| #009 Rolling label button | Có trạng thái toggle/`aria-pressed`; CTA hiện tại là điều hướng. Dùng nguyên mẫu sẽ khiến hành vi khó hiểu. |
| #050 Spotlight-tilt news card | Card tin tức 340 × 400 có trạng thái đọc, phần minh họa và vùng metadata riêng; thay card hoạt động bằng mẫu này sẽ ảnh hưởng nội dung và tỷ lệ ảnh. |
| #228 Cursor-lit glowing card borders | Cụm bốn card nhỏ nằm trong khung cố định 340 × 340; không vừa bốn card hoạt động có ảnh và mô tả đầy đủ. Không tách thuật toán rồi gọi đó là port nguyên mẫu. |
| #251 Staggered scroll-in feature cards | Có vùng cuộn riêng 300 × 480 và replay khi cuộn lại; dễ tạo cuộn lồng nhau, khác cách trang hiện hoạt động. |
| #237 Line-by-line mask reveal headline | Là bộ headline có chuyển câu, nút Replay/Previous/Next và underline; không phù hợp với nội dung hero cố định. |
| #373 Five underline hovers | Là cụm menu lớn với chữ 30px trong khung 340 × 340; không phù hợp header capsule hiện tại. |

Không gắn thêm chức năng “đã đọc”, “theo dõi”, trạng thái toggle hoặc thông báo thành công giả chỉ để dùng được animation của mẫu.

## 4. Thay đổi theo khu vực

### A. Header và hai nút hero — giữ gọn, phản hồi rõ

- Giữ vị trí, kích thước và nhãn của CTA header, “Khám phá VIC”, “Tham gia VIC”.
- Đồng bộ hover/focus/pressed trong preview bằng các trạng thái Button đang có; một phần tử chỉ có một nơi điều khiển transform.
- Nút chính xanh chanh/chữ đen, nút phụ nền tối/viền sáng; trạng thái focus phải rõ tương đương hover.
- Không gắn magnetic lên toàn bộ navigation. Hai nút hero giữ chức năng cuộn đến `#about` và chuyển tới `/tuyen-thanh-vien-preview`.

### B. CTA cuối trang — điểm nhấn Lucian #002

- Port cấu trúc capsule, fill, text, orb và các giá trị chuyển động từ code `get 002`.
- Giữ motion gốc: button cao 76px; orb 56px; fill từ `circle(28px at calc(100% - 38px) 50%)` đến `circle(160% ...)`; transition fill `.8s var(--ux-ease)`; pressed scale `.96`; mũi tên đi ra `.55s`, đi vào `.6s` với delay `.28s`.
- Giữ công thức magnetic gốc: bán kính suy giảm 240px, hệ số của mag/text/orb; xử lý refs và cleanup trong React. Không thêm spring engine hoặc thư viện animation khác.
- Dùng đúng label hiện tại “Đăng ký tham gia VIC” và đích `/tuyen-thanh-vien-preview`. Render liên kết thật; giữ native click, mở tab mới bằng modifier và sử dụng bàn phím. Animation không trì hoãn điều hướng.
- Chuyển sample copy/trạng thái live của mẫu sang phản hồi điều hướng thực tế. Không hiển thị “đăng ký thành công” khi mới nhấn liên kết.
- Màu nền capsule và gradient ánh sáng lấy từ palette VIC, không giữ tím/mint của demo. Hai trạng thái đều phải có tương phản rõ.
- **Kích thước cần duyệt cùng plan:** mẫu có root 340 × 200px, lớn hơn nút hiện tại 48px. Đặt nguyên footprint đó trong slot CTA cuối, giữ căn trái; chấp nhận khối CTA tăng chiều cao cục bộ. Không áp root này cho hero/header, không scale bằng transform hoặc tự thu button xuống 48px. Trên mobile chỉ thêm `max-width:100%` theo hướng dẫn skill, rồi kiểm tra nhãn tiếng Việt thực tế.
- Nếu label và orb không vừa ở 375px, ghi rõ xung đột và giữ CTA cũ tại breakpoint đó trong bản thử. Không cắt nhãn, giảm font tùy tiện hoặc kéo tràn viewport để ép dùng mẫu.

### C. Card hoạt động, hai ban và nhân sự — hoàn thiện thiết kế đang có

Không thay card bằng mẫu Lucian có hình học/nội dung không phù hợp. Tiếp tục dùng card và Motion hiện tại, sửa các điểm sau chỉ trong preview:

- **Hoạt động:** giữ ảnh 16:9, mô tả, tags và grid hai cột. Giữ reveal hiện có `y:30`, duration `.7s`, delay `index * .09`; hover card `y:-5` và ảnh scale `1.045`. Điều phối hover ở cấp card để ảnh/icon phản hồi cùng nhau, thay vì chỉ chuyển động khi rê đúng lên từng phần tử con.
- Card hoạt động hiện là nội dung giới thiệu, không có đích chi tiết. Không thêm con trỏ dạng nút, Tab stop hoặc role button cho card không thực hiện hành động. Giữ hover trang trí nhẹ và không đặt thông tin cần đọc vào hover.
- **Hai ban:** giữ đường dẫn, nội dung và cách chia hiện tại. Rà transform của motion wrapper và link để tránh hai lớp cùng kéo card. Focus-visible có phản hồi tương đương hover, không cần con trỏ để nhận biết link.
- **Nhân sự:** giữ poster vuông, màu từng người và hành vi mở panel. Dùng focus/pressed nhất quán; phần ảnh vẫn hiển thị trọn poster. Không thêm tilt vào poster hoặc đổi thành card lật.
- Tránh thêm spotlight chạy liên tục trên mọi card. Viền sáng và shadow chỉ là trạng thái tương tác; không thêm lớp blur diện tích lớn.

### D. Animation xuất hiện và loop — chỉnh nhịp, không chồng animation

- Giữ các reveal/loop đang có trên grid, ruy băng, workspace, SVG và background. Không thêm scene hoặc vùng cuộn mới.
- Rà các phần tử đang đồng thời nhận animation từ CSS, Motion và wrapper. Phân vai rõ: wrapper giữ reveal, lớp con giữ hover; không để cùng phần tử nhận hai transform độc lập.
- Giữ các giá trị reveal đang dùng làm chuẩn, không thay hàng loạt sang một preset khác chỉ vì thư viện có preset.
- CTA #002 và FAQ #044 dùng nguyên motion của mẫu; không bọc thêm `whileHover`/`whileTap` của Button cũ hoặc wrapper CTA hiện tại lên cùng hiệu ứng.
- Reduced motion hiển thị trạng thái cuối ngay, giữ đầy đủ hành động và nội dung. Fine pointer mới có magnetic; touch không cần hover để dùng được.

### E. FAQ — Lucian #044

- Port item/card, trigger, icon cộng-trừ, body và answer của #044. Dùng đúng ba câu hỏi/trả lời hiện tại từ `faqs.slice(0, 3)`; không sao chép dữ liệu thành bộ riêng.
- Giữ các giá trị gốc: radius item 20px; trigger min-height 58px; item nổi lên 2px; body `.5s var(--ux-ease)` với `grid-template-rows:0fr → 1fr`; câu trả lời `.25s` opacity, `.45s` transform và delay `.12s`.
- Mẫu có root 350 × 400px. Đặt trong cột FAQ hiện có và giữ footprint gốc; đây là thay đổi hình học cục bộ thứ hai của plan. Kiểm tra đủ chỗ cho tiếng Việt và ba câu thật. Không ép chiều cao từng answer, không cắt nội dung. Nếu không vừa, hoãn thay FAQ và báo rõ trước khi sửa kích thước thiết kế Lucian.
- Quản lý trạng thái bằng React và ID bằng `useId`; một item mở, có thể đóng tất cả. Giữ aria-expanded/controls/labelledby, ArrowUp/ArrowDown/Home/End, Enter/Space.
- Khi panel đóng, nội dung không còn nhận focus hoặc xuất hiện như nội dung mở trong cây accessibility. Dùng giải pháp phù hợp với animation grid, không chỉ thay opacity.
- Sample links trong mẫu chỉ được render khi có dữ liệu thật. Không thêm link giả hoặc `href="#"`. Logic của các sample link phải được điều chỉnh tương ứng khi thay bằng dữ liệu VIC.

## 5. Theme bridge và giới hạn ảnh hưởng

Tạo scope riêng, ví dụ `data-vic-details="lucian"`, chỉ trên wrapper `/home-preview`. Không dùng mỗi `data-vic-theme="home-demo01"` để bật hành vi mới vì trang tuyển sinh preview cũng dùng theme này.

| Token Lucian | Ánh xạ VIC dự kiến |
| --- | --- |
| `--ux-page` | `--demo-bg` |
| `--ux-surface` | `--demo-surface` |
| `--ux-surface-2` | `--demo-surface-raised` |
| `--ux-ink` | `--demo-text` |
| `--ux-ink-2` | `--demo-muted` |
| `--ux-line`, `--ux-line-2` | Viền sáng theo palette VIC |
| `--ux-accent` | `--demo-lime` |
| `--ux-accent-2` | `--demo-blue` |
| `--ux-accent-ink` | `--demo-bg` |
| `--ux-ease`, `--ux-spring` | Giữ nguyên giá trị trả về từ CLI tokens |

Map thêm mọi token thực sự được source đã chọn sử dụng, gồm local `--bg`, `--fg`, `--blob` của #002 và các màu ghi trực tiếp. Giữ `.ux` base rules, focus và reduced-motion; font kế thừa Be Vietnam Pro của VIC. Không chép token Lucian lên `:root` làm thay màu toàn site.

Chạy kiểm tra light/dark cho component trong môi trường kiểm tra riêng theo skill; bản `/home-preview` tiếp tục chủ động dùng dark theme. Không thêm theme switch cho người dùng trong nhiệm vụ này.

## 6. Cấu trúc code dự kiến

```text
src/components/home-color-preview/lucian/
  magnetic-cta.tsx             # #002, có comment license ở dòng đầu
  faq-accordion.tsx            # #044, có comment license ở dòng đầu
src/styles/
  home-preview-lucian.css      # .ux bridge và style scoped .u002/.u044
docs/references/lucian-home-preview/
  lucian-002.html              # source get nguyên bản, giữ license
  lucian-044.html
  tokens.css
```

- `HomeColorPreviewPage` bật biến thể tương tác; các section chung nhận prop tùy chọn có default giữ hành vi hiện tại. Không suy đoán biến thể dựa trên `window.location` trong từng button.
- `HomePreviewPage` truyền lựa chọn tới hero, hoạt động, các ban, đội ngũ và CTA/FAQ ở những vị trí cần thiết. Header nhận prop tương tự chỉ khi cần đổi các trạng thái của nó.
- Không sửa mặc định `src/components/ui/button.tsx`, `accordion.tsx` hoặc `PreviewReveal` để toàn site tự đổi theo.
- Style Lucian giữ CSS thuần, prefix gốc, hình học và motion gốc. Không chuyển toàn bộ sang Tailwind hoặc dùng Motion thay hết CSS của mẫu.
- React dùng refs/effect cho pointer; state cho accordion; không setState theo frame. Cleanup timers/listeners/rAF/observers và chống nhân đôi khi StrictMode mount lại.

## 7. Trình tự thực hiện

1. Chụp baseline `/home-preview` ở desktop và 375px; ghi lại chức năng CTA, card, panel thành viên và FAQ.
2. Tải lại #002, #044 và tokens bằng CLI. Lưu source cùng license; rà footprint thật với nội dung VIC trước khi nối vào trang.
3. Tạo bridge token và component riêng. Thử #002 trong slot CTA cuối, #044 trong cột FAQ; xử lý các điểm tương thích đã nêu, không tự sửa motion/design gốc.
4. Bật biến thể chỉ ở `/home-preview`. Rà CTA header/hero, phối hover của card hiện tại, loại bỏ animation bị chồng ở CTA vừa thay.
5. Kiểm tra responsive, keyboard, touch, reduced motion và StrictMode. Đối chiếu các route chính và trang tuyển sinh preview để phát hiện ảnh hưởng ngoài phạm vi.
6. Typecheck, production build, kiểm tra trực quan và bàn giao ảnh so sánh cùng danh sách element đã dùng. Ghi rõ phần nào giữ bản cũ do footprint không phù hợp.

## 8. Tiêu chí nghiệm thu

- Giữ thứ tự section, nội dung thật, ảnh và palette của home-preview; thuật toán/grid hero không đổi.
- CTA magnetic là liên kết hoạt động thật; không báo thành công giả, không chặn điều hướng để đợi animation.
- FAQ đủ nội dung tiếng Việt, mở/đóng đúng, chỉ một câu mở, keyboard đầy đủ, vùng đóng không giữ focus.
- Card hoạt động không giả làm nút; card nhân sự vẫn mở panel, Escape và trả focus hoạt động.
- 375px không tràn ngang/cắt chữ; các breakpoint desktop/tablet không bị chồng nội dung.
- `prefers-reduced-motion` có hiệu lực; không nhân listeners/rAF khi mount lại; không thêm loop không cần thiết.
- Kiểm tra khung hình trước/sau trong cùng điều kiện ở vùng hero, activities và CTA. Không tuyên bố đạt 120fps chỉ dựa vào build; ghi rõ máy/trình duyệt và kết quả đo thực tế nếu đo được.
- TypeScript và production build đạt. Nếu môi trường chặn mở server/trình duyệt, báo rõ giới hạn kiểm tra.
- Giao diện các route ngoài `/home-preview` và link Google Form thật giữ đúng luồng hiện tại.

## 9. Prompt triển khai

```text
Hãy nâng cấp các chi tiết tương tác của /home-preview theo IMPLEMENTATION_PLAN_HOME_PREVIEW_LUCIAN.md, sử dụng skill lucian-uxui và đọc references/porting.md trước khi port.

Đọc source hiện tại, giữ composition, nội dung, ảnh và palette đen/xanh dương/xanh chanh. Giữ nguyên Canvas hero. Chỉ /home-preview nhận biến thể chi tiết mới; home chính, tuyển sinh chính, tuyển sinh preview và các route khác giữ mặc định.

Mẫu chọn: #002 Magnetic arrow button cho CTA cuối và #044 FAQ accordion cho ba câu hỏi hiện tại. Chạy CLI get đúng ID và tokens; lưu source, giữ comment MIT ở dòng đầu mỗi component. Không dựng lại code từ tên/summary. Giữ structure, shape, footprint và motion gốc; map màu và nội dung thật. Đọc các giới hạn footprint và phương án fallback ở mục 4 trước khi tích hợp. Không tự thu nhỏ thiết kế Lucian hoặc thay nội dung để ép vừa.

CTA phải là link thật tới /tuyen-thanh-vien-preview, không chờ animation, không báo đăng ký thành công giả. FAQ dùng dữ liệu faqs hiện tại, React state/useId, keyboard/ARIA đầy đủ, panel đóng không còn focusable. Những sample link không có dữ liệu thật phải được loại khỏi dữ liệu/render và logic tương ứng.

Với header/hero, card hoạt động, hai ban và nhân sự, hoàn thiện trạng thái tương tác trên thiết kế đang có theo mục 4; không thay thành #050/#228 hoặc thêm chức năng đọc/theo dõi. Không đổi default của Button/Accordion/PreviewReveal toàn site. Dùng prop biến thể opt-in và scope data-vic-details riêng; không kích hoạt theo theme màu chung của tuyển sinh preview.

Giữ CSS Lucian thuần và chuyển động gốc; Motion tiếp tục phục vụ các tương tác đang có. Một phần tử chỉ có một hệ thống điều khiển transform; không bọc thêm magnetic/hover/spring trùng. Không thêm thư viện animation. Cleanup mọi tài nguyên, không setState mỗi frame, hỗ trợ StrictMode, pointer touch/fine, reduced motion và tab visibility.

Kiểm tra desktop, 375px, keyboard, reduced motion, light/dark ở môi trường component, chức năng link/panel/FAQ, TypeScript và production build. Báo trung thực giới hạn kiểm tra; không gửi form trong khi thử UI. Bàn giao danh sách element theo format skill cùng link nguồn và những điều chưa kiểm tra được.
```

## 10. Giới hạn đã xác nhận khi triển khai

Đã tích hợp hai mẫu vào bản preview. Việc kiểm tra trực quan qua trình duyệt chỉ hoàn tất một phần: có thể xem hero/card và cây accessibility, nhưng công cụ điều khiển trình duyệt mất ổn định khi cuộn đến CTA/FAQ. Vì vậy chưa xác nhận bằng mắt các trạng thái ở viewport 375px, thao tác bàn phím, touch và reduced motion. Không gửi hoặc chỉnh sửa Google Form.

## 11. Kết quả triển khai

- Đã port #002 vào CTA cuối trang và nối trực tiếp tới route `/tuyen-thanh-vien-preview`. Giữ kích thước gốc của capsule/orb và chuyển động magnetic; thay màu theo VIC, bỏ thông báo thành công giả và để liên kết điều hướng ngay khi nhấn.
- Đã port #044 vào ba FAQ đầu, dùng dữ liệu hiện có. Accordion mở một mục, có thể đóng hết; hỗ trợ ArrowUp/ArrowDown/Home/End, `aria-expanded`, `aria-controls`, region có nhãn và `inert` khi đóng.
- Bật hai phần trên bằng `lucianInteractions` chỉ trong `HomeColorPreviewPage`, scope token dưới `data-vic-details="lucian"`. Route `/` giữ Button và Accordion trước đây.
- Đồng bộ hover toàn card hoạt động để ảnh và icon phản hồi cùng lúc; card thành viên có phản hồi focus tương đương hover chỉ trên bản home preview. Reduced motion tắt các chuyển động trang trí tương ứng.
- Lưu source có MIT header và token bridge tại `docs/references/lucian-home-preview/`; component mới nằm trong `src/components/home-color-preview/lucian/`.
- `npm run typecheck`, `git diff --check` và `npx vite build --outDir /tmp/vic-home-preview-lucian-build --emptyOutDir` đạt. Build vẫn có cảnh báo bundle Three.js vượt 500 kB.
- Mở local `/home-preview` và kiểm tra ảnh chụp hero/card cùng cây accessibility. CTA được liệt kê là link tới `/tuyen-thanh-vien-preview`; FAQ có đủ ba câu và câu đầu đang mở. CUA không ổn định khi cuộn tiếp, nên chưa kiểm tra bằng mắt phần CTA/FAQ, keyboard, touch và viewport 375px. Không gửi hoặc sửa Google Form.
- Dev server đang chạy tại `http://127.0.0.1:5174/home-preview` để xem tiếp.

### Bổ sung sau phản hồi giao diện

- Đổi đường cong chính phía sau section hai ban sang xanh chanh.
- Hai thẻ Ban Chủ nhiệm trên `/home-preview` chạy lại animation khi vào viewport và trở về trạng thái ẩn khi rời viewport; các route khác giữ `once: true`.
- Nút “Tham gia VIC” trên header desktop và menu mobile dùng cùng magnetic interaction với CTA cuối, ở footprint gọn phù hợp header và chuyển động bằng gradient xanh đậm.
- CTA cuối cũng chuyển sang gradient xanh đậm; các CTA nền xanh chanh trên bản home preview chuyển sang nền tối/xanh đậm. Xanh chanh còn vai trò nhấn màu.
- Đã chạy lại `npm run typecheck`, `git diff --check` và production build; đều đạt. Build vẫn có cảnh báo chunk Three.js lớn hơn 500 kB.
