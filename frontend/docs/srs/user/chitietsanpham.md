# Software Requirement Specification (SRS)
## Chức năng: Chi tiết sản phẩm (Product Detail)
**Mã chức năng:** PROD-02  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Quỳnh Anh  
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Trang chi tiết sản phẩm cung cấp đầy đủ thông tin về một sản phẩm cụ thể: hình ảnh, mô tả, biến thể (màu sắc, kích thước), giá, tình trạng kho và đánh giá của khách hàng. Đây là trang ra quyết định mua hàng chính của người dùng.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/product/{id}` hoặc `/product/{slug}` | Hiển thị toàn bộ thông tin sản phẩm: ảnh, tên, giá, mô tả, biến thể, nút mua. |
| 2 | Chọn biến thể (màu, size, v.v.) | Cập nhật ảnh, giá, tình trạng kho tương ứng với biến thể đã chọn. |
| 3 | Thay đổi số lượng | Kiểm tra tồn kho; không cho phép nhập quá số lượng còn lại. |
| 4 | Nhấn "Thêm vào giỏ hàng" | Thêm sản phẩm (với biến thể + số lượng đã chọn) vào giỏ; hiện toast thông báo thành công. |
| 5 | Nhấn "Mua ngay" | Thêm vào giỏ và chuyển thẳng đến trang `/checkout`. |
| 6 | Xem ảnh sản phẩm | Click vào ảnh để phóng to (lightbox); swipe trên mobile. |
| 7 | Cuộn xuống khu vực đánh giá | Hiển thị tổng rating, phân bố sao, danh sách review có phân trang (10 review/trang). |
| 8 | Nhấn "Viết đánh giá" | Mở form đánh giá (yêu cầu đăng nhập và đã mua sản phẩm). |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu hiển thị sản phẩm

| Thành phần | Nguồn | Mô tả |
| :--- | :--- | :--- |
| Thông tin cơ bản | Bảng `products` | Tên, mô tả ngắn, mô tả dài (rich text), SKU |
| Giá | Bảng `product_variants` | Giá gốc, giá khuyến mãi, % giảm |
| Hình ảnh | Bảng `product_images` | Ảnh chính và ảnh phụ theo biến thể |
| Biến thể | Bảng `product_variants` | Màu sắc, kích thước, v.v. |
| Tồn kho | Cột `stock_quantity` | Số lượng còn lại theo từng biến thể |
| Đánh giá | Bảng `reviews` | Avg rating, tổng số review |

#### 3.2. Cấu trúc DB - Bảng `products`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `category_id` | bigint, FK | |
| `name` | varchar(255) | Tên sản phẩm |
| `slug` | varchar(300), unique | |
| `short_description` | text | Mô tả ngắn |
| `description` | longtext | Mô tả đầy đủ (HTML/Markdown) |
| `status` | enum('active','inactive','draft') | |
| `created_at` | timestamp | |

#### 3.3. Cấu trúc DB - Bảng `product_variants`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `product_id` | bigint, FK | |
| `sku` | varchar(100), unique | Mã SKU |
| `attributes` | json | `{"color": "red", "size": "XL"}` |
| `original_price` | decimal(15,2) | Giá gốc |
| `sale_price` | decimal(15,2), nullable | Giá khuyến mãi |
| `stock_quantity` | int, default 0 | Tồn kho |
| `weight` | decimal(8,2), nullable | Trọng lượng (gram) |

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| SEO | Có `<title>`, `meta description`, OpenGraph tags; schema.org `Product` markup |
| Caching | Cache thông tin sản phẩm (Redis, TTL = 10 phút); bust cache khi admin cập nhật |
| Hình ảnh | Lazy load, WebP với fallback; ảnh chính ≥ 800×800px; thumbnail 300×300px |
| Performance | LCP < 2.5s; tách biệt phần đánh giá load lazy (không block render chính) |
| Tồn kho real-time | Khi còn ≤ 5 sản phẩm: hiển thị *"Chỉ còn X sản phẩm"* |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | `id`/`slug` sản phẩm không tồn tại | Trang 404 kèm gợi ý sản phẩm tương tự |
| E02 | Sản phẩm bị ẩn/draft | Người dùng thường: 404. Admin: hiển thị với watermark "Chưa xuất bản" |
| E03 | Biến thể hết hàng | Disable option biến thể đó, hiển thị *"Hết hàng"* |
| E04 | Toàn bộ sản phẩm hết hàng | Ẩn nút "Mua ngay/Thêm giỏ"; hiển thị nút *"Thông báo khi có hàng"* |
| E05 | Người dùng chưa đăng nhập nhấn "Viết đánh giá" | Redirect đến `/login?redirect_back=/product/{id}#reviews` |
| E06 | Số lượng nhập vượt tồn kho | Tự động điều chỉnh về số tối đa, hiện thông báo *"Chỉ còn X sản phẩm"* |

---

### 6. Giao diện (UI/UX)

- **Layout 2 cột (Desktop):** Ảnh sản phẩm (trái) + thông tin mua hàng (phải).
- **Mobile:** Ảnh full-width trên đầu, thông tin bên dưới theo chiều dọc.
- **Ảnh:** Gallery thumbnails phía dưới hoặc bên cạnh ảnh chính; click để đổi ảnh; zoom khi hover (desktop).
- **Sticky Add-to-Cart bar:** Trên mobile, khi cuộn qua nút mua hàng chính, hiện thanh sticky phía dưới màn hình.
- **Tab nội dung:** Mô tả / Thông số kỹ thuật / Đánh giá.
- **Sản phẩm liên quan:** Section phía dưới gợi ý 4–8 sản phẩm cùng danh mục.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Danh mục sản phẩm | PROD-01 | Quay lại danh mục |
| Giỏ hàng | CART-01 | Sau khi thêm vào giỏ |
| Thanh toán | ORDER-01 | Mua ngay |
| Đăng nhập | AUTH-01 | Khi cần xác thực để đánh giá |
