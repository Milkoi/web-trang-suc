# Software Requirement Specification (SRS)
## Chức năng: Quản lý khách hàng (Customer Management)
**Mã chức năng:** CUS-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Le Minh Quan]  
**Vai trò:** Developer  

---

### 1. Mô tả tổng quan (Description)
Cho phép quản trị viên quản lý thông tin khách hàng, bao gồm xem danh sách, chỉnh sửa và khóa tài khoản.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/admin/customers` | Hiển thị danh sách |
| 2 | Xem chi tiết | Hiển thị thông tin |
| 3 | Nhấn "Sửa" | Cho phép chỉnh sửa |
| 4 | Lưu | Cập nhật DB |
| 5 | Khóa tài khoản | Cập nhật trạng thái |

---

### 3. Yêu cầu dữ liệu
#### Input
* Tên, email, số điện thoại, trạng thái

#### Database (`users`)
* id, name, email, phone, status, created_at

---

### 4. Ràng buộc
* Email unique
* Chỉ Admin thao tác

---

### 5. Edge Cases
* Email trùng → báo lỗi  
* Khóa tài khoản → không đăng nhập được  

---

### 6. UI/UX
* Bảng danh sách
* Có tìm kiếm