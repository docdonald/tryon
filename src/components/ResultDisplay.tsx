import { Download, RotateCcw } from 'lucide-react'
import { Button } from './ui/button'

interface ResultDisplayProps {
  resultUrl: string
  onRetry: () => void
}

export function ResultDisplay({ resultUrl, onRetry }: ResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `tryon-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen py-16 flex flex-col items-center justify-center px-6">
      <h3 className="text-2xl font-semibold text-foreground mb-8">试穿效果</h3>
      
      <div className="relative aspect-square w-full max-w-lg rounded-lg overflow-hidden border border-border shadow-lg mb-8">
        <img
          src={resultUrl}
          alt="试穿效果"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex gap-8">
        <Button onClick={handleDownload} className="w-40">
          <Download className="w-4 h-4 mr-2" />
          下载图片
        </Button>
        <Button variant="secondary" onClick={onRetry} className="w-40">
          <RotateCcw className="w-4 h-4 mr-2" />
          再试一次
        </Button>
      </div>
    </div>
  )
}
