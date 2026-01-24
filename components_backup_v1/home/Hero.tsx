'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const heroData = {
  preHeading: "AI Automation for Nigerian Businesses",
  heading: "Automate Everything. Grow Faster.",
  subheading: "Transform your business operations with AI-powered automation. Save time, reduce costs, and scale effortlessly.",
  stats: [
    { value: "100+", label: "Businesses Automated" },
    { value: "99.5%", label: "Uptime Guarantee" },
    { value: "24/7", label: "AI Support" },
    { value: "₦0", label: "Setup Commission" }
  ],
  cta: [
    { text: "Get Started Free", type: "primary", link: "/demo" },
    { text: "See How It Works", type: "secondary", link: "#demo-video" }
  ]
}

export default function Hero() {
  return (
    <section className="relative gradient-bg text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container-custom section-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-heading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-100 text-sm font-semibold uppercase tracking-wide mb-4"
          >
            {heroData.preHeading}
          </motion.p>
          
          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            {heroData.heading}
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto"
          >
            {heroData.subheading}
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {heroData.cta.map((button, index) => (
              <Link
                key={index}
                href={button.link}
                className={`
                  px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
                  ${button.type === 'primary' 
                    ? 'bg-white text-primary hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                    : 'bg-transparent border-2 border-white hover:bg-white hover:text-primary'
                  }
                `}
              >
                {button.text}
              </Link>
            ))}
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {heroData.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
