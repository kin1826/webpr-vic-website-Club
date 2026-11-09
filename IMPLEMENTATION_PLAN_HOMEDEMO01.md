# VIC — Home sáng/tối và hiệu ứng sóng lật ô vuông

Ngày cập nhật: 08/11/2026.

**Trạng thái: đã thay `/home-preview1` bằng home hiện tại; hai theme và hiệu ứng lật một lần đã được nối.**

Kế hoạch này thay thế nội dung thử phối màu trước đây trong file. Đích thử nghiệm mới là `/home-preview1`.

## 1. Những quyết định đã xác nhận

- Hợp nhất home sáng hiện tại với home tối đã duyệt, mang các nâng cấp button của bản tối sang cả hai chế độ.
- Làm trước tại `/home-preview1`; dùng route này thay bản Hyperlab cũ khi bắt đầu triển khai.
- Lần đầu theo cài đặt sáng/tối của hệ thống. Khi người xem chọn thủ công, nhớ lựa chọn cho lần sau.
- Nút đổi theme ở **trong header, cạnh nút Tham gia VIC**, trên desktop lẫn mobile.
- Chỉ lật các ô hover/ambient hiện có trong Canvas hero, khi hero đang trong viewport; sóng xuất phát từ nút theme và lan từ trên xuống.
- Mỗi ô hiện có co/mở theo trục ngang thành một lượt 180°; không tạo tile phủ mới, không ảnh hưởng chữ hoặc section khác.
- `/home-preview1` dùng toàn bộ composition của home hiện tại; theme tối dùng bộ màu và tương tác của `/home-preview`. Không giữ section Hyperlab cũ.

## 2. Nguồn chuẩn và hiện trạng đã đọc

| Thành phần | Source thực tế / vai trò |
| --- | --- |
| Home sáng `/` | Router đang render `HomePreviewPage` trong `src/pages/home-preview-page.tsx`. Đây là chuẩn sáng; không lấy `HomePage` cũ trong `home-page.tsx` làm nguồn. |
| Home tối `/home-preview` | `HomeColorPreviewPage` dùng lại `HomePreviewPage`, có palette tối và các nâng cấp tương tác vừa duyệt. |
| Button nâng cấp | `MagneticCta`: capsule, lớp màu lan, orb mũi tên, magnetic pointer; có biến thể compact cho header. |
| Màu bản tối mới nhất | Đen `#030407`, xanh dương `#1558C9`, xanh đậm `#0A2452`, xanh chanh `#D4FF24`; button đã chuyển sang nền tối/gradient xanh đậm. Không quay lại các button xanh chanh cũ. |
| FAQ | Bản tối dùng Lucian #044; ưu tiên một widget dùng chung giữa hai theme để giữ trạng thái khi chuyển. |
| `/home-preview1` | Đã mở route khỏi `defaultPagePaths`. Dùng `HomePreviewPage`, `Header` và `Footer` hiện tại cho cả hai theme; chỉ khác token, palette grid và CTA tuyển sinh theo theme. |
| Shell | `App` coi `/home-preview1` là route tự quản header/footer; trang thử phải cung cấp shell đầy đủ và tránh render hai lần. |
| Canvas | `InteractiveGrid` đã có palette tùy chọn. Đây là nền hero, tách biệt với lớp chuyển theme. |
| Panel thành viên | `DialogContent` dùng portal, nhận theme qua prop; phải nhận theme đang chọn của trang thử. |

Đọc thêm `STYLE_GUIDE.md`, `IMPLEMENTATION_PLAN_HOME_PREVIEW_LUCIAN.md`, các section hiện tại và `ui-design-references/` khi triển khai. Các mẫu Lucian đã port và source có license trong `docs/references/lucian-home-preview/` là nguồn để dùng lại; không cần chọn thêm mẫu hoặc thư viện animation cho nhiệm vụ này.

## 3. Ý tưởng: Một home, hai trạng thái ánh sáng

Trang sáng giữ cảm giác giấy trắng, kính trong, chữ đen và xanh dương của home chính. Trang tối giữ chất công nghệ đen/xanh đậm/xanh chanh của home-preview đã duyệt. Cả hai có cùng nội dung, vị trí section, ảnh, poster và nhịp tương tác.

