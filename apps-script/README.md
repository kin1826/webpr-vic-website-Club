# Backend Google Apps Script — Tuyển thành viên VIC

Backend này là trung gian giữa frontend và Google Sheet. Sheet vẫn riêng tư; Web App chạy bằng tài khoản triển khai.

## Thiết lập

1. Mở Sheet VIC, chọn **Extensions → Apps Script**.
2. Chép `Code.gs` và `appsscript.json` vào project Apps Script.
3. Trong **Project Settings → Script properties**, thêm:
   - `GOOGLE_OAUTH_CLIENT_ID`: OAuth Web Client ID dùng cho trang admin.
   - `ADMIN_EMAILS`: danh sách email quản trị, phân tách bằng dấu phẩy.
   - `TURNSTILE_SECRET_KEY`: tùy chọn; chỉ thêm khi frontend đã render Turnstile thật.
4. Chạy thủ công `initializeVicRecruitment` một lần và cấp quyền. Hàm chỉ bổ sung hai cột `idempotency_key`, `email_retry_count` nếu thiếu và tạo tab ẩn `TrangThaiKyThuat`; không xóa dữ liệu.
5. Deploy **Web app**, Execute as **Me**, Who has access **Anyone**. Lấy URL `/exec`.
6. Tạo OAuth 2.0 Web Client ID trong Google Cloud, thêm origin của website và điền cùng Client ID vào Script property và `VITE_GOOGLE_CLIENT_ID`.
7. Điền URL Web App vào `VITE_RECRUITMENT_API_URL`, build lại frontend.

Giữ `is_open=FALSE` trong tab `CauHinh` cho đến khi kiểm tra xong. Apps Script không cần và không nên công khai quyền chỉnh sửa Sheet.

## Lưu ý vận hành

- Apps Script `ContentService` trả lỗi nghiệp vụ trong JSON (`error.status`, ví dụ 429), dù lớp HTTP có thể vẫn là 200.
- Cooldown dùng hash của email chuẩn hóa và được lưu riêng, nên xóa đơn không xóa giới hạn.
- Email dùng `MailApp` của tài khoản đã cấp quyền; không giả mạo địa chỉ gửi.
- Email lỗi được lưu là `failed`, tối đa ba lần gửi lại thủ công từ admin.
- Nếu bật Turnstile, frontend cũng phải truyền token thật. Không đặt secret Turnstile ở frontend.
