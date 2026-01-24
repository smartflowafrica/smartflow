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

export default function CustomDevelopmentPage() {
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
                Custom Development Services
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Unique problems need unique solutions. Our developers build custom integrations, 
                APIs, and automation systems tailored exactly to your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-secondary">
                  Discuss Your Project
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
                  <div className="text-4xl font-bold mb-2">20+</div>
                  <div className="text-white/80">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Enterprise</div>
                  <div className="text-white/80">Grade Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">Dedicated</div>
                  <div className="text-white/80">Dev Team</div>
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
                What We Build
              </h2>
              <p className="text-xl text-gray-600">
                From concept to deployment, we handle everything
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: CodeBracketIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: 'Custom API Development',
                  description: 'Need to connect systems that do not talk to each other? We build REST APIs, webhooks, and middleware that bridge any gap.',
                  examples: ['Payment gateway integrations', 'Logistics API connections', 'Multi-platform inventory sync'],
                },
                {
                  icon: CpuChipIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'Bespoke Integrations',
                  description: 'Every business is unique. We create custom integrations between your existing tools, legacy systems, and new platforms.',
                  examples: ['ERP to e-commerce sync', 'Accounting software integration', 'Custom CRM connections'],
                },
                {
                  icon: CommandLineIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Mobile App Integration',
                  description: 'Connect your mobile apps to backend systems, automate mobile workflows, and enable real-time data sync.',
                  examples: ['Delivery app automation', 'Sales rep mobile tools', 'Customer mobile portals'],
                },
                {
                  icon: RocketLaunchIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Custom Dashboards',
                  description: 'Real-time business dashboards showing exactly the metrics you care about, pulling from all your systems.',
                  examples: ['Executive dashboards', 'Operations monitoring', 'Sales performance tracking'],
                },
                {
                  icon: ShieldCheckIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'Advanced AI Features',
                  description: 'Machine learning models, predictive analytics, natural language processing customized for your business data.',
                  examples: ['Demand forecasting', 'Customer churn prediction', 'Intelligent chatbots'],
                },
                {
                  icon: UserGroupIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'Dedicated Development Team',
                  description: 'For ongoing projects, we assign a dedicated team that becomes an extension of your business.',
                  examples: ['Product development', 'Continuous improvement', 'Technical support'],
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
              Who Needs Custom Development?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🏢',
                title: 'Enterprise Companies',
                challenge: 'Complex multi-system integration',
                solution: 'Built unified platform connecting 5 legacy systems, 3 cloud apps, and mobile fleet management',
                result: '₦2M saved annually, 70% faster operations',
              },
              {
                icon: '🏭',
                title: 'Manufacturing Business',
                challenge: 'No visibility into production',
                solution: 'Created real-time production dashboard with IoT sensor integration and predictive maintenance',
                result: '40% less downtime, ₦5M cost savings',
              },
              {
                icon: '🚚',
                title: 'Logistics Company',
                challenge: 'Manual driver coordination',
                solution: 'Built custom dispatch system with GPS tracking, route optimization, and automated customer updates',
                result: '60% more deliveries, ₦800K monthly savings',
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
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600">
              Proven methodology that delivers results
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery & Requirements',
                description: 'Deep dive into your business, technical environment, and specific needs. We document everything.',
                duration: '1-2 weeks',
              },
              {
                step: '02',
                title: 'Solution Architecture',
                description: 'Design the technical solution, choose tech stack, plan integrations. You approve before we code.',
                duration: '1 week',
              },
              {
                step: '03',
                title: 'Agile Development',
                description: 'Build in 2-week sprints with regular demos. You see progress and can adjust as we go.',
                duration: '4-12 weeks',
              },
              {
                step: '04',
                title: 'Testing & QA',
                description: 'Rigorous testing on staging environment. Load testing, security audit, edge case handling.',
                duration: '1-2 weeks',
              },
              {
                step: '05',
                title: 'Deployment & Training',
                description: 'Smooth production deployment, team training, documentation delivery.',
                duration: '1 week',
              },
              {
                step: '06',
                title: 'Support & Maintenance',
                description: 'Ongoing support, bug fixes, updates, and enhancements. We are here for the long term.',
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
                    <div className="text-xs text-gray-500 mb-2">Duration: {step.duration}</div>
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
              Custom Development Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Flexible engagement models for every project size
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Project-Based',
                description: 'Fixed scope, fixed price',
                price: '₦200K+',
                period: 'one-time',
                features: [
                  'Detailed scope document',
                  'Fixed timeline',
                  'Milestone payments',
                  '30 days post-launch support',
                  'Full documentation',
                  'Source code ownership',
                ],
                ideal: 'Small to medium projects with clear requirements',
                cta: 'Get Quote',
              },
              {
                name: 'Time & Materials',
                description: 'Pay for actual work done',
                price: '₦150K',
                period: 'per week',
                features: [
                  'Flexible scope',
                  'Weekly billing',
                  'Regular progress updates',
                  'Change requests anytime',
                  'Dedicated developer',
                  'Priority support',
                ],
                ideal: 'Evolving requirements or ongoing development',
                cta: 'Get Started',
                popular: true,
              },
              {
                name: 'Dedicated Team',
                description: 'Full-time team extension',
                price: '₦500K+',
                period: 'per month',
                features: [
                  '2-5 developers',
                  'Project manager included',
                  'Your team, your direction',
                  'Full transparency',
                  'Slack integration',
                  'Unlimited revisions',
                ],
                ideal: 'Large ongoing projects or product development',
                cta: 'Schedule Call',
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
                  <div className="text-4xl font-bold text-primary">
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
            All projects include: Free consultation • Detailed proposal • NDA protection • Post-launch support
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
              Let Us Build Something Amazing Together
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Got a unique challenge? Our developers love solving problems others say cannot be done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                Discuss Your Project
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
              Free technical consultation • Detailed proposal in 48 hours • NDA available
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
