import '../index.css'
import CrispChat from '@/components/crisp-chat'

export const metadata = {
  title: 'Atelier — AI 虚拟试衣',
  description: '上传照片，AI 即可生成试穿效果，让你轻松看到衣服穿在身上的样子',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-[#111111] antialiased">
        {children}
        <CrispChat />
      </body>
    </html>
  )
}
