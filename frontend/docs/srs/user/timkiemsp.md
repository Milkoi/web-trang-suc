# Software Requirement Specification (SRS)
## Chức năng: Tìm kiếm sản phẩm (Product Search)
**Mã chức năng:** SEARCH-01  
**Trạng thái:** Draft / Review  
**Người soạn thảo:** Trần Minh Nguyệt  
**Vai trò:** Developer

---

### 1. Mô tả tổng quan (Description)
Cho phép người dùng tìm kiếm sản phẩm theo từ khóa, với hỗ trợ gợi ý tìm kiếm tức thì (autocomplete), lọc và sắp xếp kết quả. Hệ thống tìm kiếm cần trả về kết quả nhanh và liên quan.

---

### 2. Luồng nghiệp vụ (User Workflow)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Click vào thanh tìm kiếm trên Header | Hiển thị dropdown gợi ý (từ khóa phổ biến / lịch sử tìm kiếm). |
| 2 | Gõ từ khóa (≥ 2 ký tự) | Gọi API autocomplete (debounce 300ms), hiển thị tối đa 8 gợi ý. |
| 3 | Nhấn Enter hoặc click nút tìm kiếm | Chuyển đến trang kết quả `/search?q={keyword}`. |
| 4 | Click vào gợi ý trong dropdown | Chuyển đến trang kết quả với từ khóa đó. |
| 5 | Xem trang kết quả | Hiển thị tổng số kết quả, danh sách sản phẩm, bộ lọc, sắp xếp. |
| 6 | Áp dụng bộ lọc / sắp xếp | Cập nhật URL params, reload kết quả (AJAX). |
| 7 | Click vào sản phẩm | Chuyển đến trang chi tiết sản phẩm. |

---

### 3. Yêu cầu dữ liệu (Data Requirements)

#### 3.1. Query Parameters (URL trang kết quả)

| Param | Kiểu | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `q` | string | Từ khóa tìm kiếm | `?q=điện+thoại+samsung` |
| `page` | int | Trang hiện tại | `?page=2` |
| `sort` | string | Tiêu chí sắp xếp | `?sort=price_asc` |
| `category` | string | Lọc theo danh mục slug | `?category=dien-thoai` |
| `min_price` | int | Giá tối thiểu | |
| `max_price` | int | Giá tối đa | |
| `brand` | string | Lọc theo thương hiệu | |
| `rating` | int | Số sao tối thiểu | |

#### 3.2. API Autocomplete

- **Endpoint:** `GET /api/search/suggestions?q={keyword}`
- **Response:**
```json
{
  "suggestions": [
    { "type": "keyword", "text": "điện thoại samsung" },
    { "type": "product",  "id": 123, "name": "Samsung Galaxy A55", "image": "...", "price": 8990000 },
    { "type": "category", "slug": "dien-thoai", "name": "Điện thoại" }
  ]
}
```

#### 3.3. Lưu trữ lịch sử tìm kiếm

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| Người dùng đã đăng nhập | DB bảng `search_histories` | `user_id`, `keyword`, `searched_at`; giữ tối đa 10 từ khóa gần nhất |
| Khách (Guest) | LocalStorage | Giữ tối đa 5 từ khóa gần nhất |

#### 3.4. Search Engine

- **Option A (đơn giản):** Full-text search của MySQL/PostgreSQL với `MATCH AGAINST` hoặc `ILIKE`.
- **Option B (khuyến nghị):** Tích hợp **Elasticsearch** / **MeiliSearch** để hỗ trợ fuzzy search, typo tolerance, ranking theo relevance.

---

### 4. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Tốc độ | Autocomplete API response < **200ms**; kết quả search < **500ms** |
| Debounce | Gọi autocomplete API sau khi người dùng dừng gõ **300ms** |
| Độ dài từ khóa | Tối thiểu 2 ký tự, tối đa 100 ký tự |
| Sanitization | Escape/strip ký tự đặc biệt và HTML trong query string |
| SEO | Trang kết quả có URL thân thiện; có `<title>` và `meta description` động theo từ khóa |
| Phân trang | 24 sản phẩm/trang |
| Analytics | Ghi lại từ khóa tìm kiếm (không PII) vào bảng `search_analytics` để phục vụ cải thiện |

---

### 5. Trường hợp ngoại lệ & Xử lý lỗi (Edge Cases)

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Từ khóa < 2 ký tự | Không gọi API autocomplete; không chuyển trang nếu nhấn Enter |
| E02 | Không tìm thấy kết quả | Hiển thị: *"Không tìm thấy sản phẩm nào cho từ khóa '[X]'."* + gợi ý: kiểm tra chính tả, thử từ khóa khác, xem danh mục |
| E03 | Từ khóa chứa ký tự đặc biệt / script injection | Sanitize và tìm kiếm phần text hợp lệ; không thực thi bất kỳ code nào |
| E04 | Autocomplete API lỗi | Fail silently: ẩn dropdown, người dùng vẫn tìm kiếm được bình thường |
| E05 | Từ khóa rỗng khi nhấn tìm kiếm | Không chuyển trang; có thể hiện dropdown từ khóa phổ biến |
| E06 | Kết quả lọc trả về 0 sản phẩm | Hiển thị thông báo, nút *"Xóa bộ lọc"* |

---

### 6. Giao diện (UI/UX)

- **Thanh tìm kiếm Header:** Prominent, full-width trên mobile; fixed width (400–600px) trên desktop.
- **Dropdown autocomplete:**
  - Nhóm theo loại: Gợi ý từ khóa / Sản phẩm / Danh mục.
  - Mỗi gợi ý sản phẩm hiển thị: thumbnail nhỏ, tên, giá.
  - Nút **"Xóa lịch sử"** ở cuối mục lịch sử tìm kiếm.
- **Trang kết quả:** Breadcrumb *"Kết quả tìm kiếm cho '[keyword]' (X sản phẩm)"*; layout giống trang danh mục (sidebar bộ lọc + grid sản phẩm).
- **Highlight từ khóa:** Tô đậm phần text trùng khớp trong tên sản phẩm trên trang kết quả.

---

### 7. Các màn hình liên quan (Related Screens)

| Màn hình | Mã chức năng | Mô tả |
| :--- | :--- | :--- |
| Trang chủ | HOME-01 | Thanh tìm kiếm đặt trên header |
| Danh mục sản phẩm | PROD-01 | Layout kết quả tương tự |
| Chi tiết sản phẩm | PROD-02 | Điều hướng từ kết quả tìm kiếm |
