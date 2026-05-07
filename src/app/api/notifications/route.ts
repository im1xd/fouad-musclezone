import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.from('notifications')
      .select('*').order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    return NextResponse.json({ notifications: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { ids, all } = await req.json()
    const db = supabaseAdmin()
    if (all) {
      await db.from('notifications').update({ is_read: true }).eq('is_read', false)
    } else if (ids?.length) {
      await db.from('notifications').update({ is_read: true }).in('id', ids)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
