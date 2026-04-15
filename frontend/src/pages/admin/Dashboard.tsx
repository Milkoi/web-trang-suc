import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Dashboard.css';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/statistics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !data) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu báo cáo...</div>;
  }

  const stats = [
    { label: 'Tổng doanh thu', value: new Intl.NumberFormat('vi-VN').format(data.totalRevenue) + '₫', color: '#c9a96e' },
    { label: 'Đơn hàng', value: data.totalOrders.toString(), color: '#27ae60' },
    { label: 'Sản phẩm', value: data.totalProducts.toString(), color: '#1a1a1a' },
    { label: 'Khách hàng', value: data.totalCustomers.toString(), color: '#muted' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Tổng quan hệ thống</h1>
        <p className="admin-dashboard__subtitle">Chào mừng trở lại, đây là những gì đang diễn ra với cửa hàng Velmora của bạn.</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <span className="admin-stat-card__label">{stat.label}</span>
            <div className="admin-stat-card__value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__sections">
        <div className="admin-dashboard__section">
          <h3>Đơn hàng mới nhất</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>ORD-{order.id}</strong></td>
                  <td>{order.customerName}</td>
                  <td>{new Intl.NumberFormat('vi-VN').format(order.totalPrice)}₫</td>
                  <td>
                    <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
