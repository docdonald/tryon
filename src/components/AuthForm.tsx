import { useState } from 'react'
import { User, Eye, EyeOff } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardContent } from './ui/card'

interface AuthFormProps {
  onSuccess: () => void
}

type AuthMode = 'login' | 'register'

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('请填写所有必填项')
      return
    }

    if (username.length < 3) {
      setError('用户名至少3个字符')
      return
    }

    if (password.length < 6) {
      setError('密码至少6个字符')
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (!turnstileToken) {
      setError('请完成人机验证')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, turnstileToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || '操作失败')
        // 重置验证状态
        setTurnstileToken(null)
      } else {
        // 登录/注册成功，保存用户信息到 localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        onSuccess()
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold text-foreground">
          {mode === 'login' ? '登录' : '注册'}
        </h2>
        <p className="text-muted-foreground">
          {mode === 'login' ? '欢迎回来' : '创建新账户'}
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="用户名"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            required
            icon={<User className="w-4 h-4" />}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <Input
              label="确认密码"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />
          )}
          <div className="flex justify-center">
            {(() => {
              const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
              console.log('[Turnstile] SiteKey:', siteKey ? '已配置 (长度:' + siteKey.length + ')' : '未配置');
              if (!siteKey) {
                return (
                  <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">
                    ⚠️ 人机验证未配置，请联系管理员设置 NEXT_PUBLIC_TURNSTILE_SITE_KEY
                  </div>
                );
              }
              return (
                <Turnstile
                  siteKey={siteKey}
                  onSuccess={(token) => {
                    console.log('[Turnstile] 验证成功');
                    setTurnstileToken(token);
                  }}
                  onError={(error) => {
                    console.error('[Turnstile] 验证错误:', error);
                    setError('人机验证失败，请重试 (错误代码: ' + (error || 'unknown') + ')');
                  }}
                  onExpire={() => {
                    console.log('[Turnstile] Token 过期');
                    setTurnstileToken(null);
                  }}
                  className="w-full max-w-xs"
                />
              );
            })()}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? '还没有账户？' : '已有账户？'}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
              setConfirmPassword('')
            }}
            className="ml-1 text-primary hover:underline"
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}