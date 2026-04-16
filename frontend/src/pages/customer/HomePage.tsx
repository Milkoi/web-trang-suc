import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../Components/product/ProductCard';
import api from '../../services/api';
import { Product } from '../../types';
import './HomePage.css';

interface CategoryData {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
}

interface BannerData {
  imageUrl: string;
  subtitle: string;
  title: string;
  description: string;
}

const INITIAL_CATEGORY_COUNT = 4;

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, bannerRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/banners/active').catch(() => ({ data: null })), // Fallback if no active banner
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        if (bannerRes.data) {
          setBanner(bannerRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products
    .filter(p => p.rating >= 4.7)
    .slice(0, 4);

  const newArrivals = products
    .filter(p => p.isNew)
    .slice(0, 4);

  const saleProducts = products
    .filter(p => p.isSale)
    .slice(0, 4);

  // Categories: show first 4, or all if "Xem tất cả" was clicked
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  const hasMoreCategories = categories.length > INITIAL_CATEGORY_COUNT;

  // Fallback banner content
  const currentBanner = banner || {
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    subtitle: 'Bộ sưu tập mới 2025',
    title: 'Tinh Hoa\nTrang Sức Việt',
    description: 'Nơi hội tụ những kiệt tác từ bàn tay nghệ nhân lành nghề —\nSang trọng, tinh tế, vĩnh cửu.'
  };

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg">
          <img src={currentBanner.imageUrl} alt="Luxury Jewelry" className="hero__image" />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content">
          <p className="hero__subtitle">{currentBanner.subtitle}</p>
          <h1 className="hero__title" dangerouslySetInnerHTML={{ __html: currentBanner.title.replace(/\n/g, '<br />') }} />
          <p className="hero__desc">
            {currentBanner.description}
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

          {loading ? (
            <div className="home-loading">
              <div className="home-loading__spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : categories.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Chưa có danh mục nào.</p>
          ) : (
            <>
              <div className="categories-grid">
                {visibleCategories.map(cat => (
                  <Link to={`/products?category=${cat.slug}`} key={cat.id} className="category-card">
                    <div className="category-card__image-wrap">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="category-card__image"
                        />
                      ) : (
                        <div className="category-card__placeholder" />
                      )}
                      <div className="category-card__overlay" />
                    </div>
                    <div className="category-card__label">
                      <span>{cat.name}</span>
                      <span className="category-card__arrow">→</span>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMoreCategories && !showAllCategories && (
                <div className="section__footer">
                  <button
                    className="btn-outline"
                    onClick={() => setShowAllCategories(true)}
                  >
                    Xem Tất Cả ({categories.length} danh mục)
                  </button>
                </div>
              )}
            </>
          )}
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
      {!loading && featuredProducts.length > 0 && (
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
      )}

      {/* ===== SALE SECTION ===== */}
      {!loading && saleProducts.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="container">
            <div className="section__header">
              <p className="section__subtitle">Ưu đãi hấp dẫn</p>
              <h2 className="section__title">Đang Giảm Giá</h2>
              <div className="divider" />
            </div>
            <div className="products-grid">
              {saleProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="section__footer">
              <Link to="/products?isSale=true" className="btn-outline">
                Xem Tất Cả Khuyến Mãi
              </Link>
            </div>
          </div>
        </section>
      )}

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
      {!loading && newArrivals.length > 0 && (
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
      )}
    </div>
  );
};

export default HomePage;
