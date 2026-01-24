'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'

const plans = [
  {
    name: 'Starter',
    price: '20,000',
    period: 'month',
    description: 'Perfect for small businesses just getting started with automation',
    popular: false,
    features: [
      'WhatsApp Business API',
      'Up to 1,000 conversations/month',
      'Basic automation flows',
      'Email support',
      'Mobile app access',
      '2 team members',
      'Standard templates',
    ],
    cta: 'Start Free Trial',
    href: '/demo',
  },
  {
    name: 'Professional',
    price: '35,000',
    period: 'month',
    description: 'For growing businesses that need more power and flexibility',
    popular: true,
    features: [
      'Everything in Starter',
      'Up to 5,000 conversations/month',
      'Advanced automation + AI',
      'CRM integration',
      'Priority support (24/7)',
      '5 team members',
      'Custom workflows',
      'Analytics dashboard',
      'Payment processing',
    ],
    cta: 'Start Free Trial',
    href: '/demo',
  },
  {
    name: 'Enterprise',
    price: '60,000',
    period: 'month',
    description: 'For established businesses with complex needs',
    popular: false,
    features: [
      'Everything in Professional',
      'Unlimited conversations',
      'Custom AI training',
      'Dedicated account manager',
      'White-label options',
      'Unlimited team members',
      'API access',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
]

export default function PricingPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            No hidden fees. No long-term contracts. Cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-primary scale-105 md:scale-110'
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl text-gray-600">₦</span>
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              All Plans Include:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>Free training</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>Regular updates</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5 text-secondary" />
                <span>Nigerian payment options</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-secondary">
              Compare All Features
            </Link>
            <Link href="/contact" className="btn-primary">
              Talk to Our Team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
