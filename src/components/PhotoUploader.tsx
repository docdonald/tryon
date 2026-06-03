import { useState, useRef, useCallback } from 'react'
import { Upload, X } from 'lucide-react'

interface PhotoUploaderProps {
  label: string
  value: string | null
  onChange: (base64: string | null) => void
  isRequired?: boolean
}

export function PhotoUploader({ label, value, onChange, isRequired = false }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onChange(result)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {value ? (
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
          <img
            src={value}
            alt={label}
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-input hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files
              if (files && files.length > 0) {
                handleFile(files[0])
              }
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <div className={`p-3 rounded-full mb-4 transition-colors ${
              isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">点击或拖拽上传图片</p>
            <p className="text-xs text-muted-foreground mt-1">支持 JPG、PNG 格式</p>
          </div>
        </div>
      )}
    </div>
  )
}
