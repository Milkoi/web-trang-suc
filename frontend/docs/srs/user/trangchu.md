# 📄 SOFTWARE REQUIREMENT SPECIFICATION (SRS)
## Chức năng: Trang chủ (Home Page)

- **Mã chức năng:** HOME-01  
- **Trạng thái:** Draft / Review  
- **Người soạn thảo:** Trần Minh Nguyệt  
- **Vai trò:** Lead Researcher / Developer  
- **Ngày cập nhật:** 03/04/2026  

---

## 1. Mô tả tổng quan (Description)

Trang chủ là điểm tiếp cận đầu tiên của người dùng khi truy cập hệ thống. Hiển thị các banner quảng cáo, danh mục sản phẩm nổi bật, sản phẩm gợi ý và các chương trình khuyến mãi đang chạy nhằm tối ưu trải nghiệm khám phá sản phẩm.

---

## 2. Actors (Tác nhân)

| Actor | Mô tả |
|------|------|
| Guest User | Người dùng chưa đăng nhập |
| Authenticated User | Người dùng đã đăng nhập |
| System | Website |
| Admin | Quản trị viên (quản lý nội dung hiển thị) |

---

## 3. Preconditions (Điều kiện trước)

- Hệ thống đã có dữ liệu:
  - banners
  - categories
  - products
  - promotions
- API hoạt động bình thường
- Server/CDN có thể truy cập ảnh

---

## 4. Luồng nghiệp vụ (User Workflow)

### 4.1 Luồng chính (Happy Path)

| Bước | Hành động người dùng | Phản hồi hệ thống |
| :--- | :--- | :--- |
| 1 | Truy cập URL `/` hoặc `/home` | Render trang chủ |
| 2 | Xem Banner carousel | Auto slide 5s |
| 3 | Click danh mục | Redirect `/category/{slug}` |
| 4 | Click sản phẩm | Redirect `/product/{id}` |
| 5 | Click "Thêm vào giỏ" | Thêm vào cart + update badge |
| 6 | Cuộn trang | Load thêm sản phẩm (12/lần) |

---

### 4.2 Luồng lỗi hệ thống

| Trường hợp | Xử lý |
|-----------|------|
| API lỗi | Hiển thị fallback UI |
| Timeout | Hiển thị skeleton + retry |
| Server down | Hiển thị trang lỗi |

---

## 5. Yêu cầu dữ liệu (Data Requirements)

### 5.1 Dữ liệu hiển thị

| Thành phần | Nguồn dữ liệu | Số lượng |
| :--- | :--- | :--- |
| Banner | `banners` | ≤ 5 |
| Danh mục | `categories` | ≤ 8 |
| Sản phẩm bán chạy | `products` | 12 |
| Sản phẩm mới | `products` | 12 |
| Khuyến mãi | `promotions` | ≤ 3 |

---

### 5.2 Cấu trúc bảng `banners`

| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| id | bigint | PK |
| title | varchar(255) | |
| image_url | varchar(500) | |
| link_url | varchar(500) | |
| sort_order | int | |
| status | enum | active/inactive |
| starts_at | timestamp | |
| ends_at | timestamp | |

---

## 6. API Specification

| API | Method | Mô tả |
|-----|--------|------|
| `/api/home` | GET | Lấy dữ liệu trang chủ |
| `/api/products?type=best-seller` | GET | Sản phẩm bán chạy |
| `/api/products?type=new` | GET | Sản phẩm mới |
| `/api/categories/featured` | GET | Danh mục nổi bật |

### Pagination
- `page`
- `limit`
- `has_more`

---

## 7. Business Rules

- Banner chỉ hiển thị khi:
  - status = active
  - trong thời gian hợp lệ
- Sản phẩm phải có:
  - giá hợp lệ
  - ảnh hợp lệ
- Không cho thêm sản phẩm hết hàng vào giỏ
- Sản phẩm không tồn tại → không hiển thị

---

## 8. Ràng buộc kỹ thuật (Technical Constraints)

| Hạng mục | Yêu cầu |
| :--- | :--- |
| Caching | Redis/Memcached (TTL = 5 phút) |
| Performance | LCP < 2.5s |
| Hình ảnh | Lazy loading + WebP |
| SEO | SSR hoặc SSG |
| Responsive | Mobile / Tablet / Desktop |

---

## 9. Edge Cases

| # | Trường hợp | Xử lý |
| :--- | :--- | :--- |
| E01 | Không có banner | Ẩn section |
| E02 | Hết hàng | Disable nút |
| E03 | Lỗi ảnh | Placeholder |
| E04 | Chưa login | Redirect hoặc guest cart |
| E05 | Mất mạng | Retry button |

---

## 10. UI/UX

- Header sticky
- Banner carousel
- Grid danh mục
- Card sản phẩm
- Footer đầy đủ

---

## 11. Related Screens

| Màn hình | Mã | Mô tả |
| :--- | :--- | :--- |
| Danh mục | PROD-01 | |
| Chi tiết | PROD-02 | |
| Giỏ hàng | CART-01 | |
| Tìm kiếm | SEARCH-01 | |

---

## 12. Logging & Monitoring

- Log API request/response
- Log lỗi load dữ liệu
- Theo dõi performance

---

## 13. Non-functional Requirements

- LCP < 2.5s
- TTFB < 500ms
- Hỗ trợ ≥ 1000 user đồng thời
- SEO score > 90

---

## 14. Acceptance Criteria

- Trang load đầy đủ dữ liệu
- Không lỗi UI
- Click điều hướng đúng
- Không crash khi lỗi API
- Hiển thị đúng responsive

---
