import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { CartItem } from '../../types';
import './OrdersPage.css';

interface Order {
  id: string;
  date: string;
  paymentDate?: string;
  items: CartItem[];
  total: number;
  status: string;
}

const formatPrice = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + '₫';

const OrdersPage: React.FC = () => {
  const { user, isAuthenticated, openAuth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const savedOrders = localStorage.getItem(`orders_${user.id}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } else {
      setOrders([]);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="page-content orders-page--empty">
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
          <h2>Vui lòng đăng nhập</h2>
          <p style={{ marginTop: '16px', color: 'var(--color-muted)' }}>Bạn cần đăng nhập để xem lịch sử đơn hàng của mình.</p>
          <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => openAuth('login')}>Đăng Nhập Ngay</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content orders-page">
      <div className="orders-page__inner wrapper">
        <h1 className="orders-page__title">Đơn hàng của tôi</h1>
        
        {orders.length === 0 ? (
          <div className="orders-page--empty">
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--color-muted)' }}>Bạn chưa có đơn hàng nào.</p>
              <Link to="/products" className="btn-outline" style={{ marginTop: '24px', display: 'inline-block' }}>Mua Sắm Ngay</Link>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card__header" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="order-card__id">{order.id}</span>
                      <span className={`order-card__status status-${order.status === 'Đang xử lý' ? 'processing' : 'completed'}`} style={{ marginLeft: '12px' }}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-card__date" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>Thời gian đặt: {new Date(order.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      <span>Thời gian thanh toán: {new Date(order.paymentDate || order.date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-card__items">
                  {order.items.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="order-item">
                      <img src={item.product.images[0]} alt={item.product.name} className="order-item__image" />
                      <div className="order-item__info">
                        <p className="order-item__name">{item.product.name}</p>
                        <p className="order-item__qty">Số lượng: {item.quantity}</p>
                      </div>
                      <span className="order-item__price">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-card__footer">
                  <span className="order-card__total-label">Tổng cộng:</span>
                  <span className="order-card__total-value">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
