# Software Requirement Specification (SRS)
## Chức năng: Quản lý đơn hàng (Order Management)
**Mã chức năng:** ORD-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Le Minh Quan]  
**Vai trò:** Developer  

---

### 1. Mô tả tổng quan (Description)
Cho phép quản trị viên quản lý đơn hàng bao gồm xác nhận, hủy và cập nhật trạng thái đơn hàng trong quá trình xử lý.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/admin/orders` | Hiển thị danh sách đơn hàng |
| 2 | Xem chi tiết đơn | Hiển thị thông tin |
| 3 | Nhấn "Xác nhận" | Cập nhật trạng thái |
| 4 | Nhấn "Hủy" | Yêu cầu xác nhận |
| 5 | Xác nhận hủy | Cập nhật trạng thái |
| 6 | Cập nhật trạng thái | Lưu vào DB |

---

### 3. Yêu cầu dữ liệu (Data Requirements)
#### 3.1. Dữ liệu đầu vào
* **Trạng thái:** `enum` (Pending, Confirmed, Shipping, Completed, Cancelled)
* **Ghi chú:** `string`, tùy chọn

#### 3.2. Dữ liệu lưu trữ (Bảng `orders`)
* `id`: primary key
* `user_id`: foreign key
* `total_price`: number
* `status`: enum
* `created_at`: timestamp

---

### 4. Ràng buộc kỹ thuật & Bảo mật
* Chỉ Admin thao tác
* Không cho chuyển trạng thái sai logic (VD: Completed → Pending)
* Ghi log lịch sử thay đổi

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi
* Đơn đã hủy → không thể cập nhật  
* Đơn không tồn tại → báo lỗi  
* Lỗi kết nối DB → thông báo hệ thống  

---

### 6. Giao diện (UI/UX)
* Danh sách đơn hàng dạng bảng
* Màu sắc phân biệt trạng thái
* Có filter theo trạng thái
* Có nút xác nhận/hủy nhanh