import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [shopInfo, setShopInfo] = useState({
    email: 'contact@velmora.com',
    phone: '1900 520 131',
    address: '235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội',
    workingHours: 'T2-CN: 8:00 - 23:00',
    facebookUrl: '#',
    instagramUrl: '#'
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/shopsettings');
        if (response.data) {
          setShopInfo(prev => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.error('Error fetching shop info:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await api.post('/contactmessages', formData);
      setStatus({ type: 'success', message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.' });
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      setTimeout(() => {
        setStatus({ type: 'success', message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.' });
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
        setLoading(false);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero__pattern"></div>
        <div className="container">
          <div className="contact-hero__content">
            <span className="contact-hero__badge">Liên hệ với chúng tôi</span>
            <h1 className="contact-hero__title">Kết Nối Cùng Velmora</h1>
            <p className="contact-hero__desc">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm món trang sức hoàn hảo hoặc giải đáp mọi thắc mắc.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info__card">
            <h3 className="section-title">Thông Tin Liên Hệ</h3>
            <div className="contact-info__items">
              <div className="contact-info__item">
                <div className="icon">📍</div>
                <div>
                  <h4>Địa chỉ</h4>
                  <p>{shopInfo.address}</p>
                </div>
              </div>
              <div className="contact-info__item">
                <div className="icon">📞</div>
                <div>
                  <h4>Số điện thoại</h4>
                  <p>{shopInfo.phone}</p>
                </div>
              </div>
              <div className="contact-info__item">
                <div className="icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>{shopInfo.email}</p>
                </div>
              </div>
              <div className="contact-info__item">
                <div className="icon">🕒</div>
                <div>
                  <h4>Giờ làm việc</h4>
                  <p>{shopInfo.workingHours}</p>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <h4>Theo dõi Velmora tại</h4>
              <div className="social-links">
                {shopInfo.facebookUrl && (
                  <a href={shopInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="social-link-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}
                {shopInfo.instagramUrl && (
                  <a href={shopInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="contact-form__card">
            <h3 className="form-title">Gửi lời nhắn</h3>
            <p className="form-desc">Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 24 giờ làm việc.</p>
            
            {status && (
              <div className={`form-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Họ tên của bạn" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0xxx xxx xxx" />
                </div>
                <div className="form-group">
                  <label>Chủ đề *</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Tiêu đề lời nhắn" />
                </div>
              </div>
              <div className="form-group">
                <label>Lời nhắn *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Nội dung chi tiết..." />
              </div>
              <button type="submit" className="contact-submit" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi lời nhắn ngay'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
