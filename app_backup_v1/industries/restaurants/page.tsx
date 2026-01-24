'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BellAlertIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

export default function RestaurantsPage() {
  const [monthlyOrders, setMonthlyOrders] = useState(500)
  const [avgOrderValue, setAvgOrderValue] = useState(3500)
  const [missedOrderRate, setMissedOrderRate] = useState(15)

  // ROI Calculations
  const currentRevenue = monthlyOrders * avgOrderValue
  const missedRevenue = currentRevenue * (missedOrderRate / 100)
  const recoveredRevenue = missedRevenue * 0.95 // 95% capture rate with automation
  const manualLaborCost = 120000 // ₦120K per month for manual order handling
  const totalSavings = recoveredRevenue + manualLaborCost
  const automationCost = 35000 // WhatsApp + CRM package
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
              <div className="inline-block bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🔥 Most Popular Industry
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Restaurant Automation That Actually Works
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Stop losing orders during busy hours. Automate WhatsApp orders, reservations, 
                delivery coordination, and customer follow-ups. Made for Nigerian restaurants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  See Live Demo
                </Link>
                <Link
                  href="#roi-calculator"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
                >
                  Calculate Your Savings
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
                  <div className="text-white/80">Orders Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦465K</div>
                  <div className="text-white/80">Avg. Saved/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/80">Order Taking</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3x</div>
                  <div className="text-white/80">Customer Retention</div>
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
              The Problems Every Restaurant Owner Knows Too Well
            </h2>
            <p className="text-xl text-gray-600">
              Sound familiar?
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '😰',
                title: 'Missed Orders During Rush',
                description: "Your phone rings but you are swamped. That is ₦50,000 in lost orders this week alone.",
                stat: '15% orders lost',
              },
              {
                icon: '📝',
                title: 'Wrong Orders Written Down',
                description: 'Scribbled notes lead to wrong orders. Angry customers, wasted food, stressed staff.',
                stat: '₦80K wasted monthly',
              },
              {
                icon: '🚗',
                title: 'Delivery Chaos',
                description: 'Which order goes where? Driver called 3 times. Customer angry. You lose your mind.',
                stat: '40min avg delays',
              },
              {
                icon: '🤷',
                title: 'No Customer Database',
                description: 'Who are your regulars? What do they like? No idea. Just hoping they come back.',
                stat: 'Zero retention',
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
              How SmartFlow Fixes This (Automatically)
            </h2>
            <p className="text-xl text-gray-600">
              Turn chaos into smooth operations
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: DevicePhoneMobileIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: 'WhatsApp Order Automation',
                description: 'Every order comes through WhatsApp (where your customers already are). System captures everything perfectly, sends confirmation, adds to your order board. Never miss an order again.',
                results: ['100% order capture', 'Zero missed calls', 'Perfect accuracy'],
                savings: '₦180K/month recovered revenue',
              },
              {
                icon: ClockIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Smart Reservation System',
                description: 'Customers book via WhatsApp. System checks availability, confirms booking, sends reminders automatically. You just show up and serve great food.',
                results: ['24/7 booking', '95% show-up rate', 'Zero double bookings'],
                savings: '₦120K/month in labor',
              },
              {
                icon: MapPinIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Delivery Coordination',
                description: 'Orders automatically assigned to drivers. Customer gets live updates. Driver gets clear directions. You get peace of mind.',
                results: ['30min faster delivery', 'Happy customers', 'Happy drivers'],
                savings: '₦85K/month efficiency',
              },
              {
                icon: UserGroupIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: 'Customer Database & Follow-ups',
                description: "Every customer automatically saved with order history. Send them birthday offers, remind them of favorites, build loyalty that lasts.",
                results: ['3x repeat customers', 'Personal relationships', 'Predictable revenue'],
                savings: '₦80K/month retention',
              },
              {
                icon: BellAlertIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                title: 'Kitchen Alerts & Status Updates',
                description: 'Kitchen gets orders instantly on tablet. Mark as preparing/ready. Customer gets automatic updates. No more "where is my order?" calls.',
                results: ['Zero confusion', 'Smooth operations', 'Happy kitchen staff'],
                savings: '3hrs saved daily',
              },
              {
                icon: ChartBarIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Sales Analytics',
                description: 'See best-sellers, peak hours, customer preferences. Make smart menu decisions based on real data, not guesses.',
                results: ['Data-driven decisions', 'Optimize inventory', 'Increase profits'],
                savings: '15% profit increase',
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
                          <div className="text-xs text-green-700 font-semibold mb-1">💰 Savings:</div>
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

      {/* Real Customer Story */}
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
              <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Real Story: Mama Adaeze's Kitchen, Lekki
                </h2>
                <p className="text-xl text-white/90">
                  From overwhelmed to organized in 2 weeks
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        'Missing 20+ orders per week during lunch rush',
                        'Staff stressed, making mistakes',
                        'Customers complaining on social media',
                        'Working 14 hours a day, barely breaking even',
                        'No idea who her repeat customers were',
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
                        'Zero missed orders - system captures everything',
                        'Kitchen calm and organized',
                        'Google reviews went from 3.2★ to 4.8★',
                        'Working 8 hours, revenue up 60%',
                        'Personal messages to 200+ loyal customers',
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
                      <div className="text-3xl font-bold text-green-700 mb-2">₦540K</div>
                      <div className="text-sm text-gray-700">Extra revenue per month</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">60%</div>
                      <div className="text-sm text-gray-700">Revenue increase</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">6 weeks</div>
                      <div className="text-sm text-gray-700">To break even</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-primary">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "I was ready to close down. Now I am looking at opening a second location. 
                    SmartFlow did not just save my business - it gave me my life back."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Adaeze Okonkwo, Owner
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
              Calculate Your Restaurant's Savings
            </h2>
            <p className="text-xl text-gray-600">
              See exactly how much you could save with SmartFlow
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Orders: {monthlyOrders}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100</span>
                  <span>2000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Order Value: ₦{avgOrderValue.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₦1,000</span>
                  <span>₦10,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Missed Order Rate: {missedOrderRate}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={missedOrderRate}
                  onChange={(e) => setMissedOrderRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Current Monthly Revenue</div>
                <div className="text-3xl font-bold text-gray-900">
                  ₦{currentRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="text-sm text-red-600 mb-2">Lost to Missed Orders</div>
                <div className="text-3xl font-bold text-red-700">
                  ₦{missedRevenue.toLocaleString()}
                </div>
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
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Labor Cost Saved</div>
                  <div className="text-2xl font-bold text-green-700">
                    ₦{manualLaborCost.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Automation Cost</div>
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
                Book Free Demo to Get Started
              </Link>
              <p className="text-sm text-gray-600 mt-3">
                ⏱️ Setup in 2 weeks • 💰 Money-back guarantee • 🎯 No long-term contract
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing for Restaurants */}
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
              Restaurant Package Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need in one simple package
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-primary"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white text-center">
                <div className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
                  🔥 Most Popular for Restaurants
                </div>
                <h3 className="text-3xl font-bold mb-2">Restaurant Complete Package</h3>
                <p className="text-white/90">Everything you need to automate your restaurant</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦35,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 1,229% • Payback: 6 weeks
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-primary" />
                      WhatsApp Order Management
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Automated order capture',
                        'Menu showcase with photos',
                        'Order confirmations',
                        'Kitchen notifications',
                        'Unlimited orders',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-primary" />
                      Reservation System
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Online table booking',
                        'Availability checking',
                        'Automatic reminders',
                        'No-show reduction',
                        'Guest preferences saved',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                      Delivery Coordination
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Driver assignment',
                        'Customer updates',
                        'Route optimization',
                        'Delivery tracking',
                        'Performance reports',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5 text-primary" />
                      Customer Management
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Customer database',
                        'Order history tracking',
                        'Loyalty rewards',
                        'Birthday messages',
                        'Feedback collection',
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 mb-6 border-2 border-green-200">
                  <div className="font-bold text-gray-900 mb-3 text-center">✨ Also Includes:</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      '2-week setup & training',
                      'Tablet for kitchen',
                      'WhatsApp Business API',
                      'Sales analytics dashboard',
                      'Priority support',
                      'Free updates',
                    ].map((bonus, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {bonus}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/demo" className="btn-primary inline-block mb-4">
                    Start Your Free Trial
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

      {/* Testimonials */}
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
              Nigerian Restaurants Love SmartFlow
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Chef Emeka',
                restaurant: 'The Spice Route, VI Lagos',
                quote: "We went from losing 30 orders a week to zero. The system paid for itself in the first month.",
                result: '₦420K extra monthly',
                rating: 5,
              },
              {
                name: 'Mrs. Chidinma',
                restaurant: 'Sweet Home Kitchen, Abuja',
                quote: 'My staff are happier, customers are happier, and I actually have time to cook now instead of answering phones.',
                result: '60% revenue increase',
                rating: 5,
              },
              {
                name: 'Femi Johnson',
                restaurant: 'Jollof Palace, Lekki',
                quote: 'Best business decision I ever made. The customer database alone is worth 10x what I pay.',
                result: '3x repeat customers',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <div className="text-xs text-green-700 font-semibold mb-1">Result:</div>
                  <div className="text-sm font-bold text-green-700">{testimonial.result}</div>
                </div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.restaurant}</div>
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
              Ready to Stop Losing Orders?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 50+ Nigerian restaurants already using SmartFlow. 
              See it in action with a free demo tailored to your restaurant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Book Free Demo
              </Link>
              <Link
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                WhatsApp Us Now
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              🎁 Special offer: First month 50% off • ⚡ Setup in 2 weeks • 💰 Money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
