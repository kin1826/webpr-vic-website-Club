# Backend tuyển thành viên VIC

Backend Node.js dùng Express và TypeScript. Nó kiểm tra request từ trình duyệt, xác thực quản trị và Turnstile, rồi ký request đến Google Apps Script. Apps Script tiếp tục là thành phần duy nhất đọc/ghi Google Sheet và gửi email.

```text
Browser → Express API → HMAC-signed Apps Script Web App → Google Sheet + MailApp
```

Backend không dùng database. Giới hạn IP của `express-rate-limit` hiện dùng MemoryStore: phù hợp một process, mất bộ đếm khi restart và không chia sẻ giữa nhiều instance. Nếu deploy nhiều instance, thay store bằng kho dùng chung trước khi dựa vào limiter để kiểm soát lưu lượng.

## Cài đặt và chạy local

Yêu cầu Node.js 20.19 trở lên. Tại thư mục gốc repo:

```bash
npm install
cp backend/.env.example backend/.env
cp .env.example .env.local
```

Điền các biến trong `backend/.env` theo mục **Cấu hình môi trường**. Trong `.env.local`, dùng `VITE_API_BASE_URL=http://localhost:3001` và Client ID công khai của Google. Không đặt Apps Script URL, HMAC secret, Google admin token hay Turnstile secret vào biến `VITE_*`.

Mở hai terminal tại repo:

```bash
npm run dev:backend
```

```bash
npm run dev
```

API health: `http://localhost:3001/api/health`; frontend: địa chỉ Vite trong terminal. Nếu API base URL không có, frontend local chuyển sang prototype có cảnh báo và không ghi Sheet.

## API

| Method | Đường dẫn | Xác thực | Chức năng |
| --- | --- | --- | --- |
| GET | `/api/health` | Không | Health tối giản |
| GET | `/api/recruitment/form` | Không | Cấu hình form công khai |
| POST | `/api/recruitment/applications` | Turnstile khi bật | Gửi đơn; cần header `Idempotency-Key` trùng với key trong body |
| POST | `/api/recruitment/applications/status` | Key của lần nộp | Kiểm tra đơn sau khi mất phản hồi; không nộp lại |
| GET | `/api/admin/recruitment/form` | Google ID token Bearer | Đọc form cho admin |
| PUT | `/api/admin/recruitment/form` | Google ID token Bearer | Xuất bản form |
| GET | `/api/admin/recruitment/applications` | Google ID token Bearer | Danh sách đơn, query `page`, `pageSize` |
| GET | `/api/admin/recruitment/applications/:id` | Google ID token Bearer | Chi tiết một đơn |
| POST | `/api/admin/recruitment/applications/:id/retry-email` | Google ID token Bearer | Gửi lại email lỗi |
| POST | `/api/admin/recruitment/applications/:id/confirm-email-sent` | Google ID token Bearer | Xác nhận thủ công email đã gửi sau khi kiểm tra hộp thư |

Client không được truyền action Apps Script. Backend chỉ ánh xạ từng route sang action cố định.

## Cấu hình môi trường

`backend/.env.example` là mẫu biến server; bản thật `backend/.env` bị Git bỏ qua.

| Biến | Ý nghĩa |
| --- | --- |
| `PORT` | Cổng Express, mặc định `3001` |
| `CORS_ALLOWED_ORIGINS` | Danh sách origin chính xác, phân tách dấu phẩy; không dùng `*` |
| `APPS_SCRIPT_URL` | URL Web App `/exec`, chỉ dùng ở server |
| `APPS_SCRIPT_HMAC_SECRET` | Secret ngẫu nhiên tối thiểu 32 ký tự; chỉ dùng ở server |
| `APPS_SCRIPT_TIMEOUT_MS` | Timeout gọi Apps Script |
| `GOOGLE_OAUTH_CLIENT_ID` | Client ID dùng để kiểm tra Google ID token |
| `ADMIN_EMAILS` | Allowlist email admin, phân tách dấu phẩy |
| `TURNSTILE_REQUIRED` | Cờ bật/tắt xác minh Turnstile; production cần bật |
| `TURNSTILE_SECRET_KEY` | Secret Turnstile, chỉ nằm ở Express |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Hostname chính xác được phép, phân tách dấu phẩy |
| `TURNSTILE_EXPECTED_ACTION` | Action do widget gửi, mặc định `vic_recruitment` |
| `TRUST_PROXY_HOPS` | Số proxy tin cậy đã xác định; mặc định `0` |
| `FORM_READ_LIMIT` | Số lần đọc form tối đa/IP trong 10 phút, mặc định `120` |
| `APPLICATION_SUBMIT_LIMIT` | Số request gửi đơn tối đa/IP trong 10 phút, mặc định `30` |
| `ADMIN_API_LIMIT` | Số request admin tối đa/IP trong 10 phút, mặc định `120` |

Tạo shared secret bằng:

```bash
openssl rand -hex 32
```

Đặt cùng chuỗi 64 ký tự vào `APPS_SCRIPT_HMAC_SECRET` ở host Express và Script Property `EXPRESS_HMAC_SECRET` trong Apps Script. Không commit, gửi qua URL, ghi log hoặc đưa secret vào frontend.

Khi đặt Turnstile là `true`, backend dừng khởi động nếu thiếu secret hoặc hostname cho phép. Server kiểm tra `success`, `hostname` và `action` trước khi gửi đơn sang Apps Script.

