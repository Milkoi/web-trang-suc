import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/api';
import './AccountPage.css';

type Tab = 'profile' | 'password' | 'orders' | 'favorites';

const AccountPage: React.FC = () => {
  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
      setProfileAddress(user.address || '');
    }
  }, [user]);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Per-field error state
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="account-page__unauth">
        <div className="account-page__unauth-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để xem thông tin tài khoản của bạn.</p>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block', padding: '14px 32px', fontSize: '12px', letterSpacing: '2px' }}>
          Về Trang Chủ
        </Link>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    
    try {
      // Call API to update phone and address
      await api.put('/account/profile', {
        phone: profilePhone.trim(),
        address: profileAddress.trim()
      });

      // Update context and local storage
      updateUser({ 
        name: profileName.trim(), 
        email: profileEmail.trim(),
        phone: profilePhone.trim(),
        address: profileAddress.trim()
      });
      
      setProfileSuccess('Thông tin đã được cập nhật thành công.');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear all errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setPasswordSuccess('');

    let hasError = false;

    // 1. Validate all fields are filled
    if (!currentPassword.trim()) {
      setCurrentPasswordError('Vui lòng nhập mật khẩu hiện tại.');
      hasError = true;
    }
    if (!newPassword.trim()) {
      setNewPasswordError('Vui lòng nhập mật khẩu mới.');
      hasError = true;
    }
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Vui lòng xác nhận mật khẩu mới.');
      hasError = true;
    }

    if (hasError) return;

    // 2. Validate new password strength (only if newPassword is filled)
    if (/\s/.test(newPassword)) {
      setNewPasswordError('Mật khẩu không được chứa khoảng trắng.');
      return;
    }
    if (newPassword.length < 8) {
      setNewPasswordError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải chứa ít nhất một chữ cái thường.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải chứa ít nhất một chữ cái hoa.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải chứa ít nhất một chữ số.');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword)) {
      setNewPasswordError('Mật khẩu phải chứa ít nhất một ký tự đặc biệt.');
      return;
    }

    // 3. Old password must differ from new password
    if (currentPassword === newPassword) {
      setNewPasswordError('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }

    // 4. New password must match confirmation
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    // 5. Call API
    setIsSubmitting(true);
    try {
      const response = await api.put('/account/change-password', {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(response.data.message || 'Mật khẩu đã được thay đổi thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.field === 'currentPassword') {
        setCurrentPasswordError(data.message || 'Mật khẩu hiện tại không đúng.');
      } else if (err.response?.status === 401) {
        setCurrentPasswordError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setCurrentPasswordError(data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Compute password strength for the bar
  const getPasswordStrength = (pw: string): { level: string; label: string } => {
    if (!pw) return { level: '', label: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) score++;
    if (score <= 2) return { level: 'weak', label: 'Yếu' };
    if (score <= 4) return { level: 'medium', label: 'Trung bình' };
    return { level: 'strong', label: 'Mạnh' };
  };

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {open
        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
        : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>}
    </svg>
  );

  const pwStrength = getPasswordStrength(newPassword);

  return (
    <div className="account-page">
      <div className="account-page__container">

        {/* ── Sidebar ── */}
        <aside className="account-page__sidebar">
          <div className="account-sidebar__avatar">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <div className="account-sidebar__avatar-initials">{getInitials(user.name)}</div>}
          </div>
          <div className="account-sidebar__name">{user.name}</div>
          <div className="account-sidebar__email">{user.email}</div>

          <nav className="account-sidebar__nav">
            {([
              { key: 'profile', label: 'Thông Tin Cá Nhân', icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /> },
              { key: 'password', label: 'Đổi Mật Khẩu', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></> },
            ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(item => (
              <button
                key={item.key}
                className={`account-sidebar__nav-item${activeTab === item.key ? ' active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {item.key === 'profile' && <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
                  {item.key === 'password' && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>}
                </svg>
                {item.label}
              </button>
            ))}

            <div className="account-sidebar__divider" />

            <Link to="/orders" className="account-sidebar__nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
                <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              Đơn Hàng Của Tôi
            </Link>
            <Link to="/favorites" className="account-sidebar__nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              Sản Phẩm Yêu Thích
            </Link>

            <div className="account-sidebar__divider" />

            <button className="account-sidebar__logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Đăng Xuất
            </button>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <div className="account-page__content">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <section className="account-section">
              <div className="account-section__header">
                <h1 className="account-section__title">Thông Tin Cá Nhân</h1>
                <p className="account-section__subtitle">Quản lý thông tin hồ sơ của bạn</p>
              </div>

              <form className="account-form" onSubmit={handleProfileSave}>
                <div className="account-form__group">
                  <label className="account-form__label">Họ và Tên</label>
                  <input
                    type="text"
                    className="account-form__input"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="account-form__group">
                  <label className="account-form__label">Địa Chỉ Email</label>
                  <input
                    type="email"
                    className="account-form__input"
                    value={profileEmail}
                    readOnly
                    style={{ background: 'var(--color-surface)', color: 'var(--color-muted)', cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                    Email đăng nhập không thể thay đổi tại đây.
                  </span>
                </div>
                
                <h3 style={{ marginTop: '20px', marginBottom: '15px', fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>Thông Tin Giao Hàng Mặc Định</h3>
                
                <div className="account-form__group">
                  <label className="account-form__label">Số Điện Thoại</label>
                  <input
                    type="tel"
                    className="account-form__input"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="account-form__group">
                  <label className="account-form__label">Địa Chỉ Chi Tiết</label>
                  <textarea
                    className="account-form__input"
                    value={profileAddress}
                    onChange={e => setProfileAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng mặc định (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    style={{ minHeight: '80px', resize: 'vertical', padding: '12px 16px' }}
                  />
                </div>

                <div className="account-form__group">
                  <label className="account-form__label">Phương Thức Đăng Nhập</label>
                  <div className="account-form__badge">
                    {user.provider === 'google'
                      ? <><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Google</> 
                      : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Email</>}
                  </div>
                </div>

                {profileSuccess && <p className="account-form__success">{profileSuccess}</p>}
                <div className="account-form__actions">
                  <button type="submit" className="btn-primary" style={{ padding: '14px 36px', fontSize: '12px', letterSpacing: '2px' }}>
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <section className="account-section">
              <div className="account-section__header">
                <h1 className="account-section__title">Đổi Mật Khẩu</h1>
                <p className="account-section__subtitle">Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và không dùng lại ở nơi khác</p>
              </div>

              {user.provider === 'google' ? (
                <div className="account-section__notice">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Tài khoản của bạn được đăng nhập qua Google. Vui lòng thay đổi mật khẩu trực tiếp tại trang quản lý tài khoản Google.
                </div>
              ) : (
                <form className="account-form" onSubmit={handlePasswordChange}>
                  <div className="account-form__group">
                    <label className="account-form__label">Mật Khẩu Hiện Tại</label>
                    <div className="account-form__input-wrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        className={`account-form__input${currentPasswordError ? ' input-error' : ''}`}
                        value={currentPassword}
                        onChange={e => { setCurrentPassword(e.target.value); setCurrentPasswordError(''); }}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button type="button" className="account-form__eye" onClick={() => setShowCurrent(!showCurrent)}>
                        <EyeIcon open={showCurrent} />
                      </button>
                    </div>
                    {currentPasswordError && <p className="account-form__field-error">{currentPasswordError}</p>}
                  </div>

                  <div className="account-form__group">
                    <label className="account-form__label">Mật Khẩu Mới</label>
                    <div className="account-form__input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className={`account-form__input${newPasswordError ? ' input-error' : ''}`}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setNewPasswordError(''); }}
                        placeholder="Ít nhất 8 ký tự, chữ hoa, thường, số, ký tự đặc biệt"
                      />
                      <button type="button" className="account-form__eye" onClick={() => setShowNew(!showNew)}>
                        <EyeIcon open={showNew} />
                      </button>
                    </div>
                    {newPasswordError && <p className="account-form__field-error">{newPasswordError}</p>}
                    {newPassword && !newPasswordError && (
                      <div className="account-form__strength">
                        <div className={`account-form__strength-bar ${pwStrength.level}`} />
                        <span>{pwStrength.label}</span>
                      </div>
                    )}
                    {newPassword && !newPasswordError && (
                      <div className="account-form__pw-rules">
                        <span className={newPassword.length >= 8 ? 'rule-pass' : 'rule-fail'}>✓ Ít nhất 8 ký tự</span>
                        <span className={/[a-z]/.test(newPassword) ? 'rule-pass' : 'rule-fail'}>✓ Chữ cái thường</span>
                        <span className={/[A-Z]/.test(newPassword) ? 'rule-pass' : 'rule-fail'}>✓ Chữ cái hoa</span>
                        <span className={/[0-9]/.test(newPassword) ? 'rule-pass' : 'rule-fail'}>✓ Chữ số</span>
                        <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword) ? 'rule-pass' : 'rule-fail'}>✓ Ký tự đặc biệt</span>
                        <span className={!/\s/.test(newPassword) ? 'rule-pass' : 'rule-fail'}>✓ Không có khoảng trắng</span>
                      </div>
                    )}
                  </div>

                  <div className="account-form__group">
                    <label className="account-form__label">Xác Nhận Mật Khẩu Mới</label>
                    <div className="account-form__input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className={`account-form__input${confirmPasswordError ? ' input-error' : ''}`}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button type="button" className="account-form__eye" onClick={() => setShowConfirm(!showConfirm)}>
                        <EyeIcon open={showConfirm} />
                      </button>
                    </div>
                    {confirmPasswordError && <p className="account-form__field-error">{confirmPasswordError}</p>}
                  </div>

                  {passwordSuccess && <p className="account-form__success">{passwordSuccess}</p>}

                  <div className="account-form__actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                      style={{ padding: '14px 36px', fontSize: '12px', letterSpacing: '2px', opacity: isSubmitting ? 0.6 : 1 }}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
