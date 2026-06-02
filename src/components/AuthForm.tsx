import { useState } from 'react'
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardHeader, CardContent } from './ui/Card'

interface AuthFormProps {
  onSuccess: () => void
}

type AuthMode = 'login' | 'register'

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('请填写所有必填项')
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || '操作失败')
      } else {
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
            label="邮箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            icon={<Mail className="w-4 h-4" />}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              placeholder="••••••••"
              required
            />
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'login' ? '还没有账户？' : '已有账户？'}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="ml-1 text-primary hover:underline"
          >
            {mode === 'login' ? '立即注册' : '立即登录'}
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
