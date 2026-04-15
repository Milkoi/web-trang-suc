import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminLayout.css';

interface Variant {
  id?: number;
  sku: string;
  size: string;
  price: number;
  stockQuantity: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  images: string[];
  description: string;
  variants: Variant[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    variants: [{ sku: '', size: '', price: 0, stockQuantity: 0 } as Variant]
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      images: [formData.imageUrl],
      variants: formData.variants.map(v => ({...v, price: Number(v.price), stockQuantity: Number(v.stockQuantity)}))
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, dataToSubmit);
      } else {
        await api.post('/products', dataToSubmit);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu sản phẩm.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('Không thể xóa sản phẩm.');
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: '', size: '', price: 0, stockQuantity: 0 }]
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Sản phẩm</h2>
        <button className="btn-primary" onClick={() => {
          setEditingProduct(null);
          setFormData({ name: '', category: '', description: '', imageUrl: '', variants: [{ sku: '', size: '', price: 0, stockQuantity: 0 }] });
          setIsModalOpen(true);
        }}>
          Thêm sản phẩm
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá (Bắt đầu)</th>
              <th>Tình trạng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : products.map(p => (
              <tr key={p.id}>
                <td><img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 4 }} /></td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className="badge">{p.category}</span></td>
                <td>{new Intl.NumberFormat('vi-VN').format(p.price)}₫</td>
                <td>{p.inStock ? 'Còn hàng' : 'Hết hàng'}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon" onClick={() => {
                      setEditingProduct(p);
                      setFormData({
                        name: p.name,
                        category: p.category,
                        description: p.description,
                        imageUrl: p.images[0],
                        variants: p.variants
                      });
                      setIsModalOpen(true);
                    }}>Sửa</button>
                    <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 800 }}>
            <h3>{editingProduct ? 'Sửa' : 'Thêm'} Sản phẩm</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>URL Hình ảnh</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="variants-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <label>Biến thể (Size/Price)</label>
                  <button type="button" onClick={addVariant} className="btn-text">+ Thêm biến thể</button>
                </div>
                {formData.variants.map((v, i) => (
                  <div key={i} className="variant-row" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input placeholder="SKU" value={v.sku} onChange={e => {
                      const newV = [...formData.variants];
                      newV[i].sku = e.target.value;
                      setFormData({...formData, variants: newV});
                    }} required />
                    <input placeholder="Size" value={v.size} style={{ width: 80 }} onChange={e => {
                      const newV = [...formData.variants];
                      newV[i].size = e.target.value;
                      setFormData({...formData, variants: newV});
                    }} required />
                    <input type="number" placeholder="Giá" value={v.price} onChange={e => {
                      const newV = [...formData.variants];
                      newV[i].price = Number(e.target.value);
                      setFormData({...formData, variants: newV});
                    }} required />
                    <button type="button" onClick={() => {
                      const newV = formData.variants.filter((_, idx) => idx !== i);
                      setFormData({...formData, variants: newV});
                    }} className="btn-icon delete">×</button>
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Lưu sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
