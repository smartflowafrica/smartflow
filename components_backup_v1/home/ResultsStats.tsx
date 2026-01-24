'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
  {
    value: 847000,
    suffix: '+',
    label: 'Messages Automated',
    description: 'Every single month',
  },
  {
    value: 2.4,
    suffix: 'B+',
    prefix: '₦',
    label: 'Revenue Generated',
    description: 'For our clients',
  },
  {
    value: 99.5,
    suffix: '%',
    label: 'Uptime Guarantee',
    description: 'Always available',
  },
  {
    value: 100,
    suffix: '+',
    label: 'Active Businesses',
    description: 'Across Nigeria',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Support Available',
    description: 'Real humans, real help',
  },
  {
    value: 4.9,
    suffix: '/5',
    label: 'Customer Rating',
    description: 'Based on 200+ reviews',
  },
]

function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '' 
}: { 
  value: number
  prefix?: string
  suffix?: string 
}) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        setHasAnimated(true)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, hasAnimated])

  const formatNumber = (num: number) => {
    if (value >= 1000000) {
      return (num / 1000000).toFixed(1)
    }
    if (value >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toFixed(value % 1 !== 0 ? 1 : 0)
  }

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export default function ResultsStats() {
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Results That Speak for Themselves
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300"
          >
            Real numbers from real Nigerian businesses using SmartFlow Africa
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-lg md:text-xl font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-white mb-6">
              <span className="font-bold text-secondary">"Since we started using SmartFlow, 
              we haven't missed a single customer inquiry."</span>
            </p>
            <p className="text-gray-300">
              — Chinedu Okafor, Owner of Mama's Kitchen (Lagos)
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
