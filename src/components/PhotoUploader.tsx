import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, X } from 'lucide-react'
import { Button } from './ui/button'

interface PhotoUploaderProps {
  label: string
  value: string | null
  onChange: (base64: string | null) => void
  isRequired?: boolean
}

export function PhotoUploader({ label, value, onChange, isRequired = false }: PhotoUploaderProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onChange(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onChange])

  const handleCameraStart = useCallback(() => {
    setIsCameraOpen(true)
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => {
        alert('无法访问摄像头')
        setIsCameraOpen(false)
      })
  }, [])

  const handleCameraCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const base64 = canvas.toDataURL('image/jpeg')
        onChange(base64)
      }
      setIsCameraOpen(false)
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onChange])

  const handleCameraClose = useCallback(() => {
    setIsCameraOpen(false)
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
  }, [])

  const handleClear = useCallback(() => {
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        {label} {isRequired && <span className="text-destructive">*</span>}
      </label>
      
      {isCameraOpen ? (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <Button variant="outline" onClick={handleCameraClose}>
              <X className="w-4 h-4" />
              取消
            </Button>
            <Button onClick={handleCameraCapture}>
              <Camera className="w-4 h-4 mr-2" />
              拍照
            </Button>
          </div>
        </div>
      ) : value ? (
        <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden border-2 border-dashed border-border bg-secondary">
          <img
            src={value}
            alt={label}
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square max-w-xs rounded-lg border-2 border-dashed border-border bg-secondary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 p-4"
        >
          <Upload className="w-10 h-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p>点击上传 {label}</p>
            <p className="text-xs">支持 JPG、PNG 格式，最大 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {!value && (
        <Button variant="secondary" size="sm" onClick={handleCameraStart}>
          <Camera className="w-4 h-4 mr-2" />
          使用摄像头拍照
        </Button>
      )}
    </div>
  )
}
