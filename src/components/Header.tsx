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
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Virtual Try-On
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>剩余试用次数:</span>
              <span className="font-semibold text-primary">{trialCount}</span>
            </div>

            <Button
              variant={currentPage === 'history' ? 'default' : 'ghost'}
              onClick={() => onNavigate('history')}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              试衣历史
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <Button variant="ghost" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  退出
                </Button>
              </div>
            ) : (
              <Button>登录/注册</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
