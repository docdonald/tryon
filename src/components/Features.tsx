import { Upload, Shirt, Camera, ArrowRight } from 'lucide-react';
import { useCallback } from 'react';
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

  const bothUploaded = personImage && clothingImage;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#F97316]/30" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium">AI 时尚科技</span>
              <div className="w-12 h-px bg-[#F97316]/30" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#111111] leading-[1.15] mb-6">
              <span className="block">虚拟试衣</span>
              <span className="block mt-1 text-[#F97316]/40">AI 黑科技</span>
            </h1>
            
            <p className="text-[15px] md:text-base text-[#737373] leading-[1.8] max-w-lg mx-auto tracking-wide">
              上传照片，AI 即可生成试穿效果，让你轻松看到衣服穿在身上的样子。无需出门，即可体验百变造型。
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Person Upload */}
            <div className="border border-[#E5E5E5] bg-white transition-all duration-500 hover:border-[#111111]/20">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-[#737373] tracking-wider">01</span>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                  <span className="text-sm text-[#111111] tracking-wide">人物照片</span>
                </div>
                
                <div className="relative aspect-[4/3] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center overflow-hidden group hover:border-[#111111]/20 transition-all duration-500">
                  {personImage ? (
                    <img src={personImage} alt="人物" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-12 h-12 mx-auto mb-4 border border-[#111111]/10 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#737373]" />
                      </div>
                      <p className="text-sm text-[#737373] mb-1">拖拽或点击上传</p>
                      <p className="text-xs text-[#737373]/60">JPG、PNG，最大 10MB</p>
                      <label className="mt-4 inline-block px-5 py-2 border border-[#111111] text-[#111111] text-xs tracking-wider cursor-pointer hover:bg-[#111111] hover:text-white transition-all duration-300">
                        选择文件
                        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => handleFileChange(e, onPersonImageChange)} />
                      </label>
                      <button 
                        onClick={() => handleCamera(onPersonImageChange)}
                        className="mt-3 flex items-center justify-center gap-2 mx-auto text-xs text-[#737373] hover:text-[#111111] transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>使用摄像头</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Clothing Upload */}
            <div className="border border-[#E5E5E5] bg-white transition-all duration-500 hover:border-[#111111]/20">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-[#737373] tracking-wider">02</span>
                  <div className="flex-1 h-px bg-[#E5E5E5]" />
                  <span className="text-sm text-[#111111] tracking-wide">服装照片</span>
                </div>
                
                <div className="relative aspect-[4/3] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-center overflow-hidden group hover:border-[#111111]/20 transition-all duration-500">
                  {clothingImage ? (
                    <img src={clothingImage} alt="服装" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-12 h-12 mx-auto mb-4 border border-[#111111]/10 flex items-center justify-center">
                        <Shirt className="w-5 h-5 text-[#737373]" />
                      </div>
                      <p className="text-sm text-[#737373] mb-1">拖拽或点击上传</p>
                      <p className="text-xs text-[#737373]/60">JPG、PNG，最大 10MB</p>
                      <label className="mt-4 inline-block px-5 py-2 border border-[#111111] text-[#111111] text-xs tracking-wider cursor-pointer hover:bg-[#111111] hover:text-white transition-all duration-300">
                        选择文件
                        <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => handleFileChange(e, onClothingImageChange)} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-12 text-center">
            <button
              onClick={onGenerate}
              disabled={!bothUploaded || isProcessing}
              className="group relative inline-flex items-center gap-3 px-12 py-4 bg-[#111111] text-white text-sm tracking-[0.15em] font-medium transition-all duration-300 hover:bg-[#111111]/85 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>{isProcessing ? '生成中...' : '生成试穿效果'}</span>
              {!isProcessing && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              
              {/* Decorative corner */}
              {bothUploaded && !isProcessing && (
                <>
                  <div className="absolute top-0 right-0 w-2 h-px bg-[#F97316]/60" />
                  <div className="absolute top-0 right-0 w-px h-2 bg-[#F97316]/60" />
                </>
              )}
            </button>
            
            {!bothUploaded && (
              <p className="mt-4 text-xs text-[#737373]/60 tracking-wide">
                请上传人物照片和服装照片以开始试衣
              </p>
            )}
          </div>
        </div>
      </section>

      <Pricing />
    </div>
  );
}
