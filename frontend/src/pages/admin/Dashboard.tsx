import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Tổng doanh thu', value: '1,250,000,000₫', trend: '+12.5%', color: '#c9a96e' },
    { label: 'Đơn hàng mới', value: '48', trend: '+5.2%', color: '#27ae60' },
    { label: 'Khách hàng mới', value: '156', trend: '+8.1%', color: '#1a1a1a' },
    { label: 'Sản phẩm tồn kho', value: '1,204', trend: '-2.4%', color: '#muted' },
  ];

  const recentOrders = [
    { id: 'ORD-9921', customer: 'Nguyễn Văn A', amount: '4,500,000₫', status: 'Hoàn thành' },
    { id: 'ORD-9922', customer: 'Trần Thị B', amount: '28,000,000₫', status: 'Đang xử lý' },
    { id: 'ORD-9923', customer: 'Lê Văn C', amount: '1,800,000₫', status: 'Đã hủy' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Tổng quan hệ thống</h1>
        <p className="admin-dashboard__subtitle">Chào mừng trở lại, đây là những gì đang diễn ra với cửa hàng của bạn.</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="admin-stat-card">
            <span className="admin-stat-card__label">{stat.label}</span>
            <div className="admin-stat-card__value">{stat.value}</div>
            <div className="admin-stat-card__footer">
              <span className={`admin-stat-card__trend ${stat.trend.startsWith('+') ? 'up' : 'down'}`}>
                {stat.trend}
              </span>
              <span className="admin-stat-card__period">so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__sections">
        <div className="admin-dashboard__section">
          <h3>Đơn hàng gần đây</h3>
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
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`admin-status-badge ${order.status === 'Hoàn thành' ? 'success' : order.status === 'Đang xử lý' ? 'warning' : 'danger'}`}>
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
