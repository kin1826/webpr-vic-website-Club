# Home Demo 01 — VIC / Hyperlab

Trạng thái: **đã triển khai bản Hyperlab tại `/home-preview1`** và thay source Mạch mở của route này. Trang chủ `/` không đổi. TypeScript và production build đã chạy thành công; kiểm tra trực quan trong trình duyệt chưa thực hiện được trong phiên này.

Route triển khai sau khi yêu cầu code: /home-preview1, thay bản demo hiện tại tại cùng địa chỉ.

## 1. Hướng thiết kế được chọn

**VIC / Hyperlab — Một không gian để cùng kiến tạo.**

Trang chủ mang cảm giác bước vào một xưởng công nghệ đang vận hành: vật thể có khối, kính có độ dày, kim loại phản sáng, các lớp giao diện nằm ở những độ sâu khác nhau. Chuyển động xuất hiện, chuyển cảnh khi cuộn, loop nền và tương tác card cùng tạo thành một trải nghiệm thống nhất.

Bảng màu chính: đen, trắng và xanh đậm. Cyan lạnh chỉ xuất hiện ở các đường dẫn sáng và trạng thái tương tác. Sắc xanh phải có chiều sâu, không biến cả trang thành một lớp neon.

Trang cần cho thấy chất lượng của một sản phẩm công nghệ: dựng hình, bố cục, vật liệu, ánh sáng, typography và nhịp chuyển động được chăm chút đồng thời. Số lượng hiệu ứng không thay thế chất lượng tạo hình.

### Những gì cần thay từ bản vừa làm

Dựa trên source hiện tại, bản “Mạch mở” dùng nền bạc xanh, vật thể phiến vẽ bằng Canvas 2D và nhiều khối nội dung phẳng. Các loop tập trung vào đường viền, tín hiệu nhỏ; card chưa có mô hình 3D thực sự.

Bản mới chuyển sang dựng hình 3D với phối cảnh, vật liệu và ánh sáng thật trong scene. Bỏ palette bạc xanh/mận, vật thể phiến chữ V, các orbit ellipse và cách trình bày cửa sổ phẳng của bản vừa tạo. Giữ những dữ liệu và đường dẫn đang có giá trị.

### Ba điểm người xem phải nhớ

1. Hero có một “lõi kiến tạo” 3D riêng của VIC, đủ đẹp để làm ảnh đại diện cho phiên bản này.
2. Bốn hoạt động là bốn mô hình sống có thể quan sát và tương tác.
3. Các section có sự thay đổi chiều sâu, sáng/tối và nhịp chuyển động; nội dung CLB vẫn đọc theo một mạch rõ ràng.

## 2. Mỹ thuật: đen / trắng / xanh đậm / cyan

### Token màu đề xuất

| Token | Giá trị | Vai trò |
|---|---|---|
| --hyper-black | #04070D | Nền đen chủ đạo, vùng chuyển cảnh, bóng sâu |
| --hyper-navy | #071A38 | Mặt nền xanh đậm và những khối có thể tích |
| --hyper-blue | #143F78 | Mặt cạnh, ánh sáng xanh, lớp giao diện đang hoạt động |
| --hyper-white | #F3F7FF | Chữ chính trên nền tối; nền sáng cho các đoạn đọc |
| --hyper-muted | #A7B7CC | Chữ phụ trên nền tối; cần kiểm tra tương phản theo bề mặt |
| --hyper-cyan | #72E7EF | Điểm sáng, focus, tín hiệu và chi tiết vật thể |

Phân bổ thị giác dự kiến: khoảng 70–75% đen/xanh đậm, 20–25% trắng hoặc khoảng đọc sáng, cyan khoảng 3–5% diện tích nổi bật. Đây là định hướng art direction, không phải chỉ tiêu đếm pixel.

Không thêm tím, hồng, xanh lá neon hoặc nhiều accent cạnh tranh. Sự phong phú đến từ vật liệu, độ nhám, độ sáng và ánh phản xạ của cùng bộ màu.

### Vật liệu

- **Kim loại xanh đen:** khung ngoài có bevel, độ nhám vừa phải, bắt được đường rim light trắng.
- **Sứ trắng lạnh:** vài mặt đặc để giữ khối rõ và tạo tương phản với nền tối.
- **Kính xanh có độ dày:** một số cửa sổ hoặc lõi trong suốt có khúc xạ; không phủ kính lên toàn scene.
- **Ánh sáng cyan:** tập trung ở khe nối, đường năng lượng hoặc điểm nhận tương tác.
- **Glass cho DOM:** dùng trên navigation, một phần card và control; có nền dự phòng rõ chữ khi không hỗ trợ backdrop-filter.

Kính phải nhìn thấy cạnh, lớp sau và phản xạ; tránh chỉ dùng một div trắng trong suốt rồi coi đó là 3D.

### Typography và bố cục

