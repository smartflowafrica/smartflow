'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CheckCircleIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function HealthcarePage() {
  const [monthlyAppointments, setMonthlyAppointments] = useState(400)
  const [avgConsultationFee, setAvgConsultationFee] = useState(15000)
  const [noShowRate, setNoShowRate] = useState(25)

  // ROI Calculations
  const lostAppointments = monthlyAppointments * (noShowRate / 100)
  const recoveredAppointments = lostAppointments * 0.70 // 70% recovery with reminders
  const recoveredRevenue = recoveredAppointments * avgConsultationFee
  const manualLaborCost = 120000 // ₦120K per month for reception staff
  const totalSavings = recoveredRevenue + manualLaborCost
  const automationCost = 38000 // Healthcare package
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
                Healthcare Practice Automation for Nigeria
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Stop losing revenue to no-shows. Automate appointment booking, patient reminders, 
                medical records, billing, and follow-ups. Focus on patient care, not admin.
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
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-white/80">Show-up Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦700K</div>
                  <div className="text-white/80">Extra Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">5 hrs</div>
                  <div className="text-white/80">Saved Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Digital Records</div>
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
              Healthcare Practice Challenges
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                icon: '👻',
                title: 'Patient No-Shows',
                description: '25% of patients never show up. Empty slots you could have filled. ₦700K lost revenue monthly.',
                stat: '25% no-show rate',
              },
              {
                icon: '📞',
                title: 'Manual Appointment Booking',
                description: 'Phone ringing non-stop. "What times are available?" Staff drowning in scheduling calls.',
                stat: '6hrs daily wasted',
              },
              {
                icon: '📄',
                title: 'Paper Records Chaos',
                description: 'Patient file missing. Treatment history unclear. Prescriptions unreadable. Medical errors waiting to happen.',
                stat: 'High error risk',
              },
              {
                icon: '💰',
                title: 'Billing Delays',
                description: 'Manual invoices, chasing payments, tracking who paid. Cash flow suffering while you wait.',
                stat: '45-day avg payment',
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
              Complete Healthcare Practice Automation
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                icon: CalendarDaysIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                title: '24/7 Appointment Booking',
                description: 'Patients book appointments via WhatsApp anytime. System checks doctor availability, confirms booking instantly. No more phone tag.',
                results: ['24/7 booking availability', 'Zero scheduling conflicts', 'Instant confirmations'],
                savings: '₦150K/month labor',
              },
              {
                icon: BellAlertIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                title: 'Automated Patient Reminders',
                description: 'Send appointment confirmations, 24-hour reminders, pre-visit instructions automatically. Reduce no-shows by 70%.',
                results: ['85% show-up rate', '₦700K recovered monthly', 'Better patient compliance'],
                savings: '₦700K/month recovered',
              },
              {
                icon: DocumentTextIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
                title: 'Digital Patient Records',
                description: 'Store patient history, prescriptions, test results digitally. Access from anywhere. HIPAA-compliant security. Never lose a file again.',
                results: ['100% digital records', 'Instant access', 'Secure & compliant'],
                savings: '4hrs saved weekly',
              },
              {
                icon: CreditCardIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
                title: 'Automated Billing & Payments',
                description: 'Generate invoices instantly. Send payment links via WhatsApp. Track payments automatically. Integrate with Paystack/Flutterwave.',
                results: ['Instant invoicing', '90% on-time payment', 'Zero manual tracking'],
                savings: '₦120K/month labor',
              },
              {
                icon: ClipboardDocumentListIcon,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                title: 'Treatment Follow-ups',
                description: 'Send post-visit care instructions, medication reminders, follow-up appointment nudges automatically. Better patient outcomes.',
                results: ['Better compliance', 'Fewer complications', 'Higher satisfaction'],
                savings: '50% better outcomes',
              },
              {
                icon: UserGroupIcon,
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
                title: 'Patient Database & Analytics',
                description: 'Track patient history, treatment patterns, appointment frequency. Identify high-risk patients. Make data-driven care decisions.',
                results: ['Complete patient view', 'Risk identification', 'Better care quality'],
                savings: '30% efficiency gain',
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
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Case Study: HealthFirst Clinic, Port Harcourt
                </h2>
                <p className="text-xl text-white/90">
                  From chaos to organized in 3 weeks
                </p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4">😰 Before SmartFlow:</h3>
                    <ul className="space-y-3">
                      {[
                        '30% no-show rate (₦900K lost monthly)',
                        'Reception overwhelmed with booking calls',
                        'Paper records getting lost or damaged',
                        'Patients waiting 60+ days to pay bills',
                        'No system to follow up on treatments',
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
                        '10% no-show rate (recovered ₦600K monthly)',
                        'Patients booking 24/7, staff relaxed',
                        '100% digital records, searchable instantly',
                        '80% of bills paid within 7 days',
                        'Automated follow-ups improving outcomes',
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
                      <div className="text-3xl font-bold text-green-700 mb-2">67%</div>
                      <div className="text-sm text-gray-700">No-show reduction</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-2">5 weeks</div>
                      <div className="text-sm text-gray-700">Payback period</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gray-50 rounded-xl border-l-4 border-green-600">
                  <p className="text-gray-700 italic text-lg mb-2">
                    "SmartFlow transformed our practice. We see more patients, with less stress. 
                    The automated reminders alone paid for the system in the first month."
                  </p>
                  <div className="font-semibold text-gray-900">
                    — Dr. Chukwuma Okeke, Medical Director
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
              Calculate Your Practice's ROI
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-xl">
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly Appointments: {monthlyAppointments}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={monthlyAppointments}
                  onChange={(e) => setMonthlyAppointments(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Consultation Fee: ₦{avgConsultationFee.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="5000"
                  value={avgConsultationFee}
                  onChange={(e) => setAvgConsultationFee(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No-Show Rate: {noShowRate}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="1"
                  value={noShowRate}
                  onChange={(e) => setNoShowRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
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
                    ({recoveredAppointments.toFixed(0)} appointments saved)
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
              Healthcare Package Pricing
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-green-600"
            >
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">Healthcare Complete Package</h3>
                <p className="text-white/90">Everything your practice needs</p>
              </div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-gray-900 mb-2">₦38,000</div>
                  <div className="text-gray-600">per month</div>
                  <div className="text-sm text-green-600 font-semibold mt-2">
                    Average ROI: 1,789% • Payback: 5 weeks
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">✨ Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        '24/7 appointment booking system',
                        'Automated patient reminders',
                        'Digital patient records (HIPAA-compliant)',
                        'Automated billing & payment links',
                        'Treatment follow-up automation',
                        'Patient database & analytics',
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
                        'Secure cloud storage',
                        'Priority support',
                        'Compliance consultation',
                        'Free monthly review',
                      ].map((bonus, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
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
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 40+ Nigerian healthcare practices using SmartFlow to improve patient care and revenue.
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
