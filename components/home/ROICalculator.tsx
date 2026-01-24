'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CalculatorInputs {
  monthlySales: number
  missedCallsPercent: number
  avgOrderValue: number
  staffHours: number
  hourlyWage: number
}

export default function ROICalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlySales: 500000,
    missedCallsPercent: 40,
    avgOrderValue: 5000,
    staffHours: 20,
    hourlyWage: 2000,
  })

  const [results, setResults] = useState({
    missedRevenue: 0,
    laborCostSaved: 0,
    totalMonthlySavings: 0,
    annualSavings: 0,
    roi: 0,
    paybackDays: 0,
  })

  useEffect(() => {
    calculateROI()
  }, [inputs])

  const calculateROI = () => {
    // Calculate missed revenue
    const missedRevenue = inputs.monthlySales * (inputs.missedCallsPercent / 100)

    // Calculate labor costs saved (automation reduces manual work by ~80%)
    const laborCostSaved = inputs.staffHours * inputs.hourlyWage * 0.8

    // Total monthly savings
    const totalMonthlySavings = missedRevenue + laborCostSaved

    // Annual savings
    const annualSavings = totalMonthlySavings * 12

    // ROI calculation (assuming Professional plan at ₦35,000/month)
    const monthlyCost = 35000
    const roi = ((totalMonthlySavings - monthlyCost) / monthlyCost) * 100

    // Payback period in days
    const paybackDays = Math.ceil((monthlyCost / totalMonthlySavings) * 30)

    setResults({
      missedRevenue,
      laborCostSaved,
      totalMonthlySavings,
      annualSavings,
      roi,
      paybackDays,
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0
    setInputs((prev) => ({ ...prev, [field]: numValue }))
  }

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Calculate Your ROI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            See exactly how much SmartFlow can save your business every month
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Your Business Numbers
              </h3>

              <div className="space-y-6">
                {/* Monthly Sales */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Sales Revenue
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={inputs.monthlySales}
                      onChange={(e) => handleInputChange('monthlySales', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Missed Calls Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Missed Calls (%)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={inputs.missedCallsPercent}
                      onChange={(e) =>
                        handleInputChange('missedCallsPercent', e.target.value)
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>0%</span>
                      <span className="font-bold text-primary">
                        {inputs.missedCallsPercent}%
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Average Order Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Order Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={inputs.avgOrderValue}
                      onChange={(e) => handleInputChange('avgOrderValue', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Staff Hours on Manual Tasks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Staff Hours on Manual Tasks (per week)
                  </label>
                  <input
                    type="number"
                    value={inputs.staffHours}
                    onChange={(e) => handleInputChange('staffHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Hourly Wage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Hourly Wage
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={inputs.hourlyWage}
                      onChange={(e) => handleInputChange('hourlyWage', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Main Results Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-6 text-white/90">
                  Your Potential Savings
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-white/80 mb-1">Monthly Savings</div>
                    <div className="text-4xl md:text-5xl font-bold">
                      {formatCurrency(results.totalMonthlySavings)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-white/80 mb-1">
                        Recovered Revenue
                      </div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(results.missedRevenue)}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-sm text-white/80 mb-1">Labor Saved</div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(results.laborCostSaved)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <div className="text-sm text-white/80 mb-1">Annual Savings</div>
                    <div className="text-3xl md:text-4xl font-bold">
                      {formatCurrency(results.annualSavings)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">ROI</div>
                  <div className="text-3xl font-bold text-secondary">
                    {results.roi.toFixed(0)}%
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Payback Period</div>
                  <div className="text-3xl font-bold text-primary">
                    {results.paybackDays} days
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-700 mb-4">
                  Based on your numbers, SmartFlow could save your business{' '}
                  <span className="font-bold text-primary">
                    {formatCurrency(results.annualSavings)}
                  </span>{' '}
                  per year.
                </p>
                <a
                  href="/demo"
                  className="btn-primary w-full text-center block"
                >
                  Get Your Custom Quote
                </a>
              </div>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            * Results are estimates based on industry averages. Actual results may vary
            based on your specific business circumstances.
          </p>
        </div>
      </div>
    </section>
  )
}
