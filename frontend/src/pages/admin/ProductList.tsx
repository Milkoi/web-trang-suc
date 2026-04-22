import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useCart } from '../../store/CartContext';
import { useNotification } from '../../store/NotificationContext';
import './AdminLayout.css';


interface Variant {
  id?: number;
  sku: string;
  size: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  isSale?: boolean;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
  images: string[];
  description: string;
  originStory: string;
  isNew: boolean;
  isSale: boolean;
  stockQuantity?: number;
  variants: Variant[];
}

const generateSku = (text: string) => {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper to handle numeric string inputs safely
const cleanNumberInput = (value: string) => {
  return value.replace(/[^0-9]/g, ''); // Only allow positive digits
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { refreshCart } = useCart();
  const { showNotification } = useNotification();


  const [formData, setFormData] = useState<any>({
    sku: '',
    name: '',
    category: '', // Will store Slug
    price: '',
    originalPrice: '',
    description: '',
    originStory: '',
    imageUrl: '',
    isNew: false,
    isSale: false,
    stockQuantity: '0',
    variants: [{ sku: '', size: '', price: '', originalPrice: '', stockQuantity: '' }]
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
    const selectedCat = categories.find((c: any) => c.slug === formData.category);
    const dataToSubmit = {
      sku: formData.sku,
      name: formData.name,
      categoryId: selectedCat ? selectedCat.id : 0,
      category: formData.category, // Backend maps this slug to CategoryId if categoryId is 0
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || 0,
      description: formData.description,
      originStory: formData.originStory,
      isNew: formData.isNew,
      isSale: formData.isSale,
      stockQuantity: Number(formData.stockQuantity) || 0,
      images: formData.imageUrl ? [formData.imageUrl] : [],
      variants: formData.variants.map((v: any) => ({
        sku: v.sku,
        size: v.size,
        price: Number(v.price) || 0,
        originalPrice: Number(v.originalPrice) || 0,
        stockQuantity: Number(v.stockQuantity) || 0,
        isSale: v.isSale || false
      }))
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, dataToSubmit);
      } else {
        await api.post('/products', dataToSubmit);
      }
      setIsModalOpen(false);
      fetchProducts();
      refreshCart(); // Cập nhật giỏ hàng ngay lập tức
    } catch (err: any) {
      console.error('Save error:', err);
      const data = err.response?.data;
      // Handle both { message: "..." } and string responses
      const backendMsg = data?.message || (typeof data === 'string' ? data : JSON.stringify(data));
      const errorMsg = backendMsg || err.message || 'Lỗi không xác định';
      
      showNotification('Không thể lưu sản phẩm!\n\nChi tiết: ' + (errorMsg.length > 500 ? errorMsg.substring(0, 500) + '...' : errorMsg), 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      refreshCart(); // Cập nhật giỏ hàng ngay lập tức
      showNotification('Đã xóa sản phẩm', 'success');
    } catch (err) {
      showNotification('Không thể xóa sản phẩm.', 'error');
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: '', size: '', price: '', originalPrice: '', stockQuantity: '' }]
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Quản lý Sản phẩm</h2>
        <button className="btn-primary" onClick={() => {
          setEditingProduct(null);
          setFormData({ 
            sku: '', name: '', category: '', price: '', originalPrice: '', 
            description: '', originStory: '', imageUrl: '', 
            isNew: false, isSale: false, stockQuantity: '0', 
            variants: [{ sku: '', size: '', price: '', originalPrice: '', stockQuantity: '' }] 
          });
          setIsModalOpen(true);
        }}>
          Thêm sản phẩm
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Mã SP (SKU)</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Nhãn</th>
              <th>Giá Giảm (Bán)</th>
              <th>Giá Gốc</th>
              <th>Tồn Kho</th>
              <th>Tình trạng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={11} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
            ) : products.map(p => (
              <React.Fragment key={p.id}>
                <tr 
                  className={`product-row ${expandedRowId === p.id ? 'active' : ''}`}
                  onClick={() => setExpandedRowId(expandedRowId === p.id ? null : p.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{p.id}</td>
                <td>
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 4, background: '#eee' }} />
                  )}
                </td>
                <td style={{ fontSize: 13, fontFamily: 'monospace', color: '#555' }}>{p.sku || '—'}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  {p.description && <div style={{ fontSize: 11, color: '#888', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                </td>
                <td><span className="badge" style={{ background: '#f0f0f0', color: '#333', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>{p.category}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.isNew && <span style={{ background: '#1a1a1a', color: 'white', padding: '2px 6px', fontSize: 10, borderRadius: 2 }}>NEW</span>}
                    {p.isSale && <span style={{ background: '#c0392b', color: 'white', padding: '2px 6px', fontSize: 10, borderRadius: 2 }}>SALE</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#c0392b' }}>{new Intl.NumberFormat('vi-VN').format(p.price)}₫</td>
                <td style={{ color: '#888', textDecoration: 'line-through', fontSize: 13 }}>
                  {p.originalPrice > 0 ? new Intl.NumberFormat('vi-VN').format(p.originalPrice) + '₫' : '—'}
                </td>
                <td>{p.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0}</td>
                <td>
                  <span style={{ fontSize: 12, color: p.inStock ? '#27ae60' : '#c0392b', fontWeight: 500 }}>
                    {p.inStock ? 'Còn hàng' : 'Hết hàng'}
                   </span>
                </td>
                <td>
                  <div className="table-actions" onClick={e => e.stopPropagation()}>
                    <button className="btn-icon" onClick={() => {
                      setEditingProduct(p);
                      setFormData({
                        sku: p.sku || '',
                        name: p.name,
                        category: p.category, 
                        price: p.price?.toString() || '',
                        originalPrice: p.originalPrice?.toString() || '',
                        description: p.description || '',
                        originStory: p.originStory || '',
                        imageUrl: p.images?.[0] || '',
                        isNew: p.isNew || false,
                        isSale: p.isSale || false,
                        stockQuantity: p.stockQuantity?.toString() || '0',
                        variants: p.variants ? p.variants.map((v: any) => ({
                          ...v,
                          price: v.price?.toString() || '',
                          originalPrice: v.originalPrice?.toString() || '',
                          stockQuantity: v.stockQuantity?.toString() || ''
                        })) : []
                      });
                      setIsModalOpen(true);
                    }}>Sửa</button>
                    <button className="btn-icon delete" onClick={() => handleDelete(p.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
              {expandedRowId === p.id && (
                <tr className="expanded-row">
                  <td colSpan={11}>
                    <div className="expanded-content">
                      <div className="expanded-grid">
                        <div className="expanded-info-main">
                          <div className="info-block">
                            <label>Câu chuyện sản phẩm (Origin Story)</label>
                            <p className="story-text">{p.originStory || 'Chưa có câu chuyện.'}</p>
                          </div>
                          <div className="info-block">
                            <label>Mô tả chi tiết</label>
                            <p className="desc-text">{p.description || 'Chưa có mô tả.'}</p>
                          </div>
                        </div>
                        <div className="expanded-info-side">
                          <label>Biến thể chi tiết</label>
                          <div className="mini-variant-list">
                            {p.variants.map((v, idx) => (
                              <div key={idx} className="mini-variant-card">
                                <span className="m-sku">{v.sku}</span>
                                <span className="m-size">S: {v.size}</span>
                                <span className="m-price">{new Intl.NumberFormat('vi-VN').format(v.price)}₫</span>
                                <span className="m-stock">Tồn: {v.stockQuantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="expanded-images" style={{ marginTop: 16 }}>
                            <label>Hình ảnh ({p.images.length})</label>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
                              {p.images.map((img, idx) => (
                                <img key={idx} src={img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 800 }}>
            <button className="admin-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h3>{editingProduct ? 'Sửa' : 'Thêm'} Sản phẩm</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>SKU (Mã SP) <span className="required-star">*</span></label>
                  <input type="text" className="form-control" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Tên sản phẩm <span className="required-star">*</span></label>
                  <input type="text" className="form-control" value={formData.name} onChange={e => {
                    const newName = e.target.value;
                    const newBaseSku = (!editingProduct && (!formData.sku || formData.sku === generateSku(formData.name))) ? generateSku(newName) : formData.sku;
                    
                    const updatedVariants = formData.variants.map((v: any) => ({
                      ...v,
                      sku: newBaseSku && v.size ? `${newBaseSku}-${generateSku(v.size)}` : v.sku
                    }));

                    setFormData({
                      ...formData, 
                      name: newName, 
                      sku: newBaseSku,
                      variants: updatedVariants
                    });
                  }} required />
                </div>
                <div className="form-group">
                  <label>Danh mục <span className="required-star">*</span></label>
                  <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>URL Hình ảnh chính <span className="required-star">*</span></label>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <input type="text" className="form-control" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ flex: 1 }} required />
                    <div style={{ width: 60, height: 60, border: '1px dashed #ccc', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60?text=L%E1%BB%97i'; }} />
                      ) : (
                        <span style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>Chưa có<br/>ảnh</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Giá bán (₫) <span className="required-star">*</span></label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    className="form-control" 
                    placeholder="Ví dụ: 500000"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: cleanNumberInput(e.target.value)})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Giá gốc (₫)</label>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    className="form-control" 
                    placeholder="Ví dụ: 600000"
                    value={formData.originalPrice} 
                    onChange={e => setFormData({...formData, originalPrice: cleanNumberInput(e.target.value)})} 
                  />
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                  <input type="checkbox" id="isNew" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} />
                  <label htmlFor="isNew" style={{ margin: 0, textTransform: 'none' }}>Sản phẩm Mới (Lên Top)</label>
                </div>
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                  <input type="checkbox" id="isSale" checked={formData.isSale} onChange={e => setFormData({...formData, isSale: e.target.checked})} />
                  <label htmlFor="isSale" style={{ margin: 0, textTransform: 'none' }}>Đang Khuyến Mãi (Sale)</label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Câu chuyện sản phẩm (Origin Story)</label>
                <textarea className="form-control" rows={2} value={formData.originStory} onChange={e => setFormData({...formData, originStory: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết <span className="required-star">*</span></label>
                <textarea className="form-control" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div className="variants-section" style={{ background: '#f8f9fa', padding: '16px 20px', borderRadius: 8, marginTop: 16, border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#333', margin: 0 }}>Biến thể (Size / Giá / Tồn kho)</label>
                  <button type="button" onClick={addVariant} className="btn-text" style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>+ Thêm biến thể</button>
                </div>
                
                {formData.variants.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 80px 100px 100px 80px 60px 40px', gap: 12, marginBottom: 8, padding: '0 4px' }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', margin: 0 }}>SKU/Mã <span className="required-star">*</span></label>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', margin: 0 }}>Size <span className="required-star">*</span></label>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', margin: 0 }}>Giá Bán <span className="required-star">*</span></label>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', margin: 0 }}>Giá Gốc</label>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', margin: 0 }}>Số lượng <span className="required-star">*</span></label>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>Sale?</label>
                    <label></label>
                  </div>
                )}

                {formData.variants.map((v: any, i: number) => (
                  <div key={i} className="variant-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(80px, 1fr) 80px 100px 100px 80px 60px 40px', gap: 12, marginBottom: 12, alignItems: 'center' }}>
                    <input className="form-control" placeholder="SKU" value={v.sku} onChange={e => {
                      const newV = [...formData.variants]; newV[i].sku = e.target.value; setFormData({...formData, variants: newV});
                    }} required />
                    <input className="form-control" placeholder="Size" value={v.size} onChange={e => {
                      const newSize = e.target.value;
                      const newV = [...formData.variants]; 
                      newV[i].size = newSize; 
                      
                      // Auto-link SKU: tensanpham-size
                      const baseSku = formData.sku || generateSku(formData.name);
                      if (baseSku) {
                        newV[i].sku = newSize ? `${baseSku}-${generateSku(newSize)}` : baseSku;
                      } else {
                        newV[i].sku = generateSku(newSize);
                      }
                      
                      setFormData({...formData, variants: newV});
                    }} required />
                    <input 
                      className="form-control" 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Giá" 
                      value={v.price} 
                      onChange={e => {
                        const newV = [...formData.variants]; 
                        newV[i].price = cleanNumberInput(e.target.value); 
                        setFormData({...formData, variants: newV});
                      }} 
                      required 
                    />
                    <input 
                      className="form-control" 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Giá cũ" 
                      value={v.originalPrice} 
                      onChange={e => {
                        const newV = [...formData.variants]; 
                        newV[i].originalPrice = cleanNumberInput(e.target.value); 
                        setFormData({...formData, variants: newV});
                      }} 
                    />
                    <input 
                      className="form-control" 
                      type="text" 
                      inputMode="numeric"
                      placeholder="Kho" 
                      value={v.stockQuantity} 
                      onChange={e => {
                        const newV = [...formData.variants]; 
                        newV[i].stockQuantity = cleanNumberInput(e.target.value); 
                        setFormData({...formData, variants: newV});
                      }} 
                      required 
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input type="checkbox" checked={v.isSale || false} onChange={e => {
                        const newV = [...formData.variants]; newV[i].isSale = e.target.checked; setFormData({...formData, variants: newV});
                      }} />
                    </div>

                    <button type="button" onClick={() => {
                      const newV = formData.variants.filter((_: any, idx: number) => idx !== i);
                      setFormData({...formData, variants: newV});
                    }} className="btn-icon delete" style={{ margin: '0 auto' }}>×</button>
                  </div>
                ))}
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

export default ProductList;
