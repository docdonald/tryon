import { Download, RotateCcw } from 'lucide-react'

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
    <div className="py-16 md:py-24 animate-scale-in">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-px bg-[#F97316]/30" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium">试衣结果</span>
          <div className="w-12 h-px bg-[#F97316]/30" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="relative border border-[#E5E5E5] bg-white overflow-hidden">
            <img
              src={resultUrl}
              alt="试衣结果"
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-3 bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white text-[#111111] text-sm tracking-wider font-medium hover:bg-[#F5F5F7] transition-colors"
              >
                <Download className="w-4 h-4" />
                下载图片
              </button>
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-white/50 text-white text-sm tracking-wider font-medium hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                再试一次
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
