'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  BoltIcon,
  ClockIcon,
  CloudIcon,
  CodeBracketSquareIcon,
} from '@heroicons/react/24/outline'

export default function WorkflowAutomationPage() {
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
                Custom Workflow Automation
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Automate any business process you can imagine. From inventory updates 
                to staff notifications, we build workflows tailored to your unique needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo" className="btn-secondary">
                  Schedule Free Consultation
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
                  <div className="text-4xl font-bold mb-2">1000+</div>
                  <div className="text-white/80">Workflows Created</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">90%</div>
                  <div className="text-white/80">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Zero</div>
                  <div className="text-white/80">Human Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/80">Always Running</div>
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
                Powerful Workflow Automation Capabilities
              </h2>
              <p className="text-xl text-gray-600">
                If you can describe it, we can automate it
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: BoltIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: 'Custom Trigger-Action Workflows',
                  description: 'Define what triggers the workflow (new order, low stock, customer action) and what happens next. Simple or complex - your choice.',
                  stat: 'Unlimited possibilities',
                },
                {
                  icon: ArrowPathIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'Multi-Step Automation',
                  description: 'Chain multiple actions together. Order received → Update inventory → Notify supplier → Send confirmation → Update accounting.',
                  stat: 'Up to 50 steps per workflow',
                },
                {
                  icon: CodeBracketSquareIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Conditional Logic',
                  description: 'If-then conditions, branching paths, loops. Smart workflows that make decisions based on your business rules.',
                  stat: 'Complex logic supported',
                },
                {
                  icon: Cog6ToothIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Data Transformation',
                  description: 'Convert data between systems, format dates, calculate totals, merge information. Clean data flow everywhere.',
                  stat: 'Any data format',
                },
                {
                  icon: CloudIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'Third-Party API Integration',
                  description: 'Connect to any service with an API. Google Sheets, Slack, Trello, accounting software, logistics platforms - everything.',
                  stat: '1000+ integrations available',
                },
                {
                  icon: ClockIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'Scheduled Tasks',
                  description: 'Run workflows on schedule: daily inventory reports, weekly sales summaries, monthly billing cycles. Set and forget.',
                  stat: 'Precise timing control',
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
                    <div className={`p-4 ${feature.bgColor} rounded-xl flex-shrink-0`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{feature.description}</p>
                      <div className={`inline-block ${feature.bgColor} ${feature.color} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {feature.stat}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
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
              Real Workflow Examples
            </h2>
            <p className="text-xl text-gray-600">
              See what Nigerian businesses automate with custom workflows
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                industry: '📦 Operations',
                workflow: 'Inventory Sync Across Platforms',
                description: 'Product sold on Shopify → Update inventory in database → Update listings on Jumia and Konga → Alert supplier if stock low',
                result: 'Zero overselling, 6 hours saved weekly',
              },
              {
                industry: '🚚 Logistics',
                workflow: 'Order Routing Automation',
                description: 'New order received → Check customer location → Assign to nearest warehouse → Create delivery schedule → Notify driver → Send tracking to customer',
                result: '40% faster delivery, ₦200K saved monthly',
              },
              {
                industry: '🏭 Manufacturing',
                workflow: 'Production Tracking',
                description: 'Material arrives → Update inventory → Notify production manager → Track production progress → Alert when completed → Update sales team',
                result: 'Real-time visibility, 80% less manual tracking',
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="text-4xl mb-3">{useCase.industry.split(' ')[0]}</div>
                <div className="text-sm text-gray-500 mb-1">{useCase.industry.substring(3)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.workflow}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">{useCase.description}</p>
                </div>
                <div className="bg-secondary/10 text-secondary px-3 py-2 rounded-lg text-sm font-semibold">
                  {useCase.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              Our Workflow Development Process
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery & Analysis',
                description: 'We document your current process step-by-step, identify bottlenecks, and find automation opportunities.',
              },
              {
                step: '02',
                title: 'Workflow Design',
                description: 'We map out the automated workflow with triggers, actions, conditions, and error handling. You approve before we build.',
              },
              {
                step: '03',
                title: 'Development & Testing',
                description: 'Our team builds and tests the workflow thoroughly. We ensure it handles edge cases and errors gracefully.',
              },
              {
                step: '04',
                title: 'Deployment & Monitoring',
                description: 'We launch the workflow and monitor it closely for 2 weeks. Adjustments included if needed.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8"
              >
                <div className="text-5xl font-bold text-primary/20 mb-4">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Custom Workflow Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing based on workflow complexity
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Standard Package */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Standard Workflow
              </h3>
              <div className="text-4xl font-bold text-primary mb-4">
                ₦50,000<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-700 mb-6">
                For straightforward automation needs
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 3 integrated systems',
                  'Up to 10 workflow steps',
                  'Basic conditional logic',
                  'Standard integrations',
                  'Email support',
                  'Monthly optimization review',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/demo" className="btn-secondary w-full text-center block">
                Get Started
              </Link>
            </motion.div>

            {/* Advanced Package */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-2xl p-8 border-2 border-primary scale-105"
            >
              <div className="text-center mb-4">
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Advanced Workflow
              </h3>
              <div className="text-4xl font-bold mb-4">
                ₦100,000<span className="text-lg text-white/80">/month</span>
              </div>
              <p className="text-white/90 mb-6">
                For complex business processes
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited integrated systems',
                  'Unlimited workflow steps',
                  'Advanced conditional logic',
                  'Custom API integrations',
                  'Priority 24/7 support',
                  'Weekly optimization reviews',
                  'Dedicated workflow engineer',
                  'Guaranteed 99.9% uptime',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/demo" className="btn-secondary w-full text-center block bg-white text-primary hover:bg-gray-100">
                Get Started
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Need multiple workflows? Contact us for volume pricing and enterprise solutions.
          </p>
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
              Ready to Automate Your Business Processes?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Stop wasting time on repetitive tasks. Let us build custom workflows 
              that run your business on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="btn-secondary">
                Schedule Free Consultation
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Describe Your Workflow
              </Link>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Free workflow analysis • No commitment • Custom quote in 24 hours
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
