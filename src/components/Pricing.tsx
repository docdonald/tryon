import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Per editor',
    features: [
      'Basic Analytics Dashboard',
      '5GB Cloud Storage',
      'Email and Chat Support',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: 19,
    description: 'Per editor',
    features: [
      'Everything in Free Plan',
      '5GB Cloud Storage',
      'Email and Chat Support',
      'Access to Community Forum',
      'Single User Access',
      'Access to Basic Templates',
      'Mobile App Access',
      '1 Custom Report Per Month',
      'Monthly Product Updates',
      'Standard Security Features',
    ],
    highlight: true,
  },
  {
    name: 'Pro Plus',
    price: 49,
    description: 'Per editor',
    features: [
      'Everything in Pro Plan',
      '5GB Cloud Storage',
      'Email and Chat Support',
    ],
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <div className="py-16 md:py-32 relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Pricing that scale with your business
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance text-lg">
            Choose the perfect plan for your needs and start optimizing your workflow today
          </p>
        </div>

        <div className="mt-8 md:mt-16">
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col bg-white/80 backdrop-blur-sm ${
                  plan.highlight ? 'border-primary shadow-lg shadow-primary/20' : ''
                }`}
              >
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-lg"> / mo</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <Button
                      asChild
                      className={`w-full ${
                        plan.highlight
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      <Link href="#">Get Started</Link>
                    </Button>
                  </div>

                  <ul role="list" className="space-y-3 mt-auto">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="text-primary size-4 mt-0.5 flex-shrink-0" strokeWidth={3.5} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
