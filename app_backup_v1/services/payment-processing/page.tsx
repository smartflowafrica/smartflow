'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export default function PaymentProcessingPage() {
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
                Payment Processing Automation
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Get paid faster with automated payment links. Accept Paystack, Flutterwave, 
                and bank transfers directly in your customer conversations.
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
                  <div className="text-4xl font-bold mb-2">₦50M+</div>
                  <div className="text-white/80">Processed Monthly</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-white/80">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">30sec</div>
                  <div className="text-white/80">Payment Time</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Zero</div>
                  <div className="text-white/80">Manual Invoicing</div>
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
                Everything You Need to Accept Payments
              </h2>
              <p className="text-xl text-gray-600">
                Nigerian payment methods your customers actually use
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: CreditCardIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: 'Paystack & Flutterwave Integration',
                  description: 'Accept card payments, bank transfers, USSD, and mobile money. Customers pay however they want.',
                  stat: 'All Nigerian payment methods',
                },
                {
                  icon: BoltIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'Automated Payment Link Generation',
                  description: 'Customer ready to pay? System instantly generates a secure payment link and sends it via WhatsApp or email.',
                  stat: 'Links sent in under 5 seconds',
                },
                {
                  icon: CheckCircleIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Payment Confirmation Automation',
                  description: 'Payment received? Customer automatically gets receipt, order confirmation, and tracking. No manual work.',
                  stat: '100% automated confirmations',
                },
                {
                  icon: BanknotesIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Invoice Creation',
                  description: 'Generate professional invoices automatically. Send reminders for unpaid invoices. Track payment status.',
                  stat: 'Save 3 hours daily',
                },
                {
                  icon: ShoppingCartIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'Recurring Billing',
                  description: 'Subscription business? Set up automatic recurring charges. System handles renewals, failed payments, and reminders.',
                  stat: '95% retention rate',
                },
                {
                  icon: ChartBarIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'Payment Analytics',
                  description: 'See total revenue, successful vs failed payments, popular payment methods, and customer payment behavior.',
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

      {/* Payment Methods Section */}
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
              Accept Every Nigerian Payment Method
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '💳', name: 'Debit Cards', description: 'Verve, Mastercard, Visa' },
              { icon: '🏦', name: 'Bank Transfer', description: 'Direct bank transfers' },
              { icon: '📱', name: 'USSD', description: 'Dial to pay' },
              { icon: '💰', name: 'Mobile Money', description: 'MTN, Airtel, etc.' },
              { icon: '🌐', name: 'Paystack', description: 'Full integration' },
              { icon: '⚡', name: 'Flutterwave', description: 'All payment types' },
              { icon: '🏪', name: 'POS', description: 'Coming soon' },
              { icon: '🔐', name: 'Crypto', description: 'Bitcoin, USDT' },
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-5xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {method.name}
                </h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
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
              Perfect For Every Business Model
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                industry: '🛍️ E-commerce',
                useCase: 'Instant Checkout Links',
                example: 'Customer picks products on WhatsApp, bot sends payment link, order auto-confirmed',
                result: '₦2M+ monthly revenue, 30sec checkout time',
              },
              {
                industry: '🏨 Service Providers',
                useCase: 'Service Payment Collection',
                example: 'Hair salon sends appointment confirmation with payment link, tracks payments',
                result: '90% prepayment rate, zero no-shows',
              },
              {
                industry: '📱 Subscriptions',
                useCase: 'Recurring Payment Automation',
                example: 'SaaS charges customers monthly, handles failed payments, sends renewal reminders',
                result: '95% retention, ₦800K MRR',
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="text-4xl mb-3">{useCase.industry.split(' ')[0]}</div>
                <div className="text-sm text-gray-500 mb-1">{useCase.industry.substring(3)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.useCase}
                </h3>
                <div className="bg-white rounded-lg p-4 mb-4">
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

      {/* Security Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl text-center">
              <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bank-Level Security
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Your customers payment data is protected with the same security Nigerian banks use
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-bold text-gray-900 mb-2">256-bit SSL Encryption</div>
                  <div className="text-gray-600">Same as online banking</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-bold text-gray-900 mb-2">PCI DSS Compliant</div>
                  <div className="text-gray-600">International standards</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-bold text-gray-900 mb-2">Fraud Detection</div>
                  <div className="text-gray-600">AI-powered protection</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Processing Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Automation Package
            </h3>
            <div className="text-5xl font-bold text-primary mb-2">
              ₦30,000<span className="text-2xl text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">+ Standard payment gateway fees</p>
            <p className="text-gray-700 mb-8">
              Add to your base automation plan or use standalone
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
              {[
                'Paystack & Flutterwave integration',
                'Unlimited payment links',
                'Automated confirmations',
                'Invoice generation',
                'Recurring billing',
                'Payment analytics',
                'Failed payment recovery',
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
            <p className="text-sm text-gray-500 mt-6">
              Payment gateway fees: Paystack (1.5% + ₦100) • Flutterwave (1.4%)
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
              Ready to Get Paid Faster?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Stop chasing payments. Start collecting money automatically with payment 
              links sent directly to your customers.
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
              Setup in 2-3 days • Bank-level security • All Nigerian payment methods
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