Nút đổi theme giống một công tắc vật liệu nhỏ trong header: biểu tượng mặt trời/mặt trăng đặt trong capsule hoặc ô kính bo tròn, cùng chiều cao thị giác với cụm CTA. Khi nhấn ở hero, chính các ô đang được Canvas làm sáng sẽ lật theo sóng từ nút xuống dưới. Ngoài hero, theme chỉ chuyển nhẹ.

Hiệu ứng dùng đúng ngôn ngữ ô caro đã có của hero, không tạo lớp trang trí mới và không làm card hoặc nội dung thay đổi bố cục.

## 4. Hợp nhất giao diện và button

### 4.1. Một cây nội dung dùng chung

Dùng lại composition của `HomePreviewPage`: hero → ruy băng → giới thiệu/định hướng → hoạt động → hai ban → tổ chức/đội ngũ → CTA/FAQ → footer.

Cả hai theme dùng cùng section/component và dữ liệu. Chỉ thay token, palette Canvas và các chi tiết tương phản. Khi đổi theme, giữ nguyên vị trí cuộn, FAQ đang mở, dữ liệu và trạng thái tương tác; không dùng `key={theme}` để remount toàn trang.

### 4.2. Button

- Header dùng MagneticCta compact; nhãn và đích tuyển sinh đúng luồng thử nghiệm.
- CTA tham gia tại hero, giới thiệu và cuối trang dùng chung nền tảng button mới; chọn kích thước theo slot hiện tại, tránh tăng chiều cao section do dùng nguyên root demo 340 × 200 ở mọi nơi.
- Chỉ các CTA tham gia cần magnetic; nút khám phá/cuộn và link phụ có hover, focus, pressed rõ nhưng nhẹ hơn để giữ phân cấp.
- Theme sáng: capsule đen hoặc xanh đậm, chữ sáng, fill xanh dương và orb có điểm nhấn xanh phù hợp nền trắng.
- Theme tối: giữ nền đen/gradient xanh đậm, chữ trắng; xanh chanh làm viền hoặc chi tiết nhỏ, không trở lại button nền xanh chanh.
- Hover và focus dùng màu chữ đã kiểm tra tương phản. Không để chữ đen trên gradient xanh đậm.
- Giữ liên kết thật, modifier-click, Enter và mở tab mới. Animation không trì hoãn điều hướng, không báo đăng ký thành công giả.
- Dùng CSS và Motion hiện có; xử lý pointer bằng refs/effect, cleanup đầy đủ, không setState theo frame.

### 4.3. Các chi tiết liên quan

- FAQ dùng cấu trúc mới nhất và token sáng/tối; giữ nguyên câu hỏi/trả lời và trạng thái mở.
- Hai thẻ Ban Chủ nhiệm giữ hiệu ứng vào/ra đã duyệt; theme switch không kích hoạt lại hàng loạt reveal.
- Đường cong trang trí ở section hai ban: xanh dương trong chế độ sáng, xanh chanh trong chế độ tối.
- Poster và màu cá nhân của từng thành viên giữ nguyên; panel, chrome, focus và nền nhận đúng theme hiện hành.
- Dropdown, menu mobile, footer, lớp loading và phần nền phía sau header được phối đồng bộ.
- Grid hero giữ kích thước ô, DPR, influence, smoothing, ambient và cơ chế tối ưu hiện có. Chỉ thay palette qua API hiện tại.

## 5. Đặc tả sóng lật ô vuông

### 5.1. Hình ảnh và điểm xuất phát

Lấy tâm nút đổi theme bằng `getBoundingClientRect()` tại thời điểm nhấn. Đây là gốc sóng; không cố định ở góc phải dưới. Vì nút nằm gần phía trên bên phải của header, làn sóng thường đi từ trên phải ra các vùng còn lại, theo khoảng cách thực tế.

Không tạo lớp phủ, Canvas thứ hai hoặc các ô DOM. Lật trực tiếp các ô 64px mà `InteractiveGrid` đang vẽ khi hover/ambient. Giữ tâm và kích thước hiện tại của từng ô. Từ tối sang sáng, mặt tối co lại theo trục ngang rồi mở thành mặt sáng; sáng sang tối đảo màu. Chỉ các ô đang có hiệu ứng tại thời điểm bấm mới tham gia.

