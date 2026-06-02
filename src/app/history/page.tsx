'use client'

import { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { AuthForm } from '../../components/AuthForm'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Download, Trash2, ArrowLeft, ImageOff } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import { TryOnRecord } from '../../types'

type PageView = 'auth' | 'history'

export default function History() {
  const [currentView, setCurrentView] = useState<PageView>('history')
  const [records, setRecords] = useState<TryOnRecord[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) {
        setCurrentView('auth')
        setIsLoading(false)
        return
      }
      await loadRecords()
    }
    checkUser()
  }, [])

  const loadRecords = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('tryon_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch {
      setRecords([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    window.location.reload()
  }

  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `tryon-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return

    try {
      const { error } = await supabase
        .from('tryon_records')
        .delete()
        .eq('id', id)

      if (!error) {
        setRecords(records.filter(r => r.id !== id))
      }
    } catch {
      alert('删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onNavigate={(page) => {
          if (page === 'home') {
            window.location.href = '/'
          }
        }}
        currentPage="history"
        trialCount={0}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h2 className="text-xl font-semibold text-foreground">历史记录</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <ImageOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">暂无历史记录</h3>
              <p className="text-muted-foreground">完成试衣后，记录将保存在这里</p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                去试衣
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <div className="aspect-square bg-secondary">
                  <img
                    src={record.result_url}
                    alt="试穿效果"
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(record.created_at)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(record.result_url)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
