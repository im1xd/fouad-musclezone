import { supabase } from './supabase'
import type { Product, Category } from './supabase'

export async function getProducts(params?: {
  category?: string
  featured?: boolean
  search?: string
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, product_images(*), categories(*)')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  if (params?.category) query = query.eq('category_id', params.category)
  if (params?.featured) query = query.eq('is_featured', true)
  if (params?.search) {
    query = query.or(`name.ilike.%${params.search}%,name_fr.ilike.%${params.search}%`)
  }

  const { data, error } = await query
  if (error) { console.error('getProducts error:', error); return [] }
  return (data as Product[]) ?? []
}

export async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), categories(*)')
    .eq('slug', slug)
    .eq('is_hidden', false)
    .single()
  if (error) return null
  return data as Product
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) return []
  return data ?? []
}

export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('settings').select('*')
  if (error) return {}
  const map: Record<string, string> = {}
  data?.forEach((s: any) => { map[s.key] = s.value || '' })
  return map
}
