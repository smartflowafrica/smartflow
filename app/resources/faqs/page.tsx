'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'

interface FAQ {
  question: string
  answer: string
  category: string
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const faqs: FAQ[] = [
    // General Questions
    {
      category: 'General',
      question: 'What is SmartFlow Africa?',
      answer: 'SmartFlow Africa is a Nigerian automation company that helps businesses save time and money by automating repetitive tasks. We integrate your existing tools (WhatsApp, email, payment systems, CRMs) and build custom workflows that run on autopilot.',
    },
    {
      category: 'General',
      question: 'Who is SmartFlow Africa for?',
      answer: 'We serve Nigerian businesses of all sizes - from small retail shops to large enterprises. If you are spending hours on manual tasks like order processing, customer follow-ups, inventory tracking, or payment reconciliation, we can help.',
    },
    {
      category: 'General',
      question: 'How is SmartFlow different from hiring a developer?',
      answer: 'We specialize in business automation, not just coding. We understand Nigerian business challenges, integrate with local tools (Paystack, Flutterwave, Nigerian banks), and provide ongoing support. Plus, we are often more cost-effective than hiring a full-time developer.',
    },
    {
      category: 'General',
      question: 'Do I need technical knowledge to use your services?',
      answer: 'No! We handle all the technical work. You just tell us what problems you want to solve, and we build the automation. We also train your team on how to use the systems we create.',
    },

    // Pricing & Payment
    {
      category: 'Pricing',
      question: 'How much do your services cost?',
      answer: 'Pricing varies based on complexity. Simple automation starts at ₦50,000/month, while comprehensive solutions range from ₦150,000-₦500,000/month. Custom development projects start at ₦200,000. We offer free consultations to provide accurate quotes.',
    },
    {
      category: 'Pricing',
      question: 'Do you offer payment plans?',
      answer: 'Yes! We offer monthly subscriptions for ongoing automation services, and milestone-based payment for custom development projects. We can also discuss flexible payment terms for enterprise clients.',
    },
    {
      category: 'Pricing',
      question: 'Is there a setup fee?',
      answer: 'Setup fees vary by service. Some simple integrations have no setup fee, while complex custom solutions may have a one-time setup cost. This is always discussed upfront in your proposal.',
    },
    {
      category: 'Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, Paystack, Flutterwave, and for enterprise clients, we can invoice through your procurement process.',
    },
    {
      category: 'Pricing',
      question: 'Can I cancel anytime?',
      answer: 'Yes, our monthly subscriptions can be cancelled with 30 days notice. For custom development projects, cancellation terms are outlined in your contract.',
    },

    // Implementation
    {
      category: 'Implementation',
      question: 'How long does implementation take?',
      answer: 'Simple integrations: 1-2 weeks. Standard automation: 2-4 weeks. Complex custom solutions: 6-16 weeks. We provide detailed timelines in your proposal.',
    },
    {
      category: 'Implementation',
      question: 'Will you disrupt my current operations?',
      answer: 'No. We build and test everything in a staging environment first. When ready, we deploy during off-hours or low-traffic periods. Your business keeps running smoothly.',
    },
    {
      category: 'Implementation',
      question: 'Do I need to provide access to my systems?',
      answer: 'Yes, we need secure access to the systems we are integrating (APIs, logins, etc.). We sign NDAs and follow strict security protocols. Access is revoked after project completion if you prefer.',
    },
    {
      category: 'Implementation',
      question: 'Will you train my staff?',
      answer: 'Absolutely! Every project includes comprehensive training for your team. We provide documentation, video tutorials, and hands-on training sessions.',
    },
    {
      category: 'Implementation',
      question: 'What if something breaks after deployment?',
      answer: 'All projects include post-launch support (duration varies by package). We also offer ongoing maintenance plans. If we built it, we will fix it.',
    },

    // Technical
    {
      category: 'Technical',
      question: 'What tools and platforms do you integrate with?',
      answer: 'We integrate with virtually any platform that has an API: WhatsApp Business API, Paystack, Flutterwave, Nigerian banks, Shopify, WooCommerce, Zoho, HubSpot, Monday.com, Google Workspace, Microsoft 365, custom databases, and many more.',
    },
    {
      category: 'Technical',
      question: 'Do you work with legacy systems?',
      answer: 'Yes! We specialize in connecting modern tools with older systems. If your legacy system has any form of data export or API, we can integrate it.',
    },
    {
      category: 'Technical',
      question: 'Is my data secure?',
      answer: 'Security is our priority. We use encrypted connections, secure servers, follow GDPR/data protection principles, and sign NDAs. We never share or sell your data.',
    },
    {
      category: 'Technical',
      question: 'Where is my data stored?',
      answer: 'Data is stored on secure cloud servers (AWS, Google Cloud) with Nigerian or EU data centers. For sensitive data, we can discuss on-premise or private cloud solutions.',
    },
    {
      category: 'Technical',
      question: 'Can you integrate with our custom/proprietary software?',
      answer: 'Most likely, yes! If your software has an API, database access, or can export data, we can integrate it. We will assess during the discovery phase.',
    },

    // Services Specific
    {
      category: 'Services',
      question: 'What is WhatsApp Business API automation?',
      answer: 'WhatsApp Business API lets you automate customer communications at scale. Auto-reply to orders, send payment confirmations, delivery updates, appointment reminders - all through WhatsApp. It is different from the regular WhatsApp Business app.',
    },
    {
      category: 'Services',
      question: 'Can you automate my email marketing?',
      answer: 'Yes! We set up automated email sequences, cart abandonment emails, customer re-engagement campaigns, personalized product recommendations, and more. All triggered automatically based on customer behavior.',
    },
    {
      category: 'Services',
      question: 'What is workflow automation?',
      answer: 'Workflow automation connects your different tools so data flows automatically between them. For example: When a customer orders → payment is verified → inventory updates → supplier is notified → customer gets confirmation → delivery is scheduled. All automatic.',
    },
    {
      category: 'Services',
      question: 'Do you build mobile apps?',
      answer: 'Yes, as part of our custom development services. We build mobile apps for iOS and Android, or cross-platform apps that work on both.',
    },
    {
      category: 'Services',
      question: 'Can you help with CRM implementation?',
      answer: 'Absolutely! We help you choose the right CRM (Zoho, HubSpot, Salesforce, or custom), migrate your data, integrate with your other tools, and train your team.',
    },

    // Support & Maintenance
    {
      category: 'Support',
      question: 'What kind of support do you provide?',
      answer: 'All plans include email and WhatsApp support. Higher tiers include priority support, phone support, and dedicated account managers. Enterprise clients get 24/7 support.',
    },
    {
      category: 'Support',
      question: 'How quickly do you respond to issues?',
      answer: 'Critical issues: Within 2 hours. High priority: Within 4 hours. Normal requests: Within 24 hours. Response times improve with higher support tiers.',
    },
    {
      category: 'Support',
      question: 'Do you offer ongoing maintenance?',
      answer: 'Yes! We offer monthly maintenance plans that include updates, bug fixes, monitoring, backups, and continuous optimization.',
    },
    {
      category: 'Support',
      question: 'What happens if my business grows and needs more?',
      answer: 'That is great! Our solutions are designed to scale. We can add more features, handle higher volumes, and expand integrations as you grow.',
    },

    // Getting Started
    {
      category: 'Getting Started',
      question: 'How do I get started?',
      answer: 'Contact us for a free consultation. We will discuss your challenges, assess your needs, and provide a detailed proposal with pricing and timeline. No obligation.',
    },
    {
      category: 'Getting Started',
      question: 'Do you offer free consultations?',
      answer: 'Yes! We offer a free 30-60 minute consultation to understand your business and discuss how automation can help you.',
    },
    {
      category: 'Getting Started',
      question: 'What information should I prepare for the consultation?',
      answer: 'Think about: What repetitive tasks waste your time? What tools/software you currently use? What data you need to track? What your biggest operational challenges are? We will guide the conversation.',
    },
    {
      category: 'Getting Started',
      question: 'Can I see examples of your work?',
      answer: 'Yes! Check our case studies page to see real projects we have completed for Nigerian businesses, including the challenges, solutions, and results.',
    },
    {
      category: 'Getting Started',
      question: 'Do you sign NDAs?',
      answer: 'Yes, we are happy to sign NDAs before discussing your business details. We treat all client information as confidential.',
    },
  ]

