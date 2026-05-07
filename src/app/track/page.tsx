'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/shop/CartSidebar'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import { useCartStore } from '@/store/cart'

const STATUS_STEPS = ['new','accepted','preparing','shipped','delivered']
const STATUS_LABELS: any = {
  ar: { new:'طلب جديد', accepted:'مقبول', preparing:'قيد التحضير', shipped:'تم الإرسال', delivered:'تم التسليم', cancelled:'ملغي' },
  fr: { new:'Nouvelle commande', accepted:'Acceptée', preparing:'En préparation', shipped:'Expédiée', delivered:'Livrée', cancelled:'Annulée' }
}
const STATUS_ICONS: any = { new:'📋', accepted:'✅', preparing:'📦', shipped:'🚚', delivered:'🏠', cancelled:'❌' }

export default function TrackPage() {
  const lang = useCartStore(s => s.lang)
  const [query, setQuery] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')

  async function search() {
    if (!query && !phone) {
      setError(lang === 'ar' ? 'أدخل رقم الطلب أو رقم الهاتف' : 'Entrez le numéro de commande ou de téléphone')
      return
    }
    setLoading(true); setError(''); setOrder(null)
    try {
      const params = new URLSearchParams()
      if (query) params.set('order', query)
      if (phone) params.set('phone', phone)
      const res = await fetch(`/api/track?${params}`)
      const data = await res.json()
      if (!res.ok || !data.order) { setError(lang === 'ar' ? 'لم يتم العثور على الطلب' : 'Commande introuvable'); return }
      setOrder(data.order)
    } catch { setError(lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'Une erreur est survenue') }
    finally { setLoading(false) }
  }

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1
  const labels = STATUS_LABELS[lang]

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <AnnouncementBar /><Navbar /><CartSidebar /><WhatsappFloat />

      <div className="max-w-2xl mx-auto px-4 py-12 pb-20">
        {/* HEADER */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            {lang === 'ar' ? 'الطلبات' : 'COMMANDES'}
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif', fontSize: 'clamp(36px,8vw,64px)', fontWeight: 900, letterSpacing: '3px', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
            {lang === 'ar' ? 'تتبع الطلب' : 'SUIVI DE COMMANDE'}
          </h1>
          <p style={{ color: 'var(--gray4)', fontSize: '14px' }}>
            {lang === 'ar' ? 'أدخل رقم طلبك أو رقم هاتفك لمعرفة حالة التوصيل' : 'Entrez votre numéro de commande ou de téléphone pour suivre la livraison'}
          </p>
        </div>

        {/* SEARCH FORM */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--gray1)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === 'ar' ? 'رقم الطلب' : 'N° DE SUIVI'}
              </label>
              <input
                className="form-input-dark"
                placeholder="FF-20240101-XXXXXX"
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                style={{ direction: 'ltr', letterSpacing: '1px' }}
              />
            </div>
            <div style={{ color: 'var(--gray4)', fontWeight: 700, textAlign: 'center', paddingTop: '20px' }}>
              {lang === 'ar' ? 'أو' : 'OU'}
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {lang === 'ar' ? 'رقم الهاتف' : 'TÉLÉPHONE'}
              </label>
              <input
                className="form-input-dark"
                placeholder="06XXXXXXXX"
                value={phone} onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                type="tel" style={{ direction: 'ltr' }}
              />
            </div>
          </div>
          <button
            onClick={search} disabled={loading}
            style={{ width: '100%', padding: '13px', background: loading ? 'var(--gray2)' : 'var(--orange)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Cairo, sans-serif', transition: 'background 0.2s' }}
          >
            {loading ? <><div className="spinner" style={{ width: 20, height: 20 }} /></> : `🔍 ${lang === 'ar' ? 'تتبع' : 'Rechercher'}`}
          </button>
          {error && <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'var(--red)', fontSize: '13px', textAlign: 'center' }}>{error}</div>}
        </div>

        {/* RESULT */}
        {order && (
          <div style={{ animation: 'fadeInUp 0.4s ease' }}>
            {/* ORDER INFO */}
            <div style={{ background: 'var(--dark2)', border: '1px solid var(--gray1)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--gray4)', marginBottom: '4px' }}>{lang === 'ar' ? 'رقم الطلب' : 'N° de commande'}</div>
                  <div style={{ fontWeight: 800, fontSize: '17px', color: 'var(--orange)', fontFamily: 'monospace', letterSpacing: '1px' }}>{order.order_number}</div>
                </div>
                <div style={{ textAlign: 'end' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray4)', marginBottom: '4px' }}>{lang === 'ar' ? 'تاريخ الطلب' : 'Date'}</div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              {/* STATUS BADGE */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }} className={`status-${order.status}`}>
                <span>{STATUS_ICONS[order.status]}</span>
                <span>{labels[order.status] || order.status}</span>
              </div>

              {/* PROGRESS BAR */}
              {order.status !== 'cancelled' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', position: 'relative' }}>
                    {/* LINE */}
                    <div style={{ position: 'absolute', top: '16px', right: '16px', left: '16px', height: '3px', background: 'var(--gray1)', zIndex: 0 }} />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', height: '3px', background: 'var(--orange)', zIndex: 1, width: `calc(${Math.max(0, stepIdx) / (STATUS_STEPS.length - 1) * 100}% - 16px)`, transition: 'width 0.5s ease' }} />
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2, flex: 1 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: i <= stepIdx ? 'var(--orange)' : 'var(--dark3)', border: `2px solid ${i <= stepIdx ? 'var(--orange)' : 'var(--gray1)'}`, transition: 'all 0.3s', boxShadow: i === stepIdx ? '0 0 12px rgba(255,107,0,0.5)' : 'none' }}>
                          {i <= stepIdx ? '✓' : (i + 1)}
                        </div>
                        <div style={{ fontSize: '10px', color: i <= stepIdx ? 'var(--orange)' : 'var(--gray4)', fontWeight: i === stepIdx ? 800 : 600, textAlign: 'center', lineHeight: 1.3 }}>
                          {labels[s]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRACKING */}
              {order.tracking_number && (
                <div style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray4)', marginBottom: '6px' }}>{lang === 'ar' ? 'رقم التتبع' : 'N° de suivi'}</div>
                  <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '1px', color: 'var(--orange)', fontFamily: 'monospace', marginBottom: '8px' }}>{order.tracking_number}</div>
                  {order.tracking_url && (
                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', padding: '7px 16px', borderRadius: '7px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                      🔗 {lang === 'ar' ? 'تتبع الشحنة' : 'Suivre le colis'}
                    </a>
                  )}
                </div>
              )}

              {/* ITEMS */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gray5)', marginBottom: '10px' }}>{lang === 'ar' ? 'المنتجات المطلوبة' : 'Produits commandés'}</div>
                {(order.order_items || []).map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--gray1)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--gray5)', fontWeight: 600 }}>{item.product_name} ×{item.quantity}</span>
                    <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{item.total_price?.toLocaleString()} دج</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '16px', fontWeight: 800 }}>
                  <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span style={{ color: 'var(--orange)' }}>{order.total?.toLocaleString()} دج</span>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}
            <a href={`https://wa.me/213660445532?text=مرحباً، أريد الاستفسار عن طلبي رقم ${order.order_number}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '13px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
              💬 {lang === 'ar' ? 'تواصل مع الدعم عبر واتساب' : 'Contacter le support WhatsApp'}
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
