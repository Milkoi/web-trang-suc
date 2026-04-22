import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNotification } from '../../store/NotificationContext';
import './AdminLayout.css';


interface Order {
  id: number;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: any[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);


  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
      showNotification('Cập nhật trạng thái thành công', 'success');
    } catch (err) {
      showNotification('Không thể cập nhật trạng thái.', 'error');
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang vận chuyển';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Hoàn tiền';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b'; // orange
      case 'processing': return '#3b82f6'; // blue
      case 'shipping': return '#8b5cf6'; // purple
      case 'completed': return '#10b981'; // green
      case 'cancelled': return '#ef4444'; // red
      case 'returned': return '#6b7280'; // gray
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Đơn hàng</h2>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td>#{o.id.toString().startsWith('ORD') ? o.id : `ORD-${o.id}`}</td>
                <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                <td>{new Intl.NumberFormat('vi-VN').format(o.totalPrice)}₫</td>
                <td>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: getStatusColor(o.status), color: 'white' }}>
                    {getStatusText(o.status)}
                  </span>
                </td>
                <td>
                  <select 
                    className="status-select"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang chuẩn bị</option>
                    <option value="shipping">Đang vận chuyển</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="returned">Hoàn tiền</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
