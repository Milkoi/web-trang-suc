# Software Requirement Specification (SRS)
## Chức năng: Thống kê doanh thu (Revenue Statistics)
**Mã chức năng:** STA-01  

---

### 1. Mô tả
Hiển thị doanh thu theo thời gian giúp admin theo dõi hiệu quả kinh doanh.

---

### 2. Workflow
| Bước | Hành động | Phản hồi |
|---|---|---|
| 1 | Truy cập `/admin/statistics` | Hiển thị dashboard |
| 2 | Chọn thời gian | Cập nhật dữ liệu |
| 3 | Xem biểu đồ | Hiển thị |

---

### 3. Data
* total_revenue
* order_count
* time_range

---

### 4. Constraints
* Chỉ tính đơn đã hoàn thành

---

### 5. Edge Cases
* Không có dữ liệu → hiển thị 0  

---

### 6. UI
* Biểu đồ cột/line
* Bộ lọc ngày