  const categories = ['All', 'General', 'Pricing', 'Implementation', 'Technical', 'Services', 'Support', 'Getting Started']

  const filteredFAQs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <QuestionMarkCircleIcon className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Everything you need to know about SmartFlow Africa's automation services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Ask a Question
              </Link>
              <Link
                href="/demo"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQs List */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="text-xs text-primary font-semibold mb-1">{faq.category}</div>
                      <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                    </div>
                    <ChevronDownIcon
                      className={`w-6 h-6 text-gray-500 flex-shrink-0 ml-4 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5"
                    >
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600">
              We are here to help you understand how automation can transform your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Talk to Our Team',
                description: 'Get personalized answers to your specific questions',
                cta: 'Contact Us',
                href: '/contact',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
              {
                icon: DocumentTextIcon,
                title: 'View Case Studies',
                description: 'See real examples of how we have helped businesses like yours',
                cta: 'Read Case Studies',
                href: '/case-studies',
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
              },
              {
                icon: RocketLaunchIcon,
                title: 'Book a Demo',
                description: 'See our automation solutions in action with a live demo',
                cta: 'Schedule Demo',
                href: '/demo',
                color: 'text-accent',
                bgColor: 'bg-accent/10',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-8 text-center"
                >
                  <div className={`inline-flex p-4 ${item.bgColor} rounded-xl mb-4`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                  <Link
                    href={item.href}
                    className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    {item.cta}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
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
              Ready to Automate Your Business?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Let us show you exactly how automation can save you time and money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Get Free Consultation
              </Link>
              <Link
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                WhatsApp Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
