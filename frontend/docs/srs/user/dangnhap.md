# Software Requirement Specification (SRS)
## Chức năng: Đăng nhập (User Login)
**Mã chức năng:** AUTH-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Quỳnh Anh 
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Cung cấp cơ chế xác thực an toàn để người dùng (Khách hàng / Quản trị viên) đăng nhập vào hệ thống thương mại điện tử. Đảm bảo tính bảo mật cho tài khoản và dữ liệu cá nhân của người dùng.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập URL `/login` hoặc nhấn nút "Đăng nhập" | Hiển thị form đăng nhập gồm: Email, Password, Remember Me, nút Đăng nhập, link Quên mật khẩu. |
| 2 | Nhập Email và Password, nhấn "Đăng nhập" | Validate định dạng dữ liệu phía Client (HTML5 / JS). |
| 3 | Gửi request POST đến server | Server validate lại dữ liệu đầu vào, kiểm tra CSRF Token. |
| 4 | Server tra cứu tài khoản | So khớp Email trong DB, kiểm tra trạng thái tài khoản (active/inactive). |
| 5 | Kiểm tra mật khẩu | So sánh Password nhập vào với hash lưu trong DB (Bcrypt/Argon2). |
| 6 | Xác thực thành công | Khởi tạo Session/JWT Token, ghi nhận `last_login_at` và `login_ip`, chuyển hướng về trang chủ hoặc trang trước đó. |
| 7 | Xác thực thất bại | Giữ nguyên trang login, hiển thị thông báo lỗi chung, xóa trường Password, tăng bộ đếm thất bại. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào (Input Fields)

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `email` | string | Có | Đúng định dạng email, tối đa 255 ký tự |
| `password` | string | Có | Tối thiểu 8 ký tự, ẩn ký tự khi nhập |
| `remember_me` | boolean | Không | Mặc định: `false` |

#### 3.2. Dữ liệu lưu trữ (Database - Bảng `users`)

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | Định danh người dùng |
| `email` | varchar(255), unique, index | Email đăng nhập |
| `password` | varchar(255) | Mật khẩu đã hash (Bcrypt/Argon2) |
| `status` | enum('active','inactive') | Trạng thái tài khoản |
| `last_login_at` | timestamp, nullable | Thời điểm đăng nhập gần nhất |
| `login_ip` | varchar(45) | IP đăng nhập gần nhất (IPv4/IPv6) |
| `failed_login_count` | int, default 0 | Số lần đăng nhập sai liên tiếp |
| `locked_until` | timestamp, nullable | Thời điểm tài khoản được mở khóa |

#### 3.3. Session / Token

- **Session mode:** Tạo session server-side, lưu `session_id` vào cookie `HttpOnly; Secure; SameSite=Strict`.
- **Remember Me = true:** Thời hạn session kéo dài 30 ngày; ngược lại hết hạn khi đóng trình duyệt.
- **JWT mode (nếu áp dụng):** Access Token TTL = 15 phút; Refresh Token TTL = 7 ngày, lưu `HttpOnly cookie`.

---

### 4. Ràng buộc kỹ thuật & Bảo mật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Giao thức | Bắt buộc **HTTPS** trên toàn bộ luồng xác thực |
| CSRF Protection | Nhúng CSRF Token ẩn trong mọi form POST |
| Mã hóa mật khẩu | Không lưu plaintext; sử dụng `Argon2id` (ưu tiên) hoặc `Bcrypt` (cost ≥ 12) |
| Brute-force Protection | Khóa tạm thời tài khoản/IP sau **5 lần sai liên tiếp trong 1 phút**; thời gian khóa: 15 phút |
| Rate Limiting | Tối đa 10 request/phút/IP đến endpoint `/login` |
| Logging | Ghi Audit Log mỗi lần đăng nhập (thành công & thất bại): `user_id`, `ip`, `user_agent`, `timestamp`, `result` |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Email sai định dạng | Hiển thị lỗi inline tại field: *"Email không đúng định dạng."* |
| E02 | Email hoặc Password không khớp | Hiển thị thông báo chung: *"Email hoặc mật khẩu không chính xác."* (không tiết lộ field nào sai) |
| E03 | Tài khoản bị khóa bởi Admin | Hiển thị: *"Tài khoản của bạn tạm thời bị đình chỉ. Vui lòng liên hệ Admin."* |
| E04 | Tài khoản bị khóa do Brute-force | Hiển thị: *"Tài khoản bị tạm khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau [X] phút."* |
| E05 | CSRF Token hết hạn | Redirect về `/login` kèm thông báo: *"Phiên làm việc hết hạn, vui lòng thử lại."* |
| E06 | Server timeout / lỗi DB | Hiển thị: *"Đã xảy ra lỗi hệ thống, vui lòng thử lại sau."*; ghi log lỗi nội bộ. |
| E07 | Người dùng đã đăng nhập truy cập `/login` | Tự động redirect về trang chủ `/`. |

---

### 6. Giao diện (UI/UX)

- Thiết kế **Responsive**: hoạt động trên Desktop (≥1024px), Tablet (768px), Mobile (<768px).
- Nút **"Đăng nhập"** hiển thị spinner khi đang xử lý request, vô hiệu hóa để tránh submit nhiều lần.
- Hỗ trợ phím tắt: nhấn `Enter` để submit form.
- Hiển thị **icon mắt** để toggle ẩn/hiện mật khẩu.
- Link **"Quên mật khẩu?"** dẫn đến `/forgot-password`.
- Link **"Chưa có tài khoản? Đăng ký"** dẫn đến `/register`.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Đăng ký | AUTH-02 | Tạo tài khoản mới |
| Quên mật khẩu | AUTH-03 | Khôi phục mật khẩu qua email |
| Trang chủ | HOME-01 | Trang đích sau khi đăng nhập thành công |
| Thông tin cá nhân | USER-01 | Quản lý hồ sơ người dùng |
