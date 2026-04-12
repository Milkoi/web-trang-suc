import React, { useState } from 'react';
import { ProductFilters } from '../../types';
import './ProductFilter.css';

interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  totalResults: number;
}

const CATEGORIES = [
  { id: 'necklace', label: 'Dây Chuyền' },
  { id: 'ring', label: 'Nhẫn' },
  { id: 'bracelet', label: 'Lắc Tay' },
  { id: 'anklet', label: 'Lắc Chân' },
  { id: 'earring', label: 'Bông Tai' },
];

const MATERIALS = [
  { id: 'gold', label: 'Vàng' },
  { id: 'silver', label: 'Bạc' },
  { id: 'platinum', label: 'Bạch Kim' },
  { id: 'diamond', label: 'Kim Cương' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact', compactDisplay: 'short' }).format(price);

const ProductFilter: React.FC<ProductFilterProps> = ({ filters, onFilterChange, totalResults }) => {
  const [openSections, setOpenSections] = useState<string[]>(['category', 'material', 'price']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleCategory = (id: string) => {
    const cats = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id];
    onFilterChange({ ...filters, categories: cats });
  };

  const toggleMaterial = (id: string) => {
    const mats = filters.materials.includes(id)
      ? filters.materials.filter(m => m !== id)
      : [...filters.materials, id];
    onFilterChange({ ...filters, materials: mats });
  };

  const clearAll = () => {
    onFilterChange({
      categories: [],
      materials: [],
      priceRange: [0, 50000000],
      inStock: false,
      isNew: false,
      isSale: false,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.inStock ||
    filters.isNew ||
    filters.isSale ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 50000000;

  return (
    <aside className="product-filter">
      {/* Header */}
      <div className="product-filter__header">
        <h3 className="product-filter__title">Bộ Lọc</h3>
        <span className="product-filter__results">{totalResults} sản phẩm</span>
        {hasActiveFilters && (
          <button className="product-filter__clear" onClick={clearAll}>
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Category */}
      <div className="filter-section">
        <button
          className="filter-section__toggle"
          onClick={() => toggleSection('category')}
        >
          <span>Danh Mục</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={openSections.includes('category') ? 'rotate-180' : ''}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {openSections.includes('category') && (
          <div className="filter-section__content">
            {CATEGORIES.map(cat => (
              <label key={cat.id} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                <span className="filter-checkbox__box" />
                <span className="filter-checkbox__label">{cat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div className="filter-section">
        <button
          className="filter-section__toggle"
          onClick={() => toggleSection('material')}
        >
          <span>Chất Liệu</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={openSections.includes('material') ? 'rotate-180' : ''}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {openSections.includes('material') && (
          <div className="filter-section__content">
            {MATERIALS.map(mat => (
              <label key={mat.id} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(mat.id)}
                  onChange={() => toggleMaterial(mat.id)}
                />
                <span className="filter-checkbox__box" />
                <span className="filter-checkbox__label">{mat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <button
          className="filter-section__toggle"
          onClick={() => toggleSection('price')}
        >
          <span>Khoảng Giá</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={openSections.includes('price') ? 'rotate-180' : ''}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {openSections.includes('price') && (
          <div className="filter-section__content">
            <div className="filter-price">
              <div className="filter-price__labels">
                <span>{formatPrice(filters.priceRange[0])}₫</span>
                <span>{formatPrice(filters.priceRange[1])}₫</span>
              </div>
              <input
                type="range"
                className="filter-price__slider"
                min={0}
                max={50000000}
                step={500000}
                value={filters.priceRange[1]}
                onChange={e =>
                  onFilterChange({ ...filters, priceRange: [filters.priceRange[0], +e.target.value] })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="filter-section">
        <button
          className="filter-section__toggle"
          onClick={() => toggleSection('status')}
        >
          <span>Trạng Thái</span>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={openSections.includes('status') ? 'rotate-180' : ''}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {openSections.includes('status') && (
          <div className="filter-section__content">
            {[
              { key: 'inStock', label: 'Còn hàng' },
              { key: 'isNew', label: 'Hàng mới' },
              { key: 'isSale', label: 'Đang giảm giá' },
            ].map(({ key, label }) => (
              <label key={key} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters[key as keyof ProductFilters] as boolean}
                  onChange={e => onFilterChange({ ...filters, [key]: e.target.checked })}
                />
                <span className="filter-checkbox__box" />
                <span className="filter-checkbox__label">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProductFilter;
