'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import CartSidebar from '@/components/shop/CartSidebar'
import WhatsappFloat from '@/components/ui/WhatsappFloat'
import { useCartStore } from '@/store/cart'
import { WILAYAS } from '@/lib/algeria'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, lang, subtotal, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', phone2: '', wilaya: '', commune: '', address: '', notes: '' })

  const total = subtotal()
  const delivery = total >= 5000 ? 0 : 400
  const grand = total + delivery

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit() {
    if (!form.name || !form.phone || !form.wilaya || !form.commune || !form.address) {
      toast.error(lang === 'ar' ? 'يرجى ملء جميع الحقول الإلزامية' : 'Veuillez remplir tous les champs obligatoires')
      return
    }
    if (!/^(05|06|07)\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      toast.error(lang === 'ar' ? 'رقم الهاتف غير صحيح' : 'Numéro de téléphone invalide')
      return
    }
    if (!items.length) { toast.error('السلة فارغة'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subtotal: total, delivery_price: delivery, total: grand,
          items: items.map(i => ({
            product_id: i.product.id,
            product_name: i.product.name,
            product_image: i.primaryImage ?? i.product.product_images?.[0]?.url ?? null,
            quantity: i.quantity,
            unit_price: i.product.price,
            total_price: i.product.price * i.quantity,
            selected_flavor: i.flavor ?? null,
            selected_size: i.size ?? null,
          }))
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCart()
      router.push(`/success?order=${data.order_number}`)
    } catch (e: any) {
      toast.error(e.message || 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--dark3)', border: '1px solid var(--gray1)', borderRadius: '8px', padding: '11px 14px', color: 'var(--white)', fontFamily: 'Cairo, sans-serif', fontSize: '14px', outline: 'none', direction: 'rtl' }

  return (
    <div style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <AnnouncementBar /><Navbar /><CartSidebar /><WhatsappFloat />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '24px' }}>🛒 {lang === 'ar' ? 'إتمام الطلب' : 'Finaliser la commande'}</h1>

        {/* ORDER SUMMARY */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--gray1)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontWeight: 800, marginBottom: '12px' }}>{lang === 'ar' ? 'ملخص الطلب' : 'Récapitulatif'}</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray5)', marginBottom: '6px' }}>
              <span>{lang === 'fr' && item.product.name_fr ? item.product.name_fr : item.product.name} ×{item.quantity}</span>
              <span style={{ fontWeight: 700 }}>{(item.product.price * item.quantity).toLocaleString()} دج</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--gray1)', paddingTop: '10px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray4)', marginBottom: '4px' }}>
              <span>{lang === 'ar' ? 'التوصيل' : 'Livraison'}</span>
              <span style={{ color: delivery === 0 ? 'var(--green)' : 'inherit' }}>{delivery === 0 ? '🎉 مجاني' : `${delivery.toLocaleString()} دج`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px' }}>
              <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span style={{ color: 'var(--orange)' }}>{grand.toLocaleString()} دج</span>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--green)', fontWeight: 700 }}>
          💵 {lang === 'ar' ? 'الدفع عند الاستلام — لا حاجة لبطاقة بنكية' : 'Paiement à la livraison — Aucune carte requise'}
        </div>

        {/* FORM */}
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--gray1)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontWeight: 800, marginBottom: '16px', fontSize: '16px' }}>📋 {lang === 'ar' ? 'بيانات التوصيل' : 'Informations de livraison'}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'الاسم الكامل *' : 'Nom complet *'}</label>
              <input style={inputStyle} placeholder={lang === 'ar' ? 'محمد أمين...' : 'Mohamed Amine...'} value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}</label>
              <input style={{ ...inputStyle, direction: 'ltr' }} placeholder="06XXXXXXXX" value={form.phone} onChange={set('phone')} type="tel" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'الولاية *' : 'Wilaya *'}</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.wilaya} onChange={set('wilaya')}>
                <option value="">{lang === 'ar' ? 'اختر الولاية' : 'Choisir la wilaya'}</option>
                {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name} - {w.name_fr}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'البلدية *' : 'Commune *'}</label>
              <input style={inputStyle} placeholder={lang === 'ar' ? 'البلدية...' : 'Commune...'} value={form.commune} onChange={set('commune')} />
            </div>
          </div>

          <div className="mb-3">
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'العنوان التفصيلي *' : 'Adresse détaillée *'}</label>
            <input style={inputStyle} placeholder={lang === 'ar' ? 'رقم الحي، الشارع...' : 'Quartier, rue...'} value={form.address} onChange={set('address')} />
          </div>
          <div className="mb-3">
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'رقم هاتف ثاني (اختياري)' : 'Téléphone 2 (optionnel)'}</label>
            <input style={{ ...inputStyle, direction: 'ltr' }} placeholder="07XXXXXXXX" value={form.phone2} onChange={set('phone2')} type="tel" />
          </div>
          <div className="mb-5">
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray4)', display: 'block', marginBottom: '5px' }}>{lang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optionnel)'}</label>
            <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} placeholder={lang === 'ar' ? 'أي معلومات إضافية...' : 'Informations supplémentaires...'} value={form.notes} onChange={set('notes')} />
          </div>

          <button onClick={submit} disabled={loading || !items.length} style={{ width: '100%', padding: '15px', background: loading ? 'var(--gray2)' : 'var(--orange)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '17px', cursor: loading || !items.length ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Cairo, sans-serif', transition: 'background 0.2s' }}>
            {loading ? <><div className="spinner" style={{ width: 20, height: 20, marginInlineEnd: 8 }} /> {lang === 'ar' ? 'جاري الإرسال...' : 'Envoi...'}</> : `✅ ${lang === 'ar' ? `تأكيد الطلب — ${grand.toLocaleString()} دج` : `Confirmer — ${grand.toLocaleString()} DA`}`}
          </button>
        </div>
      </div>
    </div>
  )
}
