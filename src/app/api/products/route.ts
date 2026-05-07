import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const db = supabaseAdmin()
    const url = new URL(req.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const featured = url.searchParams.get('featured')
    const hidden = url.searchParams.get('hidden') // admin only

    let query = db.from('products')
      .select('*, product_images(*), categories(name, name_fr, slug)')
      .order('created_at', { ascending: false })

    if (!hidden) query = query.eq('is_hidden', false)
    if (category) query = query.eq('category_id', category)
    if (featured) query = query.eq('is_featured', true)
    if (search) query = query.or(`name.ilike.%${search}%,name_fr.ilike.%${search}%`)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ products: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = supabaseAdmin()

    // Generate slug
    const slug = (body.name || '').toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now()

    const { images, ...productData } = body

    const { data: product, error } = await db
      .from('products')
      .insert({ ...productData, slug })
      .select()
      .single()

    if (error) throw error

    // Insert images if provided
    if (images?.length) {
      await db.from('product_images').insert(
        images.map((url: string, i: number) => ({
          product_id: product.id, url,
          is_primary: i === 0, display_order: i,
        }))
      )
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
