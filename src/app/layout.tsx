import '../index.css'
import CrispChat from '@/components/crisp-chat'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <CrispChat />
      </body>
    </html>
  )
}
