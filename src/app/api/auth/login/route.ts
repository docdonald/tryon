import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: data.user }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
