'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  price?: string;
  accent: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=90',
    badge: '🔥 الأكثر مبيعاً',
    title: 'تفوق على حدودك',
    subtitle: 'أفضل بروتين واي أصلي بأسعار لا تُنافَس',
    cta: 'تسوق الآن',
    price: 'Whey Protein Gold Standard  4,500 دج',
    accent: '#f97316',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=90',
    badge: '💪 قوة مضاعفة',
    title: 'ابنِ جسمك بالعلم',
    subtitle: 'كرياتين مونوهيدرات للقوة والأداء الأمثل',
    cta: 'اكتشف المزيد',
    price: 'Creatine Monohydrate  2,800 دج',
    accent: '#3b82f6',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1400&q=90',
    badge: '⚡ Pre-Workout',
    title: 'انطلق بلا توقف',
    subtitle: 'طاقة انفجارية لكل تمرين — أداء على أعلى مستوى',
    cta: 'احصل عليه الآن',
    price: 'Pre-Workout Storm  3,200 دج',
    accent: '#a855f7',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=90',
    badge: '🏆 نتائج مضمونة',
    title: 'جسمك، أهدافك',
    subtitle: 'مكملات أصلية 100% مع ضمان الجودة والتوصيل لكل الجزائر',
    cta: 'تسوق الآن',
    price: 'Mass Gainer 5kg  5,500 دج',
    accent: '#10b981',
  },
];

interface HeroSliderProps {
  slides?: Slide[];
}

