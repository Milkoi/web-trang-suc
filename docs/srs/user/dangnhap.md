# Software Requirement Specification (SRS)
## Chức năng: Đăng nhập người dùng (User Login)
**Mã chức năng:** AUTH-03  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Tran Quynh Anh]  
**Vai trò:** End User (Khách hàng)

---

### 1. Mô tả tổng quan (Description)
Cho phép khách hàng đăng nhập vào hệ thống để sử dụng các chức năng như mua hàng, quản lý đơn hàng và thông tin cá nhân.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/login` | Hiển thị form đăng nhập |
| 2 | Nhập Email và Password | Kiểm tra dữ liệu đầu vào |
| 3 | Nhấn "Đăng nhập" | Gửi request đến server |
| 4 | Xác thực thành công | Chuyển về trang chủ / trang trước đó |
| 5 | Xác thực thất bại | Hiển thị thông báo lỗi |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào
* **Email:** string, đúng định dạng, bắt buộc  
* **Password:** string, tối thiểu 6 ký tự, bắt buộc  
* **Remember Me:** boolean (tùy chọn)

#### 3.2. Dữ liệu lưu trữ (Database - users)
* `email`: unique  
* `password`: hashed  
* `status`: active/inactive  
* `last_login_at`: timestamp  

---

### 4. Ràng buộc kỹ thuật & Bảo mật

* Sử dụng HTTPS  
* Password được mã hóa bằng Bcrypt  
* Có CSRF Token  
* Giới hạn đăng nhập sai (5 lần / phút)  
* Session hoặc JWT Token  

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi

* Sai email/password  
  → Hiển thị: "Email hoặc mật khẩu không đúng"

* Tài khoản bị khóa  
  → Hiển thị: "Tài khoản đã bị khóa"

* Chưa nhập dữ liệu  
  → Hiển thị lỗi validate

---

### 6. Giao diện (UI/UX)

* Form gồm:
  - Email  
  - Password  
  - Checkbox "Ghi nhớ đăng nhập"  
* Nút "Đăng nhập"  
* Link "Quên mật khẩu"  
* Responsive mobile + desktop  
* Enter để submit  

---

### 7. Phân quyền (Authorization)

* Sau khi đăng nhập:
  - USER → Trang chủ  
  - ADMIN → Không dùng chức năng này (dùng hệ thống riêng)

---