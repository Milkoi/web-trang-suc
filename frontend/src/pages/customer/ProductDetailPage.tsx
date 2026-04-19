import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import { useFavorites } from '../../store/FavoritesContext';
import ProductCard from '../../Components/product/ProductCard';
import SizeGuideDrawer from '../../Components/product/SizeGuideDrawer';
import './ProductDetailPage.css';

const formatPrice = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + '₫';

const MATERIAL_MAP: Record<string, string> = {
  gold: 'Vàng', silver: 'Bạc', platinum: 'Bạch Kim', diamond: 'Kim Cương',
};
const CATEGORY_MAP: Record<string, string> = {
  necklace: 'Dây Chuyền', ring: 'Nhẫn', bracelet: 'Lắc Tay', anklet: 'Lắc Chân', earring: 'Bông Tai',
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'policy' | 'description' | 'faq' | 'reviews'>('description');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { isAuthenticated } = useAuth();

  const productFaqs = [
    {
      id: 1,
      question: "Sản phẩm có bao gồm hộp đựng và chứng nhận không?",
      answer: "Tất cả sản phẩm tại Velmora đều đi kèm hộp đựng cao cấp, túi giấy và hóa đơn đảm bảo. Với trang sức kim cương, quý khách sẽ nhận được chứng chỉ kiểm định (GIA hoặc trong nước) đi kèm."
    },
    {
      id: 2,
      question: "Tôi có được kiểm tra hàng trước khi thanh toán không?",
      answer: "Quý khách hoàn toàn được quyền kiểm tra sản phẩm trước khi thanh toán. Tuy nhiên, vì tính chất trang sức cao cấp, quý khách vui lòng không đeo thử sản phẩm khi chưa thanh toán."
    },
    {
      id: 3,
      question: "Nếu không vừa size tôi có được đổi không?",
      answer: "Chúng tôi hỗ trợ đổi size miễn phí trong vòng 48h kể từ khi nhận hàng. Quý khách vui lòng giữ nguyên tem mác và hóa đơn mua hàng."
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const [prodRes, allRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products'),
          api.get(`/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
        
        // Filter related
        const all = allRes.data as Product[];
        setRelated(all.filter(p => p.category === prodRes.data.category && p.id !== prodRes.data.id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const selectedVariant = product?.variants?.find(v => v.size === selectedSize);

  if (isLoading) return <div className="page-content" style={{ textAlign: 'center', padding: '120px 0' }}>Đang tải...</div>;

  if (!product) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px' }}>Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product?.variants && product.variants.length > 0 && !selectedSize) {
      alert('Vui lòng chọn size trước khi thêm vào giỏ hàng');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/reviews', {
        productId: product.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
    } catch {
      alert("Lỗi khi gửi đánh giá.");
    }
  };

  const disc = (selectedVariant?.originalPrice ?? product.originalPrice)
    ? Math.round((1 - (selectedVariant?.price ?? product.price) / (selectedVariant?.originalPrice ?? product.originalPrice!)) * 100)
    : 0;

  return (
    <div className="product-detail page-content">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ padding: '24px 0' }}>
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/products">Sản phẩm</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>{CATEGORY_MAP[product.category]}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div className="product-detail__layout">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  className={`product-detail__thumb ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="product-detail__main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
              {product.isNew && <span className="badge-new" style={{ position: 'absolute', top: '16px', left: '16px' }}>Mới</span>}
              {product.isSale && disc > 0 && (
                <span className="badge-sale" style={{ position: 'absolute', top: product.isNew ? '40px' : '16px', left: '16px' }}>−{disc}%</span>
              )}
              {!product.inStock && (
                <div className="product-detail__out-of-stock">
                  <span>Hết hàng</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <p className="product-detail__category">{CATEGORY_MAP[product.category]}</p>
            <h1 className="product-detail__name">{product.name}</h1>

            {/* Rating */}
            <div className="product-detail__rating">
              <span className="product-detail__stars">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="product-detail__rating-text">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className="product-detail__price">
              <span className={`product-detail__price-current ${(selectedVariant?.isSale ?? product.isSale) ? 'price-sale' : ''}`}>
                {formatPrice(selectedVariant?.price ?? product.price)}
              </span>
              {(selectedVariant?.originalPrice ?? product.originalPrice) && (
                <span className="price-original">{formatPrice(selectedVariant?.originalPrice ?? product.originalPrice!)}</span>
              )}
            </div>

            <div className="product-detail__divider" />

            {/* Details */}
            <div className="product-detail__meta">
              <div className="product-detail__meta-item">
                <span>Chất liệu</span>
                <span>{MATERIAL_MAP[product.material]}</span>
              </div>
              <div className="product-detail__meta-item">
                <span>SKU</span>
                <span>{product.sku}</span>
              </div>
              <div className="product-detail__meta-item">
                <span>Tình trạng</span>
                <span className={product.inStock ? 'in-stock' : 'out-stock'}>
                  {product.inStock ? '✓ Còn hàng' : '✗ Hết hàng'}
                </span>
              </div>
            </div>

            {/* Description & Origin Story */}
            <div className="product-detail__descriptions">
              <p className="product-detail__desc">{product.description}</p>
              
              {product.originStory && (
                <div className="product-detail__origin">
                  <h3>Câu Chuyện Thiết Kế</h3>
                  <p>{product.originStory}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="product-detail__actions-container">
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="product-detail__size-selector">
                  <div className="size-selector-header">
                    <span className="size-label">Kích thước</span>
                    <button className="btn-size-guide" onClick={() => setIsSizeGuideOpen(true)}>
                      Hướng dẫn chọn size
                    </button>
                  </div>
                  
                  <div className="size-options">
                    {product.availableSizes.map(size => {
                      const variant = product.variants?.find(v => v.size === size);
                      const isOutOfStock = variant ? variant.stockQuantity <= 0 : !product.inStock;
                      
                      return (
                        <button 
                          key={size}
                          disabled={isOutOfStock}
                          className={`size-option ${selectedSize === size ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                          onClick={() => !isOutOfStock && setSelectedSize(s => s === size ? '' : size)}
                        >
                          {size}
                          {isOutOfStock && <span className="out-of-stock-label">Hết</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="product-detail__actions">
              {product.inStock && (
                <>
                  <div className="product-detail__qty">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                    <span>{quantity}</span>
                    <button 
                      disabled={(() => {
                        const variant = product.variants?.find(v => v.size === selectedSize);
                        const maxStock = variant ? variant.stockQuantity : product.stockQuantity;
                        return quantity >= maxStock;
                      })()}
                      onClick={() => {
                        const variant = product.variants?.find(v => v.size === selectedSize);
                        const maxStock = variant ? variant.stockQuantity : product.stockQuantity;
                        if (quantity < maxStock) {
                          setQuantity(q => q + 1);
                        }
                      }}
                    >+</button>
                  </div>
                <button
                  className={`btn-primary product-detail__add-btn ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  {added ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Đã thêm!
                    </>
                  ) : 'Thêm vào giỏ hàng'}
                </button>
                </>
              )}

              <button
                onClick={() => toggleFavorite(product)}
                aria-label="Thêm vào yêu thích"
                style={{
                  width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer',
                  background: 'transparent', transition: 'all 0.3s ease',
                  color: isFavorite(product.id) ? 'var(--color-gold)' : 'var(--color-text)',
                  borderColor: isFavorite(product.id) ? 'var(--color-gold)' : 'var(--color-border)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            </div>

            {/* Features */}
            <div className="product-detail__features">
              {['Miễn phí vận chuyển từ 10tr', 'Bảo hành vĩnh viễn', 'Đổi trả 30 ngày'].map(f => (
                <div key={f} className="product-detail__feature">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabbed Section */}
        <div className="product-detail__tabs-section">
          <div className="product-detail__tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'policy' ? 'active' : ''}`}
              onClick={() => setActiveTab('policy')}
            >
              Chính sách hậu mãi
            </button>
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả sản phẩm
            </button>
            <button 
              className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              Câu hỏi thường gặp
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá ({reviews.length})
            </button>
          </div>

          <div className="product-detail__tabs-content">
            {activeTab === 'policy' && (
              <div className="tab-content policy-content">
                <div className="policy-group">
                  <h4>Chế độ bảo hành</h4>
                  <ul>
                    <li>Làm sạch, siêu âm trang sức miễn phí trọn đời.</li>
                    <li>Bảo hành lỗi kỹ thuật, nước xi 6 tháng (Vàng) và 3 tháng (Bạc).</li>
                    <li>Khắc tên miễn phí theo yêu cầu linh hoạt.</li>
                  </ul>
                </div>
                <div className="policy-group">
                  <h4>Chính sách thu đổi</h4>
                  <ul>
                    <li>Áp dụng thu đổi trên toàn quốc theo bảng giá hiện hành.</li>
                    <li>Không áp dụng thu đổi cho các dòng trang sức Bạc, Đồng hồ.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="tab-content description-content">
                <div className="description-text">
                  {product.description}
                </div>
                {product.originStory && (
                  <div className="origin-story">
                    <h4>Câu chuyện thiết kế</h4>
                    <p>{product.originStory}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="tab-content faq-content">
                <div className="product-faq-list">
                  {productFaqs.map(faq => (
                    <div key={faq.id} className={`product-faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                      <button 
                        className="product-faq-header"
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className="faq-chevron" />
                      </button>
                      <div className="product-faq-body">
                        <div className="product-faq-answer">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Link to="/faq" className="view-more-faq">Xem tất cả các câu hỏi khác</Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content reviews-content">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {isAuthenticated ? (
                    <form onSubmit={submitReview} className="review-form">
                      <h4 style={{ marginBottom: 16 }}>Viết đánh giá của bạn</h4>
                      <div className="form-group">
                        <select 
                           value={newReview.rating} 
                           onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                           className="form-control"
                           style={{ width: '150px' }}
                        >
                           <option value="5">5 Sao (Tuyệt vời)</option>
                           <option value="4">4 Sao (Khá tốt)</option>
                           <option value="3">3 Sao (Bình thường)</option>
                           <option value="2">2 Sao (Kém)</option>
                           <option value="1">1 Sao (Tệ)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <textarea 
                          placeholder="Nhận xét của bạn về sản phẩm này..." 
                          className="form-control"
                          rows={4}
                          value={newReview.comment}
                          onChange={e => setNewReview({...newReview, comment: e.target.value})}
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary">Gửi đánh giá</button>
                    </form>
                  ) : (
                    <div style={{ padding: 24, background: '#f5f5f5', textAlign: 'center', marginBottom: 32, borderRadius: 8 }}>
                      Vui lòng đăng nhập để đánh giá sản phẩm.
                    </div>
                  )}

                  <div className="reviews-list">
                     {reviews.length === 0 ? (
                       <p style={{ textAlign: 'center', color: '#666', marginTop: 32 }}>Chưa có đánh giá nào cho sản phẩm này.</p>
                     ) : reviews.map(r => (
                       <div key={r.id} className="review-item" style={{ borderBottom: '1px solid #eee', padding: '24px 0' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                           <strong>{r.userName}</strong>
                           <span style={{ color: '#999', fontSize: 14 }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                         </div>
                         <div style={{ color: 'var(--color-gold)', marginBottom: 8 }}>
                           {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                         </div>
                         <p style={{ margin: 0, color: '#444' }}>{r.comment}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="product-detail__related">
            <div className="section__header">
              <p className="section__subtitle">Có thể bạn thích</p>
              <h2 className="section__title">Sản Phẩm Liên Quan</h2>
              <div className="divider" />
            </div>
            <div className="products-grid">
              {related.map(p => (<ProductCard key={p.id} product={p} />))}
            </div>
          </section>
        )}
      </div>
      
      <SizeGuideDrawer 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        availableSizes={product.availableSizes || []}
        selectedSize={selectedSize}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
};

export default ProductDetailPage;
