'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const heroData = {

  heading: "Automate Everything. Grow Faster.",
  subheading: "Transform your business operations with AI-powered automation. Save time, reduce costs, and scale effortlessly.",
  stats: [
    { value: "100+", label: "Businesses Automated" },
    { value: "99.5%", label: "Uptime Guarantee" },
    { value: "24/7", label: "AI Support" },

  ],
  cta: [
    { text: "Get Started Free", type: "primary", link: "/auth/signup" },
    { text: "See How It Works", type: "secondary", link: "#how-it-works" }
  ]
}

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900">

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">



          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-slate-900 mb-8"
          >
            Automate Everything. <br />
            <span className="gradient-text">Grow Faster.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed text-balance"
          >
            {heroData.subheading}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-center mb-20"
          >
            <Link
              href="/auth/signup"
              className="btn-primary min-w-[160px] flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="btn-secondary min-w-[160px]"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full glass-card p-8 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {heroData.stats.map((stat, index) => (
                <div key={index} className="pt-8 md:pt-0 first:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1 tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
