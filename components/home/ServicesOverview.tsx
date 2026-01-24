'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "WhatsApp Automation",
    description: "Transform WhatsApp into your 24/7 sales, support, and booking assistant",
    features: ["Order processing", "Booking management", "Customer support", "Payment integration"],
    link: "/services/whatsapp-automation",
    popular: true
  },
  {
    icon: UserGroupIcon,
    title: "CRM Integration",
    description: "Centralize customer data and automate relationship management",
    features: ["Data synchronization", "Lead management", "Pipeline automation", "Analytics"],
    link: "/services/crm-integration"
  },
  {
    icon: EnvelopeIcon,
    title: "Email Automation",
    description: "Automated email campaigns, follow-ups, and customer journeys",
    features: ["Campaign automation", "Segmentation", "A/B testing", "Analytics"],
    link: "/services/email-automation"
  },
  {
    icon: CreditCardIcon,
    title: "Payment Automation",
    description: "Seamless payment processing, invoicing, and reconciliation",
    features: ["Paystack integration", "Auto-invoicing", "Payment tracking", "Refunds"],
    link: "/services/payment-automation"
  },
  {
    icon: ArrowPathIcon,
    title: "Workflow Automation",
    description: "Connect your tools and automate repetitive business processes",
    features: ["Multi-tool integration", "Custom workflows", "Data processing", "Scheduling"],
    link: "/services/workflow-automation"
  },
  {
    icon: CpuChipIcon,
    title: "Custom Solutions",
    description: "Tailored automation solutions for your specific business needs",
    features: ["Consultation", "Custom development", "Integration", "Support"],
    link: "/services/custom-solutions"
  }
]

export default function ServicesOverview() {
  return (
    <section className="section-padding relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <svg className="w-64 h-64 text-primary-500" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4"
          >
            Our Services
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-6"
          >
            Complete <span className="text-primary-600">Business Automation</span> Suite
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600"
          >
            Everything you need to automate and scale your business operations
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={`group card relative h-full flex flex-col ${service.popular ? 'border-primary-500/20 ring-1 ring-primary-500/20 shadow-primary-500/5' : ''}`}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-primary-100/50 backdrop-blur text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  Popular
                </div>
              )}

              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                {service.title}
              </h3>

              <p className="text-slate-600 mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-500">
                    <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={service.link}
                className="mt-auto inline-flex items-center text-primary-600 font-semibold hover:gap-2 transition-all duration-300 group-hover:text-primary-700"
              >
                Learn More
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/services" className="btn-primary inline-flex items-center gap-2">
            View All Services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
