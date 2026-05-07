import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customer_name, customer_phone, customer_phone2,
            wilaya, commune, address, notes, subtotal, delivery_price, total } = body

    if (!customer_name || !customer_phone || !wilaya || !commune || !address) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })
    }
    if (!items?.length) {
      return NextResponse.json({ error: 'السلة فارغة' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { data: order, error: orderError } = await db
      .from('orders')
      .insert({
        customer_name, customer_phone, customer_phone2: customer_phone2 || null,
        wilaya, commune, address, notes: notes || null,
        subtotal, delivery_price, total,
        status: 'new', payment_method: 'cash_on_delivery',
        discount_amount: 0,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      product_image: item.product_image || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      selected_flavor: item.selected_flavor || null,
      selected_size: item.selected_size || null,
    }))

    const { error: itemsError } = await db.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    // Decrement quantities (non-blocking, ignore errors)
    for (const item of items) {
      if (item.product_id) {
        try {
          await db.rpc('decrement_product_quantity', {
            p_id: item.product_id,
            amount: item.quantity,
          })
        } catch {}
      }
    }

    return NextResponse.json({ order_number: order.order_number, order_id: order.id }, { status: 201 })
  } catch (e: any) {
    console.error('Order error:', e)
    return NextResponse.json({ error: e.message || 'حدث خطأ' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = supabaseAdmin()
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = 20

    let query = db.from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status && status !== 'all') query = query.eq('status', status)
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,order_number.ilike.%${search}%,customer_phone.ilike.%${search}%`
      )
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ orders: data, total: count, page, limit })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
