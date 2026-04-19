import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ContentManagement.css';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  isActive: boolean;
}

interface ShopSettings {
  siteName: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  workingHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

const ContentManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    siteName: 'VELMORA'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'banners' | 'settings'>('banners');
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchSettings();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/content/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/content/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.put(`/content/banners/${editingBanner.id}`, bannerForm);
      } else {
        await api.post('/content/banners', bannerForm);
      }
      
      fetchBanners();
      setShowBannerModal(false);
      setEditingBanner(null);
      resetBannerForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi lưu banner');
    }
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      imageUrl: ''
    });
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl
    });
    setShowBannerModal(true);
  };

  const handleDeleteBanner = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await api.delete(`/content/banners/${id}`);
        fetchBanners();
      } catch (error) {
        alert('Lỗi khi xóa banner');
      }
    }
  };

  const handleToggleBanner = async (banner: Banner) => {
    try {
      await api.put(`/content/banners/${banner.id}`, {
        isActive: !banner.isActive
      });
      fetchBanners();
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái banner');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/content/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setBannerForm({
        ...bannerForm,
        imageUrl: response.data.url
      });
    } catch (error) {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/content/settings', settings);
      alert('Cập nhật cài đặt thành công');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi lưu cài đặt');
    }
  };

  const handleSettingsChange = (field: keyof ShopSettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="content-management">
      <div className="content-management__header">
        <h1>Quản lý Nội dung</h1>
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            Banner
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Cài đặt
          </button>
        </div>
      </div>

      {activeTab === 'banners' && (
        <div className="content-management__content">
          <div className="section-header">
            <h2>Quản lý Banner</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowBannerModal(true)}
            >
              Thêm Banner mới
            </button>
          </div>

          <div className="banner-list">
            {banners.map(banner => (
              <div key={banner.id} className="banner-item">
                <div className="banner-image">
                  <img src={banner.imageUrl} alt={banner.title} />
                </div>
                <div className="banner-info">
                  <h3>{banner.title}</h3>
                  {banner.subtitle && <p>{banner.subtitle}</p>}
                  <div className="banner-status">
                    <span className={`status ${banner.isActive ? 'active' : 'inactive'}`}>
                      {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </div>
                  <div className="banner-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditBanner(banner)}
                    >
                      Sửa
                    </button>
                    <button 
                      className={`btn-toggle ${banner.isActive ? 'btn-hide' : 'btn-show'}`}
                      onClick={() => handleToggleBanner(banner)}
                    >
                      {banner.isActive ? 'Ẩn' : 'Hiện'}
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="content-management__content">
          <div className="section-header">
            <h2>Cài đặt Website</h2>
          </div>

          <form onSubmit={handleSettingsSubmit} className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>Tên Website</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingsChange('siteName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Liên hệ</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => handleSettingsChange('contactPhone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Giờ làm việc</label>
                <input
                  type="text"
                  value={settings.workingHours}
                  onChange={(e) => handleSettingsChange('workingHours', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả Website</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleSettingsChange('siteDescription', e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleSettingsChange('address', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Facebook URL</label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => handleSettingsChange('facebookUrl', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => handleSettingsChange('instagramUrl', e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Lưu Cài đặt
            </button>
          </form>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner mới'}</h2>
              <button className="modal-close" onClick={() => setShowBannerModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleBannerSubmit} className="banner-form">
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tiêu đề phụ</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Ảnh Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {bannerForm.imageUrl && (
                  <div className="image-preview">
                    <img src={bannerForm.imageUrl} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowBannerModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Đang tải...' : editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
