# Software Requirement Specification (SRS)
## Chức năng: Thông tin cá nhân (User Profile)
**Mã chức năng:** USER-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt  
**Vai trò:** Developer

---

### 1. Mô tả tổng quan (Description)
Trang thông tin cá nhân cho phép người dùng đã đăng nhập xem và cập nhật hồ sơ cá nhân, quản lý danh sách địa chỉ giao hàng, đổi mật khẩu và xem lịch sử hoạt động tài khoản.

---

### 2. Luồng nghiệp vụ (User Workflow)

#### 2.1. Cập nhật thông tin cá nhân

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/account/profile` | Hiển thị form với thông tin hiện tại được điền sẵn. |
| 2 | Chỉnh sửa thông tin và nhấn "Lưu" | Validate dữ liệu phía client. |
| 3 | Gửi request PUT | Validate phía server, cập nhật DB. |
| 4 | Thành công | Hiển thị toast: *"Cập nhật thông tin thành công."* |
| 5 | Upload ảnh đại diện | Chọn file ảnh → preview → nhấn "Upload" → hệ thống resize và lưu. |

#### 2.2. Quản lý địa chỉ giao hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Xem danh sách địa chỉ | Hiển thị tối đa 5 địa chỉ; địa chỉ mặc định được đánh dấu. |
| 2 | Thêm địa chỉ mới | Mở form thêm địa chỉ (modal hoặc section mở rộng). |
| 3 | Chỉnh sửa địa chỉ | Mở form chỉnh sửa với dữ liệu hiện tại. |
| 4 | Xóa địa chỉ | Hiện dialog xác nhận; không cho xóa địa chỉ mặc định nếu còn địa chỉ khác. |
| 5 | Đặt làm địa chỉ mặc định | Cập nhật `is_default = true` cho địa chỉ chọn, `false` cho tất cả địa chỉ còn lại. |

#### 2.3. Đổi mật khẩu

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập tab "Bảo mật" | Hiển thị form đổi mật khẩu. |
| 2 | Nhập mật khẩu hiện tại, mật khẩu mới, xác nhận | Validate format phía client. |
| 3 | Nhấn "Đổi mật khẩu" | Server verify mật khẩu hiện tại, hash mật khẩu mới, cập nhật DB. |
| 4 | Thành công | Invalidate tất cả session khác (trừ session hiện tại), hiển thị thông báo thành công. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào - Thông tin cá nhân

| Field | Kiểu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `full_name` | string | Có | 2–100 ký tự |
| `phone_number` | string | Không | 10–11 số, định dạng VN |
| `date_of_birth` | date | Không | Định dạng YYYY-MM-DD; không được là ngày tương lai |
| `gender` | enum | Không | `male`, `female`, `other` |
| `avatar` | file | Không | JPG/PNG/WebP, tối đa 2MB, tối thiểu 200×200px |

#### 3.2. Dữ liệu đầu vào - Địa chỉ giao hàng

| Field | Kiểu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `receiver_name` | string | Có | 2–100 ký tự |
| `receiver_phone` | string | Có | 10–11 số |
| `province_id` | int | Có | ID từ danh mục địa giới hành chính |
| `district_id` | int | Có | |
| `ward_id` | int | Có | |
| `address_detail` | string | Có | 5–200 ký tự |
| `is_default` | boolean | Không | Mặc định `false` |

#### 3.3. Cấu trúc DB - Bảng `user_addresses`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `user_id` | bigint, FK | |
| `receiver_name` | varchar(100) | |
| `receiver_phone` | varchar(15) | |
| `province_id` | int, FK | |
| `district_id` | int, FK | |
| `ward_id` | int, FK | |
| `address_detail` | varchar(200) | |
| `is_default` | tinyint(1), default 0 | |
| `created_at` | timestamp | |

---

### 4. Ràng buộc kỹ thuật & Bảo mật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Phân quyền | Chỉ người dùng đã đăng nhập mới truy cập được; middleware `auth` bắt buộc |
| Avatar | Resize về 200×200px và 400×400px; lưu lên Object Storage (S3/MinIO); xóa file cũ sau khi upload mới |
| Email thay đổi | Nếu cho phép đổi email: gửi email xác nhận đến địa chỉ mới trước khi áp dụng |
| Đổi mật khẩu | Invalidate tất cả Refresh Token / Session cũ (trừ phiên hiện tại) |
| Giới hạn địa chỉ | Tối đa **5 địa chỉ** mỗi tài khoản |
| CSRF | Tất cả request POST/PUT/DELETE đều cần CSRF Token |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Upload ảnh vượt quá 2MB | Lỗi client: *"Ảnh không được vượt quá 2MB."* |
| E02 | Upload file không phải ảnh | Lỗi: *"Chỉ chấp nhận file JPG, PNG hoặc WebP."* |
| E03 | Mật khẩu hiện tại nhập sai | Lỗi: *"Mật khẩu hiện tại không chính xác."* |
| E04 | Mật khẩu mới trùng với mật khẩu cũ | Lỗi: *"Mật khẩu mới không được trùng với mật khẩu hiện tại."* |
| E05 | Xóa địa chỉ mặc định duy nhất | Không cho phép; hiển thị: *"Không thể xóa địa chỉ mặc định. Vui lòng chọn địa chỉ mặc định khác trước."* |
| E06 | Thêm địa chỉ khi đã đủ 5 | Ẩn nút "Thêm địa chỉ"; hiển thị: *"Bạn đã đạt giới hạn 5 địa chỉ."* |
| E07 | Người dùng chưa đăng nhập truy cập `/account/*` | Redirect đến `/login?redirect=/account/profile` |

---

### 6. Giao diện (UI/UX)

- **Layout sidebar + content:** Sidebar menu tài khoản (Hồ sơ / Địa chỉ / Đơn hàng / Bảo mật); content area bên phải.
- **Mobile:** Sidebar ẩn, điều hướng qua dropdown hoặc tab ngang.
- **Avatar:** Hiển thị ảnh hiện tại, nút "Thay đổi ảnh" overlay khi hover; preview ảnh trước khi upload.
- **Địa chỉ:** Mỗi card địa chỉ có badge *"Mặc định"* (nếu là địa chỉ mặc định), nút Sửa và Xóa.
- **Form đổi mật khẩu:** 3 field password với icon toggle ẩn/hiện; password strength indicator cho mật khẩu mới.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Đăng nhập | AUTH-01 | Xác thực trước khi truy cập |
| Trạng thái đơn hàng | ORDER-02 | Xem đơn hàng từ menu tài khoản |
| Đặt hàng | ORDER-01 | Dùng địa chỉ đã lưu khi checkout |
