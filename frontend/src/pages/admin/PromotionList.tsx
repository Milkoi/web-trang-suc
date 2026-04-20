import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './PromotionList.css';

interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: number;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  description: string | null;
  imageUrl: string | null;
}

interface CreatePromotionDto {
  name: string;
  code: string;
  discount: number;
  startDate: string | null;
  endDate: string | null;
  usageLimit: number | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  description: string | null;
  imageUrl: string | null;
  isVisible: boolean;
}

const PromotionList: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<CreatePromotionDto>({
    name: '',
    code: '',
    discount: 10,
    startDate: null,
    endDate: null,
    usageLimit: null,
    minOrderAmount: null,
    maxDiscountAmount: null,
    description: '',
    imageUrl: '',
    isVisible: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await api.get('/promotions');
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromotion) {
        await api.put(`/promotions/${editingPromotion.id}`, formData);
      } else {
        await api.post('/promotions', formData);
      }
      fetchPromotions();
      setShowCreateModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu khuyến mãi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      discount: 0,
      startDate: null,
      endDate: null,
      usageLimit: null,
      minOrderAmount: null,
      maxDiscountAmount: null,
      description: '',
      imageUrl: '',
      isVisible: true
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn chắc chắn muốn xóa khuyến mãi này?')) {
      try {
        await api.delete(`/promotions/${id}`);
        fetchPromotions();
      } catch (error) {
        alert('Lỗi khi xóa khuyến mãi');
      }
    }
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      await api.put(`/promotions/${promotion.id}`, { isActive: !promotion.isActive });
      fetchPromotions();
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (promotion: Promotion) => {
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;
    
    if (!promotion.isActive) return 'inactive';
    if (start && now < start) return 'upcoming';
    if (end && now > end) return 'expired';
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) return 'exhausted';
    return 'active';
  };

  const getStatusText = (promotion: Promotion) => {
    const status = getStatusColor(promotion);
    switch (status) {
      case 'active': return 'Hiệu lực';
      case 'upcoming': return 'Sắp tới';
      case 'expired': return 'Hết hạn';
      case 'exhausted': return 'Hết lượt';
      case 'inactive': return 'Vô hiệu';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Không giới hạn';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="admin-page promotion-mgmt">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Khuyến mãi</h2>
        <button className="btn-primary" onClick={() => {
          setEditingPromotion(null);
          resetForm();
          setShowCreateModal(true);
        }}>
          Thêm khuyến mãi
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên chiến dịch</th>
              <th>Mã</th>
              <th>Giảm giá</th>
              <th>Giới hạn tối đa</th>
              <th>Thời hạn</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promotion) => (
              <tr key={promotion.id}>
                <td style={{ fontWeight: 600 }}>{promotion.name}</td>
                <td><code className="promotion-code">{promotion.code}</code></td>
                <td>{promotion.discount}%</td>
                <td>{formatCurrency(promotion.maxDiscountAmount)}</td>
                <td>
                  <div style={{ fontSize: '12px' }}>
                    {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString('vi-VN') : '—'} 
                    {' - '}
                    {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString('vi-VN') : '—'}
                  </div>
                </td>
                <td>
                  <span className={`status ${getStatusColor(promotion)}`}>
                    {getStatusText(promotion)}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => {
                        setEditingPromotion(promotion);
                        setFormData({
                          name: promotion.name,
                          code: promotion.code,
                          discount: promotion.discount,
                          startDate: promotion.startDate ? promotion.startDate.split('T')[0] : null,
                          endDate: promotion.endDate ? promotion.endDate.split('T')[0] : null,
                          usageLimit: promotion.usageLimit,
                          minOrderAmount: promotion.minOrderAmount,
                          maxDiscountAmount: promotion.maxDiscountAmount,
                          description: promotion.description || '',
                          imageUrl: promotion.imageUrl || '',
                          isVisible: promotion.isVisible
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '600px' }}>
            <button className="admin-modal-close" onClick={() => setShowCreateModal(false)}>&times;</button>
            <h3>Tạo Khuyến mãi Mới</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên khuyến mãi *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <small style={{ color: '#666' }}>Hệ thống sẽ tự sinh mã dựa trên tên này.</small>
              </div>

              <div className="form-group">
                <label>Mức giảm (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-grid" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value || null })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount === null ? '' : formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount === null ? '' : formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tổng lượt dùng tối đa (Hệ thống)</label>
                <input
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                />
                <small style={{ color: '#666' }}>Mỗi khách hàng lưu về sẽ chỉ được dùng mã này <b>1 lần duy nhất</b>.</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({...formData, isVisible: e.target.checked})}
                  />
                  Hiển thị công khai trên Web Hub
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu chiến dịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingPromotion && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '600px' }}>
            <button className="admin-modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            <h3>Sửa Khuyến mãi</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Tên khuyến mãi *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mức giảm (%) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="form-grid" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value || null })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value || null })}
                  />
                </div>
              </div>

              <div className="form-grid" style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount === null ? '' : formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount === null ? '' : formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tổng lượt dùng tối đa (Hệ thống)</label>
                <input
                  type="number"
                  value={formData.usageLimit === null ? '' : formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
