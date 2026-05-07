'use client'
type Props = { lang: 'ar' | 'fr' }

const BRANDS = [
  { name: 'Optimum Nutrition', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Optimum_Nutrition_logo.svg/320px-Optimum_Nutrition_logo.svg.png' },
  { name: 'Dymatize', logo: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?w=120&q=80' },
  { name: 'MuscleTech', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/MuscleTech_logo.svg/320px-MuscleTech_logo.svg.png' },
  { name: 'Nutrex', logo: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=120&q=80' },
  { name: 'BioTechUSA', logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80' },
  { name: 'OstroVit', logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=120&q=80' },
  { name: 'Scitec Nutrition', logo: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=120&q=80' },
  { name: 'QNT', logo: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=120&q=80' },
]

export default function BrandsSection({ lang }: Props) {
  const repeated = [...BRANDS, ...BRANDS]
  return (
    <section style={{ padding: '36px 0', borderTop: '1px solid var(--gray1)', borderBottom: '1px solid var(--gray1)', overflow: 'hidden', background: 'var(--dark2)' }}>
      <div className="max-w-6xl mx-auto px-4 mb-5">
        <h2 style={{
          fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif',
          fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900,
          letterSpacing: '3px', textAlign: 'center', color: '#fff'
        }}>
          {lang === 'ar' ? 'الماركات العالمية' : 'MARQUES MONDIALES'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--gray4)', fontSize: '13px', marginTop: '4px' }}>
          {lang === 'ar' ? 'نتعامل فقط مع أفضل الماركات الأصلية' : 'Nous travaillons uniquement avec les meilleures marques authentiques'}
        </p>
      </div>

      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* fade edges */}
        <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, var(--dark2), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', insetInlineEnd: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, var(--dark2), transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div className="brands-track">
          {repeated.map((brand, i) => (
            <div key={i} style={{
              flexShrink: 0, margin: '0 20px',
              background: 'var(--dark3)', border: '1px solid var(--gray1)',
              borderRadius: '10px', padding: '16px 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '150px', height: '70px', transition: 'border-color 0.2s'
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--gray1)')}>
              <span style={{ fontFamily: 'Bebas Neue, Barlow Condensed, sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--gray5)', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
