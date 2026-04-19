import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './PromotionList.css';

interface Promotion {
  id: number;
  name: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  minOrderAmount: number | null;
}

interface CreatePromotionDto {
  name: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  minOrderAmount: number | null;
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
    discount: 0,
    startDate: '',
    endDate: '',
    usageLimit: null,
    minOrderAmount: null
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
      setEditingPromotion(null);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lôõi khi luu khuyên mãi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      discount: 0,
      startDate: '',
      endDate: '',
      usageLimit: null,
      minOrderAmount: null
    });
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      code: promotion.code,
      discount: promotion.discount,
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      usageLimit: promotion.usageLimit,
      minOrderAmount: promotion.minOrderAmount
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bân châc muôn xóa khuyên mãi này?')) {
      try {
        await api.delete(`/promotions/${id}`);
        fetchPromotions();
      } catch (error) {
        alert('Lôõi khi xóa khuyên mãi');
      }
    }
  };

  const togglePromotionStatus = async (promotion: Promotion) => {
    try {
      await api.put(`/promotions/${promotion.id}`, { isActive: !promotion.isActive });
      fetchPromotions();
    } catch (error) {
      alert('Lôõi khi câp nhât trang thái');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'inactive';
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) return 'exhausted';
    return 'active';
  };

  const getStatusText = (promotion: Promotion) => {
    const status = getStatusColor(promotion);
    switch (status) {
      case 'active': return 'Hiêu luc';
      case 'upcoming': return 'Sáp diên ra';
      case 'expired': return 'Dã hêt hên';
      case 'exhausted': return 'Dã hêt lân';
      case 'inactive': return 'Vô hiêu';
      default: return 'Không xác dinh';
    }
  };

  if (loading) return <div className="admin-loading">Dang tài...</div>;

  return (
    <div className="promotion-list">
      <div className="promotion-list__header">
        <h1>Quân lý Khuyên mãi</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          Thêm Khuyên mãi Môi
        </button>
      </div>

      <div className="promotion-list__content">
        <div className="promotion-table">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mã</th>
                <th>Giâm gia</th>
                <th>Thô gian hiêu luc</th>
                <th>Sô lân sû dung</th>
                <th>Trang thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(promotion => (
                <tr key={promotion.id}>
                  <td>{promotion.name}</td>
                  <td>
                    <code className="promotion-code">{promotion.code}</code>
                  </td>
                  <td>{promotion.discount}%</td>
                  <td>
                    {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                  </td>
                  <td>
                    {promotion.usedCount}
                    {promotion.usageLimit && ` / ${promotion.usageLimit}`}
                  </td>
                  <td>
                    <span className={`status ${getStatusColor(promotion)}`}>
                      {getStatusText(promotion)}
                    </span>
                  </td>
                  <td>
                    <div className="promotion-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(promotion)}
                      >
                        Sûa
                      </button>
                      <button 
                        className="btn-toggle"
                        onClick={() => togglePromotionStatus(promotion)}
                      >
                        {promotion.isActive ? 'Khóa' : 'Mô'}
                      </button>
                      <button 
                        className="btn-delete"
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
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm Khuyên mãi Môi</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="promotion-form">
              <div className="form-group">
                <label>Tên khuyên mãi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mã khuyên mãi</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giâm gia (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngây bât dâu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngây kêt thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giôi hên sô lân</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null})}
                  />
                </div>
                <div className="form-group">
                  <label>Giá don hàng tôi thiêu</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderAmount || ''}
                    onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : null})}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Hûy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPromotion && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Sûa Khuyên mãi</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="promotion-form">
              <div className="form-group">
                <label>Tên khuyên mãi</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mã khuyên mãi</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giâm gia (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngây bât dâu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngây kêt thúc</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Giôi hên sô lân</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null})}
                  />
                </div>
                <div className="form-group">
                  <label>Giá don hàng tôi thiêu</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderAmount || ''}
                    onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : null})}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Hûy
                </button>
                <button type="submit" className="btn-primary">
                  Câp nhât
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