## HMAC giữa Express và Apps Script

Express tạo nonce 32 byte ngẫu nhiên mới cho **mỗi lần gọi** Apps Script. `payloadJson` được serialize đúng một lần; cả hai phía ký và xác minh nguyên chuỗi UTF-8 đó:

```text
protocolVersion + "\n" + timestamp + "\n" + nonce + "\n" + payloadJson
```

`timestamp` là Unix milliseconds dạng chuỗi, cửa sổ hiệu lực 120 giây. `nonce` gửi dạng base64url; chữ ký là HMAC-SHA256 dạng hex chữ thường. Apps Script xác minh chữ ký trước khi parse payload nghiệp vụ, rồi claim hash của nonce dưới `LockService` vào tab ẩn `TrangThaiKyThuat`. Nonce hết hạn sau 10 phút và được dọn định kỳ; bảng không lưu secret hay payload. Request cũ trực tiếp không có envelope/chữ ký bị từ chối.

Nonce vận chuyển thay đổi mỗi lần gọi. Idempotency key của một lần nộp đơn được so với hash nội dung; dùng lại key với nội dung khác bị từ chối. Nếu mất phản hồi, giao diện tự kiểm tra trạng thái tối đa ba lần rồi cho phép kiểm tra thủ công bằng endpoint trạng thái; không gửi lại đơn. Express chờ Apps Script tối đa 35 giây, trình duyệt tối đa 45 giây.

Đơn được ghi vào Sheet cùng khóa idempotency, cooldown và job email trước khi Apps Script trả thành công. Email gửi sau bởi trigger theo phút. Lỗi trước khi gọi MailApp được thử lại tối đa ba lần; kết quả gửi không rõ được đưa vào `needs_review` để admin kiểm tra hộp thư trước khi gửi lại hoặc xác nhận đã gửi.

## Apps Script và deployment

1. Chép `apps-script/Code.gs` và `apps-script/appsscript.json` vào project Apps Script gắn với Sheet.
2. Thêm Script Properties `EXPRESS_HMAC_SECRET`, `GOOGLE_OAUTH_CLIENT_ID`, `ADMIN_EMAILS`. Turnstile secret được chuyển sang `backend/.env`, không đặt ở Apps Script sau khi mọi traffic đã chuyển qua Express.
3. Chạy `initializeVicRecruitment` một lần nếu cần tạo tab kỹ thuật/headers và cấp quyền Sheet.
4. Chạy `installConfirmationEmailTrigger` một lần và cấp quyền gửi email. Trigger chạy dưới tài khoản cài đặt; giữ tài khoản này hoạt động và kiểm tra quota MailApp.
5. Tạo một deployment version mới của Web App với **Execute as: Me**, **Who has access: Anyone**. Express cần gọi được `/exec`; Sheet không cần công khai.
6. Đặt deployment URL trong `APPS_SCRIPT_URL`, kiểm tra HMAC khớp hai phía và gọi `GET /api/health`, sau đó thử form bằng email kiểm thử; đơn cần xuất hiện trong Sheet ngay, email có thể đến sau khi trigger xử lý.
7. Mở danh sách deployments Apps Script và kiểm kê deployment cũ còn dùng code nhận payload không ký. Xác định ai/luồng nào còn gọi từng URL trước khi archive. Không archive tự động trong thay đổi source này.
8. Khi đã xác nhận các luồng đang dùng deployment đã nâng cấp, archive deployment cũ theo quy trình của đội và gỡ Turnstile secret cũ khỏi Script Properties nếu không còn deployment hợp lệ cần nó.

`/api/health` chỉ cho biết process Express chạy. Hãy kiểm tra thêm `APPS_SCRIPT_URL`, Script Property, log Apps Script và một lần gửi email test trước khi mở nhận đơn.

## CORS, proxy và triển khai

CORS chỉ cho phép origin trong `CORS_ALLOWED_ORIGINS`; không dùng CORS để thay cho xác thực. API không dùng cookie, do đó không bật credentials/CSRF cookie. Admin dùng Google ID token trong header Authorization; không lưu token vào localStorage.

`TRUST_PROXY_HOPS=0` là mặc định an toàn. Chỉ đặt giá trị dương sau khi xác định chính xác proxy/load balancer và cách nó ghi `X-Forwarded-For`; không bật trust proxy chung chung. Đặt đúng số hop để limiter lấy IP client do proxy tin cậy cung cấp.

`npm run build` typecheck backend và biên dịch server sang `backend/dist/`. Chạy bản build bằng:

```bash
node backend/dist/server.js
```

Static hosting của frontend không chạy Express. Deploy `backend/dist` lên dịch vụ Node.js riêng có biến môi trường server; trỏ `VITE_API_BASE_URL` của frontend về origin API đó. Nếu host nhiều process/instance, dùng rate-limit store dùng chung trước khi xem limiter là hạn chế toàn cụm. Chưa cấu hình/deploy host Express trong repository.

## Kiểm tra

```bash
npm run typecheck
npm test
npm run build
```

Unit/integration tests dùng request mock và token giả; không gửi email hoặc ghi dữ liệu vào Sheet thật. Checklist deployment thật cần kiểm tra chữ ký hợp lệ/sai/hết hạn/replay, limiter, CORS, Turnstile, Google ID token, retry/idempotency và một lần gửi tới Sheet/email test.
