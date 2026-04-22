import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../Components/product/ProductCard';
import { useFavorites } from '../../store/FavoritesContext';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page section">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Danh sách cá nhân</p>
          <h2 className="section__title">Sản Phẩm Yêu Thích</h2>
          <div className="divider" />
        </div>

        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="1" style={{ marginBottom: '1rem' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.</p>
            <Link to="/products" className="btn-primary">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="products-grid">
            {favorites.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