- Display đề xuất: Sora, trọng lượng 600–700, tạo khối chữ rộng và chắc. Kiểm tra dấu tiếng Việt, nguồn font và giấy phép trước khi đưa vào source.
- Body: Be Vietnam Pro hiện có hoặc một font sans hỗ trợ tiếng Việt được tải thật. Nếu cần giữ Be Vietnam Pro để tránh tải thêm, sự khác biệt phải đến từ tỷ lệ, khối chữ và bố cục.
- Hero 72–120px trên desktop phù hợp; mobile khoảng 42–60px. Không ép cỡ cố định gây tràn.
- Chữ chính trắng gần nguyên sắc; body có độ tương phản ổn định, không dùng opacity quá thấp trên nền động.
- Khoảng đọc khoảng 50–70 ký tự mỗi dòng. Tiêu đề chuyển động theo dòng hoặc cụm nghĩa, không cắt từng ký tự tiếng Việt.
- Khung desktop 12 cột, max-width khoảng 1280–1440px. Bố cục cân bằng quang học; các card vẫn có vùng chứa và khoảng cách cụ thể.
- Radius theo vai trò: navigation/control 10–16px, card lớn 20–28px. Không biến tất cả thành capsule.
- Các vùng sáng có khoảng thở, giúp mắt nghỉ sau các scene tối nhiều chi tiết.

## 3. Hero — “Lõi kiến tạo” của VIC

### Hình dạng chủ đạo

Một cụm kiến trúc tương lai được dựng riêng cho trang, gồm:

- Khung ngoài xanh đen dạng góc gấp mở, có hai vai lệch nhau trong không gian.
- Một mặt sứ trắng lơ lửng bên trong, có đường cắt và chi tiết âm để thể hiện độ dày.
- Lõi kính xanh kích thước nhỏ hơn, có một đường sáng cyan đi xuyên qua.
- Bốn module nhỏ trên các thanh dẫn không khép kín, đại diện cho bốn hình thức hoạt động.
- Bề mặt đáy tối nhận bóng mềm và phản sáng nhẹ, tạo cảm giác vật thể tồn tại trong một studio 3D.

Silhouette cần đặc trưng, có phần đặc và khoảng rỗng rõ. Không dùng torus/quả cầu mặc định làm toàn bộ điểm nhấn; không dựng một đám cube ngẫu nhiên. Logo VIC thật vẫn nằm ở header, không bị biến dạng hoặc thay bằng vật thể minh họa.

Có thể dựng bằng geometry có bevel trong code; nếu cần Blender để nâng chất lượng, xuất GLB tối ưu. Không lấy một model không liên quan rồi gắn tên VIC.

### Bố cục đầu trang

~~~text
Logo VIC          Về VIC / Hoạt động / Các ban        Chuyển động / Tham gia

       We dream it.                      Cụm kiến tạo 3D chiếm phần phải
       We make it.                       và có thể mở rộng ra sau hero

       CLB Lập trình VKU
       Đoạn giới thiệu ngắn
       [Tìm hiểu cách tham gia] [Khám phá VIC]

                    Gợi ý cuộn + đường ánh sáng dẫn xuống
~~~

Tiêu đề và CTA là HTML, hiện từ sớm và đứng trên vùng nền đã kiểm soát tương phản. Vật thể chiếm khoảng 55–65% vùng hero trên desktop; vùng chữ không bị kính, flare hoặc module quét qua.

Mobile chuyển thành bố cục có chủ đích: tên CLB và thông điệp xuất hiện trước hoặc đồng thời với một scene được crop vừa phải; CTA luôn ở vùng dễ tìm. Không thu nhỏ nguyên cảnh desktop đến mức vật thể thành đốm sáng.

### Intro xuất hiện

- 0–300ms: nền đen/xanh và text chính hiện rõ; poster của scene đã có sẵn nếu 3D chưa tải.
- 300–1000ms: camera mở góc nhìn, khung ngoài trượt vào đúng vị trí; từng mặt bắt ánh sáng.
- 800–1600ms: lõi kính và bốn module được lắp vào cụm theo nhịp lệch nhau.
- Khoảng 1600–2200ms: một đường sáng đi qua lõi, scene ổn định thành idle loop.
- CTA dùng được ngay khi hiện; không có màn chờ giả hoặc bắt xem hết intro.

### Idle loop và tương tác

- Cụm chính lơ lửng biên độ nhỏ, chu kỳ 7–10 giây.
- Bốn module dịch trên các thanh dẫn theo chu kỳ 14–20 giây; không quay liên tục nhanh quanh trục.
- Highlight trắng/cyan chạy qua một số cạnh theo chu kỳ 5–8 giây, có đoạn nghỉ.
- Lõi có biến thiên khúc xạ/ripple rất nhẹ, tốc độ chậm.
- Pointer tạo camera parallax nhỏ và làm vùng vật liệu gần pointer phản sáng hơn.
- Khi cuộn khỏi hero, cụm mở ra theo trục sâu và camera dịch sang góc nhìn mới, tạo cầu nối tới phần giới thiệu.

Không gán camera đồng thời cho intro, pointer và scroll cùng ghi transform. Có một bộ điều phối: pose nền theo section + offset intro + offset pointer giới hạn.

## 4. Background có chuyển động và chiều sâu

Background có cấu trúc, không chỉ là một gradient tối đứng yên.

