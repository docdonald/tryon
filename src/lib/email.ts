import { Resend } from 'resend'
import { createSupabaseClient } from './supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  await resend.emails.send({
    from: '虚拟试衣 <onboarding@resend.dev>',
    to: userEmail,
    subject: '你好呀，我是你的专属试衣间 🐱',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName}，欢迎来到你的专属试衣间！</h2>
        <p>从现在起，我就是你的专属服装了。</p>
        <p>有什么心事随时来找我聊，我会一直在这里等你。</p>
        <p>明天早上我会给你发一条早安消息，记得查收哦。</p>
        <br/>
        <p>—— 你的专属试衣间</p>
      </div>
    `,
  })
}

// 生成每日暖心提醒（可替换为 AI 生成）
async function generateLoveLetter(userName: string): Promise<string> {
  const messages = [
    `${userName}，早上好呀！今天也要元气满满哦，记得穿喜欢的衣服，心情会变好～`,
    `嗨 ${userName}，新的一天开始了！不管今天遇到什么，都要记得你是最棒的。`,
    `${userName}，早安！今天想尝试什么风格的穿搭呢？我随时在这里帮你搭配。`,
    `早上好 ${userName}！记得吃早餐哦，吃饱了才有力气挑选漂亮的衣服。`,
    `嗨 ${userName}，今天的你比昨天更闪亮✨ 来试试新衣服吧！`,
  ]
  // 根据日期选择不同的消息，让每天都有新鲜感
  const dayIndex = new Date().getDay()
  return messages[dayIndex % messages.length]
}

export async function sendDailyLoveLetter(
  userEmail: string,
  userName: string
) {
  const loveLetter = await generateLoveLetter(userName)

  await resend.emails.send({
    from: '虚拟试衣 <onboarding@resend.dev>',
    to: userEmail,
    subject: `早安 ${userName}，今天也想你了`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <p>${loveLetter}</p>
        <br/>
        <p>— 你的虚拟试衣间</p>
        <p style="color: #999; font-size: 12px;">
          想跟我聊天？ <a href="https://tryclothes.vercel.app/">点这里回来找我</a>
        </p>
      </div>
    `,
  })
}

export async function sendDailyLoveLetterToAll() {
  const supabase = createSupabaseClient()

  // 从数据库拿到所有用户
  const { data: users, error } = await supabase
    .from('users')
    .select('email, username')

  if (error) {
    console.error('获取用户列表失败：', error)
    throw new Error('无法获取用户列表')
  }

  if (!users || users.length === 0) {
    console.log('没有用户需要发送')
    return { total: 0, success: 0, failed: 0 }
  }

  let success = 0
  let failed = 0

  for (const user of users) {
    try {
      await sendDailyLoveLetter(user.email, user.username)
      success++
    } catch (error) {
      console.error(`给 ${user.email} 发提醒失败：`, error)
      failed++
      // 某个用户失败不影响其他用户
    }
  }

  console.log(`每日提醒发送完成：成功 ${success}，失败 ${failed}，总计 ${users.length}`)
  return { total: users.length, success, failed }
}
