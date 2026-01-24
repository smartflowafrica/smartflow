'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellAlertIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'

export default function EcommercePage() {
  const [monthlyOrders, setMonthlyOrders] = useState(800)
  const [avgOrderValue, setAvgOrderValue] = useState(8000)
  const [cartAbandonmentRate, setCartAbandonmentRate] = useState(70)

  // ROI Calculations
  const cartAbandoned = monthlyOrders * (cartAbandonmentRate / 100)
  const recoveredCarts = cartAbandoned * 0.35 // 35% recovery rate
  const recoveredRevenue = recoveredCarts * avgOrderValue
  const manualProcessingCost = 150000 // ₦150K per month
  const totalSavings = recoveredRevenue + manualProcessingCost
  const automationCost = 45000 // E-commerce package
  const netBenefit = totalSavings - automationCost
  const roi = ((netBenefit / automationCost) * 100).toFixed(0)

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
                E-commerce Automation for Nigerian Online Stores
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Stop losing abandoned carts. Automate order processing, inventory sync, 
                customer service, and payment collection. Sell more while doing less.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  See Live Demo
                </Link>
                <Link
                  href="#roi-calculator"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
                >
                  Calculate Your ROI
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
                  <div className="text-4xl font-bold mb-2">35%</div>
                  <div className="text-white/80">Cart Recovery</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦800K</div>
                  <div className="text-white/80">Extra Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="text-white/80">Order Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">5 hrs</div>
                  <div className="text-white/80">Saved Daily</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
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
              E-commerce Challenges Killing Your Growth
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '🛒',
                title: 'Abandoned Cart Nightmare',
                description: '70% of customers add to cart but never checkout. That is ₦2M in lost sales every month.',
                stat: '70% abandonment',
              },
              {
                icon: '📦',
                title: 'Manual Order Processing',
                description: 'Copy order from Instagram, paste to WhatsApp, update spreadsheet, send invoice. 5 hours daily wasted.',
                stat: '5hrs wasted daily',
              },
              {
                icon: '🔢',
                title: 'Inventory Chaos',
                description: 'Sold out on Jumia but showing available on your site. Angry customers, cancelled orders, lost reputation.',
                stat: '₦150K monthly losses',
              },
              {
                icon: '💬',
                title: 'Customer Service Overload',
                description: '"Where is my order?" x 100. Your team drowning in repetitive questions while new orders pile up.',
                stat: '80% repeat questions',
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-red-100 shadow-lg"
              >
                <div className="text-5xl mb-4 text-center">{problem.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{problem.description}</p>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-red-600 font-semibold">Impact:</div>
                  <div className="text-sm font-bold text-red-700">{problem.stat}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
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
              Complete E-commerce Automation
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: InboxIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Abandoned Cart Recovery',
                description: 'Automatically send WhatsApp reminders to customers who abandoned carts. Include product images, special discount codes, easy checkout links.',
                results: ['35% cart recovery rate', '₦800K+ extra revenue monthly', 'Personalized messages'],
                savings: '₦800K/month recovered',
              },
              {
                icon: ShoppingCartIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Multi-Channel Order Sync',
                description: 'Orders from website, Instagram, WhatsApp, Jumia all flow to one dashboard. No more copying and pasting. Perfect accuracy.',
                results: ['All channels in one place', '95% accuracy rate', 'Real-time updates'],
                savings: '5hrs saved daily',
              },
              {
                icon: ChartBarIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: 'Inventory Management',
                description: 'Real-time inventory sync across all platforms. Sell on Jumia, stock updates everywhere. Never oversell again.',
                results: ['Zero overselling', 'Multi-platform sync', 'Low stock alerts'],
                savings: '₦150K/month saved',
              },
              {
                icon: CreditCardIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: 'Payment Automation',
                description: 'Generate payment links instantly. Send via WhatsApp. Track who paid. Auto-send receipts. Paystack & Flutterwave integrated.',
                results: ['30sec checkout', '99% payment success', 'Zero manual invoicing'],
                savings: '₦120K/month labor',
              },
              {
                icon: BellAlertIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                title: 'Customer Notifications',
                description: 'Order confirmed, payment received, shipped, out for delivery, delivered - customers updated every step automatically.',
                results: ['80% fewer inquiries', 'Happy customers', 'Better reviews'],
                savings: '3hrs saved daily',
              },
              {
                icon: UserGroupIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Customer Segmentation',
                description: 'Tag customers by purchase history. Send targeted campaigns to high-spenders, win back inactive customers, reward loyal ones.',
                results: ['3x repeat purchases', 'Targeted marketing', 'Higher LTV'],
                savings: '25% revenue increase',
              },
            ].map((solution, index) => {
              const Icon = solution.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-8 shadow-lg"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 ${solution.bgColor} rounded-xl flex-shrink-0`}>
                      <Icon className={`w-10 h-10 ${solution.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {solution.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{solution.description}</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 font-semibold mb-2">Results:</div>
                          <ul className="space-y-1">
                            {solution.results.map((result, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-xs text-green-700 font-semibold mb-1">💰 Impact:</div>
                          <div className="text-lg font-bold text-green-700">{solution.savings}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Case Study: StyleHub Fashion, Lagos
                </h2>
                <p className="text-xl text-white/90">
                  From ₦3M to ₦7.2M monthly revenue in 6 months
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        '65% cart abandonment (₦1.95M lost monthly)',
                        'Team of 4 processing orders manually',
                        'Overselling causing customer complaints',
                        'No way to track repeat customers',
                        'Spending ₦200K on ads but low ROI',
                      ].map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 flex-shrink-0">✗</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-600 mb-4">✅ After SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        '35% cart abandonment (recovered ₦900K monthly)',
                        'Team of 2, processing 3x more orders',
                        'Zero overselling, perfect inventory sync',
                        'Segmented database of 5,000+ customers',
                        'Same ad spend, 2.5x return',
                      ].map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                  <div className="grid sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">₦4.2M</div>
                      <div className="text-sm text-gray-700">Revenue increase</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">140%</div>
                      <div className="text-sm text-gray-700">Growth rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">8 weeks</div>
                      <div className="text-sm text-gray-700">Payback period</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-blue-600">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "SmartFlow transformed our business. We are now processing 3x more orders with half the team. 
                    The abandoned cart recovery alone pays for the system 20 times over."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Tunde Bakare, Founder
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your E-commerce ROI
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Orders (Completed): {monthlyOrders}
                </label>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Order Value: ₦{avgOrderValue.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cart Abandonment Rate: {cartAbandonmentRate}%
                </label>
                <input
                  type="range"
                  min="40"
                  max="85"
                  step="5"
                  value={cartAbandonmentRate}
                  onChange={(e) => setCartAbandonmentRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💰 Your Monthly Benefit with SmartFlow
              </h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Recovered Revenue</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{recoveredRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ({recoveredCarts.toFixed(0)} carts recovered)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Labor Saved</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{manualProcessingCost.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Investment</div>
                  <div className="text-2xl font-bold text-gray-700">
                    -₦{automationCost.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-green-300 pt-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Net Monthly Benefit</div>
                  <div className="text-5xl font-bold text-green-700 mb-4">
                    ₦{netBenefit.toLocaleString()}
                  </div>
                  <div className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold">
                    {roi}% ROI
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/demo" className="btn-primary inline-block">
                See It In Action - Book Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
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
              E-commerce Package Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-600"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">E-commerce Complete Package</h3>
                <p className="text-white/90">Everything your online store needs</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦45,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 1,689% • Payback: 8 weeks
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">✨ Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        'Abandoned cart recovery automation',
                        'Multi-channel order sync (IG, WhatsApp, Website, Jumia)',
                        'Real-time inventory management',
                        'Payment link generation (Paystack/Flutterwave)',
                        'Customer segmentation & database',
                        'Automated order notifications',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">🎁 Bonuses:</h4>
                    <ul className="space-y-2">
                      {[
                        'Full setup & training',
                        'Sales analytics dashboard',
                        'WhatsApp Business API',
                        'Product catalog management',
                        'Priority support',
                        'Free monthly strategy call',
                      ].map((bonus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          {bonus}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/demo" className="btn-primary inline-block mb-4">
                    Start Free Trial
                  </Link>
                  <p className="text-sm text-gray-600">
                    💳 No credit card required • 🎯 Cancel anytime • 💰 Money-back guarantee
                  </p>
                </div>
              </div>
            </motion.div>
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
              Stop Losing Revenue to Abandoned Carts
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 100+ Nigerian e-commerce stores using SmartFlow to automate and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Book Free Demo
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
