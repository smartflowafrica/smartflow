'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  HomeModernIcon,
  BellAlertIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function RealEstatePage() {
  const [monthlyLeads, setMonthlyLeads] = useState(150)
  const [avgPropertyValue, setAvgPropertyValue] = useState(5000000)
  const [commissionRate, setCommissionRate] = useState(5)
  const [leadLossRate, setLeadLossRate] = useState(40)

  // ROI Calculations
  const lostLeads = monthlyLeads * (leadLossRate / 100)
  const recoveredLeads = lostLeads * 0.60 // 60% recovery with automation
  const dealsClosed = recoveredLeads * 0.15 // 15% conversion rate
  const commission = (avgPropertyValue * commissionRate) / 100
  const recoveredRevenue = dealsClosed * commission
  const manualLaborCost = 200000 // ₦200K per month for admin
  const totalSavings = recoveredRevenue + manualLaborCost
  const automationCost = 42000 // Real estate package
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
                Real Estate Automation for Nigerian Agents
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Stop losing leads. Automate lead capture, property inquiries, viewing schedules, 
                follow-ups, and document management. Close more deals with less effort.
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
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Lead Capture</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦900K</div>
                  <div className="text-white/80">Extra Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">60%</div>
                  <div className="text-white/80">Lead Recovery</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">4 hrs</div>
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
              Real Estate Agent Struggles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '😫',
                title: 'Lost Leads',
                description: 'Lead calls at 9pm. You miss it. They call another agent. Deal lost. 40% of leads lost this way.',
                stat: '40% leads lost',
              },
              {
                icon: '📞',
                title: 'Manual Follow-up Hell',
                description: 'Tracking who to call, when, about which property. Spreadsheet chaos. Leads falling through cracks.',
                stat: '₦2M+ lost yearly',
              },
              {
                icon: '🗓️',
                title: 'Viewing Coordination Nightmare',
                description: 'Back-and-forth WhatsApp messages. "When are you free?" "Is 3pm okay?" Days wasted scheduling one viewing.',
                stat: '5hrs weekly wasted',
              },
              {
                icon: '📄',
                title: 'Document Management Mess',
                description: 'Property docs, client IDs, contracts scattered everywhere. Searching for hours when needed urgently.',
                stat: 'High stress',
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
              Complete Real Estate Automation
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: HomeModernIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: '24/7 Lead Capture',
                description: 'Never miss a lead. Automated WhatsApp responses to property inquiries 24/7. Capture contact details, property preferences, budget instantly.',
                results: ['100% lead capture', '24/7 availability', 'Instant responses'],
                savings: '₦900K/month recovered',
              },
              {
                icon: BellAlertIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Smart Follow-up Automation',
                description: 'Automated follow-ups based on lead stage. Interested in 2-bedroom? System sends similar properties automatically. Hot lead gone cold? Re-engagement message sent.',
                results: ['60% lead recovery', 'Perfect timing', 'Personalized messages'],
                savings: '₦600K/month deals',
              },
              {
                icon: CalendarIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Viewing Scheduler',
                description: 'Clients book viewings via WhatsApp. System checks your availability, confirms time, sends reminders, directions automatically.',
                results: ['Zero back-and-forth', '90% show-up rate', '4hrs saved weekly'],
                savings: '₦150K/month labor',
              },
              {
                icon: UserGroupIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: 'Lead Database & Segmentation',
                description: 'Every lead automatically saved with preferences, budget, interaction history. Segment by property type, budget, location. Target the right people.',
                results: ['Complete lead history', 'Smart segmentation', 'Better targeting'],
                savings: '3x conversion rate',
              },
              {
                icon: DocumentDuplicateIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                title: 'Document Management',
                description: 'Store all property documents, client IDs, contracts in one secure place. Search and find in seconds. Share with clients instantly.',
                results: ['Instant access', 'Secure storage', 'Easy sharing'],
                savings: '2hrs saved weekly',
              },
              {
                icon: ChartBarIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Sales Pipeline Analytics',
                description: 'See your entire sales pipeline. Which properties getting most interest. Which leads are hot. Where deals are stuck. Make data-driven decisions.',
                results: ['Full pipeline visibility', 'Performance tracking', 'Better forecasting'],
                savings: '30% more closings',
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
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Case Study: Prime Properties, Lagos
                </h2>
                <p className="text-xl text-white/90">
                  From 2 deals/month to 7 deals/month in 3 months
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        'Missing 50+ leads monthly (called after hours)',
                        'Spending 15hrs/week on follow-ups',
                        'Forgetting to follow up on hot leads',
                        'Viewings taking days to schedule',
                        'Closing only 2 deals per month',
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
                        'Capturing 100% of leads 24/7',
                        '3hrs/week on follow-ups (automated)',
                        'System reminds about every hot lead',
                        'Viewings scheduled in under 2 minutes',
                        'Closing 7 deals per month',
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
                      <div className="text-3xl font-bold text-green-700 mb-2">₦5.2M</div>
                      <div className="text-sm text-gray-700">Extra commission monthly</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">250%</div>
                      <div className="text-sm text-gray-700">Deals increase</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">1 week</div>
                      <div className="text-sm text-gray-700">Payback period</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-orange-600">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "I was drowning in leads and still losing deals. SmartFlow organized everything. 
                    Now I am closing 3x more deals with less stress. Best investment ever."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Biodun Adeyemi, Senior Agent
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
              Calculate Your Real Estate ROI
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Leads: {monthlyLeads}
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Property Value: ₦{avgPropertyValue.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="1000000"
                  value={avgPropertyValue}
                  onChange={(e) => setAvgPropertyValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Commission Rate: {commissionRate}%
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lead Loss Rate: {leadLossRate}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={leadLossRate}
                  onChange={(e) => setLeadLossRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💰 Your Monthly Benefit with SmartFlow
              </h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Extra Deals Closed</div>
                  <div className="text-2xl font-bold text-green-700">
                    {dealsClosed.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (from {recoveredLeads.toFixed(0)} recovered leads)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Extra Commission</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{recoveredRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Labor Saved</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{manualLaborCost.toLocaleString()}
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
              Real Estate Package Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-orange-600"
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">Real Estate Complete Package</h3>
                <p className="text-white/90">Everything you need to close more deals</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦42,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 2,043% • Pays for itself with just 1 extra deal
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">✨ Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        '24/7 lead capture automation',
                        'Smart follow-up sequences',
                        'Viewing scheduler & reminders',
                        'Lead database & segmentation',
                        'Document management system',
                        'Sales pipeline analytics',
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
                        'Property listing templates',
                        'Priority support',
                        'Free monthly strategy call',
                        'Performance reports',
                      ].map((bonus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
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
              Ready to Close More Deals?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 60+ Nigerian real estate agents using SmartFlow to capture more leads and close more deals.
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
