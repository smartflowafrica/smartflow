'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

export default function WhatsAppAutomationPage() {
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
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-white font-semibold">⭐ Most Popular Service</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                WhatsApp Automation for Nigerian Businesses
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Turn WhatsApp into your most powerful sales channel. Capture every lead, 
                automate responses, and close more deals - all while you sleep.
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
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Calls Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/80">Always Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">₦465K</div>
                  <div className="text-white/80">Avg. Monthly Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3x</div>
                  <div className="text-white/80">Response Speed</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
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
                The WhatsApp Problem Every Nigerian Business Faces
              </h2>
              <p className="text-xl text-gray-600">
                Sound familiar?
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '📞',
                  title: 'Missing 40-60% of Customer Messages',
                  description: 'You are busy running your business. By the time you see the message, the customer already bought from someone else.',
                },
                {
                  icon: '⏰',
                  title: 'Spending 4+ Hours Daily on Repetitive Questions',
                  description: '"Where is my order?" "What are your prices?" "Are you open?" The same questions. Every. Single. Day.',
                },
                {
                  icon: '💸',
                  title: 'Losing ₦300K+ Monthly in Missed Sales',
                  description: 'Every unanswered message is money walking out the door. Your competitors who respond faster are eating your lunch.',
                },
                {
                  icon: '😰',
                  title: 'Cannot Scale Without Hiring More Staff',
                  description: 'You need 2-3 people just to keep up with messages. But you cannot afford that overhead.',
                },
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-xl p-6"
                >
                  <div className="text-4xl mb-3">{problem.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-700">{problem.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-gray-50">
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
                SmartFlow WhatsApp Automation: Your Solution
              </h2>
              <p className="text-xl text-gray-600">
                We built this specifically for Nigerian businesses like yours
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  icon: CheckCircleIcon,
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                  title: 'Instant Auto-Replies (Under 10 Seconds)',
                  description: 'Customer sends a message. Bot responds instantly with the exact info they need. No waiting. No missed opportunities.',
                  stat: '100% capture rate',
                },
                {
                  icon: ClockIcon,
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                  title: '24/7 Availability (Even When You Sleep)',
                  description: 'Your customers message at 2 AM? No problem. The bot handles inquiries, takes orders, and books appointments round the clock.',
                  stat: 'Save 4+ hours daily',
                },
                {
                  icon: ChartBarIcon,
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                  title: 'Smart Lead Qualification',
                  description: 'Bot asks the right questions, qualifies leads, and only sends you the serious buyers. Your time is valuable.',
                  stat: '3x more qualified leads',
                },
                {
                  icon: BoltIcon,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-100',
                  title: 'Automated Order Taking',
                  description: 'Product catalog, pricing, add to cart, payment links - all automated. Your customers can complete purchases without you lifting a finger.',
                  stat: '₦465K avg. monthly increase',
                },
                {
                  icon: ShieldCheckIcon,
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  title: 'CRM Integration',
                  description: 'Every conversation syncs to your CRM. Track customer history, follow-ups, and conversions automatically.',
                  stat: 'Zero manual data entry',
                },
                {
                  icon: ChatBubbleLeftRightIcon,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100',
                  title: 'Human Handoff When Needed',
                  description: 'Complex questions? Bot seamlessly transfers to your team with full context. You handle what matters, bot handles the rest.',
                  stat: '80% handled by automation',
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
                    className="bg-white rounded-xl p-8 shadow-lg flex items-start gap-6"
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
              Real Use Cases from Nigerian Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See how businesses like yours use WhatsApp automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                industry: '🍲 Restaurant',
                business: 'Mama\'s Kitchen, Lagos',
                useCase: 'Order Taking & Reservations',
                before: 'Missing 50% of orders during lunch rush',
                after: 'Capturing 100% of orders, ₦465K more monthly revenue',
              },
              {
                industry: '🛍️ E-commerce',
                business: 'Spice Route, Abuja',
                useCase: 'Product Inquiries & Order Status',
                before: 'Spending 6 hours daily answering FAQs',
                after: '89% of questions automated, 6 hours saved daily',
              },
              {
                industry: '🏨 Hotel',
                business: 'Serenity Suites, PH',
                useCase: 'Booking & Guest Services',
                before: '60% of inquiries going unanswered',
                after: '100% capture rate, 40% more bookings',
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
              >
                <div className="text-4xl mb-3">{useCase.industry.split(' ')[0]}</div>
                <div className="text-sm text-gray-500 mb-1">{useCase.industry.substring(3)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.business}
                </h3>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm font-semibold text-primary mb-2">
                    Use Case: {useCase.useCase}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-red-600 font-semibold mb-1">Before:</div>
                    <div className="text-sm text-gray-700">{useCase.before}</div>
                  </div>
                  <div>
                    <div className="text-xs text-green-600 font-semibold mb-1">After:</div>
                    <div className="text-sm text-gray-700">{useCase.after}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
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
              How It Works (Simple 4-Step Process)
            </h2>
            <p className="text-xl text-gray-600">
              From setup to live automation in just 5-7 days
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                step: '01',
                title: '30-Minute Discovery Call',
                description: 'We understand your business, your customers, and your most common inquiries. No technical jargon.',
              },
              {
                step: '02',
                title: 'Custom Bot Design (2-3 Days)',
                description: 'We build conversation flows specific to your business. You review and approve before launch.',
              },
              {
                step: '03',
                title: 'WhatsApp Business API Setup',
                description: 'We handle all the technical setup. You just need your WhatsApp Business number.',
              },
              {
                step: '04',
                title: 'Training & Go Live',
                description: 'We train your team, launch the bot, and monitor for 7 days. You are never alone.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg"
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
              WhatsApp Automation Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business size
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '20,000',
                conversations: '1,000',
                features: [
                  'WhatsApp Business API',
                  'Basic automation flows',
                  'Up to 1,000 conversations/month',
                  'Email support',
                  '2 team members',
                  'Standard templates',
                ],
                cta: 'Start Free Trial',
                popular: false,
              },
              {
                name: 'Professional',
                price: '35,000',
                conversations: '5,000',
                features: [
                  'Everything in Starter',
                  'Advanced AI responses',
                  'Up to 5,000 conversations/month',
                  'CRM integration',
                  'Priority 24/7 support',
                  '5 team members',
                  'Custom workflows',
                  'Analytics dashboard',
                ],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '60,000',
                conversations: 'Unlimited',
                features: [
                  'Everything in Professional',
                  'Unlimited conversations',
                  'Custom AI training',
                  'Dedicated account manager',
                  'White-label options',
                  'Unlimited team members',
                  'API access',
                  'SLA guarantee',
                ],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {plan.name}
                </h3>
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl text-gray-600">₦</span>
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {plan.conversations} conversations
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/demo"
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
            All plans include 7-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Do I need WhatsApp Business API?',
                a: 'Yes, but we handle the entire setup for you. You just need a WhatsApp Business number (can be your existing number).',
              },
              {
                q: 'Can customers still reach a real person?',
                a: 'Absolutely! The bot handles common questions, but complex inquiries are seamlessly transferred to your team with full context.',
              },
              {
                q: 'What if the bot gives wrong answers?',
                a: 'We train the bot on your specific business during setup. You review and approve all responses before launch. Plus, you can update anytime.',
              },
              {
                q: 'How long until we are live?',
                a: '5-7 days from discovery call to go-live. We move fast because we know you are losing money every day you wait.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </motion.div>
            ))}
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
              Ready to Stop Missing Sales on WhatsApp?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Join 80+ Nigerian businesses already automating their WhatsApp. 
              7-day free trial. No credit card required.
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
            <p className="text-white/70 text-sm mt-6">
              Setup takes 5-7 days • Live support included • Money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
