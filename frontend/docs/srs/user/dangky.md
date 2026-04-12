# Software Requirement Specification (SRS)
## Chức năng: Đăng ký tài khoản (User Registration)
**Mã chức năng:** AUTH-02  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Quỳnh Anh
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Cho phép người dùng mới tạo tài khoản cá nhân trên hệ thống thương mại điện tử. Quy trình bao gồm nhập thông tin, xác thực email và kích hoạt tài khoản trước khi sử dụng.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập URL `/register` | Hiển thị form đăng ký: Họ tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu, checkbox Điều khoản. |
| 2 | Điền thông tin và nhấn "Đăng ký" | Validate dữ liệu phía Client (format, độ dài, khớp mật khẩu). |
| 3 | Gửi request POST lên server | Server validate lại toàn bộ dữ liệu, kiểm tra CSRF Token. |
| 4 | Kiểm tra email trùng lặp | Nếu email đã tồn tại → trả về lỗi. Nếu chưa → tiếp tục. |
| 5 | Tạo tài khoản | Hash mật khẩu, lưu vào DB với `status = 'pending'`, tạo `email_verification_token`. |
| 6 | Gửi email xác thực | Gửi email chứa link kích hoạt đến địa chỉ email người dùng (TTL: 24 giờ). |
| 7 | Hiển thị thông báo | Chuyển đến trang thông báo: *"Vui lòng kiểm tra email để kích hoạt tài khoản."* |
| 8 | Người dùng nhấn link xác thực email | Server kiểm tra token, cập nhật `status = 'active'`, redirect về `/login` với thông báo thành công. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào (Input Fields)

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `full_name` | string | Có | 2–100 ký tự, không chứa ký tự đặc biệt |
| `email` | string | Có | Đúng định dạng email, tối đa 255 ký tự, chưa tồn tại trong DB |
| `phone_number` | string | Không | 10–11 chữ số, định dạng VN (0xxxxxxxxx) |
| `password` | string | Có | Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số |
| `password_confirmation` | string | Có | Phải khớp với `password` |
| `agree_terms` | boolean | Có | Bắt buộc checked = `true` |

#### 3.2. Dữ liệu lưu trữ (Database - Bảng `users`)

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK, auto-increment | Định danh người dùng |
| `full_name` | varchar(100) | Họ và tên |
| `email` | varchar(255), unique, index | Email đăng nhập |
| `phone_number` | varchar(15), nullable | Số điện thoại |
| `password` | varchar(255) | Mật khẩu đã hash |
| `status` | enum('pending','active','inactive') | Trạng thái tài khoản |
| `email_verified_at` | timestamp, nullable | Thời điểm xác thực email |
| `email_verification_token` | varchar(64), nullable | Token xác thực email |
| `token_expires_at` | timestamp, nullable | Thời hạn token |
| `created_at` | timestamp | Thời điểm tạo tài khoản |

---

### 4. Ràng buộc kỹ thuật & Bảo mật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Giao thức | Bắt buộc **HTTPS** |
| CSRF Protection | Nhúng CSRF Token trong form POST |
| Mã hóa mật khẩu | Sử dụng `Argon2id` hoặc `Bcrypt` (cost ≥ 12); không lưu plaintext |
| Email verification token | Tạo bằng `CSPRNG`, độ dài 64 ký tự, TTL = 24 giờ |
| Rate Limiting | Tối đa 5 lần đăng ký/giờ/IP |
| Spam Prevention | Tích hợp **reCAPTCHA v3** hoặc Honeypot field ẩn |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Email sai định dạng | Lỗi inline: *"Email không đúng định dạng."* |
| E02 | Email đã tồn tại trong hệ thống | Lỗi inline: *"Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác."* |
| E03 | Mật khẩu không đủ độ mạnh | Lỗi inline: *"Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."* |
| E04 | Xác nhận mật khẩu không khớp | Lỗi inline: *"Mật khẩu xác nhận không khớp."* |
| E05 | Chưa đồng ý điều khoản | Lỗi inline: *"Bạn cần đồng ý với Điều khoản dịch vụ để tiếp tục."* |
| E06 | Token xác thực email hết hạn | Hiển thị trang lỗi với nút *"Gửi lại email xác thực"*. |
| E07 | Token xác thực đã được dùng | Hiển thị: *"Liên kết này đã được sử dụng. Tài khoản của bạn có thể đã được kích hoạt."* + link đến `/login`. |
| E08 | Email xác thực không đến | Trang thông báo cung cấp nút *"Gửi lại email"* (giới hạn 3 lần/24 giờ). |

---

### 6. Giao diện (UI/UX)

- Thiết kế **Responsive**: hoạt động trên Desktop, Tablet, Mobile.
- Hiển thị **password strength indicator** (Yếu / Trung bình / Mạnh) theo thời gian thực.
- Icon mắt để toggle ẩn/hiện mật khẩu cho cả 2 field.
- Nút **"Đăng ký"** hiển thị spinner khi đang xử lý, vô hiệu hóa tránh submit nhiều lần.
- Link **"Đã có tài khoản? Đăng nhập"** dẫn về `/login`.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Đăng nhập | AUTH-01 | Đăng nhập sau khi tài khoản được kích hoạt |
| Thông tin cá nhân | USER-01 | Hoàn thiện hồ sơ sau khi đăng ký |
| Trang chủ | HOME-01 | Trang đích sau khi kích hoạt và đăng nhập |
