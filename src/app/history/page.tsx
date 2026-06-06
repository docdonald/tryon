'use client'

import { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { AuthForm } from '../../components/AuthForm'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Download, Trash2, ArrowLeft, ImageOff } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import { TryOnRecord } from '../../types'

export default function History() {
  const [records, setRecords] = useState<TryOnRecord[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (!user) return
    
    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('tryon_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching history:', error)
        } else {
          setRecords(data || [])
        }
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchHistory()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return
    
    try {
      const { error } = await supabase
        .from('tryon_records')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting record:', error)
      } else {
        setRecords(records.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const urlObject = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlObject
      a.download = `tryon-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(urlObject)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm onSuccess={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={(page) => page === 'home' && (window.location.href = '/')}
        onShowAuth={() => {}}
        currentPage="history"
        trialCount={0}
      />
      
      <main className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Button>
          <h1 className="text-2xl font-bold">试衣历史</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16">
            <ImageOff className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">暂无试衣记录</p>
            <Button onClick={() => window.location.href = '/'} className="mt-4">
              去试试
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {records.map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={record.result_url}
                      alt="试衣结果"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex justify-between">
                        <span className="text-white text-sm">
                          {new Date(record.created_at).toLocaleDateString('zh-CN')}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDownload(record.result_url)}
                            className="gap-1"
                          >
                            <Download className="w-3 h-3" />
                            下载
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            删除
                          </Button>
                        </div>
                      </div>
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
