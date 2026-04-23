import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { useVouchers } from '../../store/VoucherContext';
import { useFavorites } from '../../store/FavoritesContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const { openVoucher } = useVouchers();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="navbar-announcement">
        <p>✦ Miễn phí vận chuyển cho đơn hàng trên 10.000.000₫ ✦</p>
      </div>

      {/* Main Navbar */}
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${scrolled ? '' : 'navbar--with-announcement'}`}>
        <div className="navbar__inner">

          {/* Left: Nav Links */}
          <nav className="navbar__nav navbar__nav--left">
            <NavLink to="/" className="navbar__link">Trang Chủ</NavLink>
            <NavLink to="/about" className="navbar__link">Giới Thiệu</NavLink>
            <NavLink to="/products" className="navbar__link">Sản Phẩm</NavLink>
            <NavLink to="/news" className="navbar__link">Tin Tức</NavLink>
            <NavLink to="/contact" className="navbar__link">Liên Hệ</NavLink>
          </nav>

          {/* Center: Logo */}
          <Link 
            to="/" 
            className="navbar__logo"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
          >
            <span className="navbar__logo-text">VELMORA</span>
            <span className="navbar__logo-sub">JEWELRY HOUSE</span>
          </Link>

          {/* Right: Actions */}
          <div className="navbar__actions">
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Tìm kiếm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {isAuthenticated ? (
              <div className="navbar__user" ref={userMenuRef}>
                <button className="navbar__icon-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="Tài khoản">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="navbar__avatar" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="navbar__user-menu">
                    <div className="navbar__user-info">
                      <span className="navbar__user-name">{user?.name}</span>
                      <span className="navbar__user-email">{user?.email}</span>
                    </div>
                    <Link to="/account" className="navbar__user-item" onClick={() => setUserMenuOpen(false)}>Tài khoản của tôi</Link>
                    <Link to="/orders" className="navbar__user-item" onClick={() => setUserMenuOpen(false)}>Đơn hàng</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="navbar__user-item navbar__user-admin" onClick={() => setUserMenuOpen(false)}>
                        <strong>🛠 Trang quản trị</strong>
                      </Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="navbar__user-item navbar__user-logout">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="navbar__icon-btn" onClick={() => openAuth('login')} aria-label="Đăng nhập">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            <Link to="/favorites" className="navbar__icon-btn navbar__fav-btn" aria-label="Yêu thích" style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favorites.length > 0 && <span className="navbar__cart-badge">{favorites.length}</span>}
            </Link>

            <button className="navbar__icon-btn navbar__voucher-btn" onClick={openVoucher} aria-label="Voucher">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </button>

            <button className="navbar__icon-btn navbar__cart-btn" onClick={openCart} aria-label="Giỏ hàng">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
            </button>

            {/* Mobile menu button */}
            <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
              <span className={menuOpen ? 'open' : ''}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="navbar__mobile-menu">
            <Link to="/" onClick={() => setMenuOpen(false)}>Trang Chủ</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>Giới Thiệu</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>Tất Cả Sản Phẩm</Link>
            <Link to="/news" onClick={() => setMenuOpen(false)}>Tin Tức</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Liên Hệ</Link>
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)}>Tài Khoản Của Tôi</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>Đơn Hàng</Link>
                <Link to="/favorites" onClick={() => setMenuOpen(false)}>Yêu Thích</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }}>Đăng Xuất</button>
              </>
            ) : (
              <button onClick={() => { openAuth('login'); setMenuOpen(false); }}>Đăng Nhập</button>
            )}
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <>
          <div className="overlay" onClick={() => setSearchOpen(false)} />
          <div className="navbar__search-overlay">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trang sức..."
                className="navbar__search-input"
              />
              <button type="submit" className="navbar__search-submit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
              <button type="button" className="navbar__search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
