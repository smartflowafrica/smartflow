'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  CalculatorIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function ROICalculatorPage() {
  // Calculator State
  const [employees, setEmployees] = useState(5)
  const [avgSalary, setAvgSalary] = useState(150000)
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [errorRate, setErrorRate] = useState(5)
  const [avgErrorCost, setAvgErrorCost] = useState(20000)

  // Calculations
  const hourlyRate = avgSalary / (52 * 40) // Monthly salary to hourly rate
  const annualTimeCost = employees * hoursPerWeek * 52 * hourlyRate
  const annualErrorCost = (errorRate / 100) * employees * 52 * avgErrorCost
  const totalAnnualCost = annualTimeCost + annualErrorCost

  // Automation saves 70% of manual time and 90% of errors
  const timeSavings = annualTimeCost * 0.7
  const errorSavings = annualErrorCost * 0.9
  const totalSavings = timeSavings + errorSavings

  // Typical SmartFlow cost (estimate)
  const estimatedMonthlyCost = employees <= 5 ? 100000 : employees <= 20 ? 250000 : 500000
  const annualAutomationCost = estimatedMonthlyCost * 12

  const netSavings = totalSavings - annualAutomationCost
  const roi = ((netSavings / annualAutomationCost) * 100).toFixed(0)
  const paybackMonths = (annualAutomationCost / (totalSavings / 12)).toFixed(1)

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <CalculatorIcon className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              ROI Calculator
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Calculate how much money your business can save with automation
            </p>
            <p className="text-white/80">
              Enter your business details below to see your potential return on investment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Business Details</h2>
              
              <div className="space-y-6">
                {/* Number of Employees */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <UserGroupIcon className="w-5 h-5 mr-2 text-primary" />
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="1"
                    max="1000"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={employees}
                      onChange={(e) => setEmployees(Number(e.target.value))}
                      className="w-full"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                {/* Average Salary */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary" />
                    Average Monthly Salary (₦)
                  </label>
                  <input
                    type="number"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="50000"
                    step="10000"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={avgSalary}
                      onChange={(e) => setAvgSalary(Number(e.target.value))}
                      className="w-full"
                      min="50000"
                      max="500000"
                      step="10000"
                    />
                  </div>
                </div>

                {/* Hours on Manual Tasks */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <ClockIcon className="w-5 h-5 mr-2 text-primary" />
                    Hours per Week on Manual Tasks (per employee)
                  </label>
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="1"
                    max="40"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                      className="w-full"
                      min="1"
                      max="40"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Time spent on data entry, invoicing, order processing, follow-ups, etc.
                  </p>
                </div>

                {/* Error Rate */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-primary" />
                    Error Rate (%)
                  </label>
                  <input
                    type="number"
                    value={errorRate}
                    onChange={(e) => setErrorRate(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="0"
                    max="50"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={errorRate}
                      onChange={(e) => setErrorRate(Number(e.target.value))}
                      className="w-full"
                      min="0"
                      max="50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of manual tasks that result in errors requiring fixes
                  </p>
                </div>

                {/* Average Error Cost */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary" />
                    Average Cost per Error (₦)
                  </label>
                  <input
                    type="number"
                    value={avgErrorCost}
                    onChange={(e) => setAvgErrorCost(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    min="1000"
                    step="1000"
                  />
                  <div className="mt-2">
                    <input
                      type="range"
                      value={avgErrorCost}
                      onChange={(e) => setAvgErrorCost(Number(e.target.value))}
                      className="w-full"
                      min="1000"
                      max="100000"
                      step="1000"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Time to fix + lost revenue + customer impact
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Main Results Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Your Potential ROI</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-white/80 text-sm mb-1">Annual Savings</div>
                    <div className="text-4xl font-bold">
                      ₦{totalSavings.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-1">Estimated Investment</div>
                    <div className="text-2xl font-bold">
                      ₦{annualAutomationCost.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border-t border-white/30 pt-4">
                    <div className="text-white/80 text-sm mb-1">Net Annual Benefit</div>
                    <div className="text-3xl font-bold text-green-300">
                      ₦{netSavings.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/30">
                    <div>
                      <div className="text-white/80 text-sm mb-1">ROI</div>
                      <div className="text-3xl font-bold">{roi}%</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm mb-1">Payback Period</div>
                      <div className="text-3xl font-bold">{paybackMonths} mo</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Savings Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Time Cost (Current)</span>
                    <span className="font-bold text-red-600">
                      ₦{annualTimeCost.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700 flex items-center">
                      Time Savings (70%)
                      <CheckCircleIcon className="w-4 h-4 ml-2 text-green-600" />
                    </span>
                    <span className="font-bold text-green-600">
                      ₦{timeSavings.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">Error Cost (Current)</span>
                    <span className="font-bold text-red-600">
                      ₦{annualErrorCost.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 flex items-center">
                      Error Reduction (90%)
                      <CheckCircleIcon className="w-4 h-4 ml-2 text-green-600" />
                    </span>
                    <span className="font-bold text-green-600">
                      ₦{errorSavings.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-accent/10 border-2 border-accent rounded-2xl p-6 text-center">
                <p className="text-gray-700 font-semibold mb-4">
                  Ready to achieve these results?
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-accent/90 transition-all"
                >
                  Get Free Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Assumptions Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              How We Calculate ROI
            </h2>
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="font-bold text-gray-900 mb-4">Assumptions:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Automation typically reduces manual work by <strong>70%</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Automation reduces errors by <strong>90%</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Based on average client results across multiple industries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Estimated pricing based on business size and complexity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>Does not include additional benefits like improved customer satisfaction, faster scaling, or competitive advantages</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-6 italic">
                Note: Actual results vary by business, industry, and implementation. This calculator provides estimates based on typical client outcomes. Contact us for a personalized assessment.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real Results Section */}
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
              Real Client Results
            </h2>
            <p className="text-xl text-gray-600">
              See what businesses like yours have achieved
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                business: 'Restaurant Chain',
                employees: 45,
                result: '₦8.2M saved annually',
                payback: '2 months',
                details: 'Automated ordering, inventory, and staff scheduling',
              },
              {
                business: 'Real Estate Agency',
                employees: 12,
                result: '₦3.5M saved annually',
                payback: '3 months',
                details: 'Automated lead nurturing and document processing',
              },
              {
                business: 'E-commerce Store',
                employees: 8,
                result: '₦2.8M saved annually',
                payback: '1.5 months',
                details: 'Automated order fulfillment and customer service',
              },
            ].map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{client.business}</h3>
                <p className="text-sm text-gray-600 mb-4">{client.employees} employees</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Annual Savings</div>
                    <div className="text-2xl font-bold text-primary">{client.result}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Payback Period</div>
                    <div className="text-lg font-bold text-secondary">{client.payback}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{client.details}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all"
            >
              View All Case Studies
            </Link>
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
              Let's Turn These Numbers Into Reality
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Schedule a free consultation to discuss your specific automation needs and get a detailed ROI analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Get Free Consultation
              </Link>
              <Link
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                WhatsApp Us
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Free consultation • Custom ROI analysis • No obligation
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