Sóng bắt đầu từ tọa độ nút đã quy đổi sang hero, đi từ hàng trên xuống dưới và uốn nhẹ theo trục ngang. Chữ, nút, ribbon và các section khác không bị biến đổi.

### 5.2. Trình tự chuyển đề xuất

1. **Nhận thao tác:** nếu hero đang trong viewport và không bật reduced motion, lấy tâm nút và theme đích.
2. **Chụp trạng thái ô đang hoạt động:** dùng hàng/cột, giá trị hover/ambient và kích thước hiện có trong `InteractiveGrid`.
3. **Lật một lượt trong vòng vẽ Canvas hiện tại:** mỗi ô chiếu một góc 180° quanh trục ngang; đổi màu mặt tại nửa vòng và trễ theo sóng từ trên xuống.
4. **Kết thúc:** vòng rAF hiện có trở về cách vẽ hover/ambient bình thường. Không thêm vòng rAF hay lớp phủ.

Độ trễ mỗi ô dựa trên khoảng cách tâm ô tới nút:

```text
verticalProgress = clamp((cellCenterY - buttonY - waveCurve) / heroHeight, 0, 1)
flipDelay = verticalProgress × waveSpread + smallHorizontalOffset
```

Giữ lượt lật dưới một giây. Dùng `scaleY = cos(π × progress)` để Canvas chiếu một lượt xoay 180°; không thay kích thước ô hoặc scale Canvas.

Chỉ hiệu ứng trên các ô nền của hero. Các section phía dưới không nhận animation lật; theme trang vẫn đổi nhẹ theo token chung.

### 5.3. Điều khiển và khả năng truy cập

- Nút theme là `button` thật, có tên truy cập rõ cho hành động tiếp theo; dùng `aria-pressed` cho trạng thái tối hoặc mô hình tương đương nhất quán.
- Phím Enter/Space hoạt động, focus-visible rõ; focus vẫn ở nút theme.
- Trong lúc các ô hero lật, bỏ qua thao tác đổi theme trùng. Không khóa tương tác với phần còn lại của trang.
- Khi modal thành viên mở, nút header nằm sau modal và tuân theo focus trap hiện có; không đặt công tắc xuyên lên trên modal.
- Nếu hero ngoài viewport hoặc `prefers-reduced-motion` bật, đổi theme trực tiếp, không lật ô.
- Nếu tab bị ẩn, hero rời viewport, resize hoặc route đổi giữa lúc lật: hoàn tất lượt hiện tại và giải phóng callback.
- Mobile có hit area ít nhất 44px, vị trí phù hợp safe area. Header mobile vẫn cho dùng nút theme cạnh cụm hành động, không bắt mở menu mới đổi được.

## 6. Theme và trạng thái

Tạo theme context riêng của trang thử, type `HomeTheme = "light" | "dark"`. Có thể lưu preference riêng bằng key như `vic.home-preview1.theme`, chỉ chứa lựa chọn giao diện.

Thứ tự xác định theme: lựa chọn thủ công hợp lệ đã lưu → `prefers-color-scheme` → light. Khi chưa có lựa chọn thủ công, theo thay đổi theme hệ thống bằng cập nhật nhẹ; chỉ thao tác nhấn nút mới chạy sóng lật. Đọc storage trong `try/catch`, không để storage bị chặn làm lỗi trang.

Dùng token ngữ nghĩa cho nền, mặt nổi, chữ, chữ phụ, viền, accent, kính, bóng, button và trạng thái focus. Token từng theme được scope dưới wrapper thử nghiệm; portal nhận theme qua context/prop tường minh. Tháo theme/metadata tạm khi rời route.

Tránh flash sai theme lúc mở trực tiếp trang thử: xác định preference trước lần paint của nội dung route khi có thể, lớp fallback mang màu phù hợp, và không để trang tối chớp trắng. Không gắn `transition: all` lên toàn bộ DOM; hiệu ứng lật chỉ áp dụng lên ô Canvas trong hero.

## 7. Hiệu năng

