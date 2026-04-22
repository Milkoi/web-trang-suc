# Software Requirement Specification (SRS)
## Chức năng: Quản lý khuyến mãi (Promotion Management)
**Mã chức năng:** PRO-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** [Le Minh Quan]  

---

### 1. Mô tả
Quản lý mã giảm giá và chương trình khuyến mãi.

---

### 2. Workflow
| Bước | Hành động | Phản hồi |
|---|---|---|
| 1 | Truy cập `/admin/promotions` | Hiển thị danh sách |
| 2 | Thêm mã | Form nhập |
| 3 | Lưu | Validate + lưu DB |
| 4 | Sửa/Xóa | Cập nhật |

---

### 3. Data
* code, discount, start_date, end_date

---

### 4. Constraints
* Không trùng code
* Kiểm tra thời gian hợp lệ

---

### 5. Edge Cases
* Hết hạn → không áp dụng  
* Discount > 100% → lỗi  

---

### 6. UI
* Hiển thị trạng thái còn hạn/hết hạn