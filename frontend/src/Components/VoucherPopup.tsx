import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import './VoucherPopup.css';

interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: number;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
  description: string | null;
  imageUrl: string | null;
  minOrderAmount: number | null;
  isClaimed?: boolean;
}

interface VoucherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoucherPopup: React.FC<VoucherPopupProps> = ({ isOpen, onClose }) => {
  const { user, openAuth, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'mine'>('available');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'available') {
        fetchAvailable();
      } else if (isAuthenticated) {
        fetchMyVouchers();
      }
    }
  }, [isOpen, activeTab, isAuthenticated]);

  const fetchAvailable = async () => {
    setLoading(true);
    try {
      const res = await api.get('/promotions/available');
      setPromotions(res.data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyVouchers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/promotions/my-vouchers');
      setMyVouchers(res.data);
    } catch (error) {
      console.error('Error fetching my vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id: number) => {
    if (!user) {
      onClose();
      openAuth('login');
      return;
    }

    setClaimingId(id);
    try {
      await api.post(`/promotions/save/${id}`);
      fetchAvailable();
      // Thông báo thành công nhẹ nhàng hơn alert
      alert('Đã lưu ưu đãi vào ví của bạn!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu mã');
    } finally {
      setClaimingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Vô hạn';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  const bgImage = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80";

  return (
    <div className="voucher-hub-overlay" onClick={onClose}>
      <div className="voucher-hub-modal" onClick={e => e.stopPropagation()}>
        <button className="voucher-hub-close" onClick={onClose}>&times;</button>
        
        <div className="voucher-hub-banner" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="voucher-hub-banner-content">
            <h2>Hệ Thống Ưu Đãi</h2>
            <p>Trải nghiệm trang sức tinh hoa cùng Velmora</p>
          </div>
        </div>

        <div className="voucher-hub-tabs">
          <button 
            className={`voucher-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Nhận Ưu Đãi
          </button>
          <button 
            className={`voucher-tab ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => {
              if (!isAuthenticated) openAuth('login');
              else setActiveTab('mine');
            }}
          >
            Ưu Đãi Của Tôi
          </button>
        </div>

        <div className="voucher-hub-list-container">
          {loading ? (
            <div className="voucher-hub-loading">Đang tải...</div>
          ) : activeTab === 'available' ? (
            promotions.length === 0 ? (
              <div className="voucher-hub-empty">Hiện không có ưu đãi nào khả dụng</div>
            ) : (
              <div className="voucher-hub-list">
                {promotions.map(promo => {
                  const isExpired = promo.endDate && new Date(promo.endDate) < new Date();
                  const isOut = promo.usageLimit && promo.usedCount >= promo.usageLimit;
                  
                  return (
                    <div key={promo.id} className={`voucher-card ${isExpired || isOut ? 'disabled' : ''}`}>
                      <div className="voucher-card-left">
                        <div className="voucher-discount">
                          <span className="voucher-num">{promo.discount}</span>
                          <span className="voucher-percent">%</span>
                        </div>
                        <div className="voucher-tag">SAVE</div>
                      </div>
                      
                      <div className="voucher-card-right">
                        <h4 className="voucher-card-title">{promo.name}</h4>
                        <div className="voucher-card-info">
                          <p className="voucher-expiry">HSD: {formatDate(promo.endDate)}</p>
                          {promo.minOrderAmount && <p className="voucher-min">Đơn từ: {promo.minOrderAmount.toLocaleString()}₫</p>}
                        </div>
                        
                        <button 
                          className={`voucher-claim-btn ${promo.isClaimed ? 'claimed' : ''}`}
                          disabled={!!isExpired || !!isOut || claimingId === promo.id || promo.isClaimed}
                          onClick={() => handleClaim(promo.id)}
                        >
                          {claimingId === promo.id ? 'Loading...' : 
                           promo.isClaimed ? 'Đã lưu' :
                           isExpired ? 'Hết hạn' : 
                           isOut ? 'Hết lượt' : 'Lưu Ngay'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            myVouchers.length === 0 ? (
              <div className="voucher-hub-empty">Bạn chưa lưu mã nào</div>
            ) : (
              <div className="voucher-hub-list">
                {myVouchers.map(uv => {
                  const promo = uv.promotion;
                  const isExpired = promo.endDate && new Date(promo.endDate) < new Date();
                  const isUsed = uv.isUsed;
                  
                  return (
                    <div key={uv.id} className={`voucher-card ${isUsed || isExpired ? 'disabled' : ''}`}>
                      <div className="voucher-card-left" style={{ background: isUsed ? '#ccc' : '#1a1a1a' }}>
                        <div className="voucher-discount">
                          <span className="voucher-num">{promo.discount}</span>
                          <span className="voucher-percent">%</span>
                        </div>
                        <div className="voucher-tag">{isUsed ? 'ĐÃ DÙNG' : 'CỦA TÔI'}</div>
                      </div>
                      
                      <div className="voucher-card-right">
                        <h4 className="voucher-card-title">{promo.name}</h4>
                        <div className="voucher-card-info">
                          <p className="voucher-expiry">HSD: {formatDate(promo.endDate)}</p>
                          <p className="voucher-code-display">Mã: <strong>{promo.code}</strong></p>
                        </div>
                        
                        <div className={`voucher-status-tag ${isUsed ? 'used' : isExpired ? 'expired' : 'valid'}`}>
                          {isUsed ? 'Đã sử dụng' : isExpired ? 'Đã hết hạn' : 'Sẵn sàng dùng'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        <div className="voucher-hub-footer">
          <p>Mã đã lưu sẽ tự động hiển thị trong giỏ hàng khi thanh toán</p>
        </div>
      </div>
    </div>
  );
};

export default VoucherPopup;
