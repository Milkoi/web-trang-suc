# Software Requirement Specification (SRS)
## Chức năng: Quản lý sản phẩm (Product Management)
**Mã chức năng:** PROD-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Le Minh Quan]  
**Vai trò:** Developer  

---

### 1. Mô tả tổng quan (Description)
Cho phép quản trị viên thêm, chỉnh sửa và xóa sản phẩm trong hệ thống, quản lý thông tin chi tiết như tên, giá, hình ảnh và danh mục.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/admin/products` | Hiển thị danh sách sản phẩm |
| 2 | Nhấn "Thêm sản phẩm" | Hiển thị form |
| 3 | Nhập thông tin | Validate dữ liệu |
| 4 | Lưu | Thêm vào DB |
| 5 | Nhấn "Sửa" | Hiển thị thông tin |
| 6 | Cập nhật | Lưu thay đổi |
| 7 | Nhấn "Xóa" | Xác nhận |
| 8 | Xóa thành công | Cập nhật danh sách |

---

### 3. Yêu cầu dữ liệu (Data Requirements)
#### 3.1. Dữ liệu đầu vào
* **Tên sản phẩm:** `string`, bắt buộc
* **Giá:** `number`, > 0
* **Danh mục:** `category_id`, bắt buộc
* **Mô tả:** `text`, tùy chọn
* **Hình ảnh:** `file/url`, tùy chọn

#### 3.2. Dữ liệu lưu trữ (Bảng `products`)
* `id`: primary key
* `name`: string
* `price`: number
* `category_id`: foreign key
* `description`: text
* `image_url`: string
* `created_at`: timestamp

---

### 4. Ràng buộc kỹ thuật & Bảo mật
* Chỉ Admin được phép thao tác
* Validate dữ liệu đầu vào
* Upload ảnh phải kiểm tra định dạng (jpg, png)
* Sử dụng CSRF Token

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi
* Giá <= 0  
  → Thông báo lỗi
* Không chọn danh mục  
  → Không cho submit
* Upload file sai định dạng  
  → Báo lỗi
* Sản phẩm không tồn tại khi sửa/xóa  
  → Thông báo lỗi

---

### 6. Giao diện (UI/UX)
* Bảng danh sách sản phẩm
* Có tìm kiếm/lọc
* Form rõ ràng, dễ nhập
* Preview ảnh khi upload