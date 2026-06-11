export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs text-[#737373]/60 tracking-wider">
          有问题或建议？联系我们：
          <a
            href="mailto:feedback@tryclothes.vercel.app"
            className="text-[#111111] hover:underline transition-colors"
          >
            feedback@tryclothes.vercel.app
          </a>
        </p>
      </div>
    </footer>
  )
}
