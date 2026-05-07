'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    bg: 'linear-gradient(135deg, #0a0500 0%, #1a0800 50%, #0d0400 100%)',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=85',
    overlay: 'rgba(255,107,0,0.08)',
    accent: '#FF6B00',
    tag: { ar: '🔥 الأكثر مبيعاً', fr: '🔥 Best-seller' },
    title: { ar: 'تفوق على\nحدودك', fr: 'DÉPASSEZ\nVOS LIMITES' },
    sub: { ar: 'أفضل بروتين واي أصلي بأسعار لا تُنافَس', fr: 'La meilleure whey protéine aux meilleurs prix' },
    btn: { ar: 'تسوق الآن', fr: 'Acheter maintenant' },
    href: '/#products',
    product: { ar: 'Whey Protein Gold Standard', fr: 'Whey Protein Gold Standard' },
    price: '4,500 دج',
  },
  {
    bg: 'linear-gradient(135deg, #050010 0%, #0f0520 50%, #050010 100%)',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=85',
    overlay: 'rgba(124,58,237,0.08)',
    accent: '#7C3AED',
    tag: { ar: '💪 قوة حقيقية', fr: '💪 Force réelle' },
    title: { ar: 'كرياتين\n100% نقي', fr: 'CRÉATINE\n100% PURE' },
    sub: { ar: 'زيادة القوة والطاقة أثناء التمرين', fr: 'Augmentez votre force et énergie à l\'entraînement' },
    btn: { ar: 'اكتشف الكرياتين', fr: 'Voir créatine' },
    href: '/#products',
    product: { ar: 'Creatine Monohydrate 300g', fr: 'Créatine Monohydrate 300g' },
    price: '2,800 دج',
  },
  {
    bg: 'linear-gradient(135deg, #000d05 0%, #001a0a 50%, #000d05 100%)',
    img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=700&q=85',
    overlay: 'rgba(34,197,94,0.06)',
    accent: '#22c55e',
    tag: { ar: '🔥 احرق الدهون', fr: '🔥 Brûlez les graisses' },
    title: { ar: 'تنشيف\naحترافي', fr: 'SÈCHE\nPROFESSIONNELLE' },
    sub: { ar: 'أفضل مكملات التنشيف في الجزائر', fr: 'Meilleurs compléments de sèche en Algérie' },
    btn: { ar: 'ابدأ التنشيف', fr: 'Commencer la sèche' },
    href: '/#products',
    product: { ar: 'Fat Burner Pro + L-Carnitine', fr: 'Fat Burner Pro + L-Carnitine' },
    price: '3,800 دج',
  },
]

export default function HeroSlider() {
  const lang = useCartStore(s => s.lang)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = () => go((current + 1) % SLIDES.length)
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [current])

  const slide = SLIDES[current]

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'clamp(380px, 55vw, 580px)', background: slide.bg, transition: 'background 0.8s ease' }}>
      {/* BG Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src={slide.img}
          alt=""
          className="hero-bg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: 0.3 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: slide.bg, opacity: 0.85 }} />
        <div style={{ position: 'absolute', inset: 0, background: slide.overlay }} />
      </div>

      {/* GRID PATTERN */}
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.6 }} />

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 2, padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', minHeight: 'inherit' }}>
        <div className="grid md:grid-cols-2 items-center w-full gap-8">

          {/* TEXT */}
          <div key={`text-${current}`} className="fade-in-up" style={{ order: lang === 'fr' ? 1 : 2 }}>
            <div className="delay-1 fade-in-up" style={{ display: 'inline-block', background: `rgba(${slide.accent === '#FF6B00' ? '255,107,0' : slide.accent === '#7C3AED' ? '124,58,237' : '34,197,94'},0.15)`, border: `1px solid ${slide.accent}30`, color: slide.accent, padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
              {slide.tag[lang]}
            </div>

            <h1 className="delay-2 fade-in-up" style={{
              fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif',
              fontSize: 'clamp(42px, 8vw, 80px)',
              fontWeight: 900,
              lineHeight: 1.0,
              color: '#fff',
              marginBottom: '16px',
              textShadow: `0 0 40px ${slide.accent}40`,
              whiteSpace: 'pre-line',
              letterSpacing: '2px',
            }}>
              {slide.title[lang]}
            </h1>

            <p className="delay-3 fade-in-up" style={{ color: 'var(--gray5)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6, maxWidth: '380px' }}>
              {slide.sub[lang]}
            </p>

            <div className="delay-4 fade-in-up flex items-center gap-3 flex-wrap">
              <a href={slide.href} style={{
                background: slide.accent, color: '#fff',
                padding: '13px 28px', borderRadius: '8px',
                fontWeight: 800, fontSize: '15px', textDecoration: 'none',
                display: 'inline-block', transition: 'transform 0.2s',
                boxShadow: `0 4px 20px ${slide.accent}40`,
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                {slide.btn[lang]}
              </a>
              <div style={{ color: 'var(--gray4)', fontSize: '13px' }}>
                <span style={{ color: 'var(--gray5)', fontWeight: 700 }}>{slide.product[lang]}</span>
                <br />
                <span style={{ color: slide.accent, fontWeight: 800, fontSize: '16px' }}>{slide.price}</span>
              </div>
            </div>

            {/* TRUST */}
            <div className="delay-4 fade-in-up flex items-center gap-4 mt-5 flex-wrap">
              {['✅ جودة مضمونة', '🚚 دفع عند الاستلام', '📦 توصيل سريع'].map((item, i) => (
                <span key={i} style={{ fontSize: '12px', color: 'var(--gray4)', display: 'flex', alignItems: 'center', gap: '4px' }}>{item}</span>
              ))}
            </div>
          </div>

          {/* PRODUCT IMAGE */}
          <div key={`img-${current}`} className="slide-in-right hidden md:flex items-center justify-center" style={{ order: lang === 'fr' ? 2 : 1 }}>
            <div style={{ position: 'relative', width: '280px', height: '280px' }}>
              <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: `radial-gradient(circle, ${slide.accent}20 0%, transparent 70%)`, animation: 'pulse-wa 3s infinite' }} />
              <img
                src={slide.img}
                alt={slide.product[lang]}
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))', position: 'relative', zIndex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ARROWS */}
      <button onClick={prev} style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gray1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <ChevronRight size={20} />
      </button>
      <button onClick={next} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gray1)', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}>
        <ChevronLeft size={20} />
      </button>

      {/* DOTS */}
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: '4px', background: i === current ? 'var(--orange)' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}
