import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { data, error } = await db.from('settings').select('*')
    if (error) throw error
    const map: Record<string, string> = {}
    data?.forEach((s: any) => { map[s.key] = s.value })
    return NextResponse.json({ settings: map })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = supabaseAdmin()
    const upserts = Object.entries(body).map(([key, value]) => ({
      key, value: String(value),
    }))
    const { error } = await db.from('settings').upsert(upserts, { onConflict: 'key' })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
