interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = '处理中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-lg font-medium text-foreground">{message}</p>
      <p className="text-sm text-muted-foreground">请稍候，AI 正在为您生成试穿效果...</p>
    </div>
  )
}