| Lớp | Cách thể hiện | Nhịp chuyển động |
|---|---|---|
| Nền xa | Trường xanh đen, ánh sáng khuếch tán rất thấp | Thay đổi theo section, chuyển màu chậm |
| Mặt phẳng sâu | Các mặt cong hoặc tấm cắt xanh đậm bắt rim light | Dịch nhẹ theo camera/scroll |
| Trường tín hiệu | Những đoạn sáng ngắn có hướng di chuyển cụ thể | Loop chậm, số lượng vừa phải, có instancing |
| Bề mặt gần | Làn sóng quang học thấp, phản sáng nhẹ | Shader chạy chậm, không làm méo chữ |
| DOM nội dung | Text, navigation, card, nút | Luôn rõ; không phụ thuộc scene render thành công |

Các vùng đọc có scrim hoặc nền đặc, không để shader sáng làm chữ lúc rõ lúc mất. Trường tín hiệu chỉ nằm trong một số vùng không gian, không rải thành nền sao khắp trang.

Độ sáng, mật độ và hướng chuyển động có thể thay đổi khi đi từ giới thiệu → hoạt động → hai ban → CTA. Dùng một ngôn ngữ ánh sáng chung để trang có cảm giác đi qua cùng một không gian.

## 5. Nội dung và tạo hình từng section

### 5.1. Giới thiệu — mở cụm để nhìn vào bên trong

Sau hero tối là một vùng trắng lạnh rộng, typography xanh đậm. Đây là khoảng chuyển rõ về cảm giác, đồng thời giúp người mới hiểu VIC ngay.

Bên trái: “VIC — Cùng học. Cùng làm. Cùng tiến xa.”, mô tả CLB ngắn và CTA tới /tham-gia.

Bên phải: một lát cắt của cụm 3D, tách thành hai lớp thể hiện “Trước mắt” và “Về lâu dài”. Nội dung định hướng luôn là DOM; mô hình chỉ minh họa sự mở rộng và tiếp nối.

Animation xuất hiện: mặt ngoài tách sang hai hướng, đường dẫn sáng được nối, text hiện theo từng khối. Hover/focus từng hướng làm lớp tương ứng được nhấn; người dùng không cần tương tác mới đọc được nội dung.

### 5.2. Hoạt động — bốn card 3D có câu chuyện riêng

Đặt trên nền navy sâu, dùng lưới 2 × 2 đồng đều ở desktop và một cột ở mobile. Đây là section giàu tương tác thứ hai sau hero.

Card gồm khung có độ dày thị giác, cửa sổ mô hình, nhãn loại/trạng thái, tiêu đề, mô tả và link chi tiết. Tên hoạt động và ngày không nằm trong texture.

| Hoạt động hiện có | Mô hình trong card | Loop riêng |
|---|---|---|
| Tech Sharing | Hai cấu trúc mở, một gói sáng được trao giữa chúng | Truyền qua lại chậm, khoảng 8–12s |
| Mini Challenge | Các mảnh kỹ thuật có khe ăn khớp | Tách nhẹ → đổi vị trí → ghép về cấu trúc, khoảng 10–14s |
| Build & Show | Một khung trưng bày có mô hình nhỏ bên trong | Đổi góc quan sát nhẹ và một dải ánh sáng quét qua, khoảng 12–16s |
| Open Lab | Cụm thử nghiệm ở trạng thái exploded view | Các lớp mở/khép nhẹ, khoảng 10–14s |

Chuyển động card:

- Xuất hiện: từ chiều sâu, rotateX khoảng 8–12° và translateY 24–40px về trạng thái thẳng; stagger khoảng 80–120ms.
- Idle: cửa sổ mô hình có loop như bảng; một điểm sáng viền chạy chậm. Có thể cho mặt visual nổi lên xuống tối đa 2–3px trong vùng đã chừa sẵn.
- Hover: perspective tilt khoảng 3–5°, ánh phản xạ bám pointer, model mở thêm một chút; text có parallax nhỏ tối đa 2px.
- Focus bàn phím: đưa card về tư thế đọc ổn định, nhấn viền và phát một nhịp minh họa ngắn.
- Rời pointer: mọi lớp về vị trí ban đầu mượt; không snap hoặc giữ card ở góc lệch.

Wrapper grid đứng yên và có gutter đủ cho hiệu ứng. Không dùng margin âm hoặc phóng card qua thẻ bên cạnh. Không loop chữ hoặc cả phần mô tả.

Bốn visual có thể cùng idle ở chất lượng cao khi đo hiệu năng đạt; ở chất lượng trung bình chỉ model đang được chú ý loop đầy đủ, các model còn lại có nhịp thưa hoặc đứng yên. Không tự đổi lựa chọn và không carousel tự chạy.

Dùng đúng bốn hoạt động hiện có, giữ isDemo và trạng thái ngày. Link tới /hoat-dong/:slug; có “Xem tất cả hoạt động” tới /hoat-dong.

### 5.3. Các ban — hai không gian cùng vận hành

Trở về nền đen; hai vùng rộng của Ban Học tập và Ban Truyền thông nằm cạnh nhau. Tránh lặp lại bố cục card hoạt động.

- Học tập: cấu trúc module, đường lắp ghép, mô hình tạo hình từ một bản wireframe sang bề mặt đặc.
- Truyền thông: các mặt khung hình, bố cục ảnh và lớp nội dung được sắp thành một trường hình ảnh có chiều sâu.
- Một đường truyền cyan nối hai vùng, cho thấy việc làm sản phẩm và kể câu chuyện liên quan nhau.

