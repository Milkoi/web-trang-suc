# Software Requirement Specification (SRS)
## Chức năng: Đặt hàng / Thanh toán (Checkout)
**Mã chức năng:** ORDER-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt 
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Quy trình đặt hàng cho phép người dùng nhập thông tin giao hàng, chọn phương thức vận chuyển, chọn phương thức thanh toán và xác nhận đơn hàng. Đây là bước cuối cùng trước khi đơn hàng được tạo chính thức trong hệ thống.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/checkout` từ giỏ hàng | Kiểm tra đăng nhập; kiểm tra lại tồn kho toàn bộ sản phẩm trong giỏ. |
| 2 | Nhập / chọn địa chỉ giao hàng | Nếu đã có địa chỉ lưu → cho phép chọn; hoặc nhập địa chỉ mới. |
| 3 | Chọn phương thức vận chuyển | Hệ thống tính phí ship dựa trên địa chỉ và tổng trọng lượng đơn hàng. |
| 4 | Chọn phương thức thanh toán | Hiện các tùy chọn: COD, VNPay, Chuyển khoản. |
| 5 | Nhập ghi chú đơn hàng (tùy chọn) | Lưu ghi chú vào đơn hàng. |
| 6 | Nhấn "Đặt hàng" | Validate toàn bộ thông tin, kiểm tra tồn kho lần cuối, khởi tạo đơn hàng. |
| 7a | Thanh toán COD | Tạo đơn hàng trực tiếp, chuyển đến trang xác nhận đơn hàng `/order/success/{id}`. |
| 7b | Thanh toán VNPay | Redirect đến cổng thanh toán VNPay; sau khi thanh toán → callback về hệ thống. |
| 8 | Callback thanh toán thành công | Cập nhật trạng thái đơn hàng `paid`, gửi email xác nhận, chuyển đến trang success. |
| 9 | Callback thanh toán thất bại | Giữ đơn hàng trạng thái `pending_payment`, hiển thị lỗi, cho phép thử lại. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu đầu vào (Input Fields)

| Field | Kiểu | Bắt buộc | Ràng buộc |
| :--- | :--- | :--- | :--- |
| `receiver_name` | string | Có | 2–100 ký tự |
| `receiver_phone` | string | Có | 10–11 số, định dạng VN |
| `province_id` | int | Có | ID tỉnh/thành từ danh mục địa chỉ |
| `district_id` | int | Có | ID quận/huyện |
| `ward_id` | int | Có | ID phường/xã |
| `address_detail` | string | Có | Số nhà, tên đường (5–200 ký tự) |
| `shipping_method_id` | int | Có | ID phương thức vận chuyển |
| `payment_method` | enum | Có | `cod`, `vnpay`, `bank_transfer` |
| `note` | string | Không | Tối đa 500 ký tự |
| `coupon_code` | string | Không | Mã giảm giá (nếu chưa áp dụng ở giỏ) |

#### 3.2. Cấu trúc DB - Bảng `orders`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `order_code` | varchar(20), unique | Mã đơn hàng (VD: ORD-20240103-00001) |
| `user_id` | bigint, FK | |
| `status` | enum | `pending`, `pending_payment`, `confirmed`, `shipping`, `delivered`, `cancelled`, `refunded` |
| `receiver_name` | varchar(100) | |
| `receiver_phone` | varchar(15) | |
| `shipping_address` | text | Địa chỉ đầy đủ (JSON snapshot) |
| `subtotal` | decimal(15,2) | Tổng tiền hàng |
| `discount_amount` | decimal(15,2), default 0 | Số tiền giảm giá |
| `shipping_fee` | decimal(15,2), default 0 | Phí vận chuyển |
| `total_amount` | decimal(15,2) | Tổng cộng phải thanh toán |
| `payment_method` | varchar(50) | |
| `payment_status` | enum | `unpaid`, `paid`, `refunded` |
| `paid_at` | timestamp, nullable | Thời điểm thanh toán |
| `note` | text, nullable | Ghi chú người dùng |
| `created_at` | timestamp | |

#### 3.3. Cấu trúc DB - Bảng `order_items`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `order_id` | bigint, FK | |
| `product_variant_id` | bigint, FK | |
| `product_name` | varchar(255) | Snapshot tên sản phẩm tại thời điểm đặt |
| `variant_attributes` | json | Snapshot biến thể (màu, size…) |
| `quantity` | int | |
| `unit_price` | decimal(15,2) | Giá tại thời điểm đặt hàng |
| `total_price` | decimal(15,2) | `quantity × unit_price` |

---

### 4. Ràng buộc kỹ thuật & Bảo mật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Tính nhất quán tồn kho | Dùng **DB Transaction + Row-level Lock** khi trừ tồn kho để tránh oversell |
| Idempotency | Mỗi request tạo đơn hàng có `idempotency_key` để tránh tạo đơn trùng khi retry |
| Snapshot dữ liệu | Lưu snapshot giá, tên sản phẩm, địa chỉ vào `order_items` và `orders` để bảo toàn lịch sử |
| Thanh toán | Tích hợp VNPay theo chuẩn IPN (Instant Payment Notification); xác thực chữ ký HMAC |
| HTTPS | Bắt buộc cho toàn bộ luồng checkout và callback thanh toán |
| Timeout | Đơn hàng `pending_payment` tự động hủy sau **30 phút** nếu không thanh toán |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Sản phẩm hết hàng tại thời điểm checkout | Thông báo lỗi, highlight sản phẩm vi phạm, không cho đặt hàng; redirect về giỏ hàng |
| E02 | Giỏ hàng trống khi truy cập checkout | Redirect về `/cart` |
| E03 | Người dùng chưa đăng nhập | Redirect về `/login?redirect=/checkout` |
| E04 | VNPay timeout / không phản hồi | Hiển thị lỗi, giữ đơn `pending_payment`, hiện nút *"Thanh toán lại"* |
| E05 | IPN callback giả mạo (chữ ký sai) | Từ chối, ghi log cảnh báo, không cập nhật trạng thái đơn hàng |
| E06 | Coupon hết lượt sử dụng giữa chừng | Hiển thị: *"Mã giảm giá đã hết lượt sử dụng."*; tính lại tổng không có coupon |
| E07 | Địa chỉ giao hàng không trong vùng phục vụ | Hiển thị thông báo, không hiện phương thức ship cho vùng đó |

---

### 6. Giao diện (UI/UX)

- **Layout dạng stepper (3 bước):** ① Thông tin giao hàng → ② Phương thức vận chuyển & Thanh toán → ③ Xác nhận.
- **Order Summary sidebar:** Hiển thị cố định (desktop) hoặc collapsible (mobile) với danh sách sản phẩm, tạm tính, phí ship, giảm giá, **tổng cộng**.
- Nút **"Đặt hàng"** hiển thị spinner khi đang xử lý; disable để tránh double-submit.
- **Trang success:** Hiển thị mã đơn hàng, tóm tắt đơn, thông báo *"Email xác nhận đã được gửi đến [email]."*, nút *"Xem đơn hàng"* và *"Tiếp tục mua sắm"*.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Giỏ hàng | CART-01 | Bước trước checkout |
| Trạng thái đơn hàng | ORDER-02 | Xem trạng thái sau khi đặt |
| VNPay | EXT-01 | Cổng thanh toán bên ngoài |
| Thông tin cá nhân | USER-01 | Lấy địa chỉ đã lưu |
