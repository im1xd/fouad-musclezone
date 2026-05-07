import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SignJWT } from 'jose'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { data, error } = await db
      .from('admin_users')
      .select('id, name, email, password_hash, is_active')
      .eq('email', email.toLowerCase().trim())
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'بيانات الدخول خاطئة' }, { status: 401 })
    }

    // Simple password fallback for demo (in production use bcrypt)
    const validPw = password === 'FMZ@Admin2024' || password === 'demo123'
    if (!validPw) {
      return NextResponse.json({ error: 'كلمة المرور خاطئة' }, { status: 401 })
    }

    await db.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', data.id)

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fouad-muscle-zone-secret-2024')
    const token = await new SignJWT({ sub: data.id, email: data.email, name: data.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ token, name: data.name, email: data.email })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
