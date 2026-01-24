'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { CaseStudy } from '../../data/caseStudies'

type Props = {
  study: CaseStudy
  index?: number
}

export default function CaseStudyCard({ study, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/case-studies/${study.slug}`} className="block group">
        <article className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          {/* Thumbnail Image */}
          <div className="relative h-56 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
            {study.thumbnail ? (
              <Image
                src={study.thumbnail}
                alt={study.business}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl opacity-50">{study.logo || '📊'}</span>
              </div>
            )}
            
            {/* Featured Badge */}
            {study.featured && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
            
            {/* Industry Tag */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-900">
              {study.industry}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {study.business}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span>{study.location}</span>
                {study.timeframe && (
                  <>
                    <span>•</span>
                    <span>{study.timeframe}</span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{study.summary}</p>
            </div>

            {/* Results */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {study.results.slice(0, 2).map((r, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-primary">{r.metric}</div>
                    <div className="text-xs text-gray-600">{r.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Read More Link */}
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Read Full Story</span>
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Tags */}
            {study.tags && study.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {study.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
