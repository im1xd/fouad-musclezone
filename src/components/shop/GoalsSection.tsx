'use client'
type Props = { lang: 'ar' | 'fr' }

const GOALS = [
  {
    id: 'bulking', emoji: '💪',
    ar: { title: 'زيادة الكتلة', sub: 'بروتين + ماس جينر', desc: 'باك مميز لزيادة الوزن وبناء العضلات بسرعة' },
    fr: { title: 'Prise de masse', sub: 'Protéine + Mass Gainer', desc: 'Pack spécial pour prendre du volume musculaire rapidement' },
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
    color: '#FF6B00',
  },
  {
    id: 'cutting', emoji: '🔥',
    ar: { title: 'التنشيف', sub: 'Fat Burner + BCAA', desc: 'احرق الدهون والحفاظ على كتلتك العضلية' },
    fr: { title: 'Sèche', sub: 'Fat Burner + BCAA', desc: 'Brûlez les graisses tout en préservant le muscle' },
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    color: '#ef4444',
  },
  {
    id: 'strength', emoji: '⚡',
    ar: { title: 'القوة والأداء', sub: 'كرياتين + Pre-Workout', desc: 'رفع الأثقال وتحسين أداءك الرياضي' },
    fr: { title: 'Force & Performance', sub: 'Créatine + Pré-workout', desc: 'Augmentez vos charges et améliorez vos performances' },
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
    color: '#7C3AED',
  },
  {
    id: 'health', emoji: '🌿',
    ar: { title: 'الصحة العامة', sub: 'فيتامينات + أوميغا 3', desc: 'تحسين المناعة والصحة العامة والحيوية' },
    fr: { title: 'Santé générale', sub: 'Vitamines + Oméga 3', desc: 'Améliorez votre immunité et votre vitalité' },
    img: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=400&q=80',
    color: '#22c55e',
  },
]

export default function GoalsSection({ lang }: Props) {
  return (
    <section style={{ padding: '40px 0', background: 'var(--black)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 style={{
          fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif',
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 900, letterSpacing: '3px',
          textAlign: 'center', marginBottom: '8px',
          color: '#fff'
        }}>
          {lang === 'ar' ? 'ما هو هدفك ؟' : "QUEL EST VOTRE OBJECTIF ?"}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--gray4)', marginBottom: '32px', fontSize: '14px' }}>
          {lang === 'ar' ? 'اختر هدفك واكتشف الباك المناسب لك' : 'Choisissez votre objectif et découvrez le pack idéal'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {GOALS.map(goal => {
            const content = goal[lang]
            return (
              <div key={goal.id} className="goal-card" style={{
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid var(--gray1)',
                cursor: 'pointer', position: 'relative',
                minHeight: '220px'
              }}>
                {/* BG IMAGE */}
                <img src={goal.img} alt={content.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)` }} />

                {/* CONTENT */}
                <div style={{ position: 'relative', zIndex: 2, padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{goal.emoji}</div>
                  <div style={{ display: 'inline-block', background: `${goal.color}22`, border: `1px solid ${goal.color}44`, color: goal.color, fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '10px', marginBottom: '8px', width: 'fit-content' }}>
                    {lang === 'ar' ? 'باك' : 'Pack'} {content.sub}
                  </div>
                  <h3 style={{ fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif', fontSize: '26px', letterSpacing: '2px', color: '#fff', marginBottom: '4px' }}>
                    {content.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--gray5)', lineHeight: 1.5 }}>{content.desc}</p>
                  <button style={{
                    marginTop: '12px', padding: '8px 16px', borderRadius: '6px',
                    background: goal.color, color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    width: 'fit-content', fontFamily: 'Cairo, sans-serif'
                  }}>
                    {lang === 'ar' ? 'اكتشف الباك ←' : 'Voir le pack →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
