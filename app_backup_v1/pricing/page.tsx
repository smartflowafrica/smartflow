'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      monthlyPrice: 25000,
      annualPrice: 250000,
      savings: '17% off',
      features: [
        'WhatsApp Business API',
        'Up to 500 contacts',
        'Basic automation workflows',
        '2 team members',
        'Email support',
        'Basic analytics',
        'Mobile app access',
      ],
      notIncluded: [
        'CRM integration',
        'Advanced workflows',
        'Priority support',
        'Custom integrations',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Most popular for growing businesses',
      monthlyPrice: 45000,
      annualPrice: 450000,
      savings: '17% off',
      features: [
        'Everything in Starter',
        'Up to 5,000 contacts',
        'Advanced automation workflows',
        'CRM integration (HubSpot, Zoho)',
        '5 team members',
        'Priority email support',
        'Advanced analytics & reports',
        'API access',
        'Payment integration',
        'Custom fields',
      ],
      notIncluded: [
        'Dedicated account manager',
        'Custom development',
        'SLA guarantee',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large businesses with complex needs',
      monthlyPrice: 95000,
      annualPrice: 950000,
      savings: '17% off',
      features: [
        'Everything in Professional',
        'Unlimited contacts',
        'Unlimited workflows',
        'All CRM integrations',
        'Unlimited team members',
        '24/7 phone & WhatsApp support',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'Advanced security',
        '99.9% SLA guarantee',
        'Onboarding & training',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const addOns = [
    {
      name: 'Extra CRM Integration',
      price: 15000,
      description: 'Connect additional CRM or business tool',
    },
    {
      name: 'Additional Team Members',
      price: 5000,
      description: 'Per additional user per month',
    },
    {
      name: 'SMS Notifications',
      price: 10000,
      description: 'Send SMS alongside WhatsApp (per 1,000 SMS)',
    },
    {
      name: 'Advanced Analytics Package',
      price: 12000,
      description: 'Custom reports, export data, advanced insights',
    },
    {
      name: 'Dedicated Onboarding',
      price: 50000,
      description: 'One-time setup with personal trainer',
    },
    {
      name: 'Custom Development',
      price: 150000,
      description: 'Custom features or integrations (one-time)',
    },
  ]

  const featureComparison = [
    {
      category: 'Core Features',
      features: [
        { name: 'WhatsApp Business API', starter: true, pro: true, enterprise: true },
        { name: 'Contact Management', starter: '500', pro: '5,000', enterprise: 'Unlimited' },
        { name: 'Team Members', starter: '2', pro: '5', enterprise: 'Unlimited' },
        { name: 'Mobile App Access', starter: true, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Automation',
      features: [
        { name: 'Basic Workflows', starter: true, pro: true, enterprise: true },
        { name: 'Advanced Workflows', starter: false, pro: true, enterprise: true },
        { name: 'Conditional Logic', starter: false, pro: true, enterprise: true },
        { name: 'Multi-step Sequences', starter: '3 steps', pro: '10 steps', enterprise: 'Unlimited' },
      ],
    },
    {
      category: 'Integrations',
      features: [
        { name: 'Payment Gateways', starter: false, pro: true, enterprise: true },
        { name: 'CRM Integration', starter: false, pro: '2 systems', enterprise: 'All systems' },
        { name: 'Custom Integrations', starter: false, pro: false, enterprise: true },
        { name: 'API Access', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Support & Training',
      features: [
        { name: 'Email Support', starter: true, pro: true, enterprise: true },
        { name: 'Priority Support', starter: false, pro: true, enterprise: true },
        { name: '24/7 Phone Support', starter: false, pro: false, enterprise: true },
        { name: 'Dedicated Account Manager', starter: false, pro: false, enterprise: true },
        { name: 'Onboarding & Training', starter: false, pro: 'Self-service', enterprise: 'Personalized' },
      ],
    },
    {
      category: 'Analytics & Reporting',
      features: [
        { name: 'Basic Analytics', starter: true, pro: true, enterprise: true },
        { name: 'Advanced Reports', starter: false, pro: true, enterprise: true },
        { name: 'Custom Dashboards', starter: false, pro: false, enterprise: true },
        { name: 'Data Export', starter: false, pro: true, enterprise: true },
      ],
    },
  ]

  const roiScenarios = [
    {
      business: 'Small Restaurant',
      problem: 'Losing 15% of orders during busy hours',
      calculation: [
        { label: 'Monthly orders', value: '500' },
        { label: 'Lost orders (15%)', value: '75' },
        { label: 'Avg order value', value: '₦3,500' },
        { label: 'Lost revenue', value: '₦262,500' },
        { label: 'Recovered with SmartFlow (95%)', value: '₦249,375' },
        { label: 'SmartFlow cost', value: '-₦25,000' },
      ],
      monthlyBenefit: '₦224,375',
      roi: '897%',
      payback: '3 weeks',
    },
    {
      business: 'E-commerce Store',
      problem: '70% cart abandonment rate',
      calculation: [
        { label: 'Monthly completed orders', value: '800' },
        { label: 'Abandoned carts (70%)', value: '1,867' },
        { label: 'Avg order value', value: '₦8,000' },
        { label: 'Lost revenue', value: '₦14,936,000' },
        { label: 'Recovered (35% recovery rate)', value: '₦5,227,600' },
        { label: 'SmartFlow cost', value: '-₦45,000' },
      ],
      monthlyBenefit: '₦5,182,600',
      roi: '11,517%',
      payback: '6 days',
    },
    {
      business: 'Professional Services',
      problem: '40% clients pay late (30+ days)',
      calculation: [
        { label: 'Monthly revenue', value: '₦4,500,000' },
        { label: 'Late payments (40%)', value: '₦1,800,000' },
        { label: 'Opportunity cost (15% annual)', value: '₦22,500' },
        { label: 'Improved to 90% on-time', value: '₦16,875' },
        { label: 'Labor cost saved', value: '₦180,000' },
        { label: 'SmartFlow cost', value: '-₦36,000' },
      ],
      monthlyBenefit: '₦160,875',
      roi: '447%',
      payback: '5 weeks',
    },
  ]

  const faqs = [
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial on all plans. No credit card required. You can test all features and see real results before committing.',
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time. If you upgrade, you pay the difference prorated. If you downgrade, the credit applies to your next billing cycle.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including bank transfer, Paystack, Flutterwave, debit/credit cards, and USSD. For Enterprise plans, we also accept purchase orders and wire transfers.',
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for Starter and Professional plans. Enterprise plans include complimentary onboarding and setup. Optional dedicated onboarding is available as an add-on for other plans.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel anytime with no penalties. For monthly plans, cancellation takes effect at the end of your billing cycle. Annual plans are non-refundable but you retain access until the end of your annual period.',
    },
    {
      question: 'Do you offer discounts for NGOs or educational institutions?',
      answer: 'Yes! We offer 30% discount for registered non-profits, NGOs, and educational institutions. Contact our sales team with your registration documents to qualify.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'You can export all your data (contacts, conversations, analytics) before canceling. We retain your data for 30 days after cancellation in case you want to reactivate. After 30 days, all data is permanently deleted.',
    },
    {
      question: 'Do you have a money-back guarantee?',
      answer: 'Yes! If you are not satisfied within the first 30 days, we will refund your payment in full, no questions asked. We are confident you will see value quickly.',
    },
    {
      question: 'How does WhatsApp Business API pricing work?',
      answer: 'WhatsApp charges per conversation (24-hour window). We include reasonable usage in all plans. For high-volume businesses, WhatsApp fees are passed through at cost (typically ₦5-15 per conversation depending on volume).',
    },
    {
      question: 'Can I get a custom package for my specific needs?',
      answer: 'Yes! Enterprise plans are fully customizable. We can create a package tailored to your exact requirements, integrations, and volume. Contact our sales team to discuss your needs.',
    },
  ]

  const getPrice = (tier: typeof pricingTiers[0]) => {
    return billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice
  }

  const getMonthlyEquivalent = (tier: typeof pricingTiers[0]) => {
    return billingCycle === 'annual' ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice
  }

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              No hidden fees. No surprises. Choose the plan that fits your business. 
              All plans include 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-2 mb-8">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-accent px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                  tier.popular
                    ? 'ring-4 ring-primary scale-105 lg:scale-110'
                    : 'border-2 border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="bg-gradient-to-r from-primary to-secondary text-white text-center py-3 font-bold">
                    🔥 Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ₦{getMonthlyEquivalent(tier).toLocaleString()}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-green-600 font-semibold mt-2">
                        ₦{getPrice(tier).toLocaleString()}/year ({tier.savings})
                      </div>
                    )}
                  </div>

                  <Link
                    href={tier.cta === 'Contact Sales' ? '/contact' : '/demo'}
                    className={`block w-full text-center py-4 px-6 rounded-lg font-bold text-lg mb-8 transition-all ${
                      tier.popular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {tier.cta}
                  </Link>

                  <div className="space-y-4 mb-6">
                    <div className="font-semibold text-gray-900">Included:</div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.notIncluded.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <div className="font-semibold text-gray-500 text-sm">Not included:</div>
                      <ul className="space-y-2">
                        {tier.notIncluded.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <XMarkIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-12 max-w-3xl mx-auto">
            All plans include: 14-day free trial • No credit card required • Cancel anytime • 
            WhatsApp Business API • Mobile & desktop apps • Regular updates
          </p>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Optional Add-ons
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your plan with additional features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-primary transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {addon.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                <div className="text-2xl font-bold text-primary">
                  ₦{addon.price.toLocaleString()}
                  <span className="text-sm text-gray-600 font-normal">/month</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what is included in each plan
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-6 font-bold text-gray-900">Features</th>
                    <th className="text-center p-6 font-bold text-gray-900">Starter</th>
                    <th className="text-center p-6 font-bold text-gray-900 bg-primary/10">
                      Professional
                    </th>
                    <th className="text-center p-6 font-bold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((category, catIndex) => (
                    <>
                      <tr key={`cat-${catIndex}`} className="bg-gray-50">
                        <td colSpan={4} className="p-4 font-bold text-gray-900">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featIndex) => (
                        <tr
                          key={`feat-${catIndex}-${featIndex}`}
                          className="border-b border-gray-200"
                        >
                          <td className="p-4 text-gray-700">{feature.name}</td>
                          <td className="p-4 text-center">
                            {typeof feature.starter === 'boolean' ? (
                              feature.starter ? (
                                <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700">{feature.starter}</span>
                            )}
                          </td>
                          <td className="p-4 text-center bg-primary/5">
                            {typeof feature.pro === 'boolean' ? (
                              feature.pro ? (
                                <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700 font-semibold">{feature.pro}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof feature.enterprise === 'boolean' ? (
                              feature.enterprise ? (
                                <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto" />
                              ) : (
                                <XMarkIcon className="w-6 h-6 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-700">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Scenarios */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real ROI Examples
            </h2>
            <p className="text-xl text-gray-600">
              See how businesses like yours benefit from SmartFlow
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {roiScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {scenario.business}
                </h3>
                <p className="text-sm text-red-600 font-semibold mb-6">
                  Problem: {scenario.problem}
                </p>

                <div className="space-y-2 mb-6">
                  {scenario.calculation.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between text-sm ${
                        item.label.includes('cost')
                          ? 'text-red-600 font-semibold'
                          : item.label.includes('Recovered') || item.label.includes('saved')
                          ? 'text-green-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>{item.label}:</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-300">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600 mb-1">Net Monthly Benefit</div>
                    <div className="text-3xl font-bold text-green-700">
                      {scenario.monthlyBenefit}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-600">ROI</div>
                      <div className="text-lg font-bold text-green-700">{scenario.roi}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Payback</div>
                      <div className="text-lg font-bold text-green-700">{scenario.payback}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We have got answers.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                  <span className="text-2xl text-gray-400 flex-shrink-0">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Start your 14-day free trial today. No credit card required. 
              See results in the first week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Talk to Sales
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Join 200+ Nigerian businesses already using SmartFlow
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
