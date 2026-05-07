-- ============================================================
-- FOUAD MUSCLE ZONE - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_fr TEXT,
  details TEXT,
  usage_instructions TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  flavors TEXT[],
  sizes TEXT[],
  tags TEXT[],
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_phone2 TEXT,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  delivery_price DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','accepted','preparing','shipped','delivered','cancelled')),
  payment_method TEXT DEFAULT 'cash_on_delivery',
  delivery_company TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  admin_notes TEXT,
  accepted_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  selected_flavor TEXT,
  selected_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'FF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Auto updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Notification on new order
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (type, title, message, reference_id, reference_type)
  VALUES ('new_order', 'طلب جديد! 🔔', 'طلب جديد من ' || NEW.customer_name || ' — ' || NEW.wilaya, NEW.id, 'order');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_notify_order
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();

-- Decrement quantity function
CREATE OR REPLACE FUNCTION decrement_product_quantity(p_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET quantity = GREATEST(0, quantity - amount) WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read products & categories
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_hidden = FALSE);
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_product_images" ON product_images FOR SELECT USING (TRUE);
CREATE POLICY "public_read_brands" ON brands FOR SELECT USING (TRUE);
CREATE POLICY "public_read_settings" ON settings FOR SELECT USING (TRUE);

-- Public can create orders
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT WITH CHECK (TRUE);

-- Service role has full access (for admin API)

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO settings (key, value) VALUES
  ('store_name', 'Fouad Muscle Zone'),
  ('store_phone', '0660445532'),
  ('store_whatsapp', '213660445532'),
  ('store_address', 'سطيف، الجزائر'),
  ('store_instagram', 'https://www.instagram.com/fouad_fitness39'),
  ('store_facebook', 'https://www.facebook.com/share/1CLyvfRZRo/'),
  ('store_tiktok', 'https://www.tiktok.com/@fouadfitness39'),
  ('store_maps', 'https://maps.app.goo.gl/6gBja8UDLokDdBDv5'),
  ('delivery_home', '400'),
  ('delivery_office', '350'),
  ('free_delivery_min', '5000'),
  ('currency', 'دج')
ON CONFLICT (key) DO NOTHING;

-- Admin user (password: FMZ@Admin2024)
INSERT INTO admin_users (email, password_hash, name) VALUES
  ('admin@fouadmusclezone.dz', crypt('FMZ@Admin2024', gen_salt('bf', 12)), 'Fouad Admin')
ON CONFLICT (email) DO NOTHING;

-- Categories
INSERT INTO categories (name, name_fr, slug, display_order) VALUES
  ('Protein', 'Protéine', 'protein', 1),
  ('Creatine', 'Créatine', 'creatine', 2),
  ('Vitamins', 'Vitamines', 'vitamins', 3),
  ('Mass Gainer', 'Prise de masse', 'mass-gainer', 4),
  ('Fat Burner', 'Brûle-graisses', 'fat-burner', 5),
  ('Pre-Workout', 'Pré-entraînement', 'pre-workout', 6),
  ('BCAA', 'BCAA', 'bcaa', 7),
  ('Accessories', 'Accessoires', 'accessories', 8)
ON CONFLICT (slug) DO NOTHING;

-- Brands
INSERT INTO brands (name, slug) VALUES
  ('Optimum Nutrition', 'on'),
  ('Dymatize', 'dymatize'),
  ('MuscleTech', 'muscletech'),
  ('BioTechUSA', 'biotechusa'),
  ('OstroVit', 'ostrovit')
ON CONFLICT (slug) DO NOTHING;
