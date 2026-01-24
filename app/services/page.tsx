'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'

const services = [
  {
    id: 'whatsapp-automation',
    name: 'WhatsApp Automation',
    icon: ChatBubbleLeftRightIcon,
    tagline: 'Turn WhatsApp into your most powerful sales channel',
    description: 'Automate customer conversations, capture leads 24/7, and never miss a sale. Perfect for Nigerian businesses that rely on WhatsApp.',
    popular: true,
    features: [
      'Auto-reply to common questions',
      'Lead capture and qualification',
      'Order taking and confirmations',
      'Appointment booking',
      'Product catalog integration',
      'Payment link sharing',
    ],
    useCases: ['Restaurants', 'E-commerce', 'Service Businesses'],
    pricing: 'From ₦20,000/month',
    stats: { customers: '80+', satisfaction: '4.9/5' },
    href: '/services/whatsapp-automation',
  },
  {
    id: 'crm-integration',
    name: 'CRM & Contact Management',
    icon: UserGroupIcon,
    tagline: 'Keep all your customer data organized in one place',
    description: 'Sync conversations to your CRM, track customer history, and manage relationships at scale without manual data entry.',
    popular: false,
    features: [
      'HubSpot, Salesforce, Zoho integration',
      'Automatic contact syncing',
      'Conversation history tracking',
      'Custom fields and tags',
      'Lead scoring',
      'Sales pipeline automation',
    ],
    useCases: ['Sales Teams', 'Real Estate', 'B2B Services'],
    pricing: 'From ₦35,000/month',
    stats: { customers: '45+', satisfaction: '4.8/5' },
    href: '/services/crm-integration',
  },
  {
    id: 'email-automation',
    name: 'Email Marketing Automation',
    icon: EnvelopeIcon,
    tagline: 'Send the right message at the right time',
    description: 'Automated email campaigns, drip sequences, and transactional emails that drive engagement and sales.',
    popular: false,
    features: [
      'Welcome email sequences',
      'Abandoned cart recovery',
      'Post-purchase follow-ups',
      'Newsletter automation',
      'A/B testing',
      'Analytics and reporting',
    ],
    useCases: ['E-commerce', 'SaaS', 'Content Creators'],
    pricing: 'From ₦25,000/month',
    stats: { customers: '60+', satisfaction: '4.7/5' },
    href: '/services/email-automation',
  },
  {
    id: 'payment-processing',
    name: 'Payment Processing',
    icon: CreditCardIcon,
    tagline: 'Get paid faster with automated payment links',
    description: 'Integrate Paystack, Flutterwave, and bank transfers directly into your conversations. Payment links sent automatically.',
    popular: false,
    features: [
      'Paystack & Flutterwave integration',
      'Automated payment link generation',
      'Payment confirmation automation',
      'Invoice creation',
      'Recurring billing',
      'Payment analytics',
    ],
    useCases: ['E-commerce', 'Service Providers', 'Subscriptions'],
    pricing: 'From ₦30,000/month',
    stats: { customers: '55+', satisfaction: '4.9/5' },
    href: '/services/payment-processing',
  },
  {
    id: 'workflow-automation',
    name: 'Custom Workflow Automation',
    icon: Cog6ToothIcon,
    tagline: 'Automate any business process you can imagine',
    description: 'From inventory updates to staff notifications, we build custom automation workflows tailored to your unique business needs.',
    popular: false,
    features: [
      'Custom trigger-action workflows',
      'Multi-step automation',
      'Conditional logic',
      'Data transformation',
      'Third-party API integration',
      'Scheduled tasks',
    ],
    useCases: ['Operations', 'Logistics', 'Manufacturing'],
    pricing: 'From ₦50,000/month',
    stats: { customers: '30+', satisfaction: '5.0/5' },
    href: '/services/workflow-automation',
  },
  {
    id: 'custom-development',
    name: 'Custom Development',
    icon: CodeBracketIcon,
    tagline: 'Unique problems need unique solutions',
    description: 'Need something special? Our developers build custom integrations, APIs, and automation systems just for you.',
    popular: false,
    features: [
      'Custom API development',
      'Bespoke integrations',
      'Mobile app integration',
      'Custom dashboards',
      'Advanced AI features',
      'Dedicated development team',
    ],
    useCases: ['Enterprise', 'Unique Requirements', 'Complex Systems'],
    pricing: 'Custom pricing',
    stats: { customers: '20+', satisfaction: '5.0/5' },
    href: '/services/custom-development',
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Automation Services Built for Nigerian Businesses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 mb-8"
            >
              From WhatsApp automation to custom development, we have the tools 
              to transform your business operations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/demo" className="btn-secondary inline-block">
                Schedule Free Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={service.href}
                    className={`block h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border-2 hover:scale-105 ${
                      service.popular
                        ? 'border-primary ring-4 ring-primary/20'
                        : 'border-transparent'
                    }`}
                  >
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="mb-4">
                        <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-block p-4 bg-primary/10 rounded-xl">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-primary font-semibold mb-3">
                      {service.tagline}
                    </p>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <svg
                            className="w-5 h-5 text-secondary flex-shrink-0 mr-2 mt-0.5"
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
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Use Cases */}
                    <div className="mb-6">
                      <div className="text-xs text-gray-500 mb-2">Perfect for:</div>
                      <div className="flex flex-wrap gap-2">
                        {service.useCases.map((useCase, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {service.pricing}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.stats.customers} customers • {service.stats.satisfaction}
                        </div>
                      </div>
                      <div className="text-primary font-semibold">
                        Learn More →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Book a free 30-minute consultation. We will analyze your business and 
              recommend the best automation strategy for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-primary">
                Schedule Free Consultation
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
