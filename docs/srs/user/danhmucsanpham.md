# Software Requirement Specification (SRS)
## Chức năng: Danh mục sản phẩm (Product Category Listing)
**Mã chức năng:** PROD-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt 
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Cho phép người dùng duyệt và lọc sản phẩm theo danh mục. Hỗ trợ phân trang, sắp xếp và bộ lọc đa tiêu chí (giá, thương hiệu, đánh giá) nhằm giúp người dùng tìm được sản phẩm phù hợp nhanh chóng.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập `/category/{slug}` | Hiển thị tên danh mục, breadcrumb, bộ lọc sidebar, danh sách sản phẩm. |
| 2 | Chọn bộ lọc (giá, thương hiệu, v.v.) | Cập nhật URL query params, load lại danh sách sản phẩm không reload trang (AJAX). |
| 3 | Chọn tiêu chí sắp xếp | Cập nhật query param `sort`, refresh danh sách. |
| 4 | Chuyển trang / load thêm | Phân trang hoặc infinite scroll, load thêm 24 sản phẩm/lần. |
| 5 | Click vào sản phẩm | Chuyển hướng đến `/product/{id}`. |
| 6 | Nhấn "Thêm vào giỏ" trên card | Thêm vào giỏ, cập nhật badge giỏ hàng. |
| 7 | Chọn danh mục con (nếu có) | Lọc lại sản phẩm theo danh mục con. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Query Parameters (URL)

| Param | Kiểu | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `slug` | string | Slug của danh mục | `dien-thoai` |
| `page` | int | Trang hiện tại (mặc định: 1) | `?page=2` |
| `sort` | string | Tiêu chí sắp xếp | `?sort=price_asc` |
| `min_price` | int | Giá tối thiểu (VNĐ) | `?min_price=100000` |
| `max_price` | int | Giá tối đa (VNĐ) | `?max_price=5000000` |
| `brand` | string (multi) | Lọc theo thương hiệu | `?brand=samsung,apple` |
| `rating` | int | Lọc theo số sao tối thiểu | `?rating=4` |

#### 3.2. Tùy chọn sắp xếp (`sort`)

| Giá trị | Ý nghĩa |
| :--- | :--- |
| `newest` | Mới nhất (mặc định) |
| `price_asc` | Giá tăng dần |
| `price_desc` | Giá giảm dần |
| `best_selling` | Bán chạy nhất |
| `top_rated` | Đánh giá cao nhất |

#### 3.3. Cấu trúc dữ liệu - Bảng `categories`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `name` | varchar(100) | Tên danh mục |
| `slug` | varchar(120), unique | Slug URL |
| `parent_id` | bigint, nullable, FK | Danh mục cha (cho danh mục con) |
| `image_url` | varchar(500), nullable | Ảnh đại diện danh mục |
| `sort_order` | int | Thứ tự hiển thị |
| `status` | enum('active','inactive') | |

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Phân trang | 24 sản phẩm/trang; hỗ trợ cả pagination và infinite scroll |
| Caching | Cache kết quả query phổ biến trong Redis (TTL = 2 phút) |
| SEO | URL danh mục dạng `/category/{slug}` thân thiện SEO; có meta title, description |
| Performance | Kết quả trả về < 500ms với index đúng trên DB |
| URL state | Bộ lọc và sắp xếp phản ánh lên URL để hỗ trợ chia sẻ link và back/forward browser |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | `slug` danh mục không tồn tại | Trả về trang 404 với gợi ý danh mục khác |
| E02 | Danh mục không có sản phẩm nào | Hiển thị: *"Hiện chưa có sản phẩm trong danh mục này."* |
| E03 | Kết quả lọc trả về 0 sản phẩm | Hiển thị: *"Không tìm thấy sản phẩm phù hợp với bộ lọc."* + nút *"Xóa bộ lọc"* |
| E04 | `min_price` > `max_price` | Hiển thị lỗi validation: *"Giá tối thiểu không được lớn hơn giá tối đa."* |
| E05 | Sản phẩm hết hàng | Hiển thị badge *"Hết hàng"*, disable nút thêm giỏ |
| E06 | Truy cập trang `?page=9999` không tồn tại | Redirect về trang cuối cùng hợp lệ |

---

### 6. Giao diện (UI/UX)

- **Layout 2 cột:** Sidebar bộ lọc (trái) + lưới sản phẩm (phải).
- **Mobile:** Sidebar bộ lọc ẩn mặc định, hiện ra khi nhấn nút *"Bộ lọc"* (slide-in drawer).
- **Breadcrumb:** Trang chủ > [Danh mục cha] > [Danh mục hiện tại].
- **Card sản phẩm:** Ảnh, tên, giá, giá gốc gạch ngang (nếu đang sale), badge % giảm, rating, nút Thêm giỏ.
- Hiển thị tổng số sản phẩm tìm được: *"Hiển thị 1–24 trong tổng số 156 sản phẩm"*.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Trang chủ | HOME-01 | Điều hướng từ trang chủ |
| Chi tiết sản phẩm | PROD-02 | Xem chi tiết sản phẩm |
| Tìm kiếm | SEARCH-01 | Kết quả tìm kiếm dùng chung layout |
| Giỏ hàng | CART-01 | Sau khi thêm sản phẩm |
