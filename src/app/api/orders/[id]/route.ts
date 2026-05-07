import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const db = supabaseAdmin()
    const updates: any = {}

    if (body.status) updates.status = body.status
    if (body.admin_notes !== undefined) updates.admin_notes = body.admin_notes
    if (body.delivery_company !== undefined) updates.delivery_company = body.delivery_company
    if (body.tracking_number !== undefined) updates.tracking_number = body.tracking_number
    if (body.tracking_url !== undefined) updates.tracking_url = body.tracking_url

    if (body.status === 'accepted') updates.accepted_at = new Date().toISOString()
    if (body.status === 'shipped') updates.shipped_at = new Date().toISOString()
    if (body.status === 'delivered') updates.delivered_at = new Date().toISOString()

    const { data, error } = await db.from('orders').update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ order: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = supabaseAdmin()
    const { data, error } = await db.from('orders').select('*, order_items(*)').eq('id', id).single()
    if (error) throw error
    return NextResponse.json({ order: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
