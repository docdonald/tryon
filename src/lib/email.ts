import { Resend } from 'resend'
import { createSupabaseClient } from './supabase/server'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY 未配置')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

/**
 * 发送单封邮件
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResend()

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    to,
    subject,
    html,
  })

  if (error) {
    throw new Error(`邮件发送失败: ${error.message}`)
  }

  return data
}

/**
 * 生成每日邮件 HTML 内容
 */
export function generateDailyLetterHtml({
  username,
  date,
  content,
}: {
  username: string
  date: string
  content: string
}): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>每日精选</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #2563eb; color: #fff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .body { padding: 32px 24px; color: #333; line-height: 1.8; }
    .body p { margin: 0 0 16px; }
    .footer { padding: 24px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
    .username { color: #2563eb; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>每日精选</h1>
      <p style="margin:8px 0 0; opacity:0.9;">${date}</p>
    </div>
    <div class="body">
      <p>你好，<span class="username">${username}</span>！</p>
      <div>${content}</div>
    </div>
    <div class="footer">
      <p>此邮件由系统自动发送，如需退订请联系管理员。</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * 给所有注册用户发送每日邮件
 */
export async function sendDailyLetterToAll({
  subject = '每日精选',
  content = '今天也是充满希望的一天，记得使用我们的 AI 试衣功能哦！',
}: {
  subject?: string
  content?: string
} = {}) {
  const supabase = createSupabaseClient()
  const date = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  // 获取所有有邮箱的用户
  console.log('[Email] 获取用户列表...')
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, email')
    .not('email', 'is', null)

  if (error) {
    throw new Error(`获取用户失败: ${error.message}`)
  }

  if (!users || users.length === 0) {
    console.log('[Email] 没有可发送邮件的用户')
    return { sent: 0, failed: 0, total: 0 }
  }

  console.log(`[Email] 开始发送，共 ${users.length} 位用户`)

  const results = { sent: 0, failed: 0, total: users.length, errors: [] as string[] }

  for (const user of users) {
    try {
      const html = generateDailyLetterHtml({
        username: user.username,
        date,
        content,
      })

      await sendEmail({
        to: user.email,
        subject,
        html,
      })

      results.sent++
      console.log(`[Email] 已发送给: ${user.username} (${user.email})`)
    } catch (err: any) {
      results.failed++
      const msg = `发送给 ${user.email} 失败: ${err.message}`
      results.errors.push(msg)
      console.error(`[Email] ${msg}`)
    }
  }

  console.log(`[Email] 发送完成: ${results.sent} 成功, ${results.failed} 失败`)
  return results
}
