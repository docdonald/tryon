'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function EmailAdminPage() {
  const [subject, setSubject] = useState('每日精选')
  const [content, setContent] = useState('今天也是充满希望的一天，记得使用我们的 AI 试衣功能哦！')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/send-daily-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
        },
        body: JSON.stringify({ subject, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || '发送失败')
      } else {
        setResult(data.data)
      }
    } catch (err: any) {
      setError(err.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">邮件发送管理</h1>
            <p className="text-muted-foreground">给所有注册用户发送每日邮件</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm space-y-1">
                <p className="font-medium">发送完成！</p>
                <p>成功: {result.sent} 封</p>
                <p>失败: {result.failed} 封</p>
                <p>总计: {result.total} 位用户</p>
                {result.errors.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p className="font-medium">失败详情:</p>
                    {result.errors.map((e: string, i: number) => (
                      <p key={i} className="text-xs text-red-600">{e}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">邮件标题</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">邮件内容（支持 HTML）</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">安全密钥（可选）</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="如果配置了 SEND_EMAIL_SECRET 则必填"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground">
                在 .env.local 中设置 SEND_EMAIL_SECRET 可开启接口保护
              </p>
            </div>

            <Button
              onClick={handleSend}
              disabled={loading}
              className="w-full"
            >
              {loading ? '发送中...' : '发送邮件给所有用户'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
