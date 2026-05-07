'use client'
import { useCartStore } from '@/store/cart'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQty, subtotal, lang } = useCartStore()
  const total = subtotal()
  const deliveryFree = total >= 5000
  const deliveryPrice = deliveryFree ? 0 : 400

  if (!isOpen) return null

  return (
    <>
      {/* OVERLAY */}
      <div onClick={toggleCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, backdropFilter: 'blur(3px)' }} />

      {/* SIDEBAR */}
      <div className="cart-open" style={{
        position: 'fixed', top: 0, insetInlineEnd: 0,
        width: 'min(360px, 100vw)', height: '100vh',
        background: 'var(--dark2)', borderInlineStart: '1px solid var(--gray1)',
        zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.5)'
      }}>
        {/* HEADER */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--gray1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--orange)' }} />
            <span style={{ fontWeight: 800, fontSize: '17px' }}>{lang === 'ar' ? 'سلة المشتريات' : 'Panier'}</span>
            {items.length > 0 && <span style={{ background: 'var(--orange)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>{items.length}</span>}
          </div>
          <button onClick={toggleCart} style={{ background: 'none', border: 'none', color: 'var(--gray5)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray4)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{lang === 'ar' ? 'السلة فارغة' : 'Panier vide'}</div>
              <button onClick={toggleCart} style={{ background: 'var(--orange)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '12px', fontFamily: 'Cairo, sans-serif' }}>
                {lang === 'ar' ? 'تسوق الآن' : 'Acheter maintenant'}
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const img = item.primaryImage || item.product.product_images?.[0]?.url
              return (
                <div key={idx} style={{ background: 'var(--dark3)', borderRadius: '10px', padding: '12px', marginBottom: '8px', border: '1px solid var(--gray1)', display: 'flex', gap: '10px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '8px', background: 'var(--dark4)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {img ? <img src={img} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '24px' }}>💪</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lang === 'fr' && item.product.name_fr ? item.product.name_fr : item.product.name}
                    </div>
                    {(item.flavor || item.size) && (
                      <div style={{ fontSize: '11px', color: 'var(--gray4)', marginBottom: '4px' }}>
                        {[item.flavor, item.size].filter(Boolean).join(' / ')}
                      </div>
                    )}
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--orange)', marginBottom: '6px' }}>
                      {(item.product.price * item.quantity).toLocaleString()} دج
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1, item.flavor, item.size)} style={{ background: 'var(--dark4)', border: '1px solid var(--gray1)', color: 'var(--white)', width: 26, height: 26, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={13} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1, item.flavor, item.size)} style={{ background: 'var(--dark4)', border: '1px solid var(--gray1)', color: 'var(--white)', width: 26, height: 26, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={13} />
                      </button>
                      <button onClick={() => removeItem(item.product.id, item.flavor, item.size)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: '4px', marginInlineStart: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--gray1)' }}>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray4)', marginBottom: '4px' }}>
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Sous-total'}</span>
                <span>{total.toLocaleString()} دج</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray4)', marginBottom: '8px' }}>
                <span>{lang === 'ar' ? 'التوصيل' : 'Livraison'}</span>
                <span style={{ color: deliveryFree ? 'var(--green)' : 'var(--white)' }}>
                  {deliveryFree ? (lang === 'ar' ? '🎉 مجاني' : '🎉 Gratuite') : `${deliveryPrice.toLocaleString()} دج`}
                </span>
              </div>
              {!deliveryFree && (
                <div style={{ fontSize: '11px', color: 'var(--gray4)', background: 'var(--dark3)', padding: '6px 10px', borderRadius: '6px', marginBottom: '8px' }}>
                  {lang === 'ar' ? `أضف ${(5000 - total).toLocaleString()} دج للحصول على توصيل مجاني 🎉` : `Ajoutez ${(5000 - total).toLocaleString()} DA pour la livraison gratuite 🎉`}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 800, paddingTop: '8px', borderTop: '1px solid var(--gray1)' }}>
                <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span style={{ color: 'var(--orange)' }}>{(total + deliveryPrice).toLocaleString()} دج</span>
              </div>
            </div>
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: 'var(--green)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💵 {lang === 'ar' ? 'الدفع عند الاستلام — آمن وبسيط' : 'Paiement à la livraison — Sûr et simple'}
            </div>
            <Link href="/checkout" onClick={toggleCart} style={{ display: 'block', background: 'var(--orange)', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: '10px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange-dark)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}>
              {lang === 'ar' ? 'إتمام الطلب ←' : 'Commander →'}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
