import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuth, logout } = useAuth();
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
      setSearchQuery('');
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
            <Link to="/" className="navbar__link">Trang Chủ</Link>
            <Link to="/about" className="navbar__link">Giới Thiệu</Link>
            <Link to="/products" className="navbar__link">Sản Phẩm</Link>
          </nav>

          {/* Center: Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">LUXELUM</span>
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
                    <Link to="/profile" className="navbar__user-item">Tài khoản của tôi</Link>
                    <Link to="/orders" className="navbar__user-item">Đơn hàng</Link>
                    <button onClick={logout} className="navbar__user-item navbar__user-logout">Đăng xuất</button>
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
            {!isAuthenticated && (
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