Xuất hiện theo góc nhìn: scene của từng ban mở từ một mặt cắt sang phối cảnh đầy đủ. Idle loop nhẹ trong visual; hover/focus làm nhánh tương ứng phản hồi.

Tên ban, công việc, lĩnh vực tiêu biểu và link đều đọc được cùng lúc. Mobile xếp dọc; không dùng kéo ngang để mở ban thứ hai.

### 5.4. Sơ đồ CLB — giao diện có chiều sâu nhưng quan hệ rõ

Một section sáng hoặc xanh trắng dịu. Sơ đồ DOM là nội dung chính, connector SVG có nhịp sáng chạy theo quan hệ tổ chức.

Các nhóm chức danh có bề mặt nhiều lớp, shadow mềm và ánh cạnh; visual nền 3D chậm nằm phía sau để tạo không gian. Không quay hoặc dịch loop tên người.

Xuất hiện theo thứ tự Ban Chủ nhiệm → hai ban → các chức danh. Dữ liệu từ organizationPositions, departments, members; chưa có người thật thì hiện chức danh/ghi chú.

Mobile là danh sách có phân cấp rõ, không thu nhỏ cả sơ đồ desktop. Có đường tới /gioi-thieu#doi-ngu.

### 5.5. CTA cuối — cùng hoàn thiện một cấu trúc

Lõi 3D quay lại ở một bố cục mới: các module tiến về và cùng tạo thành một cụm hoàn chỉnh. Vật thể nằm phía sau hoặc lệch bên phải, dành vùng sạch cho nội dung.

Copy đề xuất: “Điều tiếp theo, cùng làm với VIC.” Một câu ngắn về tinh thần học hỏi và CTA tới /tham-gia.

Intro: lắp cụm trong khoảng 1–1.4s. Loop: lớp sáng chạy qua đường nối, vật thể chuyển động rất nhẹ. Nút có viền phản sáng, mặt trắng và chữ xanh đậm; hover chuyển trạng thái đủ tương phản. Không để bloom hoặc glass làm mất chữ.

FAQ tối đa ba mục lấy từ dữ liệu hiện có, bề mặt đọc yên tĩnh. Footer giữ logo thật và các liên kết có thật.

## 6. Choreography: nhiều animation, có thứ tự ưu tiên

| Vùng | Xuất hiện | Loop | Tương tác |
|---|---|---|---|
| Navigation | Reveal ngắn, không che hero | Điểm trạng thái rất nhẹ nếu cần | Glass sáng hơn, focus rõ |
| Hero | Camera mở, cụm lắp theo lớp, title reveal | Float, module drift, light travel | Pointer parallax và phản xạ vật liệu |
| Background | Độ sâu hình thành dần khi scene sẵn sàng | Flow field, mặt quang học, ánh sáng | Đổi pose/mật độ theo scroll |
| Giới thiệu | Lát cắt mở, hai hướng định hình | Một nhịp truyền nhỏ trong visual | Highlight hướng gần con trỏ/focus |
| Bốn hoạt động | Perspective reveal, stagger | Model riêng, viền sáng nhịp thưa | Tilt, parallax, model mở |
| Hai ban | Wireframe → solid, mở trường hình ảnh | Kết nối và biến đổi cấu trúc chậm | Nhấn nhánh tương ứng |
| Sơ đồ | Connector và nhóm chức danh hiện theo cấp | Chỉ một gói sáng trên đường nối | Focus và mở đúng trang |
| CTA | Cụm hội tụ, nút hiện sớm | Vật thể + seam light | Phản hồi vật liệu nút |
| FAQ/menu | Mở/đóng có phản hồi | Không cần loop | Keyboard/touch đầy đủ |

Nhịp thời gian gợi ý:

- Phản hồi điều khiển: 160–240ms.
- Hover/tilt: 250–450ms, trở về tự nhiên và có thể ngắt giữa chừng.
- Reveal: 600–1000ms.
- Chuyển pose scene: 900–1600ms hoặc điều khiển bằng tiến trình cuộn.
- Loop lớn: 10–20 giây; loop nhỏ: 6–10 giây, lệch pha để không cùng giật nhịp.

