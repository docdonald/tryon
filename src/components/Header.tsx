import { useState, useEffect } from 'react'
import { User, LogOut, History } from 'lucide-react'

interface UserInfo {
  id: number
  username: string
  created_at: string
}

interface HeaderProps {
  onNavigate: (page: 'home' | 'history') => void
  onShowAuth: () => void
  currentPage: 'home' | 'history'
  trialCount: number
}

export function Header({ onNavigate, onShowAuth, currentPage, trialCount }: HeaderProps) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const checkUser = () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          setUser(JSON.parse(userStr))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      }
    }
    checkUser()

    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-editorial ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 border border-[#111111]/15 flex items-center justify-center transition-all duration-300 group-hover:border-[#111111]/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#111111]">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium tracking-[0.15em] text-[#111111] uppercase">Atelier</span>
            <span className="text-[10px] tracking-[0.2em] text-[#737373] uppercase -mt-0.5">Virtual Try-On</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-center gap-2 text-xs tracking-wider text-[#737373]">
            <span>剩余</span>
            <span className="text-[#111111] font-medium">{trialCount}</span>
            <span>次</span>
          </div>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 px-4 py-2 text-xs tracking-wider transition-all duration-300 ${
              currentPage === 'history'
                ? 'bg-[#111111] text-white'
                : 'text-[#737373] hover:text-[#111111]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">历史</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-[#111111]/15 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#111111]" />
              </div>
              <span className="text-xs tracking-wider text-[#111111] hidden md:inline">{user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider text-[#737373] hover:text-[#111111] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">退出</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuth}
              className="px-5 py-2 bg-[#111111] text-white text-xs tracking-[0.15em] font-medium hover:bg-[#111111]/85 transition-all duration-300"
            >
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
