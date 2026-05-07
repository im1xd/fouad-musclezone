'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  name_fr?: string;
  slug: string;
  price: number;
  compare_price?: number;
  category: string;
  images: string[];
  in_stock: boolean;
  is_featured?: boolean;
  rating?: number;
  reviews_count?: number;
}

const CATEGORIES = [
  { key: 'all', label: 'الكل', icon: '🏪' },
  { key: 'Protein', label: 'بروتين', icon: '🥛' },
  { key: 'Creatine', label: 'كرياتين', icon: '⚡' },
  { key: 'Vitamins', label: 'فيتامينات', icon: '💊' },
  { key: 'Mass Gainer', label: 'ماس غاينر', icon: '💪' },
  { key: 'Fat Burner', label: 'حارق دهون', icon: '🔥' },
  { key: 'Pre-Workout', label: 'قبل التمرين', icon: '⚡' },
  { key: 'BCAA', label: 'أحماض أمينية', icon: '🧬' },
  { key: 'Accessories', label: 'إكسسوارات', icon: '🎽' },
];

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.name.includes(search) ||
      (p.name_fr && p.name_fr.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featured = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="products-page" dir="rtl">
      {/* ── Featured Section ── */}
      {featured.length > 0 && (
        <section className="featured-section" id="featured">
          <div className="section-header">
            <h2 className="section-title">
              <span className="star">⭐</span> منتجات مميزة
            </h2>
            <Link href="#products" className="see-all-link">
              الكل ←
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── All Products Section ── */}
      <section className="all-products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">جميع المنتجات</h2>
        </div>

        {/* Search */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="clear-btn">
              ✕
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="categories-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="products-count">
          {loading ? 'جاري التحميل...' : `${filtered.length} منتج`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <p>لا توجد منتجات في هذه الفئة</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .products-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ── Section Headers ── */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .section-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text-primary, #0f172a);
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }
        :global(html.dark) .section-title { color: #f1f5f9; }
        .star { font-size: 1.4rem; }
        .see-all-link {
          color: #f97316;
          font-weight: 700;
          text-decoration: none;
          font-size: 15px;
          transition: gap 0.2s;
        }
        .see-all-link:hover { text-decoration: underline; }

        /* ── Featured Grid ── */
        .featured-section {
          padding: 48px 0 32px;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        /* ── All Products ── */
        .all-products-section {
          padding: 32px 0 60px;
        }

        /* ── Search ── */
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--card-bg, #fff);
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 14px;
          padding: 12px 18px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        :global(html.dark) .search-bar {
          background: #1e293b;
          border-color: #334155;
        }
        .search-bar:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        .search-icon { font-size: 18px; }
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          background: transparent;
          color: var(--text-primary, #0f172a);
          font-family: inherit;
          direction: rtl;
        }
        :global(html.dark) .search-input { color: #f1f5f9; }
        .search-input::placeholder { color: #94a3b8; }
        .clear-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 14px;
          padding: 2px 6px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: #ef4444; }

        /* ── Categories ── */
        .categories-scroll {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 20px;
          scrollbar-width: none;
        }
        .categories-scroll::-webkit-scrollbar { display: none; }
        .cat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 100px;
          border: 1.5px solid var(--border, #e2e8f0);
          background: var(--card-bg, #fff);
          color: var(--text-muted, #64748b);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        :global(html.dark) .cat-btn {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }
        .cat-btn:hover {
          border-color: #f97316;
          color: #f97316;
          transform: translateY(-1px);
        }
        .cat-btn.active {
          background: #f97316;
          border-color: #f97316;
          color: #fff;
          box-shadow: 0 4px 14px rgba(249,115,22,0.35);
        }
        .cat-icon { font-size: 16px; }

        /* ── Count ── */
        .products-count {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 20px;
          font-weight: 600;
        }

        /* ── Grid ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        /* ── Skeleton ── */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .skeleton-card {
          height: 320px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        :global(html.dark) .skeleton-card {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Empty ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #64748b;
        }
        .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }

        @media (max-width: 640px) {
          .featured-grid,
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=75';

  return (
    <Link href={`/products/${product.slug}`} className={`product-card ${featured ? 'featured' : ''} ${!product.in_stock ? 'out-of-stock' : ''}`}>
      <div className="card-image-wrap">
        <img src={image} alt={product.name} className="card-image" loading="lazy" />
        {discount && <span className="discount-badge">-{discount}%</span>}
        {!product.in_stock && <div className="stock-overlay">نفذت الكمية</div>}
        {product.is_featured && <span className="featured-badge">⭐ مميز</span>}
      </div>
      <div className="card-body">
        <p className="card-category">{getCategoryLabel(product.category)}</p>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-price-row">
          <span className="card-price">{product.price.toLocaleString('ar-DZ')} دج</span>
          {product.compare_price && (
            <span className="card-compare">{product.compare_price.toLocaleString('ar-DZ')} دج</span>
          )}
        </div>
        <button className={`card-btn ${!product.in_stock ? 'disabled' : ''}`} disabled={!product.in_stock}>
          {product.in_stock ? 'اطلب الآن' : 'نفذ المخزون'}
        </button>
      </div>

      <style jsx>{`
        .product-card {
          background: var(--card-bg, #fff);
          border: 1.5px solid var(--border, #f1f5f9);
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          display: block;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        :global(html.dark) .product-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
          border-color: #f97316;
        }
        :global(html.dark) .product-card:hover {
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .product-card.out-of-stock { opacity: 0.7; }

        .card-image-wrap {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #f8fafc;
        }
        :global(html.dark) .card-image-wrap { background: #0f172a; }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .card-image { transform: scale(1.06); }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ef4444;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 20px;
        }
        .featured-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0,0,0,0.6);
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          backdrop-filter: blur(6px);
        }
        .stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.5);
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(2px);
        }

        .card-body {
          padding: 14px 16px;
        }
        .card-category {
          font-size: 11px;
          color: #f97316;
          font-weight: 700;
          text-transform: uppercase;
          margin: 0 0 4px;
          letter-spacing: 0.5px;
        }
        .card-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        :global(html.dark) .card-name { color: #f1f5f9; }
        .card-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .card-price {
          font-size: 17px;
          font-weight: 900;
          color: #f97316;
        }
        .card-compare {
          font-size: 13px;
          color: #94a3b8;
          text-decoration: line-through;
        }
        .card-btn {
          width: 100%;
          background: #f97316;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }
        .card-btn:hover:not(.disabled) {
          background: #ea6c0a;
          transform: scale(1.02);
        }
        .card-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </Link>
  );
}

function getCategoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label || key;
}
