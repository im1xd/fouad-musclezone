'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { t } from '@/lib/i18n'
import { ShoppingBag, Search, Menu, X, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
  const { lang, setLang, count, toggleCart } = useCartStore()
  const tr = t[lang]
  const cartCount = count()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const navLinks = [
    { href: '/', label: lang === 'ar' ? 'الرئيسية' : 'Accueil' },
    { href: '/#products', label: tr.allProducts },
    { href: '/track', label: tr.trackOrder },
    { href: '/contact', label: tr.contactUs },
  ]

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 99,
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'var(--black)',
        borderBottom: '1px solid var(--gray1)',
        backdropFilter: 'blur(12px)',
        transition: 'background 0.3s'
      }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between" style={{ height: '60px', padding: '0 16px' }}>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              border: '2px solid var(--orange)',
              overflow: 'hidden', flexShrink: 0,
              background: 'var(--dark2)'
            }}>
              <img
                src="/logo.jpg"
                alt="Fouad Muscle Zone"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:var(--orange)">FMZ</div>'
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--white)', lineHeight: 1.1, fontFamily: 'Barlow Condensed, Cairo, sans-serif', letterSpacing: '0.5px' }}>
                FOUAD MUSCLE ZONE
              </div>
              <div style={{ fontSize: '10px', color: 'var(--orange)', fontWeight: 600 }}>
                {lang === 'ar' ? 'مكملات غذائية أصلية' : 'Compléments authentiques'}
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} style={{ color: 'var(--gray5)', fontWeight: 600, fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--orange)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray5)')}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            {/* LANG TOGGLE */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              style={{
                background: 'var(--dark3)', border: '1px solid var(--gray1)',
                borderRadius: '6px', padding: '4px 10px',
                color: 'var(--gray5)', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {lang === 'ar' ? 'FR' : 'AR'}
            </button>

            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen(s => !s)}
              style={{ background: 'none', border: 'none', color: 'var(--gray5)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
            >
              <Search size={19} />
            </button>

            {/* CART */}
            <button
              onClick={toggleCart}
              style={{ background: 'none', border: 'none', color: 'var(--gray5)', cursor: 'pointer', padding: '6px', position: 'relative', display: 'flex', alignItems: 'center' }}
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 0, insetInlineEnd: 0,
                  background: 'var(--orange)', color: '#fff',
                  fontSize: '10px', fontWeight: 800,
                  width: 17, height: 17, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1
                }}>{cartCount}</span>
              )}
            </button>

            {/* MOBILE MENU */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', color: 'var(--gray5)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid var(--gray1)', padding: '10px 16px', background: 'var(--dark2)' }}>
            <div className="max-w-2xl mx-auto">
              <input
                autoFocus
                className="form-input-dark"
                placeholder={lang === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
                value={searchQ}
                onChange={e => {
                  setSearchQ(e.target.value)
                  if (e.target.value) {
                    window.location.href = `/#products`
                  }
                }}
                onKeyDown={e => { if (e.key === 'Enter') setSearchOpen(false) }}
              />
            </div>
          </div>
        )}

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ background: 'var(--dark2)', borderTop: '1px solid var(--gray1)', padding: '8px 0' }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '12px 20px', color: 'var(--gray5)', fontWeight: 600, fontSize: '15px', textDecoration: 'none', borderBottom: '1px solid var(--gray1)' }}>
                {l.label}
              </Link>
            ))}
            <a href="https://wa.me/213660445532" target="_blank"
              style={{ display: 'block', padding: '12px 20px', color: '#25D366', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
              💬 WhatsApp: 0660 44 55 32
            </a>
          </div>
        )}
      </nav>
    </>
  )
}
