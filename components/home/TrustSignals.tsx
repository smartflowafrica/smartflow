'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  PhoneIcon,
  CreditCardIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ChartBarIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

const trustSignals = [
  {
    icon: ShieldCheckIcon,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted with 256-bit SSL. We take security as seriously as Nigerian banks do.',
  },
  {
    icon: PhoneIcon,
    title: 'Local Support Team',
    description: 'Real Nigerians based in Lagos, Abuja, and Port Harcourt. We understand your business.',
  },
  {
    icon: CreditCardIcon,
    title: 'Nigerian Payment Options',
    description: 'Pay with bank transfer, Paystack, Flutterwave, or POS. No dollar accounts required.',
  },
  {
    icon: ClockIcon,
    title: '24/7 Availability',
    description: 'Your automation never sleeps. 99.5% uptime guaranteed with instant failover.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Made for Nigeria',
    description: 'Built specifically for Nigerian businesses. We understand the unique challenges you face.',
  },
  {
    icon: UserGroupIcon,
    title: '100+ Happy Businesses',
    description: 'From small shops to large enterprises, businesses across Nigeria trust us daily.',
  },
  {
    icon: ChartBarIcon,
    title: 'Transparent Reporting',
    description: 'See exactly what your automation is doing with real-time analytics and reports.',
  },
  {
    icon: LockClosedIcon,
    title: 'No Long-Term Contracts',
    description: 'Cancel anytime. No penalties. No questions asked. We earn your business every month.',
  },
]

export default function TrustSignals() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Why Nigerian Businesses Trust Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            We are not just a software company. We are your technology partner committed to your success.
          </motion.p>
        </div>

        {/* Trust Signals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl p-6 h-full hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="mb-4">
                    <div className="inline-block p-3 bg-primary/10 group-hover:bg-white/20 rounded-lg transition-colors">
                      <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                    {signal.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors">
                    {signal.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-gray-700 mb-6">
              <span className="font-bold">Trusted by leading Nigerian businesses:</span>
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-gray-400 font-semibold">Restaurants</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400 font-semibold">E-commerce</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400 font-semibold">Hotels</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400 font-semibold">Healthcare</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400 font-semibold">Real Estate</div>
              <div className="text-gray-400">•</div>
              <div className="text-gray-400 font-semibold">Professional Services</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
