# 💍 Velmora - Website Bán Trang Sức

**Velmora** là nền tảng thương mại điện tử chuyên biệt cho ngành trang sức cao cấp. Hệ thống hỗ trợ khách hàng mua sắm trực tuyến dễ dàng và giúp quản trị viên quản lý kho hàng hiệu quả.

---

## 📋 Mục lục
1. [Thành viên nhóm](#-thành-viên-nhóm)
2. [Giới thiệu](#-giới-thiệu)
3. [Tính năng](#-tính-năng)
4. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
5. [Cấu trúc dự án](#-cấu-trúc-dự-án)
6. [Cài đặt và chạy](#-cài-đặt-và-chạy)
7. [API Endpoints](#-api-endpoints)
8. [SRS Documents](#-srs-documents)

---

## 👥 Thành viên nhóm - Nhóm 14

| STT | Họ và Tên | MSSV |
| :--- | :--- | :--- |
| 1 | **Lê Minh Quân** | 23810310115 |
| 2 | **Trần Minh Nguyệt** | 23810310081 |
| 3 | **Trần Quỳnh Anh** | 23810310147 |

---

## 🌟 Giới thiệu
Dự án **Velmora** tập trung vào trải nghiệm mua sắm trang sức hiện đại, tối ưu trên cả thiết bị di động và máy tính. Website cho phép người dùng duyệt sản phẩm theo danh mục (dây chuyền, nhẫn, bông tai, lắc tay, lắc chân), xem chi tiết kích thước/chất liệu và thực hiện quy trình thanh toán an toàn. Ngoài các tính năng mua sắm, dự án còn thiết kế kiến trúc hệ thống hiện đại, tích hợp thanh toán VNPay, quản lý giỏ hàng, theo dõi đơn hàng và bảng điều khiển quản trị.

---

## ✨ Tính năng

### � Khách hàng
| Tính năng | Mô tả |
| :--- | :--- |
| **🛍️ Duyệt sản phẩm** | Xem danh sách trang sức theo danh mục (Dây chuyền, Nhẫn, Bông tai, Lắc tay, Lắc chân) |
| **🔍 Bộ lọc thông minh** | Lọc sản phẩm theo giá, kích thước (XS, S, M, L, XL) và chất liệu (Vàng, Bạc, Bạch Kim, Kim Cương) |
| **🛒 Giỏ hàng** | Thêm/bớt sản phẩm, cập nhật số lượng và tính tổng tiền |
| **💳 Thanh toán** | Nhập thông tin giao hàng và chọn phương thức thanh toán (VNPay, COD) |
| **📱 Tài khoản cá nhân** | Quản lý lịch sử đơn hàng và thông tin cá nhân |
| **💬 Phản hồi** | Gửi đánh giá và bình luận cho từng sản phẩm |
| **❤️ Danh sách yêu thích** | Lưu các sản phẩm yêu thích để xem sau |
| **🎟️ Mã khuyến mãi** | Áp dụng mã giảm giá và lưu voucher |

### ⚙️ Quản trị (Admin)
| Tính năng | Mô tả |
| :--- | :--- |
| **📦 Quản lý sản phẩm** | Thêm, sửa, xóa sản phẩm và cập nhật số lượng tồn kho |
| **📋 Quản lý đơn hàng** | Theo dõi trạng thái đơn hàng (Chờ xử lý, Đang giao, Đã giao) |
| **📈 Báo cáo doanh thu** | Xem thống kê bán hàng theo ngày/tháng |
| **🎟️ Quản lý khuyến mãi** | Tạo, sửa, xóa mã giảm giá |
| **👥 Quản lý người dùng** | Xem danh sách khách hàng và phân quyền |
| **🏪 Quản lý danh mục** | Tạo và cập nhật danh mục sản phẩm |

---

## 🛠 Công nghệ sử dụng

### Frontend
- **React 19** & **TypeScript**
- **Vite** (Build tool nhanh)
- **Tailwind CSS** (Giao diện chuẩn Responsive)
- **Axios** (HTTP Client)
- **React Router** (Navigation)
- **Context API** (State Management)

### Backend
- **ASP.NET Core 8.0 Web API**
- **Entity Framework Core** (ORM)
- **Pomelo.EntityFrameworkCore.MySql** (MySQL Driver)
- **JWT Authentication** (Xác thực)
- **Swagger/OpenAPI** (API Documentation)

### Database
- **MySQL 8.0**
- **20 Tables** (Users, Products, Orders, Cart, Reviews, etc.)
- **camelCase Naming Convention**

---

## 📁 Cấu trúc dự án

```bash
web-trang-suc/
├── 📂 backend/                           # ASP.NET Core 8.0 API
│   ├── Web_Trang_Suc_BackEnd/
│   │   ├── Controllers/                  # 13+ Controllers (Products, Orders, Auth, etc.)
│   │   ├── Models/
│   │   │   ├── Entities/                 # 18+ Entity models
│   │   │   ├── DTOs/                     # Data Transfer Objects
│   │   │   └── AppDbContext.cs           # EF Core DbContext
│   │   ├── Properties/
│   │   │   └── launchSettings.json       # Port 5278
│   │   ├── Program.cs                    # Swagger, JWT, CORS config
│   │   └── appsettings.json              # Connection string, JWT settings
│   └── database/
│       └── web_trang_suc_db.sql          # SQL schema (20 tables, 700+ lines)
│
├── 📂 frontend/                          # React 19 + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 components/                # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── ProductCard/
│   │   │   ├── Cart/
│   │   │   └── Footer/
│   │   ├── 📂 pages/                     # Page components
│   │   │   ├── customer/
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   ├── ProductsPage.tsx
│   │   │   │   ├── CartPage.tsx
│   │   │   │   ├── CheckoutPage.tsx
│   │   │   │   └── ProfilePage.tsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx
│   │   │       ├── ProductList.tsx
│   │   │       ├── CategoryList.tsx
│   │   │       └── OrderList.tsx
│   │   ├── 📂 services/                  # Axios API client
│   │   │   └── api.ts
│   │   ├── 📂 types/                     # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── 📂 store/                     # Context API (Auth, Cart, Favorites)
│   │   ├── App.tsx                       # Main App component
│   │   └── main.tsx                      # Entry point
│   ├── tailwind.config.js                # Tailwind CSS config
│   ├── vite.config.ts                    # Vite config
│   └── package.json                      # Dependencies
│
├── 📂 docs/                              # Documentation
│   └── 📂 srs/                           # SRS Documents
│       ├── user/
│       │   ├── trangchu.md
│       │   ├── dangky.md
│       │   ├── dangnhap.md
│       │   ├── danhmucsanpham.md
│       │   ├── chitietsanpham.md
│       │   ├── giohang.md
│       │   ├── dathang.md
│       │   ├── thanhtoan.md
│       │   ├── theodoidonhang.md
│       │   └── thongtincanhan.md
│       └── admin/
│           ├── quanlysanpham.md
│           ├── quanlydonhang.md
│           └── baocaodoanhthu.md
│
└── README.md                             # This file
```

---

## 🚀 Cài đặt và chạy

### 📋 Yêu cầu hệ thống
- **Node.js**: 18.x trở lên
- **.NET SDK**: 8.0 trở lên
- **MySQL**: 8.0 trở lên
- **Code Editor**: VSCode hoặc JetBrains Rider

### 1️⃣ Clone dự án
```bash
git clone <repository-url>
cd web-trang-suc
```

### 2️⃣ Cấu hình Database (MySQL)

#### Bước A: Tạo Database
```sql
CREATE DATABASE web_trang_suc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

#### Bước B: Chỉnh sửa Connection String
File: `backend/Web_Trang_Suc_BackEnd/appsettings.json`
```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=web_trang_suc_db;user=root;password=YOUR_PASSWORD;GuidFormat=None;"
}
```

#### Bước C: Import SQL Schema
Sử dụng phpMyAdmin hoặc MySQL CLI:
```bash
mysql -u root -p web_trang_suc_db < database/web_trang_suc_db.sql
```

### 3️⃣ Khởi chạy Backend
```bash
cd backend/Web_Trang_Suc_BackEnd
dotnet restore
dotnet build
dotnet run
```
✅ Backend sẽ chạy ở `http://localhost:5278`
- **Swagger UI**: `http://localhost:5278/swagger/index.html`

### 4️⃣ Khởi chạy Frontend (Terminal mới)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend sẽ chạy ở `http://localhost:5173`

---

## 📡 API Endpoints chính

### � Authentication
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **POST** | `/api/account/register` | Đăng ký tài khoản mới |
| **POST** | `/api/account/login` | Đăng nhập |
| **POST** | `/api/account/refresh-token` | Làm mới JWT token |

### 📦 Products
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/products` | Lấy danh sách sản phẩm |
| **GET** | `/api/products/{id}` | Xem chi tiết sản phẩm |
| **POST** | `/api/products` | Tạo sản phẩm (Admin) |
| **PUT** | `/api/products/{id}` | Cập nhật sản phẩm (Admin) |
| **DELETE** | `/api/products/{id}` | Xóa sản phẩm (Admin) |

### 🛒 Cart
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/cart` | Lấy giỏ hàng |
| **POST** | `/api/cart/items` | Thêm sản phẩm vào giỏ |
| **PUT** | `/api/cart/items/{id}` | Cập nhật số lượng |
| **DELETE** | `/api/cart/items/{id}` | Xóa sản phẩm khỏi giỏ |

### 📋 Orders
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **POST** | `/api/orders` | Tạo đơn hàng mới |
| **GET** | `/api/orders` | Lấy đơn hàng của user |
| **GET** | `/api/orders/{id}` | Xem chi tiết đơn hàng |
| **PUT** | `/api/orders/{id}` | Cập nhật trạng thái đơn hàng (Admin) |

### 🎟️ Promotions
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/promotions/available` | Lấy mã giảm giá khả dụng |
| **GET** | `/api/promotions/validate/{code}` | Xác thực mã giảm giá |
| **POST** | `/api/promotions/save/{id}` | Lưu voucher |
| **POST** | `/api/promotions` | Tạo mã giảm giá (Admin) |

### 📝 Reviews
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/reviews/product/{productId}` | Lấy đánh giá sản phẩm |
| **POST** | `/api/reviews` | Tạo đánh giá mới |

### ❤️ Favorites
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **GET** | `/api/favorites` | Lấy danh sách yêu thích |
| **POST** | `/api/favorites/{productId}` | Thêm vào yêu thích |
| **DELETE** | `/api/favorites/{productId}` | Xóa khỏi yêu thích |

---

## � SRS Documents

| Chức năng | Status | Link |
|----------|--------|------|
| **Authentication** | ✅ | [Xem](docs/srs/auth.md) |
| **Category** | ✅ | [Xem](docs/srs/category.md) |
| **Product** | ✅ | [Xem](docs/srs/product.md) |
| **Order** | ✅ | [Xem](docs/srs/order.md) |
| **Customer** | ✅ | [Xem](docs/srs/customer.md) |
| **Content** | ✅ | [Xem](docs/srs/content.md) |
| **Payment** | ✅ | [Xem](docs/srs/payment.md) |
| **Promotion** | ✅ | [Xem](docs/srs/promotion.md) |
| **Statistics** | ✅ | [Xem](docs/srs/statistics.md) |

---

## ✅ Tính năng đã hoàn thành

- ✅ Backend API (13 Controllers, 45+ Endpoints)
- ✅ Frontend (React 19, TypeScript)
- ✅ Database (MySQL, 20 Tables)
- ✅ Authentication (JWT)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ Order Processing
- ✅ Product Reviews & Ratings
- ✅ Wishlist & Favorites
- ✅ Promotions & Vouchers
- ✅ Admin Dashboard
- ✅ Swagger API Documentation
- ✅ CORS Configuration
- ✅ Error Handling & Validation

---

## 🐳 Triển khai (Tùy chọn)

Dự án hỗ trợ triển khai trên các nền tảng:
- Docker & Docker Compose (sắp tới)
- IIS (ASP.NET Core)
- Nginx + Node.js (Frontend)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi chạy dự án:
1. Kiểm tra Backend logs: `dotnet run` output
2. Kiểm tra Frontend logs: Browser DevTools Console
3. Kiểm tra MySQL connection: `mysql -u root -p`
4. Xem Swagger API docs: `http://localhost:5278/swagger/index.html`

---

## 📄 Giấy phép

Dự án này được phát triển cho mục đích giáo dục.

---

**Cập nhật lần cuối**: Tháng 4, 2026 ✨
- [Promotion](docs/srs/promotion.md)
- [Statistics](docs/srs/statistics.md)
- [Payment (VNPay)](docs/srs/payment.md)
- [Content Management](docs/srs/content.md)

### 👤 User Functions
- [Trang chủ](docs/srs/user/trangchu.md)
- [Danh mục sản phẩm](docs/srs/user/danhmucsanpham.md)
- [Chi tiết sản phẩm](docs/srs/user/chitietsanpham.md)
- [Đăng ký](docs/srs/user/dangky.md)
- [Đăng nhập](docs/srs/user/dangnhap.md)
- [Tìm kiếm sản phẩm](docs/srs/user/timkiemsp.md)
- [Giỏ hàng](docs/srs/user/giohang.md)
- [Đặt hàng](docs/srs/user/dathang.md)
- [Thanh toán VNPay](docs/srs/user/thanhtoan.md)
- [Theo dõi đơn hàng](docs/srs/user/theodoidonhang.md)
- [Thông tin cá nhân](docs/srs/user/thongtincanhan.md)

---

### 🔐 Authentication
- [User Login](docs/srs/user/dangnhap.md)
- [User Register](docs/srs/user/dangky.md)

---

### 💳 Payment
- [VNPay](docs/srs/user/thanhtoan.md)

---

### 📦 Order
- [Checkout](docs/srs/user/dathang.md)
- [Tracking](docs/srs/user/theodoidonhang.md)
