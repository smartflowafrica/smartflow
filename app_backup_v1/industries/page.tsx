'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  HeartIcon,
  HomeModernIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'

export default function IndustriesPage() {
  const industries = [
    {
      name: 'Restaurants & Food',
      slug: 'restaurants',
      icon: BuildingStorefrontIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Automate orders, reservations, delivery coordination, and customer follow-ups',
      stats: {
        saved: '₦465K',
        efficiency: '100%',
        metric: 'orders captured',
      },
      painPoints: [
        'Missed orders during busy hours',
        'Manual reservation management',
        'No customer database',
        'Delivery coordination chaos',
      ],
      popular: true,
    },
    {
      name: 'E-commerce',
      slug: 'ecommerce',
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Automate order processing, inventory sync, customer service, and abandoned cart recovery',
      stats: {
        saved: '₦800K',
        efficiency: '95%',
        metric: 'cart recovery',
      },
      painPoints: [
        'Manual order processing',
        'Inventory sync issues',
        'Lost abandoned carts',
        'Customer service overload',
      ],
    },
    {
      name: 'Hotels & Hospitality',
      slug: 'hotels',
      icon: BuildingOfficeIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Automate bookings, guest communication, check-ins, and post-stay follow-ups',
      stats: {
        saved: '₦600K',
        efficiency: '98%',
        metric: 'booking accuracy',
      },
      painPoints: [
        'Double bookings',
        'Manual guest communication',
        'No feedback collection',
        'Revenue leakage',
      ],
    },
    {
      name: 'Healthcare',
      slug: 'healthcare',
      icon: HeartIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Automate appointment booking, reminders, patient records, and billing',
      stats: {
        saved: '₦700K',
        efficiency: '85%',
        metric: 'show-up rate',
      },
      painPoints: [
        'Patient no-shows',
        'Manual appointment booking',
        'Paper records chaos',
        'Billing delays',
      ],
    },
    {
      name: 'Real Estate',
      slug: 'real-estate',
      icon: HomeModernIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Automate lead capture, property inquiries, viewing schedules, and follow-ups',
      stats: {
        saved: '₦900K',
        efficiency: '100%',
        metric: 'lead capture',
      },
      painPoints: [
        'Lost leads',
        'Manual viewing coordination',
        'No follow-up system',
        'Document management mess',
      ],
    },
    {
      name: 'Professional Services',
      slug: 'professional-services',
      icon: BriefcaseIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: 'Automate client onboarding, appointment scheduling, invoicing, and project updates',
      stats: {
        saved: '₦550K',
        efficiency: '90%',
        metric: 'on-time payments',
      },
      painPoints: [
        'Manual client onboarding',
        'Scheduling back-and-forth',
        'Invoice delays',
        'No project visibility',
      ],
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Industry-Specific Automation Solutions
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Every industry has unique challenges. We have built automation solutions 
              tailored to your specific business needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold">6</div>
                <div className="text-white/80">Industries Served</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">200+</div>
                <div className="text-white/80">Businesses Automated</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">₦650K</div>
                <div className="text-white/80">Average Savings</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/industries/${industry.slug}`}>
                    <div
                      className={`bg-white rounded-2xl p-8 border-2 ${industry.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 h-full relative group`}
                    >
                      {industry.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className={`inline-block p-4 ${industry.bgColor} rounded-xl mb-4`}>
                        <Icon className={`w-12 h-12 ${industry.color}`} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {industry.name}
                      </h3>

                      <p className="text-gray-600 mb-6">{industry.description}</p>

                      {/* Stats */}
                      <div className={`${industry.bgColor} rounded-xl p-4 mb-6`}>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className={`text-xl font-bold ${industry.color}`}>
                              {industry.stats.saved}
                            </div>
                            <div className="text-xs text-gray-600">Avg. Saved</div>
                          </div>
                          <div>
                            <div className={`text-xl font-bold ${industry.color}`}>
                              {industry.stats.efficiency}
                            </div>
                            <div className="text-xs text-gray-600">Efficiency</div>
                          </div>
                          <div>
                            <div className={`text-xl font-bold ${industry.color}`}>
                              ⭐
                            </div>
                            <div className="text-xs text-gray-600">{industry.stats.metric}</div>
                          </div>
                        </div>
                      </div>

                      {/* Pain Points */}
                      <div className="mb-6">
                        <div className="text-sm font-semibold text-gray-700 mb-3">
                          Common Challenges:
                        </div>
                        <ul className="space-y-2">
                          {industry.painPoints.map((point, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-500 flex-shrink-0">✗</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className={`font-semibold ${industry.color} group-hover:underline flex items-center gap-2`}>
                          Learn More
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Industry-Specific Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Industry-Specific Matters
              </h2>
              <p className="text-xl text-gray-600">
                Generic automation tools do not understand your business. We do.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Pre-Built Templates',
                  description: 'We have done this before. Start with proven workflows designed for your industry, not generic templates.',
                },
                {
                  icon: '📊',
                  title: 'Industry Benchmarks',
                  description: 'Know how you compare. We track metrics specific to your industry so you can measure real performance.',
                },
                {
                  icon: '🔧',
                  title: 'Specialized Integrations',
                  description: 'Connect the tools you already use. We integrate with industry-specific software, not just generic apps.',
                },
                {
                  icon: '💡',
                  title: 'Expert Guidance',
                  description: 'Learn from others. Our team has experience in your industry and shares best practices that work.',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to See What We Can Do for Your Industry?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Book a free consultation and see real examples from businesses like yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Book Free Demo
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
