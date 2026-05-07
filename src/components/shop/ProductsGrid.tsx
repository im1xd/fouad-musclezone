'use client'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/supabase'
import { ShoppingBag, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

type Props = { products: Product[]; lang: 'ar' | 'fr' }

export default function ProductsGrid({ products, lang }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.toggleCart)

  if (!products.length) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray4)' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
      <div style={{ fontWeight: 700 }}>{lang === 'ar' ? 'لا توجد منتجات' : 'Aucun produit trouvé'}</div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
      {products.map(p => {
        const img = p.product_images?.find(i => i.is_primary)?.url ?? p.product_images?.[0]?.url
        const inStock = p.is_available && p.quantity > 0
        const disc = p.compare_price && p.compare_price > p.price
          ? Math.round((1 - p.price / p.compare_price) * 100) : 0

        return (
          <div key={p.id} className="product-card" style={{
            background: 'var(--dark2)', border: '1px solid var(--gray1)',
            borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative'
          }}>
            {/* BADGES */}
            <div style={{ position: 'absolute', top: 8, insetInlineStart: 8, zIndex: 2, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {!inStock && <span style={{ background: 'var(--red)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px' }}>{lang === 'ar' ? 'نفذ' : 'Épuisé'}</span>}
              {p.is_best_seller && inStock && <span style={{ background: 'var(--orange)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px' }}>🔥 {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best-seller'}</span>}
              {disc > 0 && <span style={{ background: 'var(--green)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px' }}>-{disc}%</span>}
            </div>

            <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              {/* IMAGE */}
              <div style={{ aspectRatio: '1', background: 'var(--dark3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {img
                  ? <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  : <span style={{ fontSize: '48px' }}>💪</span>
                }
              </div>

              {/* INFO */}
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', marginBottom: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {lang === 'fr' && p.name_fr ? p.name_fr : p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--orange)' }}>{p.price.toLocaleString()} دج</span>
                  {p.compare_price && <span style={{ fontSize: '11px', color: 'var(--gray4)', textDecoration: 'line-through' }}>{p.compare_price.toLocaleString()}</span>}
                </div>
              </div>
            </Link>

            {/* ADD TO CART */}
            <div style={{ padding: '0 10px 10px' }}>
              <button
                disabled={!inStock}
                onClick={() => {
                  addItem(p)
                  toast.success(lang === 'ar' ? 'تمت الإضافة للسلة 🛒' : 'Ajouté au panier 🛒')
                }}
                style={{
                  width: '100%', padding: '8px', borderRadius: '8px',
                  background: inStock ? 'var(--orange)' : 'var(--gray2)',
                  color: inStock ? '#fff' : 'var(--gray4)',
                  border: 'none', cursor: inStock ? 'pointer' : 'not-allowed',
                  fontWeight: 700, fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'background 0.2s', fontFamily: 'Cairo, sans-serif'
                }}
              >
                <ShoppingBag size={14} />
                {!inStock ? (lang === 'ar' ? 'نفذت الكمية' : 'Rupture de stock') : (lang === 'ar' ? 'أضف للسلة' : 'Ajouter')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
