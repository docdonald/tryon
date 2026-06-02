import { Card, CardContent } from '@/components/ui/card';
import { Settings2, Sparkles, Zap, Upload, Shirt, Camera } from 'lucide-react';
import { ReactNode, useCallback } from 'react';
import Pricing from './Pricing';

interface FeaturesProps {
  personImage: string | null;
  clothingImage: string | null;
  onPersonImageChange: (image: string | null) => void;
  onClothingImageChange: (image: string | null) => void;
  onGenerate: () => void;
  isProcessing: boolean;
}

export function Features({
  personImage,
  clothingImage,
  onPersonImageChange,
  onClothingImageChange,
  onGenerate,
  isProcessing
}: FeaturesProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (image: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCamera = useCallback(async (onChange: (image: string | null) => void) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      onChange(canvas.toDataURL('image/jpeg'));
    } catch {
      alert('无法访问摄像头');
    }
  }, []);

  const UploadCard = ({ icon: Icon, title, value, onChange }: { 
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    title: string;
    value: string | null;
    onChange: (image: string | null) => void;
  }) => {
    return (
      <Card className="group border border-border rounded-xl bg-background/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="relative w-full h-[360px] border-2 border-dashed border-border rounded-xl overflow-hidden flex flex-col items-center justify-center">
            {value ? (
              <img src={value} alt={title} className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="relative size-40">
                  <div className="absolute inset-0 border border-current opacity-10" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                  <div className="bg-background absolute inset-0 m-auto flex size-16 items-center justify-center border-t-2 border-l-2 border-current">
                    <Icon className="size-8" aria-hidden />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-medium text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">*</p>
                
                <label className="mt-6 flex flex-col items-center gap-3 border-2 border-border rounded-xl px-10 py-6 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all hover:border-accent">
                  <Upload className="size-8" />
                  <span className="text-base font-medium">点击上传</span>
                  <span className="text-sm opacity-60">支持 JPG、PNG 格式，最大 10MB</span>
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => handleFileChange(e, onChange)} />
                </label>
                
                <button type="button" onClick={() => handleCamera(onChange)} className="mt-4 flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors">
                  <Camera className="size-5" />
                  <span>使用摄像头拍照</span>
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%), repeating-linear-gradient(100deg, #3b82f6 10%, #818cf8 15%, #60a5fa 20%, #c4b5fd 25%, #60a5fa 30%)',
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          filter: 'blur(10px)',
          opacity: 0.5,
          animation: 'aurora 20s ease-in-out infinite',
        }} />
      </div>
      
      <section className="py-16 md:py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center relative">
            <div className="absolute -inset-8 overflow-hidden rounded-3xl opacity-60 blur-xl">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(100deg, #3b82f6 10%, #818cf8 15%, #60a5fa 20%, #c4b5fd 25%, #60a5fa 30%)',
                backgroundSize: '300%, 200%',
                backgroundPosition: '50% 50%, 50% 50%',
                animation: 'aurora 20s ease-in-out infinite',
              }} />
            </div>
            <h2 className="relative z-10 text-balance text-4xl font-semibold lg:text-5xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">虚拟试衣 AI 黑科技</h2>
            <p className="relative z-10 mt-4 text-lg text-slate-600">上传照片，AI 即可生成试穿效果，让你轻松看到衣服穿在身上的样子</p>
          </div>
          
          <div className="mx-auto mt-12 grid max-w-2xl gap-8 md:max-w-5xl md:grid-cols-2">
            <UploadCard icon={Upload} title="上传人物照片" value={personImage} onChange={onPersonImageChange} />
            <UploadCard icon={Shirt} title="上传服装照片" value={clothingImage} onChange={onClothingImageChange} />
          </div>

          <div className="mt-10 text-center">
            <button onClick={onGenerate} disabled={!personImage || !clothingImage || isProcessing} className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-14 px-12 shadow-lg shadow-blue-500/25">
              {isProcessing ? '生成中...' : '生成试穿效果'}
            </button>
          </div>
        </div>
      </section>
      
      <Pricing />
    </div>
  );
}
