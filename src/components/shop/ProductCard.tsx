'use client'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import type { Product } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ShoppingCart, Zap } from 'lucide-react'

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const { lang, addItem } = useCartStore()
  const tr = t[lang]
  const img = product.product_images?.find(i => i.is_primary)?.url ?? product.product_images?.[0]?.url
  const inStock = product.is_available && product.quantity > 0
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round((1 - product.price / product.compare_price) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    addItem(product, 1, product.flavors?.[0], product.sizes?.[0])
    toast.success(lang === 'ar' ? 'تمت الإضافة للسلة 🛒' : 'Ajouté au panier 🛒')
  }

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="product-card" style={{
        background: '#181818', border: '1px solid #222', borderRadius: '12px',
        overflow: 'hidden', position: 'relative', height: '100%',
      }}>
        {/* BADGES */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {!inStock && (
            <span style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              {tr.outOfStock}
            </span>
          )}
          {discount > 0 && inStock && (
            <span style={{ background: '#22c55e22', border: '1px solid #22c55e', color: '#22c55e', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              -{discount}%
            </span>
          )}
          {product.is_best_seller && inStock && (
            <span style={{ background: '#FF6B0022', border: '1px solid #FF6B00', color: '#FF8C33', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              🔥 Best Seller
            </span>
          )}
          {product.is_featured && inStock && !product.is_best_seller && (
            <span style={{ background: '#7C3AED22', border: '1px solid #7C3AED', color: '#a78bfa', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              ⭐ Featured
            </span>
          )}
        </div>

        {/* IMAGE */}
        <div style={{
          width: '100%', aspectRatio: '1', background: '#111',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          position: 'relative',
        }}>
          {img ? (
            <img src={img} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease', filter: !inStock ? 'grayscale(50%)' : 'none'
            }} />
          ) : (
            <div style={{ fontSize: '52px', opacity: 0.4 }}>💪</div>
          )}
          {!inStock && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ background: '#ef4444', color: '#fff', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                {tr.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* INFO */}
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
            {product.categories?.name_fr ?? product.categories?.name ?? ''}
          </div>
          <div style={{
            fontSize: '14px', fontWeight: 700, color: '#f0f0f0',
            marginBottom: '8px', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {lang === 'ar' ? (product.name_fr ? product.name : product.name) : product.name_fr || product.name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FF6B00' }}>
                {product.price.toLocaleString()} دج
              </div>
              {product.compare_price && (
                <div style={{ fontSize: '12px', color: '#666', textDecoration: 'line-through' }}>
                  {product.compare_price.toLocaleString()} دج
                </div>
              )}
            </div>

            <button onClick={handleAddToCart} disabled={!inStock} style={{
              background: inStock ? '#FF6B00' : '#2a2a2a',
              border: 'none', color: inStock ? '#fff' : '#666',
              width: '36px', height: '36px', borderRadius: '8px',
              cursor: inStock ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s', flexShrink: 0
            }}>
              <ShoppingCart size={16} />
            </button>
          </div>

          {/* Stock indicator */}
          {inStock && product.quantity <= 5 && (
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={11} /> {lang === 'ar' ? `${product.quantity} وحدات فقط!` : `Plus que ${product.quantity}!`}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
