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
    link.download = `tryon-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mt-8">
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-card rounded-xl overflow-hidden shadow-2xl">
          <img
            src={resultUrl}
            alt="试衣结果"
            className="w-full h-auto"
          />
          <div className="absolute bottom-4 left-4 right-4 flex gap-3">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              下载图片
            </Button>
            <Button variant="outline" onClick={onRetry}>
              <RotateCcw className="w-4 h-4 mr-2" />
              再试一次
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
