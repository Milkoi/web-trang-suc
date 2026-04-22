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
  const [sort, setSort] = useState<SortOption>(() => {
    const s = searchParams.get('sort');
    return (s as SortOption) || 'newest';
  });
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const searchQuery = searchParams.get('q');
        const url = searchQuery ? `/products?search=${encodeURIComponent(searchQuery)}` : '/products';
        const response = await api.get(url);
        setProductsList(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams.get('q')]);

  // Sync URL params to filter
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const isNew = searchParams.get('isNew');
    const isSale = searchParams.get('isSale');

    setFilters((prev: ProductFilters) => ({
      ...prev,
      categories: cat ? [cat] : prev.categories,
      isNew: isNew === 'true' ? true : prev.isNew,
      isSale: isSale === 'true' ? true : prev.isSale,
    }));
  }, [searchParams]);

  const searchQuery = searchParams.get('q') || '';

  const filtered = useMemo(() => {
    let list = [...productsList];

    // Search filtering is now done by Backend

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
  let pageTitle = 'Tất Cả Sản Phẩm';
  let pageSubtitle = 'Khám phá bộ sưu tập trang sức tinh tế từ bàn tay nghệ nhân';

  if (searchQuery) {
    pageTitle = `Kết quả: "${searchQuery}"`;
    pageSubtitle = 'Các sản phẩm phù hợp với từ khóa tìm kiếm';
  } else if (filters.isSale) {
    pageTitle = 'Đang Giảm Giá';
    pageSubtitle = 'Khám phá các ưu đãi hấp dẫn nhất dành cho bạn';
  } else if (filters.isNew) {
    pageTitle = 'Hàng Mới Về';
    pageSubtitle = 'Những mẫu thiết kế mới nhất vừa được ra mắt';
  } else if (sort === 'popular' && !filters.categories.length && !filters.materials.length) {
    pageTitle = 'Sản Phẩm Nổi Bật';
    pageSubtitle = 'Những mẫu trang sức được yêu thích và đánh giá cao nhất';
  } else if (filters.categories.length === 1) {
    const slug = filters.categories[0];
    const catMap: Record<string, string> = {
      necklace: 'Dây Chuyền',
      ring: 'Nhẫn',
      bracelet: 'Lắc Tay',
      anklet: 'Lắc Chân',
      earring: 'Bông Tai'
    };
    pageTitle = catMap[slug] || `Danh mục: ${slug}`;
    pageSubtitle = 'Khám phá sản phẩm theo danh mục bạn chọn';
  }

  const absoluteMaxPrice = useMemo(() => {
    if (productsList.length === 0) return 0;
    const prices = productsList.flatMap(p => [
      p.price,
      ...(p.variants?.map(v => v.price) || [])
    ]).filter(p => typeof p === 'number' && !isNaN(p));
    
    const rawMax = prices.length > 0 ? Math.max(...prices) : 50000000;
    // Round up to nearest 1,000 to align with more precise slider step
    return Math.ceil(rawMax / 1000) * 1000;
  }, [productsList]);

  // Update price range filter when max price changes
  useEffect(() => {
    if (absoluteMaxPrice > 0) {
      setFilters(prev => {
        // If it's the initial load (still at default) or if current filter is out of bounds
        if (prev.priceRange[1] === DEFAULT_FILTERS.priceRange[1] || prev.priceRange[1] > absoluteMaxPrice) {
          return {
            ...prev,
            priceRange: [prev.priceRange[0], absoluteMaxPrice]
          };
        }
        return prev;
      });
    }
  }, [absoluteMaxPrice]);

  return (
    <div className="products-page page-content">
      {/* Page Header */}
      <div className="products-page__header">
        <div className="container">
          <h1 className="products-page__title">
            {pageTitle}
          </h1>
          <p className="products-page__subtitle">
            {pageSubtitle}
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
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            {filterOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}
          </button>
 
          {/* Sidebar */}
          <div className={`products-page__sidebar ${filterOpen ? 'products-page__sidebar--open' : ''}`}>
            <ProductFilter
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filtered.length}
              maxPriceLimit={absoluteMaxPrice}
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
