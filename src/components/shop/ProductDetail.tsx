'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/store/cart';

interface ProductVariant {
  flavor?: string;
  size?: string;
  price?: number;
  stock?: number;
}

interface Product {
  id: string;
  name: string;
  name_fr?: string;
  slug: string;
  price: number;
  compare_price?: number;
  category: string;
  images: string[];
  description?: string;
  in_stock: boolean;
  variants?: ProductVariant[];
  rating?: number;
  reviews_count?: number;
  weight?: string;
  brand?: string;
}

const CATEGORIES_LABELS: Record<string, string> = {
  Protein: 'بروتين',
  Creatine: 'كرياتين',
  Vitamins: 'فيتامينات',
  'Mass Gainer': 'ماس غاينر',
  'Fat Burner': 'حارق دهون',
  'Pre-Workout': 'قبل التمرين',
  BCAA: 'أحماض أمينية',
  Accessories: 'إكسسوارات',
};

export default function ProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (data) setProduct(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ProductSkeleton />;
  if (!product) return <NotFound />;

  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85',
  ];

  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  function handleAddToCart() {
    addItem({
      id: product!.id,
      name: product!.name,
      price: product!.price,
      image: images[0],
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="product-detail" dir="rtl">
      {/* ── Breadcrumb ── */}
      <div className="breadcrumb">
        <Link href="/" className="breadcrumb-link">الرئيسية</Link>
        <span className="breadcrumb-sep"> / </span>
        {/* "ما هو هدفك" تم نقله هنا ← زر "كل المنتجات" */}
        <Link href="/#products" className="breadcrumb-link all-products-btn">
          ← كل المنتجات
        </Link>
        <span className="breadcrumb-sep"> / </span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      {/* ── Main Content ── */}
      <div className="product-layout">
        {/* Images */}
        <div className="product-images">
          <div className="main-image-wrap">
            {discount && <span className="discount-badge">-{discount}%</span>}
            <img
              src={images[activeImage]}
              alt={product.name}
              className="main-image"
            />
          </div>
          {images.length > 1 && (
            <div className="thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`thumb ${i === activeImage ? 'active' : ''}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          {/* Category badge */}
          <span className="category-pill">
            {CATEGORIES_LABELS[product.category] || product.category}
          </span>

          <h1 className="product-name">{product.name}</h1>
          {product.name_fr && <p className="product-name-fr">{product.name_fr}</p>}

          {/* Rating */}
          {product.rating && (
            <div className="rating-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= Math.round(product.rating!) ? 'star-filled' : 'star-empty'}>★</span>
              ))}
              <span className="rating-count">({product.reviews_count || 0} تقييم)</span>
            </div>
          )}

          {/* Price */}
          <div className="price-block">
            <span className="price-main">{product.price.toLocaleString('ar-DZ')} دج</span>
            {product.compare_price && (
              <span className="price-old">{product.compare_price.toLocaleString('ar-DZ')} دج</span>
            )}
          </div>

          {/* Guarantees */}
          <div className="guarantees">
            <div className="guarantee-item">✅ جودة مضمونة 100%</div>
            <div className="guarantee-item">🚚 دفع عند الاستلام</div>
            <div className="guarantee-item">📦 توصيل سريع لكل الجزائر</div>
          </div>

          {/* Quantity */}
          <div className="qty-row">
            <label className="qty-label">الكمية:</label>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="cta-buttons">
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`btn-add-cart ${added ? 'added' : ''} ${!product.in_stock ? 'disabled' : ''}`}
            >
              {!product.in_stock ? 'نفذ المخزون' : added ? '✅ تمت الإضافة!' : '🛒 أضف للسلة'}
            </button>
            <Link
              href={`https://wa.me/213660445532?text=أريد طلب ${encodeURIComponent(product.name)} - ${product.price} دج`}
              target="_blank"
              className="btn-whatsapp"
            >
              💬 اطلب عبر واتساب
            </Link>
          </div>

          {/* Stock status */}
          <p className={`stock-status ${product.in_stock ? 'in' : 'out'}`}>
            {product.in_stock ? '🟢 متوفر في المخزون' : '🔴 نفذت الكمية'}
          </p>

          {/* ── "كل المنتجات" بدلاً من "ما هو هدفك" ── */}
          <div className="all-products-section">
            <h3 className="all-products-title">🛍️ تصفح كل المنتجات</h3>
            <p className="all-products-desc">اكتشف مجموعتنا الكاملة من المكملات الغذائية الأصلية</p>
            <Link href="/#products" className="btn-all-products">
              ← عودة لكل المنتجات
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-detail {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px 60px;
          font-family: 'Tajawal', 'Cairo', sans-serif;
        }

        /* ── Breadcrumb ── */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .breadcrumb-link {
          color: #f97316;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .breadcrumb-link:hover { text-decoration: underline; }
        .all-products-btn {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 4px 12px;
          font-weight: 700;
        }
        :global(html.dark) .all-products-btn {
          background: rgba(249,115,22,0.15);
          border-color: rgba(249,115,22,0.3);
        }
        .breadcrumb-sep { color: #cbd5e1; }
        .breadcrumb-current { color: #0f172a; font-weight: 600; }
        :global(html.dark) .breadcrumb-current { color: #f1f5f9; }

        /* ── Layout ── */
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .product-layout { grid-template-columns: 1fr; gap: 24px; }
        }

        /* ── Images ── */
        .product-images { position: relative; }
        .main-image-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 1;
          background: #f8fafc;
          margin-bottom: 12px;
        }
        :global(html.dark) .main-image-wrap { background: #1e293b; }
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .main-image-wrap:hover .main-image { transform: scale(1.04); }
        .discount-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #ef4444;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          z-index: 1;
        }
        .thumbs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .thumb {
          width: 70px;
          height: 70px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: #f8fafc;
          transition: border-color 0.2s;
        }
        .thumb.active { border-color: #f97316; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* ── Info ── */
        .product-info { display: flex; flex-direction: column; gap: 16px; }
        .category-pill {
          display: inline-block;
          background: #fff7ed;
          color: #f97316;
          border: 1px solid #fed7aa;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 13px;
          font-weight: 700;
          width: fit-content;
        }
        :global(html.dark) .category-pill {
          background: rgba(249,115,22,0.15);
          border-color: rgba(249,115,22,0.3);
        }
        .product-name {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
        }
        :global(html.dark) .product-name { color: #f1f5f9; }
        .product-name-fr { color: #64748b; font-size: 15px; margin: 0; }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 18px;
        }
        .star-filled { color: #fbbf24; }
        .star-empty { color: #e2e8f0; }
        .rating-count { font-size: 13px; color: #64748b; margin-right: 6px; }

        .price-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .price-main {
          font-size: 2rem;
          font-weight: 900;
          color: #f97316;
        }
        .price-old {
          font-size: 1.1rem;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .guarantees {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guarantee-item {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          background: var(--card-bg, #f8fafc);
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 14px;
        }
        :global(html.dark) .guarantee-item {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        .qty-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .qty-label { font-weight: 700; color: #0f172a; font-size: 15px; }
        :global(html.dark) .qty-label { color: #f1f5f9; }
        .qty-control {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        :global(html.dark) .qty-control { border-color: #334155; }
        .qty-btn {
          width: 38px;
          height: 38px;
          background: #f8fafc;
          border: none;
          font-size: 20px;
          cursor: pointer;
          font-weight: 700;
          color: #0f172a;
          transition: background 0.2s;
        }
        :global(html.dark) .qty-btn { background: #1e293b; color: #f1f5f9; }
        .qty-btn:hover { background: #f97316; color: #fff; }
        .qty-value {
          min-width: 44px;
          text-align: center;
          font-weight: 800;
          font-size: 16px;
          color: #0f172a;
          background: #fff;
          padding: 0 8px;
        }
        :global(html.dark) .qty-value { background: #0f172a; color: #f1f5f9; }

        .cta-buttons { display: flex; flex-direction: column; gap: 12px; }
        .btn-add-cart {
          padding: 16px 24px;
          background: #f97316;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }
        .btn-add-cart:hover:not(.disabled) {
          background: #ea6c0a;
          transform: scale(1.02);
        }
        .btn-add-cart.added { background: #10b981; }
        .btn-add-cart.disabled { background: #94a3b8; cursor: not-allowed; }
        .btn-whatsapp {
          padding: 14px 24px;
          background: #25d366;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s;
          display: block;
        }
        .btn-whatsapp:hover { background: #1ebe5d; transform: scale(1.02); }

        .stock-status { font-size: 14px; font-weight: 600; }
        .stock-status.in { color: #10b981; }
        .stock-status.out { color: #ef4444; }

        /* ── All Products Section (replaces "ما هو هدفك") ── */
        .all-products-section {
          background: linear-gradient(135deg, #fff7ed, #fef3c7);
          border: 1.5px solid #fed7aa;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-top: 8px;
        }
        :global(html.dark) .all-products-section {
          background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(251,191,36,0.08));
          border-color: rgba(249,115,22,0.25);
        }
        .all-products-title {
          font-size: 17px;
          font-weight: 800;
          color: #92400e;
          margin: 0 0 6px;
        }
        :global(html.dark) .all-products-title { color: #fbbf24; }
        .all-products-desc {
          font-size: 13px;
          color: #b45309;
          margin: 0 0 14px;
        }
        :global(html.dark) .all-products-desc { color: #d97706; }
        .btn-all-products {
          display: inline-block;
          background: #f97316;
          color: #fff;
          border-radius: 10px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-all-products:hover {
          background: #ea6c0a;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ height: 20, background: '#f1f5f9', borderRadius: 8, width: '40%', marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ aspectRatio: '1', background: '#f1f5f9', borderRadius: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[120, 60, 40, 80, 100].map((w, i) => (
            <div key={i} style={{ height: 24, background: '#f1f5f9', borderRadius: 8, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }} dir="rtl">
      <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>📦</span>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>المنتج غير موجود</h2>
      <Link href="/#products" style={{ color: '#f97316', fontWeight: 700, textDecoration: 'none' }}>
        ← عودة للمنتجات
      </Link>
    </div>
  );
}
