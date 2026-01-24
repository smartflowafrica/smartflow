'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export default function CRMIntegrationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                CRM & Contact Management Integration
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Keep all your customer data organized in one place. No more scattered 
                conversations, no more manual data entry, no more lost leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  Schedule Free Demo
                </Link>
                <Link href="#pricing" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center">
                  View Pricing
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Zero</div>
                  <div className="text-white/80">Manual Data Entry</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Synced Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3hrs</div>
                  <div className="text-white/80">Saved Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">360°</div>
                  <div className="text-white/80">Customer View</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Manage Customer Relationships
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: ArrowPathIcon,
                  title: 'Automatic Contact Syncing',
                  description: 'Every WhatsApp, email, or phone conversation automatically creates or updates the contact in your CRM. No manual copying and pasting.',
                },
                {
                  icon: DocumentTextIcon,
                  title: 'Complete Conversation History',
                  description: 'See every interaction with each customer in one place. Know exactly what was discussed, when, and by whom.',
                },
                {
                  icon: UserGroupIcon,
                  title: 'Lead Scoring & Qualification',
                  description: 'Automatically score leads based on behavior and interactions. Focus your team on the hottest prospects.',
                },
                {
                  icon: BoltIcon,
                  title: 'Automated Follow-Ups',
                  description: 'Set up trigger-based follow-ups. Customer goes cold? System sends automated check-in messages.',
                },
                {
                  icon: ChartBarIcon,
                  title: 'Sales Pipeline Automation',
                  description: 'Move deals through your pipeline automatically based on customer actions. No more manual stage updates.',
                },
                {
                  icon: CheckCircleIcon,
                  title: 'Custom Fields & Tags',
                  description: 'Track any data point important to your business. Segment customers however you need.',
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 shadow-lg flex items-start gap-6"
                  >
                    <div className="p-4 bg-primary/10 rounded-xl flex-shrink-0">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We Integrate With Your Favorite CRM
            </h2>
            <p className="text-xl text-gray-600">
              Already using a CRM? We connect seamlessly
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'HubSpot', description: 'Full bidirectional sync with all HubSpot features' },
              { name: 'Salesforce', description: 'Enterprise-grade Salesforce integration' },
              { name: 'Zoho CRM', description: 'Complete Zoho CRM synchronization' },
              { name: 'Pipedrive', description: 'Pipeline management and deal tracking' },
              { name: 'Monday.com', description: 'Project and customer management sync' },
              { name: 'Custom CRM', description: 'API integration with any custom system' },
            ].map((crm, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-4xl font-bold text-primary mb-3">{crm.name}</div>
                <p className="text-gray-600 text-sm">{crm.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              CRM Integration Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Add CRM integration to any plan
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              CRM Integration Add-On
            </h3>
            <div className="text-5xl font-bold text-primary mb-4">
              +₦15,000<span className="text-2xl text-gray-600">/month</span>
            </div>
            <p className="text-gray-700 mb-8">
              Adds to your base automation plan (Starter, Professional, or Enterprise)
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              {[
                'Unlimited contacts synced',
                'Bidirectional sync',
                'Real-time updates',
                'Custom field mapping',
                'Dedicated integration support',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/demo" className="btn-primary inline-block">
              Schedule Demo
            </Link>
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
              Ready to Unify Your Customer Data?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Stop losing track of customer conversations. Start building real relationships with complete context.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Schedule Free Demo
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Talk to Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
