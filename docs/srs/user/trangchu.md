# Software Requirement Specification (SRS)
## Chức năng: Trang chủ (Home Page)
**Mã chức năng:** HOME-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt  
**Vai trò:** Lead Researcher / Developer

---

### 1. Mô tả tổng quan (Description)
Trang chủ là điểm tiếp cận đầu tiên của người dùng khi truy cập hệ thống. Hiển thị các banner quảng cáo, danh mục sản phẩm nổi bật, sản phẩm gợi ý và các chương trình khuyến mãi đang chạy nhằm tối ưu trải nghiệm khám phá sản phẩm.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập URL `/` hoặc `/home` | Render trang chủ: Banner, danh mục, sản phẩm nổi bật, khuyến mãi. |
| 2 | Xem Banner carousel | Tự động chuyển slide mỗi 5 giây; người dùng có thể click để chuyển tay. |
| 3 | Click vào danh mục | Chuyển hướng đến trang danh mục sản phẩm `/category/{slug}`. |
| 4 | Click vào sản phẩm | Chuyển hướng đến trang chi tiết sản phẩm `/product/{id}`. |
| 5 | Click "Thêm vào giỏ" trên card sản phẩm | Thêm sản phẩm vào giỏ hàng (không rời trang), cập nhật badge số lượng trên icon giỏ. |
| 6 | Cuộn trang (Infinite scroll / Load more) | Tải thêm sản phẩm gợi ý theo batch (12 sản phẩm/lần). |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Dữ liệu hiển thị

| Thành phần | Nguồn dữ liệu | Số lượng hiển thị |
| :--- | :--- | :--- |
| Banner quảng cáo | Bảng `banners` (status = active) | Tối đa 5 banner |
| Danh mục nổi bật | Bảng `categories` (featured = true) | Tối đa 8 danh mục |
| Sản phẩm bán chạy | Bảng `products` ORDER BY `sold_count` DESC | 12 sản phẩm |
| Sản phẩm mới nhất | Bảng `products` ORDER BY `created_at` DESC | 12 sản phẩm |
| Banner khuyến mãi | Bảng `promotions` (active, còn hạn) | Tối đa 3 banner |

#### 3.2. Cấu trúc dữ liệu - Bảng `banners`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | bigint, PK | |
| `title` | varchar(255) | Tiêu đề banner |
| `image_url` | varchar(500) | Đường dẫn ảnh |
| `link_url` | varchar(500), nullable | URL khi click vào banner |
| `sort_order` | int | Thứ tự hiển thị |
| `status` | enum('active','inactive') | |
| `starts_at` | timestamp, nullable | Thời gian bắt đầu hiển thị |
| `ends_at` | timestamp, nullable | Thời gian kết thúc hiển thị |

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Caching | Cache dữ liệu trang chủ (banner, danh mục) trong **Redis/Memcached**, TTL = 5 phút |
| Performance | Thời gian tải trang (LCP) < **2.5 giây** trên kết nối 4G |
| Hình ảnh | Sử dụng **lazy loading** và định dạng **WebP**; cung cấp fallback JPG/PNG |
| SEO | Trang chủ phải render được phía server (SSR hoặc SSG) để tối ưu SEO |
| Responsive | Hỗ trợ breakpoint: Mobile (<768px), Tablet (768–1024px), Desktop (>1024px) |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Không có banner nào active | Ẩn section banner, không hiển thị khoảng trống |
| E02 | Sản phẩm hết hàng trên card | Hiển thị badge *"Hết hàng"*, vô hiệu hóa nút "Thêm vào giỏ" |
| E03 | Lỗi tải ảnh sản phẩm/banner | Hiển thị ảnh placeholder mặc định |
| E04 | Người dùng chưa đăng nhập nhấn "Thêm vào giỏ" | Redirect đến `/login` kèm `redirect_back` param, hoặc cho phép thêm vào giỏ tạm (guest cart) |
| E05 | Mất kết nối khi load thêm sản phẩm | Hiển thị nút *"Thử lại"* thay vì spinner vô hạn |

---

### 6. Giao diện (UI/UX)

- **Header cố định (Sticky):** Logo, thanh tìm kiếm, icon giỏ hàng (kèm badge số lượng), menu tài khoản.
- **Banner Carousel:** Auto-play, có indicator dots, hỗ trợ swipe trên mobile.
- **Section danh mục:** Hiển thị dạng grid icon + tên; có nút "Xem tất cả" dẫn đến `/categories`.
- **Card sản phẩm:** Ảnh, tên, giá gốc, giá khuyến mãi (nếu có), rating sao, nút "Thêm vào giỏ".
- **Footer:** Links thông tin, mạng xã hội, phương thức thanh toán được chấp nhận.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Danh mục sản phẩm | PROD-01 | Xem sản phẩm theo danh mục |
| Chi tiết sản phẩm | PROD-02 | Xem chi tiết một sản phẩm |
| Giỏ hàng | CART-01 | Quản lý giỏ hàng |
| Tìm kiếm | SEARCH-01 | Tìm kiếm sản phẩm |
