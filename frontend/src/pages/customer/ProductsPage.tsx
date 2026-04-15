import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../Components/product/ProductCard';
import ProductFilter from '../../Components/product/ProductFilter';
import api from '../../services/api';
import { Product, ProductFilters, SortOption } from '../../types';
import './ProductsPage.css';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
];

const DEFAULT_FILTERS: ProductFilters = {
  categories: [],
  materials: [],
  priceRange: [0, 500000000],
  inStock: false,
  isNew: false,
  isSale: false,
};

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const cat = searchParams.get('category');
    return cat ? { ...DEFAULT_FILTERS, categories: [cat] } : DEFAULT_FILTERS;
  });
  const [sort, setSort] = useState<SortOption>('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/products');
        setProductsList(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync URL params to filter
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const isNew = searchParams.get('isNew');
    setFilters((prev: ProductFilters) => ({
      ...prev,
      categories: cat ? [cat] : prev.categories,
      isNew: isNew === 'true' ? true : prev.isNew,
    }));
  }, [searchParams]);

  const searchQuery = searchParams.get('q') || '';

  const filtered = useMemo(() => {
    let list = [...productsList];

    // Search
    if (searchQuery) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      list = list.filter(p => filters.categories.includes(p.category));
    }

    // Materials
    if (filters.materials.length > 0) {
      list = list.filter(p => filters.materials.includes(p.material));
    }

    // Price
    list = list.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Status
    if (filters.inStock) list = list.filter(p => p.inStock);
    if (filters.isNew) list = list.filter(p => p.isNew);
    if (filters.isSale) list = list.filter(p => p.isSale);

    // Sort
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'popular': return list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      default: return list.sort((a, b) => b.id - a.id);
    }
  }, [filters, sort, searchQuery, productsList]);

  return (
    <div className="products-page page-content">
      {/* Page Header */}
      <div className="products-page__header">
        <div className="container">
          <h1 className="products-page__title">
            {searchQuery ? `Kết quả: "${searchQuery}"` : 'Tất Cả Sản Phẩm'}
          </h1>
          <p className="products-page__subtitle">
            Khám phá bộ sưu tập trang sức tinh tế từ bàn tay nghệ nhân
          </p>
        </div>
      </div>

      <div className="container">
        <div className="products-page__layout">
          {/* Mobile Filter Toggle */}
          <button
            className="products-page__filter-toggle"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            {filterOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}
          </button>

          {/* Sidebar */}
          <div className={`products-page__sidebar ${filterOpen ? 'products-page__sidebar--open' : ''}`}>
            <ProductFilter
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filtered.length}
            />
          </div>

          {/* Main Content */}
          <div className="products-page__main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <span className="products-toolbar__count">
                {filtered.length} sản phẩm
              </span>
              <div className="products-toolbar__sort">
                <label htmlFor="sort-select">Sắp xếp:</label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="products-toolbar__select"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="products-empty">
                <div className="products-empty__icon">💎</div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="products-grid--page">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