- Giữ một cây nội dung, một bộ ảnh và một Canvas hero. Không render hai trang sáng/tối chồng nhau, không screenshot toàn trang cho mỗi lần bấm.
- Tính độ trễ cho các ô đang hoạt động một lần khi bấm; giữ các mảng trạng thái trong refs.
- Chiếu lượt xoay bằng transform Canvas quanh tâm từng ô. Không thêm DOM/Canvas để lật, không blur, không scale Canvas/parent.
- Chạy animation trong requestAnimationFrame hiện có. Không thêm GSAP hoặc thư viện animation trùng chức năng.
- Grid và ambient tiếp tục tuân theo viewport/tab visibility hiện có; khi hero rời viewport thì hoàn tất lật và dừng loop theo cơ chế hiện hành.
- Đo trong cùng điều kiện trước/sau; không tuyên bố 120fps chỉ vì build đạt. Theo dõi dropped frames, long tasks và số layer ở thao tác đổi theme lặp lại.

## 8. Phạm vi route và điều hướng

Khi được duyệt triển khai, thay entry `/home-preview1` bằng bản home sáng/tối này và bỏ đúng route đó khỏi `defaultPagePaths`. Không mở lại các trang đang default khác.

Bản thử tự render Header + nội dung dùng chung + Footer. Logo về `/home-preview1`; CTA tuyển sinh về `/tuyen-thanh-vien-preview` để tiếp tục xem luồng thử nghiệm đã có. Trang tuyển sinh preview vẫn là bản hiện tại, chưa thêm theme switch vào trang đó trong nhiệm vụ này. Google Form thật giữ nguyên URL và hành vi mở tab mới.

`/`, `/home-preview`, `/tuyen-thanh-vien` và các route hiện hành tiếp tục là nguồn đối chiếu trong giai đoạn thử. Sau khi duyệt `/home-preview1`, mới lập bước đưa bản hợp nhất về `/` và mở rộng theme sang các trang khác.

## 9. Cấu trúc triển khai

```text
src/pages/home-preview1-page.tsx                    # theme preference, toggle và shell dùng chung
src/components/layout/header.tsx                    # CTA Magnetic và nút theme cạnh nhau
src/components/shared/interactive-grid.tsx          # lật các ô Canvas hiện có bằng rAF hiện tại
src/components/sections/hero-section.tsx           # truyền ref hero và grid
src/pages/home-preview1-page.tsx                    # gửi theme đích và tọa độ nút
src/styles/home-preview1-theme.css                 # nút theme; không chứa lớp phủ tile
src/pages/home-preview-page.tsx                    # composition home dùng chung
```

Dùng lại MagneticCta và FAQ đã port; tham số hóa palette/kích thước theo từng slot rõ ràng. Không chép nguyên source home sáng và tối thành hai bộ component độc lập. Những component dùng chung được mở rộng bằng props/context có mặc định tương thích với các route hiện hành.

Source Hyperlab có thể ngừng được import bởi route mới. Chỉ xóa file cũ sau khi rà tham chiếu; không xóa theo tên thư mục một cách hàng loạt.

## 10. Các bước triển khai đã thực hiện

1. Ghi baseline home sáng và tối ở cùng viewport; kiểm tra trạng thái button, FAQ, panel và grid.
2. Tách token sáng/tối và entry trang thử dùng chung section; mở `/home-preview1` khỏi default.
3. Hợp nhất button, theme hóa FAQ/header/footer/portal; xác nhận cả hai chế độ chạy đúng trước khi thêm sóng.
4. Thêm context, preference hệ thống/lưu thủ công và công tắc trong header, xử lý first paint.
5. Thêm phép chiếu lật một lượt vào các ô hover/ambient của Canvas hero; truyền theme và tọa độ nút; thêm cleanup/reduced motion.
6. Kiểm tra thao tác liên tiếp, responsive, bàn phím, route, storage lỗi và tab visibility; đo hiệu năng và tinh chỉnh số ô/thời gian.
7. Typecheck, production build, kiểm tra trực quan; cập nhật kết quả thực tế vào file kế hoạch và bàn giao route thử.

## 11. Tiêu chí nghiệm thu

