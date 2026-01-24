'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  CalendarIcon,
  BellIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function HotelsPage() {
  const [monthlyBookings, setMonthlyBookings] = useState(120)
  const [avgRoomRate, setAvgRoomRate] = useState(25000)
  const [noShowRate, setNoShowRate] = useState(15)

  // ROI Calculations
  const lostBookings = monthlyBookings * (noShowRate / 100)
  const recoveredBookings = lostBookings * 0.85 // 85% recovery with reminders
  const recoveredRevenue = recoveredBookings * avgRoomRate
  const manualLaborCost = 180000 // ₦180K per month for reception staff
  const totalSavings = recoveredRevenue + manualLaborCost
  const automationCost = 40000 // Hotel package
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
                Hotel Automation for Nigerian Hospitality
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Stop double bookings and no-shows. Automate reservations, guest communication, 
                check-ins, and post-stay follow-ups. Fill more rooms effortlessly.
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
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-white/80">Booking Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦600K</div>
                  <div className="text-white/80">Extra Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-white/80">Show-up Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">4.8★</div>
                  <div className="text-white/80">Avg. Rating</div>
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
              Hotel Management Headaches
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '📅',
                title: 'Double Booking Disasters',
                description: 'Booking.com says available, your register says booked. Guest arrives, no room. Reputation destroyed.',
                stat: '₦200K lost/incident',
              },
              {
                icon: '👻',
                title: 'No-Show Nightmare',
                description: '15% of guests never show up. Empty rooms you could have sold. ₦300K lost revenue monthly.',
                stat: '15% no-show rate',
              },
              {
                icon: '📞',
                title: 'Manual Booking Chaos',
                description: 'Phone calls, WhatsApp messages, emails, walk-ins. Your reception drowning trying to track everything.',
                stat: '6hrs daily wasted',
              },
              {
                icon: '❓',
                title: 'Guest Communication Gap',
                description: 'No pre-arrival info sent. Check-in instructions unclear. Guests calling "How do I get there?" at midnight.',
                stat: '50+ daily calls',
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
              Complete Hotel Automation
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: CalendarIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Smart Booking Management',
                description: 'Sync bookings from Booking.com, Hotels.ng, WhatsApp, and direct bookings into one system. Real-time availability everywhere. Zero double bookings.',
                results: ['98% booking accuracy', 'Zero double bookings', 'Multi-platform sync'],
                savings: '₦200K/month saved',
              },
              {
                icon: BellIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Automated Guest Reminders',
                description: 'Send booking confirmation, 24-hour reminder, check-in instructions automatically. Reduce no-shows by 85%. Never lose revenue to empty rooms again.',
                results: ['85% show-up rate', 'Automated reminders', '₦600K recovered monthly'],
                savings: '₦600K/month recovered',
              },
              {
                icon: ChatBubbleLeftRightIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: 'Guest Communication Hub',
                description: 'All guest messages (WhatsApp, SMS, email) in one place. Pre-arrival info sent automatically. Check-in/out instructions. Special requests tracked.',
                results: ['80% fewer calls', 'Better guest experience', 'Staff can focus on service'],
                savings: '4hrs saved daily',
              },
              {
                icon: UserGroupIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: 'Guest Database & Preferences',
                description: 'Remember returning guests. Their room preference, dietary needs, special occasions. Personalize experience automatically. Build loyalty that lasts.',
                results: ['40% repeat bookings', 'Personalized service', 'Higher ratings'],
                savings: '₦250K/month loyalty',
              },
              {
                icon: StarIcon,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                title: 'Review Collection Automation',
                description: 'Send post-stay thank you message. Request reviews automatically. Respond to feedback quickly. Improve your online ratings consistently.',
                results: ['3x more reviews', 'Better ratings', 'Higher visibility'],
                savings: '20% more bookings',
              },
              {
                icon: ChartBarIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Occupancy Analytics',
                description: 'See booking trends, peak seasons, revenue per room. Make smart pricing decisions. Maximize occupancy and revenue.',
                results: ['Data-driven pricing', 'Maximize occupancy', 'Revenue optimization'],
                savings: '15% revenue increase',
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
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Case Study: Serenity Suites, Abuja
                </h2>
                <p className="text-xl text-white/90">
                  From 65% occupancy to 92% in 4 months
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        'Double booked 3 times in one month',
                        '20% no-show rate (₦480K lost monthly)',
                        'Reception staff overwhelmed',
                        'Guests complaining about poor communication',
                        'Rating stuck at 3.9★',
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
                        'Zero double bookings in 4 months',
                        '5% no-show rate (recovered ₦360K monthly)',
                        'Staff relaxed, guests happy',
                        'Guests praising "excellent communication"',
                        'Rating jumped to 4.7★',
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
                      <div className="text-3xl font-bold text-green-700 mb-2">₦720K</div>
                      <div className="text-sm text-gray-700">Extra revenue monthly</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">27%</div>
                      <div className="text-sm text-gray-700">Occupancy increase</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">6 weeks</div>
                      <div className="text-sm text-gray-700">Payback period</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-purple-600">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "The no-show recovery alone paid for SmartFlow in the first month. 
                    But the real value is peace of mind - no more double booking stress."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Ibrahim Suleiman, General Manager
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
              Calculate Your Hotel's ROI
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Bookings: {monthlyBookings}
                </label>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={monthlyBookings}
                  onChange={(e) => setMonthlyBookings(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Room Rate: ₦{avgRoomRate.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={avgRoomRate}
                  onChange={(e) => setAvgRoomRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No-Show Rate: {noShowRate}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={noShowRate}
                  onChange={(e) => setNoShowRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                💰 Your Monthly Savings with SmartFlow
              </h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Recovered Revenue</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{recoveredRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    ({recoveredBookings.toFixed(0)} bookings saved)
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
              Hotel Package Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-600"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">Hotel Complete Package</h3>
                <p className="text-white/90">Everything your hotel needs</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦40,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 1,450% • Payback: 6 weeks
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">✨ Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        'Multi-platform booking sync',
                        'Automated guest reminders & confirmations',
                        'Guest communication hub',
                        'Guest database & preferences',
                        'Review collection automation',
                        'Occupancy analytics dashboard',
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
                        'Full setup & staff training',
                        'WhatsApp Business API',
                        'Custom booking forms',
                        'Priority support',
                        'Free monthly consultation',
                        'Revenue optimization tips',
                      ].map((bonus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
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
              Ready to Fill More Rooms?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 30+ Nigerian hotels using SmartFlow to maximize occupancy and guest satisfaction.
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
