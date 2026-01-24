'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { CaseStudy } from '../../data/caseStudies'

type Props = {
  study: CaseStudy
}

export default function CaseStudyDetail({ study }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!study) return null

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-primary to-secondary overflow-hidden">
        {study.heroImage ? (
          <div className="absolute inset-0">
            <Image
              src={study.heroImage}
              alt={study.business}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
            {study.logo}
          </div>
        )}
        
        <div className="relative container-custom h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Case Studies</span>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              {study.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {study.business}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              {study.summary}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-sm">Industry:</span>
                <span className="font-semibold">{study.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Location:</span>
                <span className="font-semibold">{study.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Timeline:</span>
                <span className="font-semibold">{study.timeframe}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Banner */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {study.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {result.metric}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {result.label}
                </div>
                {result.description && (
                  <div className="text-sm text-gray-600">
                    {result.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">The Challenge</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {study.challenge}
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">The Solution</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {study.solution}
              </p>
              
              {study.implementation && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Implementation Details</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {study.implementation}
                  </p>
                </>
              )}
            </motion.div>

            {/* Image Gallery */}
            {study.images && study.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Gallery</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {study.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-md"
                      onClick={() => setSelectedImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`${study.business} - Image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-8 text-white"
            >
              <div className="text-6xl mb-4 opacity-50">"</div>
              <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                {study.testimonial}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{study.author.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-xl font-bold">{study.author}</div>
                  <div className="text-white/80">{study.role}, {study.business}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Facts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Company</div>
                    <div className="font-semibold text-gray-900">{study.business}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Industry</div>
                    <div className="font-semibold text-gray-900">{study.industry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="font-semibold text-gray-900">{study.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Project Duration</div>
                    <div className="font-semibold text-gray-900">{study.timeframe}</div>
                  </div>
                  {study.date && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Completed</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(study.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Tags */}
              {study.tags && study.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-3">Ready for similar results?</h3>
                <p className="text-white/90 mb-6">
                  Let's discuss how automation can transform your business.
                </p>
                <Link
                  href="/demo"
                  className="block w-full bg-white text-primary text-center font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Book a Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-[80vh]">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      )}
    </article>
  )
}
