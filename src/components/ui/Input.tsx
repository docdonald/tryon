interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-foreground">{label}</label>}
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${error ? 'border-destructive' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
