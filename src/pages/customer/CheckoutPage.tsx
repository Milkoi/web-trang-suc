import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { CheckoutForm } from '../../types';
import './CheckoutPage.css';

const formatPrice = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + '₫';

type Step = 'shipping' | 'payment';

const INITIAL_FORM: CheckoutForm = {
  email: '',
  newsletterOptin: false,
  shipping: {
    firstName: '', lastName: '', company: '',
    address: '', apartment: '', city: '',
    country: 'Vietnam', postalCode: '', phone: '',
  },
  shippingMethod: 'free',
  payment: { method: 'credit-card' },
};

const CheckoutPage: React.FC = () => {
  const { state, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountInput, setDiscountInput] = useState('');

  const updateShipping = (field: string, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    clearCart();
    navigate('/checkout/success');
  };

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5);

  if (state.items.length === 0 && !isProcessing) {
    return (
      <div className="page-content checkout-empty">
        <div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
          <Link to="/products" className="btn-primary" style={{ display: 'inline-flex', marginTop: '24px' }}>
            Mua Sắm Ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-content">
      <div className="checkout-page__inner">
        {/* ===== LEFT: FORM ===== */}
        <div className="checkout-form-col">
          {/* Logo */}
          <div className="checkout-logo">
            <Link to="/" className="checkout-logo__link">
              <span className="checkout-logo__text">LUXELUM</span>
              <span className="checkout-logo__sub">JEWELRY HOUSE</span>
            </Link>
          </div>

          {/* Breadcrumb Steps */}
          <nav className="checkout-steps">
            <Link to="/cart" className="checkout-step checkout-step--link">Giỏ hàng</Link>
            <span className="checkout-step__sep">›</span>
            <button
              className={`checkout-step ${step === 'shipping' ? 'checkout-step--active' : 'checkout-step--done'}`}
              onClick={() => step === 'payment' && setStep('shipping')}
            >
              Giao hàng
            </button>
            <span className="checkout-step__sep">›</span>
            <span className={`checkout-step ${step === 'payment' ? 'checkout-step--active' : ''}`}>
              Thanh toán
            </span>
          </nav>

          {/* === SHIPPING FORM === */}
          {step === 'shipping' && (
            <form className="checkout-form" onSubmit={handleShippingSubmit}>
              {/* Contact */}
              <div className="checkout-section">
                <div className="checkout-section__header">
                  <h3>Thông Tin Liên Hệ</h3>
                  <span className="checkout-section__hint">
                    Đã có tài khoản? <Link to="#" onClick={e => e.preventDefault()}>Đăng nhập</Link>
                  </span>
                </div>
                <div className="form-group">
                  <input
                    id="checkout-email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>
                <label className="checkout-checkbox">
                  <input
                    type="checkbox"
                    checked={form.newsletterOptin}
                    onChange={e => setForm(p => ({ ...p, newsletterOptin: e.target.checked }))}
                  />
                  <span className="checkout-checkbox__box" />
                  <span>Nhận thông báo về ưu đãi và sản phẩm mới</span>
                </label>
              </div>

              {/* Shipping Address */}
              <div className="checkout-section">
                <h3>Địa Chỉ Giao Hàng</h3>
                <div className="form-group">
                  <select
                    className="form-control"
                    value={form.shipping.country}
                    onChange={e => updateShipping('country', e.target.value)}
                  >
                    <option value="Vietnam">Việt Nam</option>
                    <option value="US">Hoa Kỳ</option>
                    <option value="SG">Singapore</option>
                  </select>
                </div>
                <div className="checkout-form__row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Họ"
                      value={form.shipping.firstName}
                      onChange={e => updateShipping('firstName', e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tên"
                      value={form.shipping.lastName}
                      onChange={e => updateShipping('lastName', e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Công ty (tùy chọn)"
                    value={form.shipping.company}
                    onChange={e => updateShipping('company', e.target.value)}
                    autoComplete="organization"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Địa chỉ"
                    value={form.shipping.address}
                    onChange={e => updateShipping('address', e.target.value)}
                    required
                    autoComplete="street-address"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Căn hộ, tòa nhà, số phòng... (tùy chọn)"
                    value={form.shipping.apartment}
                    onChange={e => updateShipping('apartment', e.target.value)}
                    autoComplete="address-line2"
                  />
                </div>
                <div className="checkout-form__row checkout-form__row--3">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Mã bưu chính"
                      value={form.shipping.postalCode}
                      onChange={e => updateShipping('postalCode', e.target.value)}
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Thành phố"
                      value={form.shipping.city}
                      onChange={e => updateShipping('city', e.target.value)}
                      required
                      autoComplete="address-level2"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Số điện thoại (tùy chọn)"
                    value={form.shipping.phone}
                    onChange={e => updateShipping('phone', e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="checkout-section">
                <h3>Phương Thức Vận Chuyển</h3>
                <div className="checkout-shipping-methods">
                  {[
                    { id: 'free', label: 'Miễn phí cho đơn từ 10tr', price: subtotal >= 10000000 ? 'Miễn phí' : '0₫', disabled: false },
                    { id: 'standard', label: 'Tiêu chuẩn (3–5 ngày)', price: '30.000₫', disabled: false },
                    { id: 'express', label: 'Nhanh (1–2 ngày)', price: '60.000₫', disabled: false },
                  ].map(m => (
                    <label key={m.id} className={`checkout-shipping-method ${form.shippingMethod === m.id ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={m.id}
                        checked={form.shippingMethod === m.id}
                        onChange={e => setForm(p => ({ ...p, shippingMethod: e.target.value as CheckoutForm['shippingMethod'] }))}
                      />
                      <span className="checkout-shipping-method__radio" />
                      <span className="checkout-shipping-method__label">{m.label}</span>
                      <span className="checkout-shipping-method__price">{m.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="checkout-form__footer">
                <Link to="/" className="checkout-form__back">← Quay lại mua sắm</Link>
                <button type="submit" className="btn-primary checkout-form__next-btn">
                  Tiếp Tục Thanh Toán
                </button>
              </div>
            </form>
          )}

          {/* === PAYMENT FORM === */}
          {step === 'payment' && (
            <form className="checkout-form" onSubmit={handlePayNow}>
              {/* Shipping Summary */}
              <div className="checkout-section checkout-section--summary">
                <div className="checkout-summary-line">
                  <span>Liên hệ</span>
                  <div>
                    <span>{form.email}</span>
                    <button type="button" onClick={() => setStep('shipping')} className="checkout-summary-change">Thay đổi</button>
                  </div>
                </div>
                <div className="checkout-summary-line">
                  <span>Giao hàng đến</span>
                  <div>
                    <span>{form.shipping.address}, {form.shipping.city}</span>
                    <button type="button" onClick={() => setStep('shipping')} className="checkout-summary-change">Thay đổi</button>
                  </div>
                </div>
                <div className="checkout-summary-line">
                  <span>Vận chuyển</span>
                  <div>
                    <span>{form.shippingMethod === 'free' ? 'Miễn phí' : form.shippingMethod === 'standard' ? 'Tiêu chuẩn' : 'Nhanh'}</span>
                    <button type="button" onClick={() => setStep('shipping')} className="checkout-summary-change">Thay đổi</button>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="checkout-section">
                <h3>Thanh Toán</h3>
                <p className="checkout-payment__secure">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  Tất cả giao dịch đều được bảo mật và mã hóa.
                </p>

                {/* Credit Card */}
                <label className={`checkout-payment-method ${form.payment.method === 'credit-card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={form.payment.method === 'credit-card'}
                    onChange={() => setForm(p => ({ ...p, payment: { ...p.payment, method: 'credit-card' } }))}
                  />
                  <span className="checkout-payment-method__radio" />
                  <span>Thẻ tín dụng</span>
                  <div className="checkout-payment-method__icons">
                    <span className="checkout-card-icon visa">VISA</span>
                    <span className="checkout-card-icon mc">MC</span>
                    <span className="checkout-card-icon jcb">JCB</span>
                  </div>
                </label>

                {form.payment.method === 'credit-card' && (
                  <div className="checkout-card-fields">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control checkout-card-number"
                        placeholder="Số thẻ"
                        value={cardNum}
                        onChange={e => setCardNum(formatCardNum(e.target.value))}
                        required
                        maxLength={19}
                        autoComplete="cc-number"
                      />
                      <div className="checkout-card-lock">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tên trên thẻ"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        required
                        autoComplete="cc-name"
                      />
                    </div>
                    <div className="checkout-form__row">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ngày hết hạn (MM / YY)"
                          value={expiry}
                          onChange={e => setExpiry(formatExpiry(e.target.value))}
                          required
                          maxLength={5}
                          autoComplete="cc-exp"
                        />
                      </div>
                      <div className="form-group" style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mã bảo mật"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          required
                          maxLength={4}
                          autoComplete="cc-csc"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                <label className={`checkout-payment-method ${form.payment.method === 'paypal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={form.payment.method === 'paypal'}
                    onChange={() => setForm(p => ({ ...p, payment: { ...p.payment, method: 'paypal' } }))}
                  />
                  <span className="checkout-payment-method__radio" />
                  <span style={{ color: '#003087', fontWeight: '700', fontStyle: 'italic' }}>Pay</span>
                  <span style={{ color: '#009cde', fontWeight: '700', fontStyle: 'italic' }}>Pal</span>
                </label>

                {/* MoMo */}
                <label className={`checkout-payment-method ${form.payment.method === 'klarna' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="klarna"
                    checked={form.payment.method === 'klarna'}
                    onChange={() => setForm(p => ({ ...p, payment: { ...p.payment, method: 'klarna' } }))}
                  />
                  <span className="checkout-payment-method__radio" />
                  <span style={{ color: '#a50064', fontWeight: '600' }}>MoMo</span>
                </label>
              </div>

              <div className="checkout-form__footer">
                <button type="button" className="checkout-form__back" onClick={() => setStep('shipping')}>
                  ← Quay lại giao hàng
                </button>
                <button type="submit" className="btn-primary checkout-form__pay-btn" disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="auth-modal__spinner" />
                  ) : (
                    <>
                      Thanh Toán Ngay
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ===== RIGHT: ORDER SUMMARY ===== */}
        <div className="checkout-summary-col">
          <div className="checkout-summary">
            {/* Items */}
            <div className="checkout-summary__items">
              {state.items.map(item => (
                <div key={item.product.id} className="checkout-summary__item">
                  <div className="checkout-summary__item-image">
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <span className="checkout-summary__item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__item-info">
                    <p className="checkout-summary__item-name">{item.product.name}</p>
                    <p className="checkout-summary__item-material">
                      {item.product.material === 'gold' ? 'Vàng' :
                       item.product.material === 'silver' ? 'Bạc' :
                       item.product.material === 'platinum' ? 'Bạch Kim' : 'Kim Cương'}
                    </p>
                  </div>
                  <span className="checkout-summary__item-price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount */}
            <div className="checkout-summary__discount">
              <input
                type="text"
                placeholder="Mã giảm giá hoặc thẻ quà tặng"
                value={discountInput}
                onChange={e => setDiscountInput(e.target.value)}
                className="checkout-summary__discount-input"
              />
              <button className="checkout-summary__discount-btn">Áp Dụng</button>
            </div>

            {/* Totals */}
            <div className="checkout-summary__totals">
              <div className="checkout-summary__total-row">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-summary__total-row">
                <span>Vận chuyển</span>
                <span className={subtotal >= 10000000 ? 'free-ship' : ''}>
                  {subtotal >= 10000000 ? 'Miễn phí' : 'Tính khi thanh toán'}
                </span>
              </div>
              <div className="checkout-summary__total-row checkout-summary__grand-total">
                <span>Tổng cộng</span>
                <div>
                  <small>VND</small>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
