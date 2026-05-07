'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSlider from '@/components/shop/HeroSlider'
import CartSidebar from '@/components/shop/CartSidebar'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import { demoProducts, demoCategories, demoBrands } from '@/lib/demo-data'
import type { Product, Category } from '@/lib/supabase'

const GoalsSection = dynamic(() => import('@/components/shop/GoalsSection'), { ssr: false })
const BrandsSection = dynamic(() => import('@/components/shop/BrandsSection'), { ssr: false })
const ProductsGrid = dynamic(() => import('@/components/shop/ProductsGrid'), { ssr: false })

export default function HomePage() {
  const lang = useCartStore(s => s.lang)
  const tr = t[lang]
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQ, setSearchQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const categories = demoCategories
  const products = demoProducts

  const filtered = products.filter(p => {
    if (p.is_hidden) return false
    if (activeCategory !== 'all' && p.category_id !== activeCategory) return false
    if (searchQ) {
      const q = searchQ.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.name_fr?.toLowerCase().includes(q)
    }
    return true
  })

  const featured = products.filter(p => p.is_featured && !p.is_hidden).slice(0, 4)
  const bestSellers = products.filter(p => p.is_best_seller && !p.is_hidden).slice(0, 4)

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />
      <CartSidebar />
      <WhatsappFloat />

      {/* HERO */}
      <HeroSlider />

      {/* STATS BAR */}
      <div style={{ background: 'var(--black)', borderTop: '1px solid var(--gray1)', borderBottom: '1px solid var(--gray1)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4" style={{}}>
          {[
            { num: '+500', label: lang === 'ar' ? 'منتج أصلي' : 'Produits authentiques', icon: '💊' },
            { num: '+10K', label: lang === 'ar' ? 'عميل راضٍ' : 'Clients satisfaits', icon: '🏆' },
            { num: '48h', label: lang === 'ar' ? 'أسرع توصيل' : 'Livraison rapide', icon: '🚚' },
            { num: '100%', label: lang === 'ar' ? 'منتجات أصلية' : 'Produits authentiques', icon: '✅' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-4 px-3 text-center" style={{ borderRight: i < 3 ? '1px solid var(--gray1)' : 'none' }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-black text-2xl" style={{ color: 'var(--orange)', fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif', letterSpacing: '1px' }}>{s.num}</div>
              <div className="text-xs" style={{ color: 'var(--gray4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-xl" style={{ borderInlineStart: '4px solid var(--orange)', paddingInlineStart: '12px' }}>
              ⭐ {tr.featured}
            </h2>
            <button onClick={() => setActiveCategory('all')} style={{ color: 'var(--orange)', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
              {lang === 'ar' ? 'الكل ←' : 'Voir tout →'}
            </button>
          </div>
          <ProductsGrid products={featured} lang={lang} />
        </section>
      )}

      {/* ALL PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 mt-10 pb-20" id="products">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-xl" style={{ borderInlineStart: '4px solid var(--orange)', paddingInlineStart: '12px' }}>
            {tr.allProducts}
          </h2>
          <button onClick={() => setShowSearch(s => !s)} style={{ background: 'var(--dark3)', border: '1px solid var(--gray1)', borderRadius: '8px', padding: '6px 12px', color: 'var(--gray4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            🔍 {tr.search}
          </button>
        </div>

        {showSearch && (
          <div className="mb-4">
            <input
              className="form-input-dark"
              placeholder={tr.searchPlaceholder}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* CATEGORY CHIPS */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              flexShrink: 0, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: activeCategory === 'all' ? 'var(--orange)' : 'var(--dark3)',
              border: `1px solid ${activeCategory === 'all' ? 'var(--orange)' : 'var(--gray1)'}`,
              color: activeCategory === 'all' ? '#fff' : 'var(--gray5)',
              transition: 'all 0.2s'
            }}
          >{tr.all}</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                background: activeCategory === cat.id ? 'var(--orange)' : 'var(--dark3)',
                border: `1px solid ${activeCategory === cat.id ? 'var(--orange)' : 'var(--gray1)'}`,
                color: activeCategory === cat.id ? '#fff' : 'var(--gray5)',
                transition: 'all 0.2s'
              }}
            >{lang === 'ar' ? cat.name : cat.name_fr}</button>
          ))}
        </div>

        <div className="mb-3 text-sm" style={{ color: 'var(--gray4)' }}>
          {filtered.length} {lang === 'ar' ? 'منتج' : 'produits'}
        </div>

        <ProductsGrid products={filtered} lang={lang} />
      </section>

      {/* GOALS */}
      <GoalsSection lang={lang} />

      {/* BRANDS */}
      <BrandsSection lang={lang} />

      <Footer />
    </div>
  )
}
