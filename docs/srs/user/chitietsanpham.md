## Chức năng: Chi tiết sản phẩm
**Mã chức năng:** PRODUCT-02  

### 1. Mô tả
Hiển thị đầy đủ thông tin sản phẩm.

---

### 2. Luồng nghiệp vụ
| Bước | User | System |
|------|------|--------|
| 1 | Click sản phẩm | Load chi tiết |
| 2 | Click add to cart | Thêm vào giỏ |

---

### 3. Dữ liệu
- name
- price
- description
- image
- stock

---

### 4. Ràng buộc
- Không hiển thị nếu sản phẩm bị xóa

---

### 5. Edge Cases
- Hết hàng → disable button

---

### 6. UI
- Gallery ảnh
- Nút thêm giỏ hàng