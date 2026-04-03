# Software Requirement Specification (SRS)
## Chức năng: Giỏ hàng (Shopping Cart)
**Mã chức năng:** CART-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt  
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Giỏ hàng cho phép người dùng tập hợp các sản phẩm muốn mua trước khi tiến hành thanh toán. Hệ thống hỗ trợ cả **guest cart** (chưa đăng nhập) và **user cart** (đã đăng nhập), với cơ chế merge giỏ hàng khi đăng nhập.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/cart` | Hiển thị danh sách sản phẩm trong giỏ, tổng tiền, nút thanh toán. |
| 2 | Thay đổi số lượng sản phẩm | Cập nhật tức thì (debounce 500ms), tính lại tổng tiền. |
| 3 | Xóa một sản phẩm | Hiện dialog xác nhận; sau khi xác nhận, xóa khỏi giỏ và cập nhật tổng. |
| 4 | Xóa toàn bộ giỏ hàng | Hiện dialog xác nhận; sau khi xác nhận, làm trống giỏ. |
| 5 | Nhập mã giảm giá (coupon) | Validate mã, áp dụng giảm giá và hiển thị dòng chiết khấu. |
| 6 | Nhấn "Tiến hành thanh toán" | Kiểm tra đăng nhập; nếu chưa → redirect `/login`; nếu rồi → chuyển đến `/checkout`. |
| 7 | Đăng nhập khi có guest cart | Merge guest cart vào user cart (ưu tiên giữ quantity lớn hơn nếu trùng SKU). |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Cấu trúc DB - Bảng `carts`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `user_id` | bigint, nullable, FK | NULL nếu là guest |
| `session_id` | varchar(100), nullable | Dùng cho guest cart |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### 3.2. Cấu trúc DB - Bảng `cart_items`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `cart_id` | bigint, FK | |
| `product_variant_id` | bigint, FK | Biến thể cụ thể |
| `quantity` | int, default 1 | Số lượng |
| `unit_price` | decimal(15,2) | Giá tại thời điểm thêm vào giỏ |
| `created_at` | timestamp | |

#### 3.3. Tính toán giá trị giỏ hàng

| Thành phần | Công thức |
| :--- | :--- |
| Tạm tính | `SUM(unit_price × quantity)` |
| Giảm giá coupon | Trừ theo điều kiện của coupon (%, cố định) |
| Phí vận chuyển | Tính ở bước Checkout (chưa hiển thị ở Cart) |
| **Tổng cộng** | **Tạm tính − Giảm giá** |

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Guest cart | Lưu `cart_id` vào cookie `HttpOnly`; hết hạn sau 7 ngày |
| Tồn kho | Kiểm tra tồn kho thực tế khi cập nhật số lượng và khi vào trang Checkout |
| Giá | Giá trong giỏ được **lock tại thời điểm thêm vào**; hiển thị cảnh báo nếu giá thay đổi |
| Coupon validation | Kiểm tra: còn hạn, đủ điều kiện đơn hàng tối thiểu, giới hạn sử dụng |
| Realtime update | Cập nhật số lượng và tổng tiền không reload trang (AJAX/fetch) |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Giỏ hàng trống | Hiển thị icon giỏ trống + thông báo *"Giỏ hàng của bạn đang trống"* + nút *"Tiếp tục mua sắm"* |
| E02 | Sản phẩm trong giỏ hết hàng (tồn kho = 0) | Highlight đỏ item đó, hiển thị *"Sản phẩm này đã hết hàng"*, disable checkout cho đến khi xóa item |
| E03 | Số lượng yêu cầu > tồn kho | Tự động điều chỉnh về số tối đa, hiện cảnh báo *"Chỉ còn X sản phẩm"* |
| E04 | Mã coupon không hợp lệ/hết hạn | Hiển thị lỗi inline: *"Mã giảm giá không hợp lệ hoặc đã hết hạn."* |
| E05 | Giá sản phẩm thay đổi sau khi thêm vào giỏ | Hiển thị cảnh báo: *"Giá sản phẩm [X] đã thay đổi. Giá mới: [Y]."* + nút *"Cập nhật giá"* |
| E06 | Người dùng thêm cùng 1 SKU nhiều lần | Cộng dồn số lượng, không tạo dòng trùng lặp |

---

### 6. Giao diện (UI/UX)

- **Danh sách sản phẩm:** Ảnh thumbnail, tên, biến thể đã chọn (màu/size), giá đơn vị, input số lượng (có nút +/−), giá thành tiền, nút xóa.
- **Tóm tắt đơn hàng (Order Summary):** Nằm phía phải (desktop) hoặc cuối trang (mobile); hiển thị tạm tính, giảm giá, tổng cộng, nút **"Tiến hành thanh toán"**.
- **Trường nhập coupon:** Input + nút "Áp dụng"; sau khi áp dụng hiển thị tên mã và số tiền được giảm.
- **Responsive:** Trên mobile, layout chuyển sang 1 cột dọc.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Chi tiết sản phẩm | PROD-02 | Thêm sản phẩm vào giỏ từ đây |
| Đăng nhập | AUTH-01 | Yêu cầu khi checkout |
| Đặt hàng / Checkout | ORDER-01 | Bước tiếp theo |
| Danh mục sản phẩm | PROD-01 | Tiếp tục mua sắm |
