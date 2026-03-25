# Software Requirement Specification (SRS)
## Chức năng: Trang chủ (Homepage)
**Mã chức năng:** HOME-01  
**Trạng thái:** Draft  
**Người soạn thảo:** [Tran Quynh Anh]

---

### 1. Mô tả tổng quan
Trang chủ là điểm truy cập đầu tiên của người dùng, hiển thị thông tin nổi bật như banner, danh mục, sản phẩm nổi bật.

---

### 2. Luồng nghiệp vụ
| Bước | Hành động người dùng | Phản hồi hệ thống |
|------|----------------------|------------------|
| 1 | Truy cập `/` | Hiển thị trang chủ |
| 2 | Cuộn trang | Load thêm sản phẩm |
| 3 | Click sản phẩm | Chuyển sang trang chi tiết |

---

### 3. Dữ liệu
- Banner
- Danh mục
- Sản phẩm nổi bật

---

### 4. Ràng buộc
- Thời gian load < 3s
- Responsive

---

### 5. Lỗi
- Không load được dữ liệu → hiển thị thông báo

---

### 6. UI/UX
- Slider banner
- Grid sản phẩm