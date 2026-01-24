'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  BriefcaseIcon,
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  UserPlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function ProfessionalServicesPage() {
  const [monthlyClients, setMonthlyClients] = useState(30)
  const [avgProjectValue, setAvgProjectValue] = useState(150000)
  const [latePaymentRate, setLatePaymentRate] = useState(40)

  // ROI Calculations
  const monthlyRevenue = monthlyClients * avgProjectValue
  const latePayments = monthlyRevenue * (latePaymentRate / 100)
  const onTimePayments = latePayments * 0.75 // 75% converted to on-time with automation
  const manualLaborCost = 180000 // ₦180K per month for admin
  const totalSavings = onTimePayments * 0.15 + manualLaborCost // 15% interest/opportunity cost on late payments
  const automationCost = 36000 // Professional services package
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
                Professional Services Automation
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                For consultants, lawyers, accountants, designers, coaches. Automate client onboarding, 
                scheduling, invoicing, project updates. Focus on your expertise, not admin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  See Live Demo
                </Link>
                <Link
                  href="#roi-calculator"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
                >
                  Calculate Savings
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
                  <div className="text-4xl font-bold mb-2">90%</div>
                  <div className="text-white/80">On-Time Payments</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦550K</div>
                  <div className="text-white/80">Extra Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">6 hrs</div>
                  <div className="text-white/80">Saved Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Client Satisfaction</div>
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
              Professional Services Challenges
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '🤝',
                title: 'Manual Client Onboarding',
                description: 'New client? Send contract via email. Wait. Follow up. Send again. Get signed copy. Upload to folder. 3 days wasted.',
                stat: '3 days per client',
              },
              {
                icon: '📅',
                title: 'Scheduling Back-and-Forth',
                description: '"Are you free Tuesday?" "No, how about Thursday?" "Morning or afternoon?" 20 messages to book one meeting.',
                stat: '6hrs weekly wasted',
              },
              {
                icon: '💸',
                title: 'Chasing Payments',
                description: '40% of clients pay late. You are too nice to chase hard. Cash flow suffering. You need that money.',
                stat: '₦2M+ stuck',
              },
              {
                icon: '📊',
                title: 'No Project Visibility',
                description: 'Client asks "How is my project?" You scramble to remember. No clear status. Client loses confidence.',
                stat: 'Low retention',
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
              Complete Professional Services Automation
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: UserPlusIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Automated Client Onboarding',
                description: 'New client signs up? System automatically sends welcome message, contract, intake form, payment link. Everything happens in 5 minutes, not 3 days.',
                results: ['5min onboarding', '100% completion rate', 'Professional impression'],
                savings: '4hrs saved per client',
              },
              {
                icon: CalendarIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Smart Scheduling',
                description: 'Share your booking link via WhatsApp. Clients see your availability, book instantly. Calendar synced. Reminders sent automatically. Zero back-and-forth.',
                results: ['Zero scheduling calls', 'Instant booking', '95% show-up rate'],
                savings: '6hrs saved weekly',
              },
              {
                icon: CreditCardIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: 'Automated Invoicing & Payment Reminders',
                description: 'Invoice generated and sent instantly. Payment reminders sent automatically before and after due date. Get paid 90% on time.',
                results: ['90% on-time payments', 'Automated reminders', 'Better cash flow'],
                savings: '₦550K/month recovered',
              },
              {
                icon: DocumentTextIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Project Status Updates',
                description: 'Send automatic project milestones updates to clients. "Design completed", "Review ready", "Final delivered". Clients always informed.',
                results: ['Proactive communication', 'Higher satisfaction', 'Fewer inquiries'],
                savings: '3hrs saved weekly',
              },
              {
                icon: BriefcaseIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: 'Client Portal & Documents',
                description: 'Every client gets secure portal. View project status, access documents, make payments, send messages. Everything in one place.',
                results: ['Professional experience', 'Easy collaboration', 'Better organization'],
                savings: '40% efficiency gain',
              },
              {
                icon: ChartBarIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                title: 'Business Analytics',
                description: 'Track revenue, active projects, payment status, client retention. See which services most profitable. Make data-driven decisions.',
                results: ['Full visibility', 'Revenue tracking', 'Growth insights'],
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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Case Study: Apex Consulting, Abuja
                </h2>
                <p className="text-xl text-white/90">
                  From overwhelmed solo consultant to organized firm
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        'Spending 15hrs/week on admin tasks',
                        '45% of clients paying 30+ days late',
                        'Losing clients due to poor communication',
                        'Onboarding taking 3-5 days per client',
                        'Could only handle 20 clients',
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
                        '3hrs/week on admin (all automated)',
                        '85% of clients pay within 7 days',
                        '95% client retention rate',
                        'Onboarding happens in 5 minutes',
                        'Now managing 45 clients comfortably',
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
                      <div className="text-3xl font-bold text-green-700 mb-2">₦680K</div>
                      <div className="text-sm text-gray-700">Extra monthly revenue</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">125%</div>
                      <div className="text-sm text-gray-700">Client increase</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">12 hrs</div>
                      <div className="text-sm text-gray-700">Saved weekly</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-indigo-600">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "SmartFlow freed me from admin hell. I doubled my client base without hiring anyone. 
                    Now I actually spend time on consulting, not chasing payments."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Chioma Nwosu, Principal Consultant
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
              Calculate Your Professional Services ROI
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Active Clients: {monthlyClients}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={monthlyClients}
                  onChange={(e) => setMonthlyClients(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Project Value: ₦{avgProjectValue.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="50000"
                  value={avgProjectValue}
                  onChange={(e) => setAvgProjectValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Late Payment Rate: {latePaymentRate}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={latePaymentRate}
                  onChange={(e) => setLatePaymentRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💰 Your Monthly Savings with SmartFlow
              </h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Improved Cash Flow</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{(onTimePayments * 0.15).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (from on-time payments)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Labor Saved</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{manualLaborCost.toLocaleString()}
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
                    ₦{netBenefit.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                  <div className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold">
                    {roi}% ROI
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/demo" className="btn-primary inline-block">
                Book Free Demo
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
              Professional Services Package Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-600"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">Professional Services Complete Package</h3>
                <p className="text-white/90">Everything you need to scale your practice</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦36,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 1,528% • Payback: 4 weeks
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">✨ Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        'Automated client onboarding',
                        'Smart scheduling system',
                        'Automated invoicing & payment reminders',
                        'Project status updates',
                        'Client portal & document management',
                        'Business analytics dashboard',
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
                        'WhatsApp Business API',
                        'Contract templates',
                        'Priority support',
                        'Free monthly consultation',
                        'Growth strategies',
                      ].map((bonus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
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
              Ready to Scale Your Practice?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 80+ Nigerian professionals using SmartFlow to serve more clients with less admin.
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
