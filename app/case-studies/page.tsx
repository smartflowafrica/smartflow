'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CaseStudyCard from '../../components/case-studies/CaseStudyCard'
import { listCaseStudies } from '../../data/caseStudies'

export default function CaseStudiesPage() {
  const allCaseStudies = listCaseStudies()
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All')

  // Extract unique industries
  const industries = useMemo(() => {
    const unique = new Set(allCaseStudies.map((s) => s.industry))
    return ['All', ...Array.from(unique)]
  }, [allCaseStudies])

  // Filter case studies
  const filteredStudies = useMemo(() => {
    if (selectedIndustry === 'All') return allCaseStudies
    return allCaseStudies.filter((s) => s.industry === selectedIndustry)
  }, [allCaseStudies, selectedIndustry])

  // Separate featured and regular
  const featuredStudies = filteredStudies.filter((s) => s.featured)
  const regularStudies = filteredStudies.filter((s) => !s.featured)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Success Stories
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Real Nigerian businesses achieving remarkable results through intelligent automation.
              See how we've helped companies like yours grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container-custom max-w-6xl mx-auto py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">Filter by industry:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedIndustry === industry
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredStudies.length}</span> case {filteredStudies.length === 1 ? 'study' : 'studies'}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredStudies.length > 0 && selectedIndustry === 'All' && (
        <section className="container-custom max-w-6xl mx-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stories</h2>
            <p className="text-gray-600">Our most impactful transformations</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredStudies.map((study, idx) => (
              <CaseStudyCard key={study.id} study={study} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* All Case Studies */}
      <section className="container-custom max-w-6xl mx-auto py-12">
        {featuredStudies.length > 0 && selectedIndustry === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Case Studies</h2>
            <p className="text-gray-600">More success stories from our clients</p>
          </motion.div>
        )}
        
        {filteredStudies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedIndustry === 'All' ? regularStudies : filteredStudies).map((study, idx) => (
              <CaseStudyCard key={study.id} study={study} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No case studies found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different industry</p>
            <button
              onClick={() => setSelectedIndustry('All')}
              className="btn-primary"
            >
              View All Case Studies
            </button>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join these successful businesses and transform your operations with intelligent automation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/demo" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                Book a Demo
              </Link>
              <Link href="/contact" className="btn-secondary border-2 border-white text-white hover:bg-white/10">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
