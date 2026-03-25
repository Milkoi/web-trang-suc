# Software Requirement Specification (SRS)
## Chức năng: Theo dõi thanh toán VNPay (VNPay Tracking)
**Mã chức năng:** PAY-01  

---

### 1. Mô tả
Theo dõi trạng thái thanh toán VNPay của đơn hàng.

---

### 2. Workflow
| Bước | Hành động | Phản hồi |
|---|---|---|
| 1 | Khách thanh toán | Redirect VNPay |
| 2 | VNPay trả kết quả | Hệ thống nhận callback |
| 3 | Cập nhật trạng thái | Lưu DB |

---

### 3. Data
* order_id
* transaction_id
* status
* amount

---

### 4. Constraints
* Xác thực chữ ký VNPay
* HTTPS bắt buộc

---

### 5. Edge Cases
* Thanh toán thất bại  
* Callback lỗi  

---

### 6. UI
* Hiển thị trạng thái thanh toán