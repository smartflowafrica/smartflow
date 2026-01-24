'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { listCaseStudies } from '../../data/caseStudies'

// use the canonical data source; limit to top 3 for preview
const caseStudies = listCaseStudies().slice(0, 3)

export default function CaseStudiesPreview() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % caseStudies.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length)
  }

  const activeCase = caseStudies[activeIndex]

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
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Real Nigerian businesses, real results. See how automation transformed their operations.
          </motion.p>
        </div>

        {/* Case Study Carousel */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="grid lg:grid-cols-2">
                {/* Left Column: Story */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{activeCase.logo ?? activeCase.business?.charAt(0) ?? '🍽️'}</div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {activeCase.business}
                      </h3>
                      <p className="text-gray-600">
                        {activeCase.industry} • {activeCase.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        The Challenge
                      </h4>
                      <p className="text-gray-700">{activeCase.challenge}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        The Solution
                      </h4>
                      <p className="text-gray-700">{activeCase.solution}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Timeframe
                      </h4>
                      <p className="text-gray-700">Results achieved in {activeCase.timeframe}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-primary">
                    <p className="text-gray-700 italic mb-4">
                      "{activeCase.testimonial}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {activeCase.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {activeCase.author}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activeCase.role}, {activeCase.business}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Results */}
                <div className="bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white flex flex-col justify-center">
                  <h4 className="text-xl font-semibold mb-8 text-white/90">
                    The Results
                  </h4>
                  <div className="space-y-8">
                    {activeCase.results.map((result, index) => (
                      <div key={index} className="text-center">
                        <div className="text-5xl md:text-6xl font-bold mb-2">
                          {result.metric}
                        </div>
                        <div className="text-lg text-white/90">
                          {result.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous case study"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {caseStudies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to case study ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Next case study"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* View All Link */}
          <div className="text-center mt-12">
            <Link href="/case-studies" className="btn-secondary inline-block">
              View All Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
