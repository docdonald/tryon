interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}