Có nút “Tạm dừng chuyển động” dễ tìm và dùng được trên mobile. Tạm dừng giữ một frame đẹp, không làm scene biến mất. Chế độ giảm chuyển động dùng frame tĩnh, tắt camera travel/tilt/float và giữ phản hồi opacity ngắn khi phù hợp. Motion có hook theo dõi thay đổi thiết lập thiết bị. [Tài liệu useReducedMotion](https://motion.dev/docs/react-use-reduced-motion).

Không scroll hijack, không bắt người dùng xoay camera mới tìm được nút, không flash hoặc âm thanh tự chạy. Vùng có nhiều chuyển động phải được dàn nhịp để người xem vẫn chọn được thứ cần nhìn.

## 7. Stack 3D và cách chọn công nghệ

### Nền triển khai đề xuất

| Công nghệ | Nhiệm vụ cụ thể |
|---|---|
| React + TypeScript + Vite hiện có | Cấu trúc ứng dụng, route, dữ liệu và build |
| Three.js | Geometry, camera, ánh sáng, PBR, scene và renderer |
| React Three Fiber | Tổ chức scene 3D bằng component React; cập nhật khung hình qua useFrame |
| Drei | Các helper đã chọn lọc cho môi trường, view, tải model và thích ứng hiệu năng |
| Motion for React hiện có | Animation DOM, reveal, tilt card, state transition và tiến trình scroll |
| CSS hiện đại | Perspective, transform-style, glass, mask và viền phản sáng có fallback |
| React Three Postprocessing | Bloom có chọn lọc cho pipeline WebGL khi cần và đo hiệu năng đạt |
| GLB/glTF, Meshopt/KTX2 khi có asset tương ứng | Chuyển model/texture đã tối ưu vào bản web |

Project đang dùng React 19. Tài liệu R3F hiện hướng dẫn ghép React 19 với Fiber 9; trang giới thiệu cũng ghi Fiber 10 đang alpha. Khi code cần kiểm tra lại phiên bản tương thích và khóa dependency, không mặc định cài mọi gói ở tag latest. [Tài liệu R3F](https://r3f.docs.pmnd.rs/).

Không thêm GSAP/Framer Motion bản khác để điều khiển lại DOM; Motion hiện có đảm nhiệm phần này. Three/Fiber xử lý thế giới 3D. Không thêm physics engine nếu scene chỉ cần chuyển động được thiết kế trước.

### Vật liệu, shader và ánh sáng

- PBR metal/ceramic làm nền chất lượng; có environment map tự host hoặc ánh sáng studio được dựng rõ nguồn.
- Kính lõi có thể dùng MeshPhysicalMaterial hoặc MeshTransmissionMaterial khi phù hợp.
- Custom shader cho trường tín hiệu và ripple; thông số ít, có tài liệu và cấu hình tập trung.
- Bloom đặt ở các chi tiết emissive được chọn; không để chữ và toàn bộ mặt trắng bị cháy.
- Shadow và contact shadow có ngân sách; không bật bóng động cho mọi nguồn sáng.
- Depth of field chỉ được cân nhắc trong scene 3D, không làm mờ DOM hoặc thông tin cần đọc.

MeshTransmissionMaterial có thêm chi phí render pass; cần giảm resolution/samples hoặc thay vật liệu ở chất lượng thấp. Không hứa kính khúc xạ rẻ trên mọi thiết bị. [Tài liệu Drei về transmission](https://drei.docs.pmnd.rs/shaders/mesh-transmission-material).

Bloom trong pipeline đề xuất được điều chỉnh qua vật liệu và ngưỡng sáng, không phải một lớp glow CSS phủ toàn trang. [Tài liệu Bloom](https://react-postprocessing.docs.pmnd.rs/effects/bloom).

### WebGPU / TSL: nhánh nâng cao có thử nghiệm riêng

Cho phép thử WebGPURenderer và TSL vì đây là hướng công nghệ hiện đại phù hợp với shader/scene tùy biến. Tài liệu Three.js mô tả renderer có backend WebGL 2 dự phòng, đồng thời lưu ý renderer còn experimental và có khác biệt về material/postprocessing. [Tài liệu WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer).

Quyết định thực thi:

1. Chốt một baseline WebGL 2 với bộ Three/Fiber/Drei tương thích để bảo đảm có bản đẹp chạy được.
2. Làm spike WebGPU riêng trên đúng scene hero, kiểm tra ánh sáng, material, postprocessing và fallback.
3. Chỉ bật nhánh WebGPU khi đạt mức hình ảnh và độ ổn định yêu cầu; không tự nâng Fiber lên alpha chỉ để ghi “WebGPU”.
4. Các material dựa vào ShaderMaterial/onBeforeCompile và composer của WebGL không tự chuyển sang pipeline WebGPU; phải chọn implementation tương ứng hoặc giữ renderer baseline.
5. Không duy trì hai renderer đang chạy cùng lúc; không tuyên bố WebGPU chắc chắn nhanh hơn nếu chưa đo đúng scene.

Mục tiêu là tận dụng kỹ thuật hiện đại để tạo chất lượng nhìn thấy được, có đường nâng cấp rõ ràng. Các tùy chọn mới phải có vai trò cụ thể trong scene.

### Asset

Nếu dựng model ngoài code: dùng GLB có nguồn rõ và texture cần thiết; áp dụng Meshopt hoặc KTX2 khi pipeline asset thực sự dùng các định dạng đó, bao gồm decoder/transcoder tương ứng và cleanup. [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html).

Ưu tiên model chủ đạo do project tạo, vật liệu được art-direct; không phụ thuộc model/HDRI chưa rõ giấy phép hoặc URL CDN tạm thời. Render một poster đẹp từ scene để dùng khi tải, lỗi hoặc giảm chuyển động.

## 8. Kiến trúc render và quản lý tương tác

### Source hiện được triển khai

~~~text
src/pages/home-preview1-page.tsx
src/components/home-preview1/
  navigation.tsx
  hero-section.tsx
  creation-scene.tsx
  about-section.tsx
  activities-section.tsx
  teams-section.tsx
  organization-section.tsx
  invitation-section.tsx
  footer.tsx
  motion-context.tsx
  reveal.tsx
src/styles/home-preview1.css
src/data/home-preview-content.ts
~~~

Hero dùng Three.js + React Three Fiber, Drei, transmission material, instancing và bloom; những activity card có visual 3D bằng CSS cùng tilt spring để tránh tạo thêm WebGL context cho mỗi card. Sections và copy tách thành component; dữ liệu CLB tiếp tục lấy từ data hiện có. Nút chuyển động quản lý CSS/Motion/Three và tự dừng khi tab ẩn hoặc hệ điều hành bật giảm chuyển động. Bản hiện tại chưa có shared Canvas cho card, adaptive quality tự động hoặc WebGPU.

### Canvas và card

Mục tiêu là một shared Canvas với các view được theo dõi theo DOM cho hero và các cửa sổ model, thay vì mỗi card mở một context WebGL. Drei View hỗ trợ phân vùng viewport trên một canvas bằng scissor. [Tài liệu View](https://drei.docs.pmnd.rs/portals/view).

Cần prototype sớm phần này:

- Tracking wrapper của View có kích thước ổn định và không CSS rotate/scale. Tilt model nằm trong scene; DOM text có parallax nhỏ riêng.
- Nếu dùng tilt toàn mặt card bằng CSS, dùng visual DOM/poster/video phù hợp hoặc kiểm chứng cách đồng bộ phép chiếu; không giả định scissor rectangle tự xoay theo perspective của DOM.
- Pointer của từng view tính theo vùng tương ứng; canvas không chặn click/scroll của HTML.
- Bloom/composer và các scissor view phải được kiểm tra cùng nhau. Không mở một composer nặng cho mỗi card.
- Có thể để hero dùng postprocessing, các mini-scene dùng material/lighting gọn hơn. Nếu shared canvas không đạt độ ổn định cần thiết, chia tối đa hero canvas và một canvas chung cho các card; ghi rõ lý do.
- Không render các view ngoài viewport; không cấp render target độc lập cho mọi bề mặt kính.

### Quyền sở hữu chuyển động

- Motion: DOM, motion values và tiến trình section.
- Fiber useFrame: camera/model/shader, đọc giá trị từ refs hoặc motion values.
- Một scene director quyết định pose camera và trọng số chuyển cảnh.
- State React chỉ dùng cho trạng thái giao diện/chất lượng thay đổi thưa; không setState mỗi frame.
- Không thêm vòng RAF độc lập cho từng model. Cleanup tài nguyên, listener, observer và frame subscriptions đúng khi route unmount hoặc Strict Mode remount.
- Loop tiếp tục khi scene đang nhìn thấy và chuyển động được bật; dừng khi tab ẩn.
- Khi dừng, dùng render theo nhu cầu và invalidate đúng lúc cho thay đổi thật. Demand mode không tự duy trì một animation liên tục nếu không yêu cầu frame mới. [R3F về hiệu năng và demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

Style/token được scope theo root `.hyperlab`; không đổi token toàn ứng dụng để phục vụ bản mới.

## 9. Responsive, chất lượng và ngân sách hiệu năng

Đây là mục tiêu cần đo trong lượt code, chưa phải số liệu đã đạt.

| Mức | Hình ảnh | Loop và tải |
|---|---|---|
| Cao | Vật liệu kính lõi, ánh sáng tốt, bloom giới hạn, model card có chiều sâu | Hero và các model đang thấy có loop; DPR mục tiêu tối đa 1.5–1.75 sau khi đo |
| Trung bình | Giảm transmission samples/resolution, shadow và số đoạn nền | Model đang được chú ý chuyển động đầy đủ; các model khác giảm nhịp |
| Thấp/mobile yếu | Model đơn giản hơn, thay kính nặng bằng vật liệu nhẹ, tắt postprocessing đắt | Ít loop, DPR khoảng 1; poster cho vùng phụ nếu cần |
| Giảm chuyển động / không có GPU | Poster đúng art direction và toàn bộ DOM | Tĩnh, không camera travel/tilt; mọi route và CTA vẫn dùng được |

Điều chỉnh chất lượng dựa trên đo hiệu năng có hysteresis, không đoán chỉ bằng kích thước màn hình. Drei PerformanceMonitor có thể cung cấp tín hiệu để giảm độ phân giải/hiệu ứng theo FPS quan sát được. [Tài liệu PerformanceMonitor](https://drei.docs.pmnd.rs/performances/performance-monitor).

Mục tiêu ban đầu: khoảng 60fps trên desktop phù hợp và ít nhất khoảng 30fps ổn định trên mobile được chọn để kiểm tra. Giảm chất lượng trước khi để thao tác chậm hoặc máy nóng kéo dài. Không giảm màu/tương phản nội dung để đổi lấy FPS.

Các nguyên tắc tải:

- Hero DOM hiển thị trước; scene lazy-load, có poster cùng khung để không nhảy bố cục.
- Tách bundle 3D khỏi trang chính và route không dùng 3D.
- Reuse geometry/material, instancing cho chi tiết lặp; không dựng hạt bằng hàng trăm component cập nhật state.
- Không bật realtime environment capture hoặc nhiều kính có buffer riêng nếu chưa đo chi phí.
- Model card tải gần viewport; texture có kích thước phù hợp diện tích thực tế.
- Xử lý WebGL context loss, lỗi asset và GPU không khả dụng bằng fallback dễ hiểu.
- Review 360/390/768/1024/1440/1920px và zoom 200%; không tràn ngang, chữ không cắt dấu.
- Hover có tương đương keyboard/touch; hit target tối thiểu 44px trên mobile.
- CTA, menu và FAQ luôn là HTML có tên truy cập được.

## 10. Phạm vi thay bản cũ và thứ tự triển khai

### Cách thay thế

/home-preview1 sẽ được thay bằng Hyperlab; không tạo thêm một route demo chỉ vì đổi concept.

Có thể thay hoặc xóa các component riêng của bản “Mạch mở” khi không còn được import. Chỉ dọn source cũ sau khi bản mới đã dựng được và route được kiểm tra, để tránh mất điểm tham chiếu trong quá trình làm.

Các section, model hoặc helper mới không sử dụng thuật toán phiến 2D cũ làm vật thể chủ đạo. Dữ liệu chung và URL hiện có vẫn là nguồn nội dung. Luồng đăng ký /tham-gia tiếp tục dùng hệ thống hiện có; không thay backend, Sheet, auth hoặc env trong công việc UI.

### Các mốc để chất lượng không trôi khỏi concept

1. **Chốt hình ảnh tĩnh:** dựng một frame hero ở 1440px và mobile; review silhouette, màu, chất liệu, bố cục chữ trước khi nhân rộng scene.
2. **Chốt chuyển động hero:** intro + idle + pointer + một đoạn scroll; có bản quay hoặc kiểm tra trực tiếp, không chỉ báo build thành công.
3. **Chốt một card mẫu:** đủ 3D model, entry, idle, hover, focus và fallback; kiểm tra trong lưới để không chồng.
4. **Mở rộng bốn hoạt động và background:** tạo bốn model riêng, chia sẻ vật liệu, đo hiệu năng view và postprocessing.
5. **Hoàn thành câu chuyện CLB:** giới thiệu, hai ban, sơ đồ, CTA, FAQ và footer; mỗi section có cách hiện phù hợp.
6. **Chốt thích ứng và kiểm tra:** mobile, keyboard, reduced motion, tạm dừng, tab ẩn, route refresh, production.

Các mốc là checkpoint tự review trong quá trình làm, không phải yêu cầu dừng để xin xác nhận sau từng bước.

### Điều kiện bàn giao

- Frame tĩnh của hero đã có chất lượng: model có silhouette rõ, ánh sáng tách lớp, vật liệu khác nhau nhìn thấy được.
- Nền, hero và card có loop thực sự; animation xuất hiện không chỉ dùng cùng một fade-up.
- Người mới vẫn hiểu VIC là CLB gì, hoạt động gì, có những ban nào và đi đâu để tham gia.
- Bốn card không chồng lên nhau khi entry, idle, hover, focus hoặc ở mobile.
- Nút cuối không mất label và không bị glow nền lấn át.
- Tạm dừng thực sự dừng cả Three, Motion và CSS loop; reduced motion có bố cục tĩnh đẹp.
- Nhiều view, pointer, tài nguyên GPU và cleanup Strict Mode được kiểm tra.
- Chạy typecheck, production build và các kiểm tra tương tác có liên quan. Bổ sung test chỉ cho logic thực sự có ích.
- Chụp desktop/mobile, ghi những điều đã đo và renderer đang dùng. Nếu không có công cụ trình duyệt, nêu rõ giới hạn, không gọi đó là đã duyệt hình ảnh.

## 11. Prompt triển khai Hyperlab

Prompt dưới đây là đặc tả thiết kế đã dùng khi triển khai; một số mục là hướng nâng cấp tiếp theo, không phải tính năng đã xác nhận ở bản hiện tại.

~~~text
Hãy thay trang /home-preview1 hiện có bằng concept “VIC / Hyperlab”
trong IMPLEMENTATION_PLAN_HOMEDEMO01.md.

Bạn đảm nhiệm art direction, frontend và creative development 3D.
Kết quả phải có chất lượng tạo hình, ánh sáng, animation và nội dung CLB.

PHONG CÁCH
Dựng một xưởng công nghệ trong không gian 3D với đen, trắng, xanh đậm
và một lượng nhỏ cyan. Palette:
#04070D / #071A38 / #143F78 / #F3F7FF / #A7B7CC / #72E7EF.
Có các đoạn trắng lạnh để tăng tương phản và giúp đọc.
Thay toàn bộ palette bạc xanh/mận và vật thể phiến 2D của bản cũ.

VẬT THỂ HERO
Tạo “lõi kiến tạo” riêng: khung xanh đen có bevel dạng góc gấp mở,
mặt sứ trắng lơ lửng, lõi kính xanh có độ dày và bốn module hoạt động.
Có bóng, ánh phản xạ và rim light có chủ đích.
Không dùng một torus, quả cầu hoặc đám cube mặc định làm toàn bộ hero.
Logo VIC thật nằm riêng, không bị thay hoặc biến dạng.
Hero dùng headline “We dream it. We make it.”, nhận diện CLB Lập trình VKU,
mô tả rõ và CTA tới /tham-gia.

CHUYỂN ĐỘNG PHẢI CÓ
- Intro hero lắp theo lớp, camera mở góc, title reveal theo dòng.
- Idle hero: float chậm, module drift, ánh sáng truyền theo cạnh.
- Background: mặt phẳng sâu, trường tín hiệu và shader quang học chậm.
- Scroll: camera/model đổi pose để nối các section, cuộn trình duyệt tự nhiên.
- Bốn card: entry có phối cảnh, model idle riêng, hover tilt/parallax,
  reflection theo pointer và focus ổn định dễ đọc.
- Hai ban: visual wireframe/solid và trường hình ảnh có chiều sâu.
- Sơ đồ: connector hiện theo cấp và một nhịp sáng, không loop chữ.
- CTA: hội tụ model và loop đường nối, nút luôn rõ label.

CARD HOẠT ĐỘNG
Giữ lưới 2 × 2 đồng đều, một cột mobile, wrapper đứng yên.
Tech Sharing: truyền gói sáng giữa hai cấu trúc.
Mini Challenge: các mảnh kỹ thuật tìm đúng cấu trúc ghép.
Build & Show: model trong khung trưng bày với light sweep.
Open Lab: cụm exploded view mở/khép nhẹ.
Mỗi card là link thật tới chi tiết, giữ nhãn mẫu theo isDemo.
Không lồng button/link trong link bao card, không nhân bản dữ liệu.

CẤU TRÚC NỘI DUNG
Hero → giới thiệu + ngắn/dài hạn + CTA → bốn hoạt động →
hai ban → cơ cấu → lời mời + FAQ → footer.
Lấy dữ liệu hiện có từ site-data; copy mới tách data có types.
Không tự tạo nhân sự, thành tích, ngày sinh hoạt hoặc số liệu trực tiếp giả.

CÔNG NGHỆ
Dùng Three.js + React Three Fiber + Drei cho 3D.
Dùng Motion hiện có cho DOM và scroll values, không thêm thư viện DOM animation trùng.
Chọn bộ phiên bản tương thích React 19; kiểm tra tài liệu hiện hành và khóa phiên bản.
Ưu tiên baseline WebGL 2 đẹp và ổn định.
Có thể làm spike WebGPU/TSL riêng; không trộn composer/material WebGL
vào WebGPU mà chưa kiểm chứng, không tự dùng Fiber alpha chỉ để đủ tên công nghệ.

Dùng vật liệu PBR, kính/transmission có giới hạn, shader nền tùy biến,
instancing, postprocessing có chọn lọc, adaptive DPR và asset tối ưu khi có.
Từng kỹ thuật phải tạo ra giá trị nhìn thấy được và có quality fallback.

KIẾN TRÚC VÀ TƯƠNG TÁC
Dùng shared Canvas/View khi prototype chứng minh đồng bộ viewport, pointer và effects.
Không tạo một WebGL context/composer nặng cho mỗi card.
Tracking wrapper của View không CSS transform perspective;
tilt trong scene hoặc kiểm chứng cách đồng bộ visual phù hợp.
Có một scene director cho camera, tránh nhiều hiệu ứng cùng ghi transform.
Không setState mỗi frame, không thêm RAF cho từng model.
Style/token scope trong demo. Lazy-load scene và có poster ngay từ đầu.
Tạm dừng mọi loop khi người dùng chọn dừng, tab ẩn hoặc view không còn cần render.
Reduced motion hiển thị frame tĩnh đẹp và DOM đầy đủ.
GPU lỗi/không hỗ trợ vẫn đọc được trang và dùng được mọi CTA.

QUY TRÌNH CHẤT LƯỢNG
Dựng frame hero đẹp trước, rồi mới thêm motion.
Chốt một card đủ trạng thái trước khi nhân bốn model.
Kiểm tra shared views + bloom/transmission trước khi mở rộng cảnh.
Các checkpoint là tự review, tiếp tục làm trong phạm vi đã được giao.

THAY SOURCE CŨ
Thay bản “Mạch mở” tại /home-preview1; dọn file riêng không còn dùng
sau khi bản mới chạy được. Không ảnh hưởng các route UI khác hoặc backend/form.
Giữ static route và kiểm tra refresh.

BÀN GIAO
Typecheck, production build, kiểm tra tương tác và console.
Review 360/390/768/1024/1440/1920px, zoom, keyboard, touch,
reduced motion, pause/resume, tab ẩn, GPU fallback và Strict Mode.
Có ảnh desktop/mobile, ghi đúng renderer và giới hạn kiểm tra.
Không tuyên bố đẹp/hoàn thiện chỉ vì build thành công.
~~~

## 12. Ghi chú tài liệu

Đây là bản kế hoạch thay thế cho concept cũ theo yêu cầu mới: tăng chất công nghệ, 3D, loop, chuyển động card/background và phối đen–trắng–xanh đậm. Bản code hiện tại dùng WebGL qua R3F cho hero, CSS 3D cho các card/section và Motion cho DOM; chưa tuyên bố đạt các mục tiêu FPS hoặc đã qua review nhiều viewport.

Đã đối chiếu source, package.json, dữ liệu CLB và tài liệu chính thức được dẫn ngay cạnh các quyết định kỹ thuật. TypeScript và production build đã qua sau khi triển khai; build sinh route tĩnh `/home-preview1`. Cần mở route trên trình duyệt để review frame desktop/mobile, tải WebGL, keyboard, touch và chuyển động. Các con số hiệu năng trong kế hoạch vẫn là mục tiêu, chưa phải kết quả đo.
