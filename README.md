# 🏋️ Fouad Muscle Zone — متجر المكملات الغذائية

متجر إلكتروني متكامل لبيع المكملات الغذائية في الجزائر.

---

## 🚀 خطوات الإعداد

### 1. إعداد Supabase
1. اذهب إلى [supabase.com](https://supabase.com) وافتح مشروعك: `shvvlzwvlzopygjnryuh`
2. افتح **SQL Editor** وانسخ محتوى `supabase/schema.sql` وشغّله

### 2. متغيرات البيئة
انسخ `.env.local.example` إلى `.env.local` وأضف:
```
NEXT_PUBLIC_SUPABASE_URL=https://shvvlzwvlzopygjnryuh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=fouad-muscle-zone-super-secret-2024
```

### 3. تشغيل المشروع
```bash
npm install
npm run dev
```

### 4. الرفع على Netlify
1. اربط الريبو بـ Netlify
2. أضف المتغيرات في **Site Settings > Environment Variables**
3. Build command: `npm run build`
4. Publish directory: `.next`

---

## 🔐 لوحة التحكم
- URL: `/admin`
- Email: `admin@fouadmusclezone.dz`
- Password: `FMZ@Admin2024`
- **غيّر كلمة المرور بعد أول دخول!**

---

## 📁 هيكل المشروع
```
src/
├── app/
│   ├── page.tsx          # الصفحة الرئيسية
│   ├── products/[slug]/  # صفحة المنتج
│   ├── checkout/         # صفحة الطلب
│   ├── success/          # صفحة نجاح الطلب
│   ├── track/            # تتبع الطلب
│   ├── admin/            # لوحة التحكم
│   └── api/              # API Routes
├── components/
│   ├── layout/           # Navbar, Footer, AnnouncementBar
│   ├── shop/             # HeroSlider, ProductsGrid, CartSidebar...
│   └── ui/               # WhatsappFloat...
├── lib/                  # Supabase, i18n, algeria data
└── store/                # Zustand cart store
```

---

## 🛒 الميزات
- ✅ متجر ثنائي اللغة (عربي / فرنسي)
- ✅ Hero Slider متحرك
- ✅ Announcement Bar متحرك
- ✅ تصنيفات وفلترة المنتجات
- ✅ صفحة تفاصيل المنتج مع النكهات والأحجام
- ✅ سلة مشتريات
- ✅ نظام طلبات مع الدفع عند الاستلام
- ✅ تتبع الطلبات
- ✅ لوحة تحكم Admin كاملة
- ✅ إدارة المنتجات من الداشبورد
- ✅ نظام إشعارات
- ✅ ربط شركات التوصيل (Yalidine, ZR Express, Maystro, Procolis)
- ✅ WhatsApp Float Button
- ✅ SEO محسّن
- ✅ Responsive لجميع الأجهزة

