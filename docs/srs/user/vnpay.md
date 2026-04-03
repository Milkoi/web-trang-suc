# 📄 SOFTWARE REQUIREMENT SPECIFICATION (SRS)
## Chức năng: Thanh toán VNPAY

- **Mã chức năng:** PAYMENT-01  
- **Trạng thái:** Draft / Review  
- **Người soạn thảo:** Tran Minh Nguyet  
- **Ngày cập nhật:** 03/04/2026  

---

## 1. Mô tả tổng quan

Hệ thống tích hợp cổng thanh toán **VNPAY** cho phép khách hàng thanh toán đơn hàng trang sức trực tuyến thông qua:

- QR Code (Mobile Banking)  
- Thẻ ATM nội địa (NAPAS)  
- Thẻ quốc tế (Visa, MasterCard, JCB)  

### Hệ thống sẽ:
- Tạo URL thanh toán  
- Redirect người dùng sang VNPAY  
- Nhận kết quả qua callback (return URL + IPN)  
- Cập nhật trạng thái đơn hàng  

---

## 2. Actors (Tác nhân)

| Actor | Mô tả |
|------|------|
| Customer | Người mua hàng |
| System | Website bán trang sức |
| VNPAY Gateway | Cổng thanh toán |

---

## 3. Preconditions (Điều kiện trước)

- Người dùng đã đăng nhập (nếu có)  
- Có đơn hàng hợp lệ (`status = pending`)  

### Server đã cấu hình:
- `vnp_TmnCode`  
- `vnp_HashSecret`  
- `vnp_Url`  
- `vnp_ReturnUrl`  

---

## 4. Luồng nghiệp vụ chi tiết

### 4.1 Luồng chính (Happy Path)

| Bước | User | System |
|------|------|--------|
| 1 | Nhấn "Thanh toán VNPAY" | Kiểm tra đơn hàng |
| 2 | | Tạo mã giao dịch (`txnRef`) |
| 3 | | Tạo URL thanh toán (hash SHA512) |
| 4 | | Redirect sang VNPAY |
| 5 | Chọn phương thức thanh toán | |
| 6 | Xác nhận thanh toán | |
| 7 | | VNPAY redirect về `return_url` |
| 8 | | System verify chữ ký |
| 9 | | Cập nhật đơn hàng (`paid/failed`) |
| 10 | Hiển thị kết quả | |

---

### 4.2 Luồng IPN (Server-to-Server)

| Bước | VNPAY | System |
|------|------|--------|
| 1 | Gửi IPN request | |
| 2 | | Verify secure hash |
| 3 | | Kiểm tra `txnRef` tồn tại |
| 4 | | Kiểm tra số tiền |
| 5 | | Update trạng thái |
| 6 | | Trả response code |

---

## 5. Dữ liệu (Data Specification)

### 5.1 Request gửi VNPAY

| Field | Mô tả |
|------|------|
| vnp_Version | Phiên bản API |
| vnp_Command | pay |
| vnp_TmnCode | Mã merchant |
| vnp_Amount | Số tiền (x100) |
| vnp_CurrCode | VND |
| vnp_TxnRef | Mã đơn hàng |
| vnp_OrderInfo | Nội dung thanh toán |
| vnp_OrderType | billpayment |
| vnp_Locale | vn |
| vnp_ReturnUrl | URL callback |
| vnp_IpAddr | IP user |
| vnp_CreateDate | Thời gian |

---

### 5.2 Response từ VNPAY

| Field | Mô tả |
|------|------|
| vnp_ResponseCode | Kết quả |
| vnp_TransactionStatus | Trạng thái |
| vnp_TxnRef | Mã đơn |
| vnp_Amount | Số tiền |
| vnp_SecureHash | Chữ ký |

---

## 6. Business Rules (Quy tắc nghiệp vụ)

- Số tiền phải **nhân 100** trước khi gửi  
- Mỗi `order_id` chỉ thanh toán thành công **1 lần**  
- Nếu đã thanh toán → không được thanh toán lại  

### Chỉ chấp nhận khi:
- `vnp_ResponseCode = "00"`  
- `vnp_TransactionStatus = "00"`  

---

## 7. Edge Cases (Trường hợp đặc biệt)

| Trường hợp | Xử lý |
|-----------|------|
| User thoát giữa chừng | Đơn hàng vẫn `pending` |
| Thanh toán thất bại | Hiển thị lỗi |
| Callback bị giả mạo | Reject |
| IPN gửi nhiều lần | Idempotent (không update trùng) |
| Sai số tiền | Reject |
| Timeout | Cho retry |

---

## 8. Security Requirements

- Sử dụng **SHA512** để verify chữ ký  
- Không tin dữ liệu từ client  

### Validate:
- `amount`  
- `order_id`  

- IPN phải xử lý server-side  
- Log toàn bộ request/response  

---

## 9. UI/UX Requirements

### 9.1 Trang Checkout
- Nút: **Thanh toán qua VNPAY**  

Hiển thị:
- Tổng tiền  
- Phương thức thanh toán  

---

### 9.2 Trang Kết quả

**Thành công:**
> Thanh toán thành công  

**Thất bại:**
> Thanh toán thất bại  

Có nút:
- Quay lại trang đơn hàng  

---

## 10. API & Integration

### 10.1 Endpoint nội bộ

| API | Method | Mô tả |
|-----|--------|------|
| `/create-payment` | POST | Tạo URL VNPAY |
| `/vnpay-return` | GET | Nhận redirect |
| `/vnpay-ipn` | GET | Nhận IPN |

---

## 11. Database Design (gợi ý)

### Bảng `orders`

| Field | Type |
|------|------|
| id | int |
| amount | int |
| status | pending / paid / failed |
| txn_ref | varchar |

---

## 12. Logging & Monitoring

Log:
- Request gửi VNPAY  
- Response nhận về  
- IPN  

👉 Lưu log để debug khi lỗi thanh toán  

---

## 13. Non-functional Requirements

- Thời gian redirect < 2s  
- Hệ thống chịu tải nhiều request đồng thời  
- Tính sẵn sàng cao (~99%)  

---

## 14. Acceptance Criteria

- Thanh toán thành công → `status = paid`  
- Thanh toán thất bại → `status = failed`  
- Không bị double payment  
- Verify hash chính xác  

---
