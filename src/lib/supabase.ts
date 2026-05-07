import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

export type Product = {
  id: string
  name: string
  name_fr: string
  slug: string
  description: string
  description_fr: string
  details: string
  usage_instructions: string
  price: number
  compare_price: number | null
  quantity: number
  is_available: boolean
  is_featured: boolean
  is_best_seller: boolean
  is_hidden: boolean
  category_id: string | null
  brand_id: string | null
  flavors: string[] | null
  sizes: string[] | null
  tags: string[] | null
  sales_count: number
  created_at: string
  updated_at: string
  categories?: Category
  product_images?: ProductImage[]
  brands?: Brand
}

export type Category = {
  id: string
  name: string
  name_fr: string
  slug: string
  image_url: string | null
  display_order: number
  is_active: boolean
}

export type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_phone2: string | null
  wilaya: string
  commune: string
  address: string
  notes: string | null
  subtotal: number
  delivery_price: number
  discount_amount: number
  total: number
  status: 'new' | 'accepted' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  delivery_company: string | null
  tracking_number: string | null
  tracking_url: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
  selected_flavor: string | null
  selected_size: string | null
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  display_order: number
  is_primary: boolean
}

export type Notification = {
  id: string
  type: string
  title: string
  message: string | null
  reference_id: string | null
  is_read: boolean
  created_at: string
}

export type Setting = {
  key: string
  value: string | null
}
