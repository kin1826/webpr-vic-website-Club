# Apps Script — lớp truy cập Google cho tuyển thành viên VIC

Apps Script là service phía sau Express, giữ quyền ghi Google Sheet và gửi email nền bằng `MailApp`:

```text
Browser → Express API → HMAC-signed Apps Script Web App → Google Sheet + MailApp
```

Không gọi `doPost` trực tiếp bằng payload nghiệp vụ cũ. Mọi `doPost` hiện xác minh envelope HMAC trước khi parse action hoặc đọc/ghi dữ liệu nghiệp vụ. `doGet` chỉ trả health tối giản.

## Cập nhật source

1. Mở Sheet VIC, chọn **Extensions → Apps Script**.
2. Cập nhật nội dung `Code.gs` và `appsscript.json` trong repo.
3. Vào **Project Settings → Script properties** và cấu hình:

   | Tên | Giá trị |
   | --- | --- |
   | `EXPRESS_HMAC_SECRET` | Cùng chuỗi ngẫu nhiên 64 ký tự hex với `APPS_SCRIPT_HMAC_SECRET` ở Express |
   | `GOOGLE_OAUTH_CLIENT_ID` | Web Client ID dùng cho Google Sign-In và backend |
   | `ADMIN_EMAILS` | Email admin cho phép, phân tách bằng dấu phẩy |

   Tạo shared secret bằng `openssl rand -hex 32`. Không đặt secret trong source, Sheet, URL, `VITE_*` hay log.

4. Chạy `initializeVicRecruitment` một lần và cấp quyền. Hàm tạo/ẩn `TrangThaiKyThuat` nếu thiếu, đồng thời bổ sung các header nghiệp vụ đang thiếu; không xóa đơn.
5. Chạy `installConfirmationEmailTrigger` một lần và cấp quyền gửi email. Trigger chạy dưới tài khoản cài đặt; email xử lý theo đợt sau khi đơn đã được ghi. Hãy dùng tài khoản được đội duy trì và kiểm tra quota MailApp.
6. Chọn **Deploy → Manage deployments**, cập nhật deployment Web App sang version mới. Dùng **Execute as: Me** và **Who has access: Anyone** để Express có thể gọi endpoint. Không công khai quyền chỉnh sửa Sheet.
7. Dùng URL `/exec` của deployment mới cho biến server `APPS_SCRIPT_URL`.

Khi gửi đơn, API chỉ trả thành công sau khi hàng đơn và email job được ghi vào Sheet. Nếu trình duyệt mất phản hồi, frontend kiểm tra trạng thái bằng cùng idempotency key, không nộp lại. Email có thể đến sau khi trigger chạy. Nếu worker dừng trong lúc gửi hoặc MailApp trả lỗi không xác định, trạng thái chuyển sang `needs_review`; admin cần kiểm tra thư đã gửi trước khi xác nhận hoặc gửi lại.

## HMAC envelope

Express gửi POST body JSON gồm `protocolVersion`, `timestamp`, `nonce`, `payloadJson`, `signature`. Cả hai phía dùng UTF-8 và ký chuỗi nguyên dạng:

```text
protocolVersion + "\n" + timestamp + "\n" + nonce + "\n" + payloadJson
```

- `protocolVersion`: chuỗi `1`.
- `timestamp`: Unix milliseconds dạng chuỗi; chấp nhận tối đa lệch 120 giây.
- `nonce`: 32 byte ngẫu nhiên dạng base64url, mới cho mỗi request.
- `payloadJson`: JSON action và payload nghiệp vụ, được xác minh nguyên chuỗi trước khi parse.
- `signature`: HMAC-SHA256 dạng hex chữ thường.

Apps Script kiểm tra secret trước; chữ ký không hợp lệ, timestamp cũ, envelope sai hoặc replay đều bị từ chối. Sau chữ ký, nonce hash được claim dưới `LockService` trong tab ẩn hiện có. Nonce hết hạn sau 10 phút, và hàng nonce cũ được dọn định kỳ. Lock bảo đảm hai request đồng thời không claim cùng nonce.

Nonce không thay idempotency key: nonce thay mỗi lần Express gọi Apps Script; idempotency key của một lần nộp form được giữ nguyên qua retry. Cooldown theo email vẫn kéo dài chính xác 600 giây tính từ khi đơn được lưu; lỗi email không gỡ đơn hoặc cooldown.

## Quản trị và Turnstile

Apps Script vẫn kiểm tra Google ID token và allowlist admin của mình như lớp bảo vệ bổ sung. Express cũng xác minh token, audience, hạn, issuer, email đã xác minh và allowlist trước khi forward action cố định.

Turnstile được xác minh duy nhất tại Express. `TURNSTILE_SECRET_KEY` không còn được đọc bởi Code.gs mới; đặt secret ở `backend/.env`. Khi backend bật Turnstile, nó kiểm tra hostname và action. Sau khi toàn bộ traffic chuyển sang backend mới, xóa Script Property `TURNSTILE_SECRET_KEY` nếu không còn deployment cũ nào cần nó.

## Chuyển deployment hiện hành

Đổi source trong editor không tự cập nhật các version deployment đang chạy. Sau khi tạo version mới:

1. Kiểm tra URL `/exec` của backend trỏ tới đúng deployment version mới.
2. Gọi API thông qua Express, xác nhận lấy form được và một đơn email test được ghi đúng vào Sheet.
3. Vào **Deploy → Manage deployments** để kiểm kê các deployment cũ. Đối chiếu URL, người dùng và nơi đang gọi URL đó trước khi archive.
4. Archive deployment cũ còn nhận POST trực tiếp chỉ sau khi xác nhận không còn luồng hợp lệ dùng chúng. Không archive hàng loạt theo tên hoặc tự động.
5. Kiểm tra gọi thẳng deployment mới bằng payload cũ không có chữ ký bị từ chối; kiểm tra replay cùng envelope bị từ chối.

Không dựa vào việc giấu URL `/exec`. Bảo vệ request bằng HMAC; deployment legacy là một version độc lập cần được kiểm kê và xử lý theo quy trình trên.
