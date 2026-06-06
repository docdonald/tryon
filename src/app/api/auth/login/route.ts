import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseClient()

    // 从请求体中拿到前端传来的 turnstile token
    const { turnstileToken, username, password } = await request.json()

    // 去 Cloudflare 验证这个 token 是不是真的
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      }
    )

    const verifyResult = await verifyResponse.json()

    // 如果验证失败，直接拒绝
    if (!verifyResult.success) {
      console.log('[Login] Turnstile 验证失败:', verifyResult)
      return NextResponse.json(
        { success: false, message: '人机验证失败，请重试' },
        { status: 403 }
      )
    }
    console.log('[Login] Turnstile 验证通过')

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 查询用户
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, password, created_at')
      .eq('username', username)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 使用 bcrypt 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 登录成功，返回用户信息（不返回密码）
    return NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    })
  } catch (error: any) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { success: false, message: error.message || '服务器错误' },
      { status: 500 }
    )
  }
}
