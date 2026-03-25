## Chức năng: Tìm kiếm sản phẩm
**Mã chức năng:** SEARCH-01  

### 1. Mô tả
Tìm kiếm theo tên, loại, giá.

---

### 2. Luồng nghiệp vụ
| Bước | User | System |
|------|------|--------|
| 1 | Nhập từ khóa | Gợi ý |
| 2 | Submit | Trả kết quả |

---

### 3. Dữ liệu
- keyword
- filter

---

### 4. Ràng buộc
- Debounce input

---

### 5. Edge Cases
- Không có kết quả

---

### 6. UI
- Search bar + filter