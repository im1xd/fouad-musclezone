'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  // Init dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function applyTheme(dark: boolean) {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(newDark);
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#products', label: 'جميع المنتجات' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} dir="rtl">
      <div className="nav-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-icon">💪</span>
          <span className="logo-text">
            <span className="logo-fouad">FOUAD</span>
            <span className="logo-zone"> MUSCLE ZONE</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? 'الوضع المضيء' : 'الوضع المظلم'}
            title={isDark ? 'الوضع المضيء' : 'الوضع المظلم'}
          >
            <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
          </button>

          {/* Language Switch */}
          <button className="lang-btn">FR</button>

          {/* Cart */}
          <Link href="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-bottom">
            <button onClick={toggleTheme} className="mobile-theme-btn">
              {isDark ? '☀️ الوضع المضيء' : '🌙 الوضع المظلم'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 64px;
          background: var(--navbar-bg, rgba(255,255,255,0.92));
          border-bottom: 1px solid var(--navbar-border, rgba(226,232,240,0.8));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon { font-size: 24px; }
        .logo-text { font-size: 14px; font-weight: 900; line-height: 1.1; }
        .logo-fouad { color: var(--accent, #f97316); display: block; }
        .logo-zone { color: var(--text-primary, #0f172a); font-size: 11px; display: block; }

        /* Links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (max-width: 768px) { .nav-links { display: none; } }
        .nav-link {
          padding: 8px 14px;
          border-radius: 10px;
          color: var(--text-secondary, #475569);
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--accent, #f97316);
          background: var(--accent-light, #fff7ed);
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--border, #e2e8f0);
          background: var(--bg-secondary, #f8fafc);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 18px;
        }
        .theme-toggle:hover {
          transform: rotate(20deg) scale(1.1);
          border-color: var(--accent, #f97316);
          background: var(--accent-light, #fff7ed);
        }
        .theme-icon { line-height: 1; }

        .lang-btn {
          padding: 6px 12px;
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 8px;
          background: var(--bg-secondary, #f8fafc);
          color: var(--text-secondary, #475569);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lang-btn:hover {
          border-color: var(--accent, #f97316);
          color: var(--accent, #f97316);
        }

        .cart-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--accent, #f97316);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.25s;
          font-size: 18px;
        }
        .cart-btn:hover { transform: scale(1.08); filter: brightness(1.1); }
        .cart-badge {
          position: absolute;
          top: -6px;
          left: -6px;
          background: #ef4444;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
        }
        @media (max-width: 768px) { .hamburger { display: flex; } }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-primary, #0f172a);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: var(--bg-primary, #fff);
          border-bottom: 1px solid var(--border, #e2e8f0);
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          padding: 12px 16px;
          border-radius: 10px;
          color: var(--text-primary, #0f172a);
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .mobile-link:hover {
          background: var(--accent-light, #fff7ed);
          color: var(--accent, #f97316);
        }
        .mobile-bottom {
          border-top: 1px solid var(--border, #e2e8f0);
          margin-top: 8px;
          padding-top: 8px;
        }
        .mobile-theme-btn {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--border, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-secondary, #f8fafc);
          color: var(--text-primary, #0f172a);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          text-align: right;
          transition: all 0.2s;
          font-family: inherit;
        }
        .mobile-theme-btn:hover {
          border-color: var(--accent, #f97316);
          color: var(--accent, #f97316);
          background: var(--accent-light, #fff7ed);
        }
      `}</style>
    </nav>
  );
}
