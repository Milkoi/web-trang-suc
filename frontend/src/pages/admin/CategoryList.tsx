import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminLayout.css';

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

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
      setFormData({ name: '', description: '' });
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
          setFormData({ name: '', description: '' });
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
              <th>Tên danh mục</th>
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
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td>{cat.description || '—'}</td>
                <td>{cat.productCount}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon" onClick={() => {
                      setEditingCategory(cat);
                      setFormData({ name: cat.name, description: cat.description });
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
            <h3>{editingCategory ? 'Sửa' : 'Thêm'} Danh mục</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên danh mục</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
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