export default function HeroSlider({ slides = DEFAULT_SLIDES }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Sync dark mode with document
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  }, [isDark]);

  const slide = slides[current];

  return (
    <section className="hero-slider" dir="rtl">
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="mode-toggle"
        title={isDark ? 'الوضع المضيء' : 'الوضع المظلم'}
        aria-label="تبديل الوضع"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Background Images with Ken Burns */}
      <div className="slides-bg">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`slide-bg ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
        <div className="slide-overlay" />
      </div>

      {/* Content */}
      <div className={`slide-content ${isAnimating ? 'animating' : ''}`}>
        <span className="badge" style={{ '--accent': slide.accent } as React.CSSProperties}>
          {slide.badge}
        </span>

        <h1 className="slide-title">{slide.title}</h1>
        <p className="slide-subtitle">{slide.subtitle}</p>

        {slide.price && (
          <div className="price-tag">
            <span className="price-check">✅</span>
            {slide.price}
          </div>
        )}

        <div className="slide-badges">
          <span>✅ جودة مضمونة</span>
          <span>🚚 دفع عند الاستلام</span>
          <span>📦 توصيل سريع</span>
        </div>

        <div className="slide-actions">
          <Link href="#products" className="btn-primary" style={{ '--accent': slide.accent } as React.CSSProperties}>
            {slide.cta}
          </Link>
          <Link href="/track" className="btn-secondary">
            تتبع طلبي
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="slide-stats">
        {[
          { icon: '💊', num: '+500', label: 'منتج أصلي' },
          { icon: '🏆', num: '+10K', label: 'عميل راضٍ' },
          { icon: '🚚', num: '48h', label: 'أسرع توصيل' },
          { icon: '✅', num: '100%', label: 'منتجات أصلية' },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-num">{stat.num}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="slide-nav">
        <button onClick={prev} className="nav-btn nav-prev" aria-label="السابق">
          ‹
        </button>
        <div className="dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`dot ${i === current ? 'active' : ''}`}
              style={{ '--accent': slide.accent } as React.CSSProperties}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} className="nav-btn nav-next" aria-label="التالي">
          ›
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          key={current}
          style={{ '--accent': slide.accent } as React.CSSProperties}
        />
      </div>

      <style jsx>{`
        .hero-slider {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          font-family: 'Tajawal', 'Cairo', sans-serif;
        }

        /* ── Dark / Light theming ── */
        :global(html.dark) .hero-slider {
          --overlay-start: rgba(5, 10, 20, 0.75);
          --overlay-end: rgba(5, 10, 20, 0.4);
          --text-primary: #ffffff;
          --text-secondary: rgba(255,255,255,0.85);
          --stat-bg: rgba(255,255,255,0.08);
          --stat-border: rgba(255,255,255,0.15);
          --btn-sec-bg: rgba(255,255,255,0.1);
          --btn-sec-border: rgba(255,255,255,0.3);
          --btn-sec-color: #fff;
          --badge-bg: rgba(0,0,0,0.5);
          --price-bg: rgba(0,0,0,0.4);
        }
        :global(html.light) .hero-slider,
        :global(html:not(.dark)) .hero-slider {
          --overlay-start: rgba(240, 245, 255, 0.82);
          --overlay-end: rgba(240, 245, 255, 0.35);
          --text-primary: #0f172a;
          --text-secondary: #1e293b;
          --stat-bg: rgba(255,255,255,0.7);
          --stat-border: rgba(0,0,0,0.1);
          --btn-sec-bg: rgba(255,255,255,0.6);
          --btn-sec-border: rgba(0,0,0,0.2);
          --btn-sec-color: #0f172a;
          --badge-bg: rgba(255,255,255,0.7);
          --price-bg: rgba(255,255,255,0.6);
        }

        /* ── Mode Toggle ── */
        .mode-toggle {
          position: absolute;
          top: 80px;
          left: 20px;
          z-index: 50;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--stat-border, rgba(255,255,255,0.3));
          background: var(--stat-bg, rgba(255,255,255,0.1));
          font-size: 20px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mode-toggle:hover {
          transform: scale(1.1) rotate(15deg);
          background: rgba(255,255,255,0.25);
        }

        /* ── Background Slides ── */
        .slides-bg {
          position: absolute;
          inset: 0;
        }
        .slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.08);
          transition: opacity 0.9s ease, transform 0s;
        }
        .slide-bg.active {
          opacity: 1;
          transform: scale(1);
          animation: kenBurns 6s ease-in-out forwards;
        }
        @keyframes kenBurns {
          from { transform: scale(1.08); }
          to   { transform: scale(1.0); }
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            var(--overlay-start) 0%,
            var(--overlay-end) 60%,
            transparent 100%
          );
        }

        /* ── Content ── */
        .slide-content {
          position: absolute;
          top: 50%;
          right: 6%;
          transform: translateY(-50%);
          max-width: 600px;
          z-index: 10;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .slide-content.animating {
          opacity: 0;
          transform: translateY(calc(-50% + 20px));
        }

        .badge {
          display: inline-block;
          background: var(--badge-bg, rgba(0,0,0,0.5));
          color: var(--accent, #f97316);
          border: 1px solid var(--accent, #f97316);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          animation: fadeSlideDown 0.6s ease 0.1s both;
        }

        .slide-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: var(--text-primary, #fff);
          line-height: 1.15;
          margin: 0 0 12px;
          animation: fadeSlideDown 0.6s ease 0.2s both;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }

        .slide-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary, rgba(255,255,255,0.85));
          margin: 0 0 18px;
          animation: fadeSlideDown 0.6s ease 0.3s both;
        }

        .price-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--price-bg, rgba(0,0,0,0.4));
          color: var(--text-primary, #fff);
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 16px;
          backdrop-filter: blur(8px);
          animation: fadeSlideDown 0.6s ease 0.35s both;
        }

        .slide-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
          animation: fadeSlideDown 0.6s ease 0.4s both;
        }
        .slide-badges span {
          font-size: 13px;
          color: var(--text-secondary, rgba(255,255,255,0.85));
          background: var(--stat-bg, rgba(255,255,255,0.1));
          border: 1px solid var(--stat-border, rgba(255,255,255,0.2));
          border-radius: 20px;
          padding: 5px 12px;
          backdrop-filter: blur(6px);
        }

        .slide-actions {
          display: flex;
          gap: 14px;
          animation: fadeSlideDown 0.6s ease 0.5s both;
        }
        .btn-primary {
          background: var(--accent, #f97316);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 24px rgba(0,0,0,0.25);
          letter-spacing: 0.5px;
        }
        .btn-primary:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
          filter: brightness(1.1);
        }
        .btn-secondary {
          background: var(--btn-sec-bg, rgba(255,255,255,0.1));
          color: var(--btn-sec-color, #fff);
          border: 1.5px solid var(--btn-sec-border, rgba(255,255,255,0.3));
          border-radius: 14px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }
        .btn-secondary:hover {
          background: var(--btn-sec-bg);
          transform: translateY(-2px);
          filter: brightness(1.15);
        }

        /* ── Stats Bar ── */
        .slide-stats {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
          background: var(--stat-bg, rgba(255,255,255,0.08));
          border: 1px solid var(--stat-border, rgba(255,255,255,0.15));
          border-radius: 20px;
          padding: 14px 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 0 16px;
          border-left: 1px solid var(--stat-border, rgba(255,255,255,0.15));
        }
        .stat-item:last-child {
          border-left: none;
        }
        .stat-icon { font-size: 18px; }
        .stat-num {
          font-size: 18px;
          font-weight: 900;
          color: var(--text-primary, #fff);
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-secondary, rgba(255,255,255,0.7));
        }

        /* ── Navigation ── */
        .slide-nav {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 10;
        }
        .dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .dot.active {
          background: var(--accent, #f97316);
          width: 24px;
          border-radius: 4px;
        }
        .nav-btn {
          background: var(--stat-bg, rgba(255,255,255,0.1));
          border: 1px solid var(--stat-border, rgba(255,255,255,0.2));
          color: var(--text-primary, #fff);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.1);
        }

        /* ── Progress Bar ── */
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255,255,255,0.15);
          z-index: 20;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent, #f97316);
          animation: progress 5s linear forwards;
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── Animations ── */
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .slide-content {
            right: 5%;
            left: 5%;
            max-width: 100%;
            text-align: center;
          }
          .slide-badges {
            justify-content: center;
          }
          .slide-actions {
            justify-content: center;
            flex-wrap: wrap;
          }
          .slide-stats {
            flex-wrap: wrap;
            justify-content: center;
            width: 90%;
            bottom: 70px;
          }
          .stat-item {
            border-left: none;
            border-bottom: 1px solid var(--stat-border, rgba(255,255,255,0.15));
          }
          .mode-toggle {
            top: 70px;
            left: 10px;
          }
        }
      `}</style>
    </section>
  );
}
