import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/api';
import './CheckoutPage.css';

const formatPrice = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + '';

type Step = 'shipping' | 'payment';

interface CheckoutForm {
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  shippingMethod: 'free' | 'standard' | 'express';
  payment: {
    method: 'credit-card' | 'paypal' | 'momo' | 'vnpay' | 'vietqr';
  };
};

const INITIAL_FORM: CheckoutForm = {
  email: '',
  shipping: {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Vietnam',
    postalCode: '',
    phone: '',
  },
  shippingMethod: 'free',
  payment: { method: 'credit-card' },
};

const CheckoutPageFixed: React.FC = () => {
  const { state, clearSelectedItems, clearDiscount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVietQR, setShowVietQR] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [qrAmount, setQrAmount] = useState(0);
  const [paymentLink, setPaymentLink] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed' | 'expired'>('pending');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [error, setError] = useState('');

  // Handle payment countdown and status checking
  useEffect(() => {
    let timer: any;
    let pollInterval: any;

    if (showVietQR && paymentStatus === 'pending') {
      // Countdown timer
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('expired');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Poll for payment status
      pollInterval = setInterval(async () => {
        try {
          const res = await api.get(`/payment/check-status/${createdOrderId}`);
          if (res.data.status === 'paid') {
            setPaymentStatus('success');
            clearInterval(pollInterval);
            clearInterval(timer);
            setTimeout(() => {
              navigate('/checkout/success');
            }, 2000);
          }
        } catch (err) {
          console.error('Payment status check failed', err);
        }
      }, 4000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [showVietQR, paymentStatus, createdOrderId, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedItems = state.items.filter(i => i.selected);
  const subtotal = selectedItems.reduce((sum, i) => {
    const itemPrice = i.priceAtPurchase ?? i.variant?.price ?? i.product.price;
    return sum + itemPrice * i.quantity;
  }, 0);
  const shipping = form.shippingMethod === 'free' ? 0 : form.shippingMethod === 'standard' ? 30000 : 50000;
  const discount = subtotal * state.discountAmount;
  const grandTotal = subtotal + shipping - discount;

  useEffect(() => {
    if (user) {
      setForm(p => ({
        ...p,
        email: user.email || '',
        shipping: {
          ...p.shipping,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          phone: '',
        },
      }));
    }
  }, [user]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const orderData = {
        customerInfo: {
          email: form.email,
          firstName: form.shipping.firstName,
          lastName: form.shipping.lastName,
          phone: form.shipping.phone,
          address: form.shipping.address,
          city: form.shipping.city,
          country: form.shipping.country,
          postalCode: form.shipping.postalCode,
          paymentMethod: form.payment.method,
          shippingMethod: form.shippingMethod,
        },
        items: selectedItems.map(item => ({
          productVariantId: item.variant?.id ?? item.product.variants?.[0]?.id,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase ?? item.variant?.price ?? item.product.price,
        })),
        totalAmount: grandTotal,
        discountAmount: discount,
        shippingFee: shipping,
      };

      const res = await api.post('/orders', orderData);
      const finalAmount = grandTotal;

      clearSelectedItems();
      clearDiscount();

      if (form.payment.method === 'vietqr' && res.data.orderId) {
        setQrAmount(finalAmount);
        setCreatedOrderId(res.data.orderId);
        
        // Try to get PayOS payment link
        try {
          const payRes = await api.post(`/payment/create-payment-link/${res.data.orderId}`);
          console.log('PayOS response:', payRes.data);
          
          if (payRes.data && payRes.data.checkoutUrl) {
            setPaymentLink(payRes.data.checkoutUrl);
            setShowVietQR(true);
          } else {
            throw new Error('Invalid PayOS response');
          }
        } catch (payErr) {
          console.error('PayOS Link creation failed:', payErr);
          // Always show QR modal even if PayOS fails
          setShowVietQR(true);
          setError('PayOS không có. Dùng QR t.');
        }
        
        setIsProcessing(false);
        return;
      }

      navigate('/checkout/success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có l. Vui lòng th.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateVietQRUrl = () => {
    const bankCode = 'MB'; // MBBank
    const accountNumber = '4000676869';
    const accountName = 'Le Minh Quan';
    const addInfo = `Thanh toan don hang ${createdOrderId}`;
    
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;
  };

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5);

  if (selectedItems.length === 0 && !isProcessing && !showVietQR) {
    return (
      <div className="page-content checkout-empty">
        <div>
          <h2>Gi hàng trng</h2>
          <p>Thêm sp vào gi hàng trc khi thanh toán.</p>
          <Link to="/products" className="btn-primary" style={{ display: 'inline-flex', marginTop: '24px' }}>
            Mua Sám Ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content checkout-page">
      <div className="checkout-container">
        {/* Steps */}
        <nav className="checkout-steps">
          <button
            className={`checkout-step ${step === 'shipping' ? 'checkout-step--active' : 'checkout-step--done'}`}
            onClick={() => step === 'payment' && setStep('shipping')}
          >
            Giao hàng
          </button>
          <span className="checkout-step__sep">&gt;</span>
          <span className={`checkout-step ${step === 'payment' ? 'checkout-step--active' : ''}`}>
            Thanh toán
          </span>
        </nav>

        {/* QR Payment Modal */}
        {showVietQR && (
          <div className="vietqr-modal-overlay">
            <div className="vietqr-modal">
              <div className={`vietqr-modal__header ${paymentStatus}`}>
                <h3>
                  {paymentStatus === 'success' ? 'Thành công' : 
                   paymentStatus === 'expired' ? 'Ht h' : 'QR'}
                </h3>
                {paymentStatus === 'success' ? (
                  <p>C  VELMORA. {createdOrderId}.</p>
                ) : paymentStatus === 'expired' ? (
                  <p style={{color: 'red'}}>Ht h. Th.</p>
                ) : (
                  <p>QR {createdOrderId}</p>
                )}
              </div>
              
              <div className="vietqr-modal__content">
                {paymentStatus === 'success' ? (
                  <div className="payment-success-animation">
                    <div className="check-icon">
                      <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none"/>
                        <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                      </svg>
                    </div>
                    <p>Thành công!</p>
                  </div>
                ) : (
                  <>
                    <div className="vietqr-image-wrapper">
                      {paymentLink ? (
                        <iframe 
                          src={paymentLink} 
                          style={{ width: '100%', height: '550px', border: 'none', borderRadius: '12px' }}
                          title="PayOS Checkout"
                        />
                      ) : (
                        <img 
                          src={generateVietQRUrl()}
                          alt="VietQR Payment" 
                          className={paymentStatus === 'expired' ? 'qr-expired' : ''}
                        />
                      )}
                      {paymentStatus === 'checking' && (
                        <div className="qr-checking-overlay">
                          <span className="auth-modal__spinner"></span>
                          <p>...</p>
                        </div>
                      )}
                      {paymentStatus === 'expired' && (
                        <div className="qr-expired-overlay">
                          <p>Ht h</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="vietqr-info">
                      <p><strong>S ti:</strong> {formatPrice(qrAmount)}</p>
                      <p><strong>M:</strong> {formatTime(timeLeft)}</p>
                      <p><strong>N:</strong> {createdOrderId}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="vietqr-modal__footer">
                {paymentStatus === 'success' ? (
                  <button 
                    className="btn-primary" 
                    onClick={() => navigate('/orders')}
                  >
                    Xem d
                  </button>
                ) : (
                  <button 
                    className="btn-outline" 
                    onClick={() => setShowVietQR(false)}
                  >
                    H
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="checkout-content">
          {step === 'shipping' && (
            <form className="checkout-form" onSubmit={handleShippingSubmit}>
              {/* Shipping form content */}
              <div className="checkout-section">
                <h3>Thông tin giao hàng</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>H</label>
                    <input
                      type="text"
                      value={form.shipping.firstName}
                      onChange={e => setForm({...form, shipping: {...form.shipping, firstName: e.target.value}})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input
                      type="text"
                      value={form.shipping.lastName}
                      onChange={e => setForm({...form, shipping: {...form.shipping, lastName: e.target.value}})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={form.shipping.address}
                    onChange={e => setForm({...form, shipping: {...form.shipping, address: e.target.value}})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={form.shipping.city}
                      onChange={e => setForm({...form, shipping: {...form.shipping, city: e.target.value}})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={form.shipping.phone}
                      onChange={e => setForm({...form, shipping: {...form.shipping, phone: e.target.value}})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-form__footer">
                <button type="submit" className="btn-primary">
                  Tiêp
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form className="checkout-form" onSubmit={handlePayNow}>
              {/* Payment methods */}
              <div className="checkout-section">
                <h3>Thanh toán</h3>
                <label className={`checkout-payment-method ${form.payment.method === 'vietqr' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vietqr"
                    checked={form.payment.method === 'vietqr'}
                    onChange={() => setForm(p => ({ ...p, payment: { ...p.payment, method: 'vietqr' } }))}
                  />
                  <span className="checkout-payment-method__radio" />
                  <span>QR</span>
                </label>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <div className="checkout-form__footer">
                <button type="button" className="checkout-form__back" onClick={() => setStep('shipping')}>
                  &lt;
                </button>
                <button type="submit" className="btn-primary" disabled={isProcessing}>
                  {isProcessing ? '...' : 'Th'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h3>T</h3>
          {selectedItems.map(item => (
            <div key={item.id} className="checkout-summary-item">
              <div>
                <p>{item.product.name}</p>
                {item.variant && <p>Size: {item.variant.size}</p>}
              </div>
              <p>{formatPrice((item.priceAtPurchase ?? item.variant?.price ?? item.product.price) * item.quantity)}</p>
            </div>
          ))}
          <div className="checkout-summary-total">
            <p>T: {formatPrice(subtotal)}</p>
            <p>VC: {formatPrice(shipping)}</p>
            {discount > 0 && <p>GG: -{formatPrice(discount)}</p>}
            <p><strong>T: {formatPrice(grandTotal)}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageFixed;
