import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminLayout.css';

interface Category {
  id: number;
  slug: string;
  name: string;
  imageUrl?: string;
  description: string;
  productCount: number;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ slug: '', name: '', imageUrl: '', description: '' });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ slug: '', name: '', imageUrl: '', description: '' });
      fetchCategories();
    } catch (err) {
      alert('Có lỗi xảy ra. Tên danh mục có thể đã tồn tại.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data || 'Không thể xóa danh mục đang có sản phẩm.');
    }
  };

  return (
    <div className="admin-page category-mgmt">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Danh mục</h2>
        <button className="btn-primary" onClick={() => {
          setEditingCategory(null);
          setFormData({ slug: '', name: '', imageUrl: '', description: '' });
          setIsModalOpen(true);
        }}>
          Thêm danh mục
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình Ảnh</th>
              <th>Tên (Slug)</th>
              <th>Mô tả</th>
              <th>Số sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 40, height: 40, background: '#eee', borderRadius: 4 }} />
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{cat.slug}</div>
                </td>
                <td>{cat.description || '—'}</td>
                <td>{cat.productCount}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon" onClick={() => {
                      setEditingCategory(cat);
                      setFormData({ slug: cat.slug, name: cat.name, imageUrl: cat.imageUrl || '', description: cat.description || '' });
                      setIsModalOpen(true);
                    }}>
                      Sửa
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(cat.id)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h3>{editingCategory ? 'Sửa' : 'Thêm'} Danh mục</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Đường dẫn (Slug) <span className="required-star">*</span></label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                  required 
                  placeholder="vi-du-danh-muc"
                />
              </div>
              <div className="form-group">
                <label>Tên danh mục <span className="required-star">*</span></label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.name} 
                  onChange={e => {
                    const name = e.target.value;
                    // Auto-generate slug from name if adding a new category and slug is empty or matches previous auto-slug
                    if (!editingCategory) {
                      const autoSlug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData({ ...formData, name, slug: autoSlug });
                    } else {
                      setFormData({ ...formData, name });
                    }
                  }} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Đường dẫn hình ảnh (URL)</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.imageUrl} 
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                  placeholder="https://..."
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: 8, padding: 8, border: '1px dashed var(--color-border-dark)', borderRadius: 8, background: 'var(--color-bg)', alignSelf: 'flex-start' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-muted)', display: 'block', marginBottom: 4, fontWeight: 500 }}>Ảnh xem trước:</span>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain', borderRadius: 4, display: 'block' }}
                      onError={(e) => { 
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x120?text=URL+L%E1%BB%97i'; 
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  className="form-control"
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
