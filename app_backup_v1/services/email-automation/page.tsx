'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  InboxIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  BoltIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'

export default function EmailAutomationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Email Marketing Automation
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Send the right message at the right time. Automate welcome sequences, 
                cart recovery, and follow-ups that actually convert.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  Schedule Free Demo
                </Link>
                <Link href="#pricing" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center">
                  View Pricing
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-white/80">Emails Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">45%</div>
                  <div className="text-white/80">Open Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3x</div>
                  <div className="text-white/80">Conversion vs Manual</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2hrs</div>
                  <div className="text-white/80">Saved Daily</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Email Automation Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to turn email into your top revenue channel
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: EnvelopeIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: 'Welcome Email Sequences',
                  description: 'New subscriber? Automatically send a series of emails introducing your brand, building trust, and driving first purchase.',
                  stat: '60% higher engagement',
                },
                {
                  icon: InboxIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'Abandoned Cart Recovery',
                  description: 'Customer left items in cart? Send perfectly timed reminders with special offers. Recover 20-30% of abandoned carts.',
                  stat: 'Recover ₦200K+ monthly',
                },
                {
                  icon: PaperAirplaneIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Post-Purchase Follow-Ups',
                  description: 'Order delivered? Automatically request reviews, suggest related products, and turn one-time buyers into repeat customers.',
                  stat: '3x repeat purchase rate',
                },
                {
                  icon: UsersIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Newsletter Automation',
                  description: 'Schedule newsletters, product announcements, and promotions in advance. Set it and forget it.',
                  stat: 'Save 5 hours weekly',
                },
                {
                  icon: BoltIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'A/B Testing',
                  description: 'Test subject lines, content, and send times automatically. System picks the winner and sends to remaining subscribers.',
                  stat: '40% better results',
                },
                {
                  icon: ChartBarIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'Analytics & Reporting',
                  description: 'See open rates, click rates, conversions, and revenue per email. Know exactly what works.',
                  stat: 'Real-time insights',
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 shadow-lg flex items-start gap-6"
                  >
                    <div className={`p-4 ${feature.bgColor} rounded-xl flex-shrink-0`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{feature.description}</p>
                      <div className={`inline-block ${feature.bgColor} ${feature.color} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {feature.stat}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
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
              Perfect For Your Business Type
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                industry: '🛍️ E-commerce',
                useCase: 'Abandoned Cart Recovery',
                example: 'Fashion store sends cart reminder with 10% discount after 24 hours',
                result: 'Recovered ₦280K in abandoned carts monthly',
              },
              {
                industry: '💼 SaaS',
                useCase: 'Onboarding Sequences',
                example: 'Software company sends 7-day onboarding email series to new users',
                result: '60% higher activation rate, 40% less churn',
              },
              {
                industry: '📝 Content Creators',
                useCase: 'Newsletter Automation',
                example: 'Blogger schedules weekly newsletter and product promotions automatically',
                result: '5 hours saved weekly, ₦150K extra monthly income',
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="text-4xl mb-3">{useCase.industry.split(' ')[0]}</div>
                <div className="text-sm text-gray-500 mb-1">{useCase.industry.substring(3)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.useCase}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 italic">{useCase.example}</p>
                </div>
                <div className="bg-secondary/10 text-secondary px-3 py-2 rounded-lg text-sm font-semibold">
                  {useCase.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              How Email Automation Works
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your Email Platform',
                description: 'We integrate with Mailchimp, SendGrid, Mailerlite, or your existing email service.',
              },
              {
                step: '02',
                title: 'Design Your Sequences',
                description: 'We help you create effective email sequences based on customer behavior and best practices.',
              },
              {
                step: '03',
                title: 'Set Triggers & Timing',
                description: 'Define when emails send: after signup, abandoned cart, purchase, etc. System handles the rest.',
              },
              {
                step: '04',
                title: 'Monitor & Optimize',
                description: 'Track performance, run A/B tests, and continuously improve your email results.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Email Automation Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border-2 border-primary/20">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Email Automation Package
            </h3>
            <div className="text-5xl font-bold text-primary mb-4">
              ₦25,000<span className="text-2xl text-gray-600">/month</span>
            </div>
            <p className="text-gray-700 mb-8">
              Add to your base automation plan or use standalone
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              {[
                'Up to 10,000 emails/month',
                'Unlimited sequences',
                'A/B testing included',
                'Advanced segmentation',
                'Real-time analytics',
                'Email platform integration',
                'Template library',
                'Priority support',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Link href="/demo" className="btn-primary inline-block">
              Schedule Demo
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Higher volume? Contact us for custom pricing
            </p>
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
              Ready to Turn Email Into Your Top Revenue Channel?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join Nigerian businesses using email automation to recover abandoned carts, 
              onboard customers, and drive repeat purchases on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Schedule Free Demo
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Talk to Our Team
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              7-day free trial • No credit card required • Setup in 3-5 days
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
