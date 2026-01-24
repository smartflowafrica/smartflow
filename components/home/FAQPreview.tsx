'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'How long does implementation take?',
    answer: 'Most businesses are up and running within 7-10 days. Here\'s the breakdown: Discovery call (30 min), Solution design (2-3 days), Development & setup (3-5 days), Training & launch (1 day). We handle all the technical work - you just need to show up for the training.',
  },
  {
    question: 'Do I need any technical skills to use SmartFlow?',
    answer: 'No technical skills required! Our platform is designed for business owners, not developers. We provide full training during onboarding, and our support team is always available to help. If you can use WhatsApp, you can use SmartFlow.',
  },
  {
    question: 'What happens if I need to cancel?',
    answer: 'You can cancel anytime - no penalties, no long-term contracts. We earn your business every month. Simply let us know 7 days before your next billing cycle. We will even help you export your data if you decide to leave.',
  },
  {
    question: 'Can I integrate SmartFlow with my existing systems?',
    answer: 'Yes! SmartFlow integrates with popular platforms like HubSpot, Salesforce, Zoho, Google Sheets, Payment processors (Paystack, Flutterwave), and more. We also offer custom integrations for Enterprise customers.',
  },
  {
    question: 'Is my data safe and secure?',
    answer: 'Absolutely. We use bank-level 256-bit SSL encryption, secure cloud hosting, regular backups, and strict data privacy policies. We are NDPR compliant and never share your data with third parties. Your data stays in Nigeria.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include email and WhatsApp support. Professional and Enterprise plans get 24/7 priority support with faster response times. Enterprise customers also get a dedicated account manager and direct phone support.',
  },
]

export default function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Got questions? We have got answers. Here are the most common questions we get.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* More Questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                We are here to help. Talk to our team and get answers in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/2348012345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  WhatsApp Us
                </a>
                <a href="/contact" className="btn-primary">
                  Send a Message
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
