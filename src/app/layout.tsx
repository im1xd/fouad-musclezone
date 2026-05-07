import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Fouad Muscle Zone | مكملات غذائية أصلية',
  description: 'أفضل المكملات الغذائية الأصلية في الجزائر - بروتين، كرياتين، فيتامينات وأكثر.',
  keywords: 'مكملات غذائية, بروتين, كرياتين, الجزائر, compléments alimentaires Algérie',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700;800;900&family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster position="bottom-center" toastOptions={{
          style: { background: '#1e1e1e', color: '#f5f5f5', border: '1px solid #2c2c2c', borderRadius: '10px', fontFamily: 'Cairo, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#FF6B00', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
      </body>
    </html>
  )
}
