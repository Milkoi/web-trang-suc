import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../../data/products';
import { useCart } from '../../store/CartContext';
import ProductCard from '../../components/product/ProductCard';
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
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const disc = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
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
              <span className={`product-detail__price-current ${product.isSale ? 'price-sale' : ''}`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="price-original">{formatPrice(product.originalPrice)}</span>
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

            {/* Description */}
            <p className="product-detail__desc">{product.description}</p>

            {/* Quantity + Add to Cart */}
            {product.inStock && (
              <div className="product-detail__actions">
                <div className="product-detail__qty">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button
                  className={`btn-primary product-detail__add-btn ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
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
              </div>
            )}

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
    </div>
  );
};

export default ProductDetailPage;
