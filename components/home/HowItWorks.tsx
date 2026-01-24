'use client'

import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  PuzzlePieceIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    description: 'We understand your business, challenges, and goals. No technical jargon, just real talk.',
    icon: MagnifyingGlassIcon,
    duration: '30 minutes',
    deliverable: 'Clear understanding of your needs',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    title: 'Solution Design',
    description: 'We create a custom automation plan tailored to your business processes and workflows.',
    icon: PuzzlePieceIcon,
    duration: '2-3 days',
    deliverable: 'Custom automation blueprint',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '03',
    title: 'Development & Setup',
    description: 'Our team builds and configures your automation system. We handle all the technical heavy lifting.',
    icon: CodeBracketIcon,
    duration: '3-5 days',
    deliverable: 'Fully configured system',
    color: 'from-primary to-blue-700',
  },
  {
    number: '04',
    title: 'Training & Launch',
    description: 'We train your team and launch your automation. You will be an expert before we are done.',
    icon: AcademicCapIcon,
    duration: '1 day',
    deliverable: 'Live system + trained team',
    color: 'from-secondary to-green-600',
  },
  {
    number: '05',
    title: 'Ongoing Support',
    description: 'We are always here to help. Updates, optimizations, and 24/7 support included.',
    icon: ChatBubbleLeftRightIcon,
    duration: 'Forever',
    deliverable: 'Peace of mind',
    color: 'from-accent to-orange-600',
  },
]

export default function HowItWorks() {
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
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            From first call to full automation in just 7-10 days. Here's our proven process.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-12">
                  {/* Timeline Line and Number */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    {/* Number Circle */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg z-10`}>
                      <span className="text-white font-bold text-lg">
                        {step.number}
                      </span>
                    </div>
                    
                    {/* Vertical Line */}
                    {!isLast && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-100 mt-4" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${step.color} bg-opacity-10`}>
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Duration:</span> {step.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">You get:</span> {step.deliverable}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Book a free 30-minute discovery call. No commitment, no sales pressure. 
              Just honest advice on how automation can help your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/demo" className="btn-primary">
                Schedule Discovery Call
              </a>
              <a href="/contact" className="btn-secondary">
                Ask a Question
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
