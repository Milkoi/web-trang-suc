import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Protect the route
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: '📊' },
    { path: '/admin/products', label: 'Sản phẩm', icon: '💎' },
    { path: '/admin/categories', label: 'Danh mục', icon: '📁' },
    { path: '/admin/promotions', label: 'Khuyến mãi', icon: '🎁' },
    { path: '/admin/customers', label: 'Khách hàng', icon: '�' },
    { path: '/admin/content', label: 'Nội dung', icon: '📝' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: '�' },
    { path: '/admin/settings', label: 'Cấu hình', icon: '⚙️' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <Link to="/">
            <span className="admin-sidebar__logo-text">VELMORA</span>
            <span className="admin-sidebar__logo-sub">ADMIN PORTAL</span>
          </Link>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-sidebar__link-icon">{item.icon}</span>
              <span className="admin-sidebar__link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user.name}</span>
              <span className="admin-sidebar__user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={logout}>
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__search">
            <input type="text" placeholder="Tìm kiếm nhanh..." />
          </div>
          <div className="admin-header__actions">
            <Link to="/" className="admin-header__store-btn">
              <span>🏠</span> Quay lại cửa hàng
            </Link>
            <button className="admin-header__btn">🔔</button>
            <button className="admin-header__btn">🌙</button>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
