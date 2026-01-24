'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export default function CustomSolutionsPage() {
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
                Custom Solutions for Your Business
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Every business is unique. We create tailored automation and integration solutions 
                that fit your exact needs, not generic off-the-shelf software.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-secondary">
                  Discuss Your Needs
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
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-white/80">Custom Solutions</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Tailored</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/80">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Expert</div>
                  <div className="text-white/80">Team</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                What We Can Build for You
              </h2>
              <p className="text-xl text-gray-600">
                Custom solutions designed around your unique requirements
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: CodeBracketIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: 'Bespoke Software Development',
                  description: 'Custom applications built from scratch to solve your specific business challenges. Web apps, mobile apps, or desktop solutions.',
                  examples: ['Inventory management systems', 'Customer portals', 'Internal tools'],
                },
                {
                  icon: CpuChipIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'System Integration Solutions',
                  description: 'Connect all your disparate systems into one unified ecosystem. Legacy software, modern cloud apps, everything working together.',
                  examples: ['ERP integration', 'Multi-platform sync', 'Data consolidation'],
                },
                {
                  icon: CommandLineIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Process Automation',
                  description: 'Automate your unique workflows end-to-end. We analyze your processes and build automation that actually works for you.',
                  examples: ['Order fulfillment automation', 'Document processing', 'Approval workflows'],
                },
                {
                  icon: RocketLaunchIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Business Intelligence Dashboards',
                  description: 'Real-time dashboards showing the exact metrics that matter to your business. Data from all your systems in one place.',
                  examples: ['Executive dashboards', 'KPI tracking', 'Sales analytics'],
                },
                {
                  icon: ShieldCheckIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'AI-Powered Solutions',
                  description: 'Leverage artificial intelligence to gain competitive advantage. Predictive analytics, smart automation, and intelligent insights.',
                  examples: ['Demand forecasting', 'Customer behavior analysis', 'Intelligent chatbots'],
                },
                {
                  icon: UserGroupIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'Custom Integrations',
                  description: 'Build bridges between systems that were never meant to work together. APIs, webhooks, and middleware solutions.',
                  examples: ['Payment gateway integration', 'Shipping API connection', 'Third-party app sync'],
                },
              ].map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-8 shadow-lg"
                  >
                    <div className="flex items-start gap-6 mb-4">
                      <div className={`p-4 ${service.bgColor} rounded-xl flex-shrink-0`}>
                        <Icon className={`w-8 h-8 ${service.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{service.description}</p>
                      </div>
                    </div>
                    <div className="pl-20">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Examples:</div>
                      <ul className="space-y-1">
                        {service.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            • {example}
                          </li>
                        ))}
                      </ul>
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
              Real Business Problems We Have Solved
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🏪',
                title: 'Retail Chain',
                challenge: 'Manual inventory across 15 locations',
                solution: 'Built custom multi-location inventory system with real-time sync, automated reordering, and mobile app for staff',
                result: '90% less stockouts, ₦3M saved monthly',
              },
              {
                icon: '🏥',
                title: 'Healthcare Provider',
                challenge: 'Paper-based patient records',
                solution: 'Created HIPAA-compliant digital records system with appointment booking, billing integration, and patient portal',
                result: '70% faster patient processing, zero lost records',
              },
              {
                icon: '🏗️',
                title: 'Construction Company',
                challenge: 'No project visibility or cost tracking',
                solution: 'Built project management platform with time tracking, material ordering, subcontractor management, and financial reporting',
                result: '50% better project margins, ₦8M recovered',
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
                <div className="text-5xl mb-4 text-center">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {useCase.title}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-red-600 font-semibold mb-1">Challenge:</div>
                    <div className="text-sm text-gray-700">{useCase.challenge}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 font-semibold mb-1">Solution:</div>
                    <div className="text-sm text-gray-700">{useCase.solution}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600 font-semibold mb-1">Result:</div>
                    <div className="text-sm font-semibold text-gray-900">{useCase.result}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Solution Development Process
            </h2>
            <p className="text-xl text-gray-600">
              Systematic approach that ensures success
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: 'Deep Discovery',
                description: 'We immerse ourselves in your business. Site visits, process mapping, stakeholder interviews - we learn everything.',
                duration: '1-2 weeks',
              },
              {
                step: '02',
                title: 'Solution Design',
                description: 'Create detailed technical and functional specifications. You see exactly what you will get before development starts.',
                duration: '1-2 weeks',
              },
              {
                step: '03',
                title: 'Iterative Development',
                description: 'Build in phases with regular demos. You provide feedback, we adjust. Agile methodology ensures we stay on track.',
                duration: '6-16 weeks',
              },
              {
                step: '04',
                title: 'User Testing',
                description: 'Your team tests in a staging environment. We refine based on real user feedback before going live.',
                duration: '2-3 weeks',
              },
              {
                step: '05',
                title: 'Deployment & Training',
                description: 'Smooth rollout with comprehensive training for your team. Documentation, video tutorials, hands-on sessions.',
                duration: '1-2 weeks',
              },
              {
                step: '06',
                title: 'Ongoing Evolution',
                description: 'Your business changes, your solution evolves. Continuous support, updates, and enhancements.',
                duration: 'Ongoing',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl font-bold text-primary/30">{step.step}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <div className="text-xs text-gray-500 mb-2">Timeline: {step.duration}</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{step.description}</p>
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
              Custom Solution Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Flexible options for every business size
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Small Business',
                description: 'Perfect for focused solutions',
                price: '₦300K - ₦800K',
                period: 'one-time',
                features: [
                  'Single process automation',
                  '2-3 integrations',
                  'Basic dashboard',
                  '60 days support',
                  'Training included',
                  'Documentation',
                ],
                ideal: 'Small teams, specific problem to solve',
                cta: 'Get Started',
              },
              {
                name: 'Growing Business',
                description: 'Comprehensive solutions',
                price: '₦1M - ₦3M',
                period: 'one-time',
                features: [
                  'Multiple process automation',
                  '5-10 integrations',
                  'Advanced dashboards',
                  '90 days priority support',
                  'Comprehensive training',
                  'Full documentation',
                ],
                ideal: 'Medium-sized operations, multiple departments',
                cta: 'Schedule Demo',
                popular: true,
              },
              {
                name: 'Enterprise',
                description: 'Full digital transformation',
                price: '₦3M+',
                period: 'custom',
                features: [
                  'End-to-end automation',
                  'Unlimited integrations',
                  'Custom BI platform',
                  '12 months support',
                  'Dedicated team',
                  'White-glove service',
                ],
                ideal: 'Large organizations, complex requirements',
                cta: 'Contact Sales',
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-xl p-8 border-2 ${
                  plan.popular
                    ? 'border-primary ring-4 ring-primary/20 scale-105'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-primary">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-600">{plan.period}</div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <div className="text-xs text-gray-600 mb-1">Ideal for:</div>
                  <div className="text-sm font-semibold text-gray-900">{plan.ideal}</div>
                </div>
                <Link
                  href="/contact"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-600 mt-8">
            All solutions include: Free consultation • Detailed proposal • Source code ownership • Training
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
              Ready to Build Your Custom Solution?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Let us understand your unique challenges and create the perfect solution for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Start Your Project
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
            <p className="text-white/70 text-sm mt-6">
              Free consultation • Detailed proposal in 48 hours • No obligation
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