- `/home-preview1` mở trực tiếp và refresh được, hiện home hợp nhất thay cho Default/Hyperlab.
- Hai theme giữ composition và dữ liệu đúng home hiện tại; button nâng cấp hoạt động ở cả hai.
- Công tắc ở header cạnh CTA, desktop/mobile đều dùng được; lần đầu theo hệ thống, lần sau nhớ lựa chọn thủ công.
- Khi hero đang hiện, chính các ô hover/ambient hiện có lật theo sóng từ nút xuống dưới; không có ô phủ mới hoặc Canvas lật thứ hai.
- Khi hero ngoài viewport, đổi theme nhẹ và không chạy animation lật.
- Chuyển theme không remount toàn trang, không đổi scroll, không đóng FAQ hoặc phát lại hàng loạt reveal.
- Không chớp sai palette; không ô nào còn kẹt transform sau khi đổi theme.
- Bấm nhanh nhiều lần, đổi route/resize/ẩn tab trong lúc chạy không gây kẹt trạng thái.
- Bàn phím, focus, reduced motion, menu mobile và panel portal đúng theme.
- Grid hero giữ nguyên hình học/logic, không có rAF trùng hoặc listener/timer bị giữ sau unmount.
- Kiểm tra desktop, mobile 375/390px và màn hình lớn; không tràn ngang, header không chồng nút.
- TypeScript và production build đạt; ghi rõ kết quả đo hiệu năng và giới hạn kiểm tra.
- Chỉ thay code cần cho bản thử; không gửi Google Form khi kiểm tra.

## 12. Prompt triển khai đầy đủ

```text
Hãy triển khai bản home sáng/tối tại /home-preview1 theo IMPLEMENTATION_PLAN_HOMEDEMO01.md. Người dùng đã xác nhận: lần đầu theo hệ thống, nhớ lựa chọn thủ công; công tắc nằm trong header cạnh nút Tham gia VIC; chỉ các ô hover/ambient hiện có của Canvas hero được lật khi hero nằm trong viewport.

ĐỌC SOURCE
Đọc src/app.tsx, src/config/page-availability.ts, home-preview-page.tsx, home-color-preview-page.tsx, home-preview1-page.tsx, Header/Footer, các section home, InteractiveGrid, LeadershipGallery/DialogContent, MagneticCta/FAQ, CSS theme và kế hoạch Lucian hiện tại. Router / đang render HomePreviewPage, không phải HomePage legacy. /home-preview1 hiện bị defaultPagePaths che và source vẫn là Hyperlab. Đọc STYLE_GUIDE.md và tham khảo ui-design-references. Dùng lại source Lucian đã port có license; không thay bằng mẫu phỏng đoán từ tên.

PHẠM VI
Chỉ làm bản hợp nhất tại /home-preview1. Thay entry Hyperlab ở route này, bỏ đúng /home-preview1 khỏi defaultPagePaths và giữ shell một Header/một Footer. Home sáng hiện tại là chuẩn light; home-preview mới nhất là chuẩn dark và tương tác button. Giữ composition, nội dung, ảnh, poster, font, responsive và grid. Logo của bản thử về /home-preview1, CTA tuyển sinh tới /tuyen-thanh-vien-preview. Không mở rộng theme switch sang tuyển sinh hoặc đưa về home chính ở đợt này.

HỢP NHẤT
Dùng một cây component và một bộ dữ liệu cho cả hai theme. Không render hai trang chồng nhau, không remount bằng key theme. Giữ scroll và FAQ state. Hợp nhất nâng cấp button: MagneticCta compact trong header; CTA tham gia ở hero/giới thiệu/cuối dùng biến thể phù hợp slot. Nút phụ giữ phân cấp. Theme tối dùng button đen/xanh đậm, chữ sáng; không phục hồi button nền xanh chanh. Theme sáng dùng button đen/xanh, màu chữ đủ tương phản. Giữ link thật và điều hướng tức thì. FAQ, menu, panel thành viên qua portal và footer có theme đúng. Giữ màu poster/màu cá nhân.

THEME
Tạo provider riêng với type light|dark, preference scoped cho bản thử. Ưu tiên lựa chọn thủ công đã lưu, rồi hệ thống, rồi light. Khi chưa có lựa chọn thủ công, cập nhật theo hệ thống bằng chuyển nhẹ; chỉ thao tác nút mới chạy sóng. Handle storage lỗi. Hạn chế flash sai màu ở first paint/fallback. Scope token và CSS dưới wrapper thử nghiệm, truyền theme tường minh cho portal, cleanup khi đổi route.

CÔNG TẮC VÀ SÓNG LẬT
Đặt button thật trong header cạnh Tham gia VIC, luôn dùng được trên mobile. Hit area tối thiểu 44px; tên truy cập, focus và trạng thái rõ. Khi bấm, dùng getBoundingClientRect của nút và hero để đổi tọa độ sang hệ Canvas. Chỉ khởi chạy lật nếu hero còn trong viewport.

Lật chính các ô đã được InteractiveGrid vẽ cho hover/ambient. Dùng đúng CELL_SIZE, hàng/cột, tâm và kích thước render hiện tại. Mỗi ô co theo trục ngang rồi mở ra trong một lượt 180°; đổi mặt màu ở nửa vòng. Delay đi từ hàng trên xuống dưới, uốn nhẹ theo chiều ngang. Dark→light lật mặt tối sang sáng; light→dark đảo màu mặt nhưng cũng chỉ lật một lượt. Không tạo overlay, DOM tile, Canvas phụ hoặc hiệu ứng cho chữ/CTA/ribbon/section dưới.

Dùng refs và vòng requestAnimationFrame hiện tại; không setState từng frame, không thêm vòng rAF. Giữ nguyên influence, smoothing, ambient, scale, kích thước CSS pixel và DPR. Bỏ qua click theme lặp khi lật; khi hero ngoài viewport hoặc reduced motion thì đổi theme trực tiếp. Nếu resize, tab ẩn, hero rời viewport hoặc unmount, kết thúc lượt lật an toàn. Không cài thư viện animation mới.

GRID VÀ HIỆU NĂNG
InteractiveGrid nhận theme đích và tọa độ nút qua ref. Giữ CELL_SIZE, DPR, influence, smoothing, ambient, scale, tọa độ chuột và logic pause/visibility. Rà Strict Mode, bảo đảm rAF hiện tại được dùng và cleanup khi bị ẩn/unmount. Đo dropped frames/long tasks khi đổi theme và cuộn; không tuyên bố 120fps nếu chưa đo.

KIỂM TRA VÀ BÀN GIAO
Chạy TypeScript và production build. Trực tiếp thử desktop/mobile 375/390px, bàn phím, reduced motion, first paint, preference hệ thống/thủ công, storage bị chặn, reload, cuộn giữa/cuối trang, bấm nhanh, resize/tab ẩn/đổi route giữa animation. Kiểm tra header không chồng, FAQ giữ state, panel/menu đúng theme, links đúng và grid không đổi hành vi. So sánh / và /home-preview làm baseline. Không gửi Google Form. Báo rõ phần chưa kiểm tra được. Bàn giao /home-preview1, mô tả ngắn thay đổi và kết quả; cập nhật trạng thái kế hoạch theo thực tế.
```

