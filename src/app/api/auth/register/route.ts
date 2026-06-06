import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  console.log('[Register] 收到注册请求')
  try {
    console.log('[Register] 创建 Supabase 客户端...')
    const supabase = createSupabaseClient()
    console.log('[Register] Supabase 客户端创建成功')

    console.log('[Register] 解析请求体...')
    // 从请求体中拿到前端传来的 turnstile token
    const { turnstileToken, username, password } = await request.json()
    console.log('[Register] 用户名:', username)

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
      console.log('[Register] Turnstile 验证失败:', verifyResult)
      return NextResponse.json(
        { success: false, message: '人机验证失败，请重试' },
        { status: 403 }
      )
    }
    console.log('[Register] Turnstile 验证通过')

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { success: false, message: '用户名长度需要在3-50个字符之间' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度至少6个字符' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    console.log('[Register] 检查用户名是否存在...')
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    console.log('[Register] 查询结果:', { existingUser, checkError })

    if (checkError) {
      console.error('[Register] 查询错误:', checkError)
      return NextResponse.json(
        { success: false, message: '数据库查询错误: ' + checkError.message },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      )
    }

    // 使用 bcrypt 加密密码
    console.log('[Register] 加密密码...')
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('[Register] 密码加密成功')

    // 插入新用户
    console.log('[Register] 插入新用户...')
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        password: hashedPassword,
      })
      .select('id, username, created_at')
      .single()

    console.log('[Register] 插入结果:', { newUser, error })

    if (error) {
      console.error('[Register] 插入错误:', error)
      return NextResponse.json(
        { success: false, message: '注册失败: ' + error.message },
        { status: 500 }
      )
    }

    console.log('[Register] 注册成功')
    return NextResponse.json({
      success: true,
      message: '注册成功',
      user: {
        id: newUser.id,
        username: newUser.username,
        created_at: newUser.created_at,
      },
    })
  } catch (error: any) {
    console.error('[Register] 未捕获错误:', error)
    console.error('[Register] 错误堆栈:', error.stack)
    return NextResponse.json(
      { success: false, message: error.message || '服务器错误' },
      { status: 500 }
    )
  }
}
