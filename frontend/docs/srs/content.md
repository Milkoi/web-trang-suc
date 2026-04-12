# Software Requirement Specification (SRS)
## Chức năng: Quản lý nội dung website (Content Management)
**Mã chức năng:** CMS-01  

---

### 1. Mô tả
Cho phép admin thay đổi nội dung hiển thị trên website (banner, text, hình ảnh).

---

### 2. Workflow
| Bước | Hành động | Phản hồi |
|---|---|---|
| 1 | Truy cập `/admin/content` | Hiển thị nội dung |
| 2 | Chỉnh sửa | Form |
| 3 | Lưu | Cập nhật |

---

### 3. Data
* title
* content
* image

---

### 4. Constraints
* Chỉ admin

---

### 5. Edge Cases
* Upload lỗi  
* Nội dung trống  

---

### 6. UI
* Editor đơn giản
* Preview trước khi lưu