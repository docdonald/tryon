'use client'

import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Features } from '../components/Features'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ResultDisplay } from '../components/ResultDisplay'
import { AuthForm } from '../components/AuthForm'
import { AuroraBackground } from '../components/AuroraBackground'
import { supabase } from '../lib/supabase/client'

type PageView = 'home' | 'auth' | 'history'

export default function Home() {
  const [currentView, setCurrentView] = useState<PageView>('home')
  const [personImage, setPersonImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [trialCount, setTrialCount] = useState(10)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const savedCount = localStorage.getItem('trialCount')
    if (savedCount) {
      const parsedCount = parseInt(savedCount)
      setTrialCount(Math.max(parsedCount, 10))
    }
  }, [])

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      alert('请上传人物照片和服装照片')
      return
    }

    if (!user && trialCount <= 0) {
      alert('试用次数已用完，请登录后继续使用')
      setCurrentView('auth')
      return
    }

    setIsProcessing(true)
    setResultUrl(null)

    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person_image: personImage,
          clothing_image: clothingImage,
        }),
      })

      const data = await response.json()

      if (data.success && data.result_url) {
        setResultUrl(data.result_url)
        
        if (!user) {
          const newCount = trialCount - 1
          setTrialCount(newCount)
          localStorage.setItem('trialCount', newCount.toString())
        }
      } else {
        alert(data.message || '生成失败，请重试')
      }
    } catch {
      alert('网络错误，请稍后重试')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRetry = () => {
    setResultUrl(null)
    setPersonImage(null)
    setClothingImage(null)
  }

  const handleAuthSuccess = () => {
    window.location.reload()
  }

  if (currentView === 'auth') {
    return (
      <AuroraBackground>
        <div className="relative z-10">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </AuroraBackground>
    )
  }

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full">
        <Header
          onNavigate={(page) => setCurrentView(page)}
          currentPage="home"
          trialCount={trialCount}
        />
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : resultUrl ? (
          <ResultDisplay resultUrl={resultUrl} onRetry={handleRetry} />
        ) : (
          <Features
            personImage={personImage}
            clothingImage={clothingImage}
            onPersonImageChange={setPersonImage}
            onClothingImageChange={setClothingImage}
            onGenerate={handleTryOn}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </AuroraBackground>
  )
}
