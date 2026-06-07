import { NextResponse } from 'next/server'
import { sendDailyLetterToAll } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // 简单安全校验：防止被随意调用
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SEND_EMAIL_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))

    const results = await sendDailyLetterToAll({
      subject: body.subject || '每日精选',
      content: body.content || '今天也是充满希望的一天，记得使用我们的 AI 试衣功能哦！',
    })

    return NextResponse.json({
      success: true,
      message: `邮件发送完成: ${results.sent} 成功, ${results.failed} 失败`,
      data: results,
    })
  } catch (error: any) {
    console.error('[SendDailyLetter] 错误:', error)
    return NextResponse.json(
      { success: false, message: error.message || '发送失败' },
      { status: 500 }
    )
  }
}
