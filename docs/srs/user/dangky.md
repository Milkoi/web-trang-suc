# Software Requirement Specification (SRS)
## Chức năng: Đăng ký tài khoản người dùng (User Registration)
**Mã chức năng:** AUTH-04  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Tran Quynh Anh]  
**Vai trò:** End User (Khách hàng)

---

### 1. Mô tả tổng quan (Description)
Cho phép người dùng tạo tài khoản mới để sử dụng các chức năng của hệ thống như mua hàng, quản lý đơn hàng và thông tin cá nhân.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/register` | Hiển thị form đăng ký |
| 2 | Nhập thông tin (Email, Password, Name, ...) | Validate dữ liệu |
| 3 | Nhấn "Đăng ký" | Gửi request đến server |
| 4 | Hệ thống kiểm tra dữ liệu | Kiểm tra email đã tồn tại chưa |
| 5 | Đăng ký thành công | Lưu DB, chuyển về trang đăng nhập hoặc auto login |
| 6 | Đăng ký thất bại | Hiển thị lỗi |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào (Input Fields)
* **Name:** string, bắt buộc  
* **Email:** string, đúng định dạng, bắt buộc  
* **Password:** string, tối thiểu 6 ký tự, bắt buộc  
* **Confirm Password:** phải trùng với Password  
* **Phone (optional):** số điện thoại  
* **Address (optional):** địa chỉ  

#### 3.2. Dữ liệu lưu trữ (Database - bảng `users`)
* `id`: primary key  
* `name`: string  
* `email`: unique  
* `password`: hashed  
* `phone`: string  
* `address`: string  
* `status`: active (default)  
* `created_at`: timestamp  

---

### 4. Ràng buộc kỹ thuật & Bảo mật (Technical Constraints)

* Sử dụng HTTPS  
* Password phải được mã hóa bằng Bcrypt  
* Có CSRF Token  
* Validate cả client-side và server-side  
* Email phải là duy nhất  

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

* Email đã tồn tại  
  → "Email đã được sử dụng"

* Password không khớp  
  → "Mật khẩu xác nhận không đúng"

* Thiếu thông tin  
  → Hiển thị lỗi tại từng field  

* Email sai định dạng  
  → "Email không hợp lệ"

---

### 6. Giao diện (UI/UX)

* Form gồm:
  - Name  
  - Email  
  - Password  
  - Confirm Password  
  - Phone (optional)  
  - Address (optional)  

* Nút "Đăng ký"  
* Link "Đã có tài khoản? Đăng nhập"  
* Responsive (mobile + desktop)  
* Nhấn Enter để submit  

---

### 7. Phân quyền (Authorization)

* Sau khi đăng ký:
  - Tài khoản được gán role = USER  
  - Không có quyền Admin  

---

### 8. Mở rộng (Optional - nếu muốn ăn điểm cao)

* Gửi email xác nhận tài khoản  
* OTP xác thực  
* Google Login / Facebook Login  

---