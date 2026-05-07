# 🔧 التعديلات المطلوبة — Fouad Muscle Zone

## 📁 الملفات المُحدَّثة

ضع هذه الملفات في مشروعك كما هي:

| الملف | التغييرات |
|-------|-----------|
| `src/components/shop/HeroSlider.tsx` | ✅ Auto-play كل 5 ثوان + Ken Burns effect + تبديل Dark/Light |
| `src/components/shop/ProductsGrid.tsx` | ✅ BCAA → "أحماض أمينية" + أيقونات + تصميم محسّن |
| `src/components/shop/ProductDetail.tsx` | ✅ "ما هو هدفك" → "كل المنتجات" + breadcrumb محسّن |
| `src/components/layout/Navbar.tsx` | ✅ زر تبديل Dark/Light محفوظ في localStorage |
| `src/app/globals.css` | ✅ CSS Variables كاملة للـ Dark/Light mode |

---

## 🚀 خطوات التطبيق

```bash
# 1. انسخ الملفات إلى مشروعك
# 2. ابنِ المشروع
npm run build

# 3. ارفع على GitHub
git add .
git commit -m "feat: dark mode, hero slider autoplay, BCAA rename, all products section"
git push

# Netlify سيعمل deploy تلقائياً
```

---

## 🎨 ميزات Dark/Light Mode

- **الزر في Navbar**: يحفظ الاختيار في `localStorage`
- **الزر في Hero Slider**: للتبديل السريع من داخل السلايدر
- **تلقائي**: يقرأ إعدادات النظام `prefers-color-scheme`
- **CSS Variables**: كل الألوان تتغير بسلاسة عبر `transition`

---

## 🎞️ Hero Slider

- **Auto-play**: كل 5 ثوان
- **Ken Burns effect**: تكبير بطيء جذاب للصور
- **Progress bar**: شريط في الأسفل يظهر الوقت المتبقي
- **4 شرائح**: كل شريحة بلون accent مختلف
- **Navigation**: أزرار السابق/التالي + نقاط
- **لتغيير الصور**: عدّل مصفوفة `DEFAULT_SLIDES` في `HeroSlider.tsx`

---

## 🔧 لتوصيل الصور من Supabase Storage

في `src/app/admin/products/new/page.tsx` أو نموذج المنتج، أضف:

```tsx
const handleImageUpload = async (file: File) => {
  const supabase = createClient();
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('product-images') // أنشئ هذا الـ bucket في Supabase
    .upload(`products/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (data) {
    const { data: url } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    return url.publicUrl;
  }
};
```

**في Supabase Dashboard:**
1. اذهب إلى Storage
2. أنشئ bucket: `product-images`
3. اجعله **Public**
4. أضف policy: `Allow all authenticated users to upload`

---

## 📍 إصلاح تغيير العنوان

أضف جدول `settings` في Supabase:

```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('address', 'سطيف، الجزائر'),
  ('phone', '0660445532'),
  ('whatsapp', '213660445532')
ON CONFLICT (key) DO NOTHING;
```

ثم في `Footer.tsx`:

```tsx
const [address, setAddress] = useState('سطيف، الجزائر');

useEffect(() => {
  supabase.from('settings')
    .select('value')
    .eq('key', 'address')
    .single()
    .then(({ data }) => { if (data) setAddress(data.value); });
}, []);
```

وفي `admin/settings/page.tsx`:

```tsx
await supabase.from('settings')
  .upsert({ key: 'address', value: newAddress, updated_at: new Date().toISOString() });
```
