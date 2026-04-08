import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import './CartDrawer.css';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + '₫';

const CartDrawer: React.FC = () => {
  const { state, closeCart, removeFromCart, updateQuantity, applyDiscount, subtotal, total } = useCart();
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');
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

  const handleCheckout = () => {
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
            <div className="cart-drawer__items">
              {state.items.map(item => (
                <div key={item.product.id} className="cart-item">
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
                        onClick={() => removeFromCart(item.product.id)}
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
              <button className="btn-primary cart-drawer__checkout-btn" onClick={handleCheckout}>
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
      </div>
    </>
  );
};

export default CartDrawer;
