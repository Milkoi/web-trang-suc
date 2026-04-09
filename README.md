# Đề tài: Xây dựng Website bán trang sức (Nhóm 14)

## 💍 Giới thiệu dự án
Website chuyên bán các sản phẩm trang sức cao cấp. Hệ thống cung cấp trải nghiệm mua sắm trực tuyến mượt mà, sang trọng dành cho khách hàng với nhiều lựa chọn trang sức phong phú như: nhẫn, dây chuyền, bông tai, lắc tay, lắc chân... Ngoài các tính năng mua sắm, dự án còn thiết kế kiến trúc hệ thống hiện đại, tích hợp thanh toán (VNPay), quản lý giỏ hàng, theo dõi đơn hàng và bảng điều khiển quản trị.

## 💻 Công nghệ sử dụng
| Vai trò | Công nghệ |
|----------|------------|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | ASP.NET Core (C#) |
| **Database** | MySQL |
| **Kiến trúc** | REST API + SPA |

## 🚀 Hướng dẫn cài đặt và chạy dự án (Frontend)

1. **Yêu cầu hệ thống:**
   - Cài đặt [Node.js](https://nodejs.org/) bản mới nhất (khuyến nghị 18.x trở lên).
   - Code Editor: VSCode hoặc công cụ tương tự.

2. **Các bước cài đặt:**
   - Mở Terminal (CMD/PowerShell) và di chuyển vào thư mục dự án:
     ```bash
     cd C:\web-trang-suc
     ```
   - Cài đặt các thư viện phụ thuộc:
     ```bash
     npm install
     ```
   - Khởi động môi trường phát triển (Development Server):
     ```bash
     npm run dev
     ```
   - Mở trình duyệt và truy cập vào đường dẫn hiển thị trên terminal (`http://localhost:5173/`).

---

## 👥 Đội ngũ thực hiện

| Thành viên nhóm | Mã sinh viên |
|-----------------|--------------|
| Lê Minh Quân | 23810310115 |
| Trần Minh Nguyệt | 23810310081 |
| Trần Quỳnh Anh | 23810310147 |

## 📄 SRS Documents
- [Authentication](docs/srs/auth.md)
- [Category](docs/srs/category.md)
- [Product](docs/srs/product.md)
- [Order](docs/srs/order.md)
- [Customer](docs/srs/customer.md)
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
