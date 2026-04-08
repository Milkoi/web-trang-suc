import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';
import { products } from '../../data/products';
import './HomePage.css';

const heroImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80';
const cat1 = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80';
const cat2 = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80';
const cat3 = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80';
const cat4 = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80';

const HomePage: React.FC = () => {
  const featuredProducts = products.filter(p => p.rating >= 4.7).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg">
          <img src={heroImage} alt="Luxury Jewelry" className="hero__image" />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content">
          <p className="hero__subtitle">Bộ sưu tập mới 2025</p>
          <h1 className="hero__title">
            Tinh Hoa<br />
            <em>Trang Sức Việt</em>
          </h1>
          <p className="hero__desc">
            Nơi hội tụ những kiệt tác từ bàn tay nghệ nhân lành nghề —<br />
            Sang trọng, tinh tế, vĩnh cửu.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn-primary hero__cta">
              Khám Phá Ngay
            </Link>
            <Link to="/products?isNew=true" className="hero__link">
              Hàng mới về →
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="hero__scroll">
          <span />
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section categories-section">
        <div className="container">
          <div className="section__header">
            <p className="section__subtitle">Khám phá theo danh mục</p>
            <h2 className="section__title">Bộ Sưu Tập</h2>
            <div className="divider" />
          </div>
          <div className="categories-grid">
            {[
              { img: cat1, label: 'Dây Chuyền', path: '/products?category=necklace' },
              { img: cat2, label: 'Nhẫn', path: '/products?category=ring' },
              { img: cat3, label: 'Lắc Tay', path: '/products?category=bracelet' },
              { img: cat4, label: 'Bông Tai', path: '/products?category=earring' },
            ].map(cat => (
              <Link to={cat.path} key={cat.label} className="category-card">
                <div className="category-card__image-wrap">
                  <img src={cat.img} alt={cat.label} className="category-card__image" />
                  <div className="category-card__overlay" />
                </div>
                <div className="category-card__label">
                  <span>{cat.label}</span>
                  <span className="category-card__arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHIPPING BANNER ===== */}
      <section className="shipping-banner">
        <div className="container">
          <div className="shipping-banner__inner">
            {[
              { icon: '🚚', title: 'Miễn Phí Vận Chuyển', desc: 'Đơn hàng từ 10.000.000₫' },
              { icon: '💎', title: 'Chính Hãng 100%', desc: 'Kiểm định chất lượng nghiêm ngặt' },
              { icon: '🔄', title: 'Đổi Trả 30 Ngày', desc: 'Không hài lòng, hoàn tiền ngay' },
              { icon: '✨', title: 'Bảo Hành Vĩnh Viễn', desc: 'Miễn phí đánh bóng & vệ sinh' },
            ].map(item => (
              <div key={item.title} className="shipping-banner__item">
                <span className="shipping-banner__icon">{item.icon}</span>
                <div>
                  <h4 className="shipping-banner__title">{item.title}</h4>
                  <p className="shipping-banner__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <p className="section__subtitle">Được yêu thích nhất</p>
            <h2 className="section__title">Sản Phẩm Nổi Bật</h2>
            <div className="divider" />
          </div>
          <div className="products-grid">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="section__footer">
            <Link to="/products" className="btn-outline">
              Xem Tất Cả Sản Phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STORY BANNER ===== */}
      <section className="story-banner">
        <div className="story-banner__content">
          <p className="section__subtitle" style={{ color: 'var(--color-gold-light)' }}>Câu chuyện của chúng tôi</p>
          <h2 className="story-banner__title">Nghệ Thuật<br />Từ Thế Hệ Này<br />Sang Thế Hệ Khác</h2>
          <p className="story-banner__desc">
            Hơn 20 năm kinh nghiệm trong nghề kim hoàn, chúng tôi tự hào mang đến 
            những tác phẩm trang sức đẳng cấp, được chế tác thủ công bởi những nghệ nhân tài hoa nhất Việt Nam.
          </p>
          <Link to="/about" className="btn-gold">
            Về Chúng Tôi
          </Link>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <p className="section__subtitle">Vừa ra mắt</p>
            <h2 className="section__title">Hàng Mới Về</h2>
            <div className="divider" />
          </div>
          <div className="products-grid">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="section__footer">
            <Link to="/products?isNew=true" className="btn-outline">
              Xem Tất Cả Hàng Mới
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
