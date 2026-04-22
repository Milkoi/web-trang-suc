import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../store/CartContext';
import { useFavorites } from '../../store/FavoritesContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + '₫';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [quickSize, setQuickSize] = useState<string>('');
  const [quickQuantity, setQuickQuantity] = useState<number>(1);
  const sizePickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sizePickerRef.current && !sizePickerRef.current.contains(event.target as Node)) {
        setShowSizePicker(false);
      }
    };

    if (showSizePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSizePicker]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.availableSizes && product.availableSizes.length > 0) {
      setShowSizePicker(true);
      return;
    }

    addToCart(product);
  };

  const handleAddSizeToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!quickSize) return;
    const selectedVariant = product.variants?.find(v => v.size === quickSize);
    addToCart(product, quickQuantity, quickSize, selectedVariant);
    setShowSizePicker(false);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* Image */}
      <div className="product-card__image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image product-card__image--primary"
          loading="lazy"
        />
        <img
          src={product.images[1] || product.images[0]}
          alt={product.name + ' alt'}
          className="product-card__image product-card__image--secondary"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          className={`product-card__fav-btn ${isFavorite(product.id) ? 'is-fav' : ''}`}
          onClick={handleToggleFav}
          aria-label="Thêm vào yêu thích"
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 10,
            background: 'white', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
            color: isFavorite(product.id) ? 'var(--color-gold)' : 'var(--color-text)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Badges */}
        <div className="product-card__badges">
          {product.isNew && <span className="badge-new">Mới</span>}
          {product.isSale && discountPct > 0 && (
            <span className="badge-sale">−{discountPct}%</span>
          )}
          {!product.inStock && (
            <span className="product-card__sold-out">Hết hàng</span>
          )}
        </div>

        {/* Quick Add */}
        {product.inStock && (
          <>
            <button
              className="product-card__add-btn"
              onClick={handleAddToCart}
              aria-label="Thêm vào giỏ hàng"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {product.availableSizes && product.availableSizes.length > 0 ? 'Chọn size' : 'Thêm vào giỏ'}
            </button>

            {showSizePicker && product.availableSizes && product.availableSizes.length > 0 && (
              <div className="product-card__size-picker" ref={sizePickerRef} onClick={e => e.stopPropagation()}>
                <div className="product-card__size-picker-title">Chọn kích thước</div>
                <div className="product-card__size-picker-options">
                  {product.availableSizes.map(size => {
                    const variant = product.variants?.find(v => v.size === size);
                    const isOutOfStock = variant ? (variant.stockQuantity || 0) <= 0 : !product.inStock;
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        className={`product-card__size-option ${quickSize === size ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isOutOfStock) {
                            setQuickSize(prev => prev === size ? '' : size);
                            setQuickQuantity(1); // Reset quantity when changing size
                          }
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div className="product-card__quantity-selector">
                  <span>Số lượng</span>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQuickQuantity(q => Math.max(1, q - 1));
                      }}
                    >
                      −
                    </button>
                    <span>{quickQuantity}</span>
                    <button
                      type="button"
                      disabled={(() => {
                        const variant = product.variants?.find(v => v.size === quickSize);
                        const maxStock = variant ? (variant.stockQuantity || 0) : (product.inStock ? (product.stockQuantity || 0) : 0);
                        return quickQuantity >= maxStock;
                      })()}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        const variant = product.variants?.find(v => v.size === quickSize);
                        const maxStock = variant ? (variant.stockQuantity || 0) : (product.inStock ? (product.stockQuantity || 0) : 0);
                        if (quickQuantity < maxStock) {
                          setQuickQuantity(q => q + 1);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="product-card__size-add-btn"
                  onClick={handleAddSizeToCart}
                  disabled={!quickSize}
                  style={{ opacity: !quickSize ? 0.5 : 1, cursor: !quickSize ? 'not-allowed' : 'pointer' }}
                >
                  {quickSize ? `Thêm ${quickQuantity} size ${quickSize}` : 'Vui lòng chọn kích thước'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="product-card__info">
        <p className="product-card__category">
          {product.category === 'necklace' ? 'Dây chuyền' :
            product.category === 'ring' ? 'Nhẫn' :
              product.category === 'bracelet' ? 'Lắc tay' :
                product.category === 'anklet' ? 'Lắc chân' : 'Bông tai'}
        </p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price-row">
          <span className={`product-card__price ${product.isSale ? 'price-sale' : ''}`}>
            {formatPrice(product.price)}
          </span>
          {(product.originalPrice ?? 0) > 0 && (
            <span className="price-original">{formatPrice(product.originalPrice!)}</span>
          )}
        </div>
        {product.rating > 0 && (
          <div className="product-card__rating">
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
            <span className="product-card__rating-count">({product.reviews})</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
