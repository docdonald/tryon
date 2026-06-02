import { useState, useEffect } from 'react'
import { User, LogOut, History, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '../lib/supabase/client'

interface HeaderProps {
  onNavigate: (page: 'home' | 'history') => void
  currentPage: 'home' | 'history'
  trialCount: number
}

export function Header({ onNavigate, currentPage, trialCount }: HeaderProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    onNavigate('home')
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">虚拟试衣</h1>
              <p className="text-xs text-muted-foreground">AI 试穿体验</p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  variant={currentPage === 'history' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('history')}
                >
                  <History className="w-4 h-4 mr-2" />
                  历史记录
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">
                  剩余试用次数: <span className="font-semibold text-primary">{trialCount}</span>
                </span>
                <Button onClick={() => onNavigate('history')}>
                  <User className="w-4 h-4 mr-2" />
                  登录/注册
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
