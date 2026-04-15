# Database Schema Design - VELMORA (Final Sync)

Bản thiết kế này đã được hiệu chỉnh để đạt độ chính xác 100%, khớp từng ô nhập liệu trên giao diện và từng trường trong mã nguồn.

## 1. Sơ đồ quan hệ (ERD)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ FAVORITES : has
    CATEGORIES ||--o{ PRODUCTS : contains
    MATERIALS ||--o{ PRODUCTS : defines
    PRODUCTS ||--o{ PRODUCT_IMAGES : gallery
    PRODUCTS ||--o{ ORDER_ITEMS : order_details
    PRODUCTS ||--o{ FAVORITES : saved_by
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ PRODUCT_SIZES : has

    USERS {
        uuid id PK
        string fullName
        string email UK
        string password
        string avatar
        string role
        string provider
        string phone
        string defaultAddress
        boolean newsletterOptin
        timestamp createdAt
    }

    PRODUCTS {
        bigint id PK
        string sku UK
        string name
        int categoryId FK
        int materialId FK
        decimal price
        decimal originalPrice
        text description
        int stockQuantity
        decimal rating
        int reviewCount
        boolean isNew
        boolean isSale
        timestamp createdAt
    }

    PRODUCT_SIZES {
        bigint id PK
        bigint productId FK
        string size
        decimal price
        int stockQuantity
    }

    ORDERS {
        string id PK
        uuid userId FK
        string firstName
        string lastName
        string email
        string phone
        string company
        string address
        string apartment
        string city
        string country
        string postalCode
        string shippingMethod
        decimal shippingFee
        string paymentMethod
        string paymentStatus
        string orderStatus
        decimal totalAmount
        timestamp estimatedDelivery
        timestamp createdAt
        timestamp paidAt
    }
    
    ORDER_ITEMS {
        bigint id PK
        string orderId FK
        bigint product_id FK
        int quantity
        decimal priceAtPurchase
    }
```

## 2. Chi tiết 8 Bảng dữ liệu (Khớp 100% yêu cầu)

### Bảng 1: Users (Người dùng)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | UUID | Khóa chính |
| `fullName` | VARCHAR | Họ và tên hiển thị |
| `email` | VARCHAR | Email đăng nhập/liên lạc |
| `password` | VARCHAR | Mật khẩu mã hóa |
| `avatar` | TEXT | URL ảnh đại diện |
| `role` | VARCHAR | customer / admin |
| `provider` | VARCHAR | email / google |
| `phone` | VARCHAR | Số điện thoại |
| `defaultAddress` | TEXT | Địa chỉ mặc định |
| `newsletterOptin` | BOOLEAN | Đăng ký nhận tin |
| `createdAt` | TIMESTAMP | Ngày tham gia |

### Bảng 2: Categories (Danh mục)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INT | Khóa chính |
| `slug` | VARCHAR | Đường dẫn thân thiện |
| `name` | VARCHAR | Tên tiếng Việt (Nhẫn, Dây chuyền) |
| `imageUrl` | TEXT | Ảnh đại diện danh mục |

### Bảng 3: Materials (Chất liệu)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | INT | Khóa chính |
| `slug` | VARCHAR | gold, silver, diamond |
| `name` | VARCHAR | Tên hiển thị |

### Bảng 4: Products (Sản phẩm)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | BIGINT | Khóa chính |
| `sku` | VARCHAR | Mã định danh (VEL-001) |
| `name` | VARCHAR | Tên sản phẩm |
| `categoryId` | INT | FK sang bảng Categories |
| `materialId` | INT | FK sang bảng Materials |
| `price` | DECIMAL | Giá bán hiện tại |
| `originalPrice` | DECIMAL | Giá gốc (tính % giảm giá) |
| `description` | TEXT | Mô tả chi tiết |
| `stockQuantity` | INT | Số lượng trong kho |
| `rating` | DECIMAL | Điểm đánh giá trung bình |
| `reviewCount` | INT | Tổng số lượt đánh giá |
| `isNew` | BOOLEAN | Sản phẩm mới |
| `isSale` | BOOLEAN | Đang giảm giá |
| `createdAt` | TIMESTAMP | Ngày tạo |

### Bảng 5: ProductImages (Hình ảnh)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | BIGINT | Khóa chính |
| `productId` | BIGINT | FK sang bảng Products |
| `url` | TEXT | Đường dẫn ảnh |
| `isMain` | BOOLEAN | Ảnh chính hiển thị ở Card |
| `displayOrder` | INT | Thứ tự trong Gallery |

### Bảng 6: Orders (Đơn hàng)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | VARCHAR | Mã đơn (ORD-XXXXXX) |
| `userId` | UUID | FK sang bảng Users |
| `firstName` | VARCHAR | Tên người nhận |
| `lastName` | VARCHAR | Họ người nhận |
| `email` | VARCHAR | Email nhận thông báo |
| `phone` | VARCHAR | SĐT nhận hàng |
| `company` | VARCHAR | Tên công ty (Tùy chọn) |
| `address` | TEXT | Địa chỉ chính |
| `apartment` | VARCHAR | Căn hộ, tòa nhà, số phòng |
| `city` | VARCHAR | Thành phố |
| `country` | VARCHAR | Quốc gia |
| `postalCode` | VARCHAR | Mã bưu chính |
| `shippingMethod` | VARCHAR | standard, express, free |
| `shippingFee` | DECIMAL | Phí vận chuyển |
| `paymentMethod` | VARCHAR | vnpay, momo, credit-card... |
| `paymentStatus` | VARCHAR | unpaid, paid |
| `orderStatus` | VARCHAR | Trạng thái xử lý |
| `totalAmount` | DECIMAL | Tổng tiền đơn hàng |
| `estimatedDelivery` | TIMESTAMP | Thời gian dự kiến giao |
| `createdAt` | TIMESTAMP | Thời gian đặt hàng |
| `paidAt` | TIMESTAMP | Thời gian thanh toán |

### Bảng 7: OrderItems (Chi tiết đơn hàng)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | BIGINT | Khóa chính |
| `orderId` | VARCHAR | FK sang bảng Orders |
| `productId` | BIGINT | FK sang bảng Products |
| `quantity` | INT | Số lượng mua |
| `priceAtPurchase` | DECIMAL | Giá lúc mua (Snapshot) |

### Bảng 8: Favorites (Yêu thích)
| Trường | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `userId` | UUID | FK sang bảng Users |
| `productId` | BIGINT | FK sang bảng Products |

---