## 13. Kết quả triển khai

- `/home-preview1` giờ render toàn bộ home đang dùng tại `/`: header, hero, ribbon, giới thiệu, hoạt động, ban, sơ đồ tổ chức, CTA/FAQ và footer. Các section Hyperlab cũ không còn được render.
- Theme tối dùng đúng composition và palette của `/home-preview`; hai mode giữ một cây nội dung và không remount trang khi đổi.
- Công tắc sáng/tối nằm cạnh CTA trong header, theo theme hệ thống lúc đầu và lưu lựa chọn thủ công trong `vic.home-preview1.theme`. CTA header dùng MagneticCta ở cả hai theme; tương tác Lucian đã nối cho bản hợp nhất.
- Khi hero đang trong viewport, chính các ô đang có hiệu ứng hover/ambient được chiếu một lượt 180° theo sóng từ nút xuống dưới. Không tạo lớp phủ hoặc lưới lật mới. Ngoài hero và khi reduced motion bật, theme đổi trực tiếp.
- Canvas grid giữ kích thước và thuật toán hover/ambient; phép lật dùng vòng rAF hiện có, không tạo loop thứ hai.
- `npm run typecheck`, production build (`/tmp/vic-home-preview1-grid-flip-build`) và `git diff --check` đều đạt.
- Browser access host không khả dụng trong phiên này, nên chưa kiểm tra trực quan hoặc thao tác click trực tiếp qua trình duyệt.
