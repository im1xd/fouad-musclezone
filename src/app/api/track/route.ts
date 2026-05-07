import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const order = url.searchParams.get('order')?.trim()
  const phone = url.searchParams.get('phone')?.trim()

  if (!order && !phone) {
    return NextResponse.json({ error: 'query required' }, { status: 400 })
  }

  const db = supabaseAdmin()

  let query = db.from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(1)

  if (order) {
    query = query.ilike('order_number', `%${order}%`)
  } else if (phone) {
    query = query.eq('customer_phone', phone)
  }

  const { data, error } = await query.maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ order: null }, { status: 404 })

  return NextResponse.json({ order: data })
}
