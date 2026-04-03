# Software Requirement Specification (SRS)
## Chức năng: Trạng thái đơn hàng (Order Status Tracking)
**Mã chức năng:** ORDER-02  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt  
**Vai trò:** Developer

---

### 1. Mô tả tổng quan (Description)
Cho phép người dùng xem danh sách đơn hàng đã đặt và theo dõi trạng thái chi tiết từng đơn hàng theo thời gian thực. Hỗ trợ thao tác hủy đơn hàng (trong điều kiện cho phép) và yêu cầu hoàn trả.

---

### 2. Luồng nghiệp vụ (User Workflow)

#### 2.1. Danh sách đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/account/orders` | Hiển thị danh sách đơn hàng phân theo tab trạng thái, phân trang 10 đơn/trang. |
| 2 | Lọc theo trạng thái (tab) | Lọc danh sách theo: Tất cả / Chờ xác nhận / Đang giao / Hoàn thành / Đã hủy. |
| 3 | Click vào đơn hàng | Chuyển đến trang chi tiết `/account/orders/{order_code}`. |

#### 2.2. Chi tiết & Tracking đơn hàng

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Xem chi tiết đơn hàng | Hiển thị: thông tin người nhận, danh sách sản phẩm, timeline trạng thái, tổng tiền. |
| 2 | Xem timeline vận chuyển | Hiển thị các mốc: Đặt hàng → Xác nhận → Đóng gói → Đang giao → Đã nhận. |
| 3 | Nhấn "Hủy đơn hàng" | Chỉ hiển thị khi status = `pending` hoặc `confirmed`; hiện modal xác nhận + chọn lý do hủy. |
| 4 | Xác nhận hủy | Cập nhật trạng thái `cancelled`, hoàn lại tồn kho, gửi email thông báo hủy. |
| 5 | Nhấn "Đã nhận hàng" | Xác nhận nhận hàng thủ công; cập nhật `delivered`, mở khóa tính năng đánh giá. |
| 6 | Nhấn "Mua lại" | Thêm toàn bộ sản phẩm của đơn hàng vào giỏ hàng. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Trạng thái đơn hàng & Luồng chuyển tiếp

```
pending → confirmed → shipping → delivered → [completed]
    ↓           ↓
cancelled   cancelled
```

| Trạng thái | Ý nghĩa | Cho phép hủy |
| :--- | :--- | :--- |
| `pending` | Chờ xác nhận từ shop | Có |
| `confirmed` | Shop đã xác nhận | Có (trong 1 giờ) |
| `shipping` | Đang giao hàng | Không |
| `delivered` | Đã giao hàng (shipper xác nhận) | Không |
| `completed` | Người dùng xác nhận nhận hàng | Không |
| `cancelled` | Đã hủy | Không |
| `refund_requested` | Đã yêu cầu hoàn tiền | Không |
| `refunded` | Đã hoàn tiền | Không |

#### 3.2. Cấu trúc DB - Bảng `order_status_logs`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `order_id` | bigint, FK | |
| `from_status` | varchar(50), nullable | Trạng thái trước |
| `to_status` | varchar(50) | Trạng thái sau |
| `note` | text, nullable | Ghi chú (lý do hủy, v.v.) |
| `created_by` | bigint, nullable | User ID thực hiện (null = hệ thống) |
| `created_at` | timestamp | |

#### 3.3. Thông báo (Notifications)

| Sự kiện | Kênh thông báo | Nội dung |
| :--- | :--- | :--- |
| Đơn hàng được xác nhận | Email + In-app | Mã đơn, link theo dõi |
| Đang giao hàng | Email + SMS (tùy chọn) | Mã vận đơn, link track |
| Giao hàng thành công | Email + In-app | Yêu cầu đánh giá sản phẩm |
| Đơn hàng bị hủy | Email + In-app | Lý do, thông tin hoàn tiền (nếu có) |

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Phân quyền | Người dùng chỉ xem được đơn hàng của chính mình; kiểm tra `order.user_id == auth.user_id` |
| Hoàn tồn kho | Khi hủy đơn: hoàn lại `stock_quantity` trong DB Transaction |
| Hoàn tiền | Đơn đã thanh toán online: tạo bản ghi `refund_requests`; xử lý thủ công hoặc qua cổng thanh toán |
| Realtime | Cập nhật trạng thái theo thời gian thực qua **WebSocket** hoặc **Server-Sent Events** (SSE) |
| Audit Trail | Mọi thay đổi trạng thái đều được ghi vào `order_status_logs` |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Truy cập đơn hàng của người khác | Trả về lỗi 403 Forbidden |
| E02 | Mã đơn hàng không tồn tại | Trả về trang 404 |
| E03 | Hủy đơn khi trạng thái không cho phép | Ẩn nút "Hủy đơn"; nếu gọi API trực tiếp → trả về lỗi 422 với message rõ ràng |
| E04 | "Mua lại" khi một số sản phẩm đã ngừng kinh doanh | Thêm các sản phẩm còn active vào giỏ, hiển thị cảnh báo về sản phẩm không còn bán |
| E05 | Không có đơn hàng nào | Hiển thị: *"Bạn chưa có đơn hàng nào."* + nút *"Bắt đầu mua sắm"* |

---

### 6. Giao diện (UI/UX)

- **Danh sách đơn hàng:** Tab filter (Tất cả / Chờ xử lý / Đang giao / Hoàn thành / Đã hủy); mỗi row hiển thị ảnh thumbnail sản phẩm đầu, tên, tổng tiền, trạng thái badge, ngày đặt.
- **Chi tiết đơn hàng:**
  - **Timeline dọc:** Các mốc trạng thái với icon, timestamp; mốc hiện tại được highlight.
  - **Thông tin giao hàng:** Tên, SĐT, địa chỉ người nhận.
  - **Bảng sản phẩm:** Ảnh, tên, biến thể, đơn giá, SL, thành tiền.
  - **Tóm tắt thanh toán:** Tạm tính, giảm giá, phí ship, tổng cộng, phương thức thanh toán.
- **Nút hành động:** Tùy trạng thái: *Hủy đơn / Đã nhận hàng / Mua lại / Đánh giá*.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Đặt hàng | ORDER-01 | Tạo đơn hàng mới |
| Thông tin cá nhân | USER-01 | Menu điều hướng đến đơn hàng |
| Giỏ hàng | CART-01 | Mua lại → thêm vào giỏ |
| Chi tiết sản phẩm | PROD-02 | Đánh giá sản phẩm sau khi nhận |
