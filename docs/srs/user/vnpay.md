# Software Requirement Specification (SRS)
## Chức năng: Thanh toán VNPAY
**Mã chức năng:** PAYMENT-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Tran Minh Nguyet
---

### 1. Mô tả
Thanh toán online qua VNPAY.

---

### 2. Luồng nghiệp vụ
| Bước | User | System |
|------|------|--------|
| 1 | Chọn thanh toán | Redirect |
| 2 | Thanh toán | Callback |

---

### 3. Dữ liệu
- order_id  
- amount  

---

### 4. Ràng buộc
- Kết nối API  

---

### 5. Edge Cases
- Thanh toán thất bại  

---

### 6. UI/UX
- Nút thanh toán  

---