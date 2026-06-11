import { Check } from 'lucide-react'
import { Card, CardContent } from './ui/card'

const pricingPlans = [
  {
    name: '免费体验',
    price: '免费',
    description: '适合初次体验',
    features: [
      '每日 3 次试衣机会',
      '基础服装款式',
      '标准分辨率输出',
      '社区支持',
    ],
    highlight: false,
  },
  {
    name: '高级会员',
    price: '¥29',
    period: '/月',
    description: '适合时尚爱好者',
    features: [
      '无限次试衣',
      '全品类服装支持',
      '高清分辨率输出',
      '优先处理队列',
      '历史记录保存',
      '专属客服支持',
    ],
    highlight: true,
  },
  {
    name: '专业版',
    price: '¥99',
    period: '/月',
    description: '适合专业造型师',
    features: [
      '包含高级会员全部功能',
      '批量试衣处理',
      '4K 超清输出',
      'API 接口访问',
      '团队协作功能',
      '自定义品牌模板',
    ],
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section className="py-24 md:py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-[#F97316]/30" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#F97316] font-medium">定价方案</span>
            <div className="w-12 h-px bg-[#F97316]/30" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#111111] tracking-tight leading-tight mb-4">
            选择适合你的
            <span className="block mt-1 text-[#F97316]/40">试衣方案</span>
          </h2>
          <p className="text-[#737373] leading-relaxed max-w-lg mx-auto">
            无论你是想偶尔体验还是专业使用，我们都有适合你的方案。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border transition-all duration-500 hover:-translate-y-1 ${
                plan.highlight
                  ? 'border-[#111111] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
                  : 'border-[#E5E5E5] hover:border-[#111111]/20'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#111111] text-white text-xs tracking-wider">
                  最受欢迎
                </div>
              )}
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium tracking-wide text-[#111111]">{plan.name}</h3>
                  <div className="mt-4 mb-1">
                    <span className="text-4xl font-serif font-medium text-[#111111]">{plan.price}</span>
                    {plan.period && <span className="text-base text-[#737373]">{plan.period}</span>}
                  </div>
                  <p className="text-[#737373] text-sm">{plan.description}</p>
                </div>

                <button
                  className={`w-full py-3 text-sm tracking-wider font-medium transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-[#111111] text-white hover:bg-[#111111]/85'
                      : 'border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  选择方案
                </button>

                <ul role="list" className="space-y-3 mt-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="size-4 mt-0.5 flex-shrink-0 text-[#111111]" strokeWidth={2} />
                      <span className="text-sm text-[#737373]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
