import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import './CartDrawer.css';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + '₫';

const CartDrawer: React.FC = () => {
  const { state, closeCart, removeFromCart, updateQuantity, applyDiscount, subtotal, total, toggleItemSelected, toggleAllSelected, clearSelectedItems } = useCart();
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [isEditingCart, setIsEditingCart] = useState(false);
  const [cartAlert, setCartAlert] = useState<{ message: string; type: 'alert' | 'confirm'; onConfirm?: () => void } | null>(null);
  const navigate = useNavigate();

  const handleApplyDiscount = () => {
    setDiscountError('');
    setDiscountSuccess('');
    if (!discountInput.trim()) return;
    const validCodes: Record<string, number> = { LUXURY10: 10, SALE20: 20, VIP30: 30 };
    const code = discountInput.toUpperCase();
    if (validCodes[code]) {
      applyDiscount(code);
      setDiscountSuccess(`Áp dụng thành công! Giảm ${validCodes[code]}%`);
    } else {
      setDiscountError('Mã giảm giá không hợp lệ');
    }
  };

  const handleCheckoutClick = () => {
    if (state.items.filter(i => i.selected).length === 0) {
       setCartAlert({ message: "Vui lòng chọn ít nhất một sản phẩm để thanh toán.", type: 'alert' });
       return;
    }
    setShowConsultModal(true);
  };

  const proceedToCheckout = () => {
    setShowConsultModal(false);
    closeCart();
    navigate('/checkout');
  };

  if (!state.isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">Giỏ Hàng</h2>
            <span className="cart-drawer__count">
              {state.items.length} {state.items.length === 1 ? 'sản phẩm' : 'sản phẩm'}
            </span>
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="cart-drawer__empty">
            <div className="cart-drawer__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p className="cart-drawer__empty-text">Giỏ hàng của bạn đang trống</p>
            <Link to="/products" className="btn-outline" style={{ marginTop: '16px', fontSize: '11px' }} onClick={closeCart}>
              Khám Phá Sản Phẩm
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-drawer__items-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                    type="checkbox" 
                    style={{ marginRight: '12px', width: '16px', height: '16px', accentColor: '#1a1a1a', cursor: 'pointer' }}
                    checked={state.items.length > 0 && state.items.every(i => i.selected)}
                    onChange={(e) => toggleAllSelected(e.target.checked)}
                /> 
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Chọn tất cả ({state.items.length} sản phẩm)</span>
              </div>
              <button 
                onClick={() => setIsEditingCart(!isEditingCart)} 
                style={{ fontSize: '13px', color: isEditingCart ? 'var(--color-charcoal)' : 'var(--color-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isEditingCart ? 'Xong' : 'Sửa'}
              </button>
            </div>
            <div className="cart-drawer__items">
              {state.items.map(item => (
                <div key={item.product.id} className="cart-item" style={{ position: 'relative', paddingLeft: '52px' }}>
                  <input 
                    type="checkbox" 
                    style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', accentColor: '#1a1a1a', cursor: 'pointer' }} 
                    checked={!!item.selected}
                    onChange={() => toggleItemSelected(item.product.id)}
                  />
                  <div className="cart-item__image">
                    <img src={item.product.images[0]} alt={item.product.name} />
                  </div>
                  <div className="cart-item__info">
                    <div className="cart-item__top">
                      <div>
                        <p className="cart-item__sku">{item.product.sku}</p>
                        <h4 className="cart-item__name">{item.product.name}</h4>
                        <p className="cart-item__material">
                          {item.product.material === 'gold' ? 'Vàng' :
                           item.product.material === 'silver' ? 'Bạc' :
                           item.product.material === 'platinum' ? 'Bạch Kim' : 'Kim Cương'}
                        </p>
                      </div>
                      <button
                        className="cart-item__remove"
                        onClick={() => setCartAlert({
                          message: `Bạn có chắc muốn xóa "${item.product.name}" khỏi giỏ hàng?`,
                          type: 'confirm',
                          onConfirm: () => removeFromCart(item.product.id)
                        })}
                        aria-label="Xóa"
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="cart-item__bottom">
                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >−</button>
                        <span className="cart-item__qty-num">{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <span className="cart-item__price">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isEditingCart ? (
              <div className="cart-drawer__actions" style={{ borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
                <button 
                  className="btn-primary" 
                  style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                  onClick={() => {
                    const selectedCount = state.items.filter(i => i.selected).length;
                    if (selectedCount === 0) {
                      setCartAlert({ message: "Vui lòng chọn sản phẩm để xóa.", type: 'alert' });
                      return;
                    }
                    setCartAlert({
                      message: `Bạn có chắc chắn muốn xóa ${selectedCount} sản phẩm đã chọn khỏi giỏ hàng?`,
                      type: 'confirm',
                      onConfirm: () => {
                         clearSelectedItems();
                         setIsEditingCart(false);
                      }
                    });
                  }}
                >
                  Xóa {state.items.filter(i => i.selected).length} sản phẩm
                </button>
              </div>
            ) : (
              <>
                {/* Discount Code */}
                <div className="cart-drawer__discount">
                  <div className="cart-drawer__discount-row">
                    <input
                      type="text"
                      value={discountInput}
                      onChange={e => setDiscountInput(e.target.value)}
                      placeholder="Mã giảm giá hoặc thẻ quà tặng"
                      className="cart-drawer__discount-input"
                      onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <button className="cart-drawer__discount-btn" onClick={handleApplyDiscount}>
                      Áp Dụng
                    </button>
                  </div>
                  {discountError && <p className="cart-drawer__discount-error">{discountError}</p>}
                  {discountSuccess && <p className="cart-drawer__discount-success">{discountSuccess}</p>}
                </div>

                {/* Summary */}
                <div className="cart-drawer__summary">
                  <div className="cart-drawer__summary-row">
                    <span>Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {state.discountAmount > 0 && (
                    <div className="cart-drawer__summary-row cart-drawer__summary-discount">
                      <span>Giảm giá ({state.discountCode})</span>
                      <span>−{formatPrice(subtotal * state.discountAmount)}</span>
                    </div>
                  )}
                  <div className="cart-drawer__summary-row">
                    <span>Vận chuyển</span>
                    <span className={subtotal >= 10000000 ? 'cart-drawer__free-ship' : ''}>
                      {subtotal >= 10000000 ? 'Miễn phí' : 'Tính khi thanh toán'}
                    </span>
                  </div>
                  <div className="cart-drawer__summary-row cart-drawer__total-row">
                    <span>Tổng cộng</span>
                    <span className="cart-drawer__total-price">
                      {formatPrice(total)}
                      {state.discountAmount > 0 && <small> (đã giảm)</small>}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="cart-drawer__actions">
                  <button className="btn-primary cart-drawer__checkout-btn" onClick={handleCheckoutClick}>
                    Thanh Toán Ngay
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </button>
                  <button className="cart-drawer__continue" onClick={closeCart}>
                    ← Tiếp Tục Mua Sắm
                  </button>
                </div>
              </>
            )}
            
            {/* Consultation Modal */}
            {showConsultModal && (
              <div className="cart-drawer__consult-modal">
                <div className="cart-drawer__consult-overlay" onClick={() => setShowConsultModal(false)}></div>
                <div className="cart-drawer__consult-content">
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', marginBottom: '16px', color: 'var(--color-charcoal)', fontWeight: 400 }}>Tư Vấn Chuyên Sâu</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: '24px' }}>
                    Trang sức là ngôn ngữ của sự tinh tế. Quý khách có muốn chuyên gia của VELMORA hỗ trợ tư vấn thêm về kích cỡ, chất liệu hay phối đồ qua <strong style={{ color: 'var(--color-gold)' }}>Hotline: 1900 8888</strong> trước khi đặt hàng không?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="btn-outline" style={{ fontSize: '13px', padding: '12px', pointerEvents: 'none', cursor: 'default' }}>
                      Có, tôi cần tư vấn thêm
                    </button>
                    <button className="btn-primary" style={{ fontSize: '13px', padding: '12px' }} onClick={proceedToCheckout}>
                      Không, tiến hành thanh toán
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Custom Alert/Confirm Modal */}
            {cartAlert && (
              <div className="cart-drawer__consult-modal" style={{ zIndex: 1100 }}>
                <div className="cart-drawer__consult-overlay" onClick={() => { if (cartAlert.type === 'alert') setCartAlert(null); }}></div>
                <div className="cart-drawer__consult-content" style={{ width: '85%', maxWidth: '340px', padding: '36px 28px', borderRadius: '12px', textAlign: 'center' }}>
                  {cartAlert.type === 'confirm' ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }}>
                      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  )}
                  
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '12px', color: 'var(--color-charcoal)', fontWeight: 400, letterSpacing: '0.5px' }}>
                    {cartAlert.type === 'alert' ? 'Thông báo' : 'Xác nhận xóa'}
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', marginBottom: '32px' }}>
                    {cartAlert.message}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {cartAlert.type === 'confirm' && (
                       <button 
                         style={{ flex: 1, padding: '12px', fontSize: '13px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--color-charcoal)' }} 
                         onClick={() => setCartAlert(null)}>
                         Hủy
                       </button>
                    )}
                    <button 
                      className="btn-primary" 
                      style={{ 
                        flex: 1, 
                        padding: '12px', 
                        fontSize: '13px', 
                        background: 'var(--color-charcoal)', 
                        borderColor: 'var(--color-charcoal)',
                        borderRadius: '4px'
                      }} 
                      onClick={() => {
                        if (cartAlert.type === 'confirm' && cartAlert.onConfirm) {
                          cartAlert.onConfirm();
                        }
                        setCartAlert(null);
                      }}>
                      {cartAlert.type === 'confirm' ? 'Xóa' : 'Đã hiểu'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
