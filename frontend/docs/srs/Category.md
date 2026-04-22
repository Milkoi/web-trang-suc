# Software Requirement Specification (SRS)
## Chức năng: Quản lý danh mục sản phẩm (Category Management)
**Mã chức năng:** CAT-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Le Minh Quan]  
**Vai trò:** Developer  

---

### 1. Mô tả tổng quan (Description)
Cho phép quản trị viên thêm, chỉnh sửa và xóa danh mục sản phẩm nhằm tổ chức sản phẩm một cách khoa học, hỗ trợ tìm kiếm và hiển thị hiệu quả trên hệ thống.

---

### 2. Luồng nghiệp vụ (User Workflow)
| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập trang `/admin/categories` | Hiển thị danh sách danh mục |
| 2 | Nhấn "Thêm danh mục" | Hiển thị form nhập |
| 3 | Nhập thông tin và submit | Validate dữ liệu |
| 4 | Thêm thành công | Lưu DB và cập nhật danh sách |
| 5 | Nhấn "Sửa" | Hiển thị form với dữ liệu cũ |
| 6 | Cập nhật thông tin | Lưu thay đổi |
| 7 | Nhấn "Xóa" | Hiển thị xác nhận |
| 8 | Xác nhận xóa | Xóa danh mục khỏi DB |

---

### 3. Yêu cầu dữ liệu (Data Requirements)
#### 3.1. Dữ liệu đầu vào
* **Tên danh mục:** `string`, bắt buộc, không trùng
* **Mô tả:** `string`, tùy chọn

#### 3.2. Dữ liệu lưu trữ (Bảng `categories`)
* `id`: primary key
* `name`: unique
* `description`: text
* `created_at`: timestamp

---

### 4. Ràng buộc kỹ thuật & Bảo mật
* Chỉ **Admin** được phép thao tác
* Sử dụng CSRF Token
* Validate dữ liệu cả client & server
* Không cho phép trùng tên danh mục

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi
* Trùng tên danh mục  
  → Thông báo: "Danh mục đã tồn tại"
* Xóa danh mục đang chứa sản phẩm  
  → Không cho xóa, thông báo lỗi
* Dữ liệu rỗng  
  → Hiển thị lỗi bắt buộc

---

### 6. Giao diện (UI/UX)
* Danh sách dạng bảng
* Có nút Thêm / Sửa / Xóa
* Popup xác nhận khi xóa
* Responsive