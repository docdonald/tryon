import { NextResponse } from 'next/server'
import { sendDailyLoveLetterToAll } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // 简单安全校验：防止被随意调用
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SEND_EMAIL_SECRET || process.env.CRON_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, message: '未授权' },
        { status: 401 }
      )
    }

    const results = await sendDailyLoveLetterToAll()

    return NextResponse.json({
      success: true,
      message: `邮件发送完成: ${results.success} 成功, ${results.failed} 失败, 总计 ${results.total}`,
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
