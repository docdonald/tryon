interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = '处理中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      <div className="relative w-12 h-12">
        <div 
          className="absolute inset-0 border border-[#E5E5E5] animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
        <div 
          className="absolute inset-1 border border-[#111111] animate-spin"
          style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm tracking-[0.15em] text-[#111111] font-medium uppercase">{message}</p>
        <p className="text-xs text-[#737373] mt-2 tracking-wide">AI 正在为您生成试穿效果...</p>
      </div>
    </div>
  )
}
