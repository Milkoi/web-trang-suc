# TRƯỜNG ĐẠI HỌC ĐIỆN LỰC  
## KHOA CÔNG NGHỆ THÔNG TIN  


# ĐỀ CƯƠNG CHỨC NĂNG DỰ KIẾN ĐỀ TÀI  

## ĐỀ TÀI:  
### XÂY DỰNG WEBSITE BÁN TRANG SỨC  

---

### Sinh viên thực hiện:
- **Lê Minh Quân** - MSSV: 23810310115  
- **Trần Quỳnh Anh** - MSSV: 23810310147  
- **Trần Minh Nguyệt** - MSSV: 23810310081  

### Giảng viên hướng dẫn:
- **Ths. Cấn Đức Diệp**  
- SĐT: 0987838870  
- Email: diepcd@gmail.com  

### Ngành: Công nghệ thông tin  
### Lớp: D18-CNPM2  
### Khóa: D18  

Hà Nội, ngày 24 tháng 03 năm 2026  

---

# 1. Tên đề tài  
**Xây dựng Website bán trang sức**



# 2. Mô tả tóm tắt đề tài  

Để quản lý được một khối lượng lớn dữ liệu về sản phẩm trang sức, khách hàng và đơn hàng thì hệ thống cần phải đáp ứng được các yêu cầu như: dễ cập nhật, dễ tìm kiếm, dễ tra cứu, dễ sửa đổi. Ngoài ra, hệ thống cần đảm bảo khả năng xử lý lỗi và kiểm tra tính chính xác của dữ liệu ngay từ khi nhập vào.  

Để đạt được mục tiêu đó, ta cần xác định rõ:  

## ● Đầu vào của hệ thống:
- Thông tin về User (quản lý, khách hàng)  
- Thông tin sản phẩm (tên, giá, loại trang sức, chất liệu, hình ảnh…)  
- Thông tin đơn hàng (số lượng, giá tiền, trạng thái đơn hàng)  
- Thông tin thanh toán (phương thức thanh toán, mã giao dịch VNPay…)  

## ● Đầu ra của hệ thống:
- Danh sách sản phẩm theo danh mục  
- Thông tin chi tiết sản phẩm  
- Thông tin đơn hàng theo ngày, tháng, năm  
- Báo cáo doanh thu và thống kê bán hàng  
- Trạng thái thanh toán và giao dịch  


# 3. Nội dung đề tài  

## Đặt vấn đề:

- Nhu cầu người dùng muốn mua sắm trang sức trực tuyến ngày càng tăng, thay vì đến cửa hàng trực tiếp thì có thể truy cập website để xem sản phẩm, so sánh giá và đặt hàng một cách nhanh chóng.  
- Người dùng có thể xem thông tin chi tiết sản phẩm, hình ảnh, giá cả và thực hiện thanh toán online thông qua VNPay một cách tiện lợi.  
- Sử dụng **HTML, CSS, JavaScript và PHP Laravel** để xây dựng giao diện và xử lý backend cho website, chạy trên môi trường localhost bằng XAMPP.  

# 4. Tổng quan về lĩnh vực của bài toán cần giải quyết  

## ● Chức năng cho người quản lý (Admin):

- Quản lý đăng nhập hệ thống  
- Thêm, xóa, sửa danh mục sản phẩm  
- Thêm, xóa, sửa thông tin sản phẩm  
- Quản lý đơn hàng (xác nhận, hủy, cập nhật trạng thái)  
- Quản lý khách hàng  
- Quản lý khuyến mãi  
- Thống kê doanh thu  
- Theo dõi các giao dịch thanh toán VNPay  
- Thêm / thay đổi nội dung hiển thị trên website  

## ● Chức năng cho khách hàng (User):

- Trang chủ  
- Xem danh mục sản phẩm  
- Xem chi tiết sản phẩm  
- Đăng ký tài khoản  
- Đăng nhập  
- Tìm kiếm sản phẩm theo tên, loại, giá  
- Thêm sản phẩm vào giỏ hàng  
- Đặt hàng trực tuyến  
- Thanh toán online qua VNPay  
- Theo dõi trạng thái đơn hàng  
- Quản lý thông tin cá nhân  

---

## ● Phân quyền hệ thống:

- Người quản lý muốn sử dụng hệ thống thì phải có tài khoản và đăng nhập vào hệ thống, tài khoản có quyền cao nhất là **Admin**.  

- Khách hàng muốn sử dụng đầy đủ chức năng của website thì cần đăng ký tài khoản (nếu chưa có) và đăng nhập để thực hiện các thao tác như đặt hàng, thanh toán và theo dõi đơn hàng.  


# 5. Công nghệ sử dụng  
## ● Frontend:
- HTML  
- CSS  
- JavaScript  
## ● Backend:
- PHP Laravel  
## ● Môi trường chạy:
- XAMPP
## ● Thanh toán:
- Tích hợp cổng thanh toán **VNPay (Sandbox)**  

