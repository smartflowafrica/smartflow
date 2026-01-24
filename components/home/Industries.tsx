'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  HeartIcon,
  HomeModernIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'

const industries = [
  {
    id: 'restaurants',
    name: 'Restaurants & Cafés',
    icon: BuildingStorefrontIcon,
    description: 'Never miss a reservation. Turn WhatsApp into your smart booking assistant.',
    benefits: [
      'Automated reservation confirmations',
      'Menu updates and daily specials',
      'Order tracking and delivery updates',
      'Customer feedback collection',
    ],
    stats: { metric: '40%', label: 'More Reservations' },
    cta: 'See Restaurant Solutions',
    href: '/industries/restaurants',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: ShoppingBagIcon,
    description: 'Convert more browsers into buyers with instant automated responses.',
    benefits: [
      'Order confirmations and tracking',
      'Abandoned cart recovery',
      'Product recommendations',
      'Customer support automation',
    ],
    stats: { metric: '3x', label: 'Conversion Rate' },
    cta: 'See Retail Solutions',
    href: '/industries/ecommerce',
  },
  {
    id: 'hotels',
    name: 'Hotels & Hospitality',
    icon: BuildingOfficeIcon,
    description: 'Streamline bookings and guest communications 24/7.',
    benefits: [
      'Booking confirmations and reminders',
      'Check-in/check-out automation',
      'Guest service requests',
      'Post-stay feedback collection',
    ],
    stats: { metric: '60%', label: 'Faster Response Time' },
    cta: 'See Hospitality Solutions',
    href: '/industries/hotels',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Clinics',
    icon: HeartIcon,
    description: 'Reduce no-shows and improve patient communication.',
    benefits: [
      'Appointment reminders',
      'Test results delivery',
      'Prescription refill requests',
      'Health tips and updates',
    ],
    stats: { metric: '75%', label: 'Fewer No-Shows' },
    cta: 'See Healthcare Solutions',
    href: '/industries/healthcare',
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: HomeModernIcon,
    description: 'Qualify leads and schedule viewings automatically.',
    benefits: [
      'Property inquiry responses',
      'Viewing appointment scheduling',
      'Property updates and alerts',
      'Document sharing and follow-ups',
    ],
    stats: { metric: '5x', label: 'More Qualified Leads' },
    cta: 'See Real Estate Solutions',
    href: '/industries/real-estate',
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: BriefcaseIcon,
    description: 'Free up time for billable work with smart automation.',
    benefits: [
      'Consultation booking',
      'Client onboarding automation',
      'Document requests and delivery',
      'Meeting reminders and follow-ups',
    ],
    stats: { metric: '20h', label: 'Saved Per Month' },
    cta: 'See Professional Solutions',
    href: '/industries/professional-services',
  },
]

export default function Industries() {
  const [activeTab, setActiveTab] = useState('restaurants')

  const activeIndustry = industries.find((ind) => ind.id === activeTab)

  return (
    <section className="section-padding bg-gray-50">
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
            Built for Your Industry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Pre-built solutions designed specifically for Nigerian businesses in your sector
          </motion.p>
        </div>

        {/* Industry Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max mx-auto justify-center pb-2">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <button
                  key={industry.id}
                  onClick={() => setActiveTab(industry.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === industry.id
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm md:text-base whitespace-nowrap">
                    {industry.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeIndustry && (
            <motion.div
              key={activeIndustry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Description and Benefits */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <activeIndustry.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {activeIndustry.name}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {activeIndustry.description}
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    What You Get:
                  </h4>
                  <ul className="space-y-3 mb-8">
                    {activeIndustry.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-6 h-6 text-secondary flex-shrink-0 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={activeIndustry.href}
                    className="btn-primary inline-block"
                  >
                    {activeIndustry.cta}
                  </Link>
                </div>

                {/* Right Column: Stats and Visual */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-primary to-secondary p-12 rounded-2xl shadow-2xl mb-6">
                      <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                        {activeIndustry.stats.metric}
                      </div>
                      <div className="text-xl md:text-2xl text-white/90">
                        {activeIndustry.stats.label}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Average result from {activeIndustry.name.toLowerCase()} using SmartFlow
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Don't see your industry? We've got you covered.
          </p>
          <Link href="/industries" className="btn-secondary inline-block">
            View All Industries
          </Link>
        </div>
      </div>
    </section>
  )
}
