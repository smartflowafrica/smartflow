'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

// Note: Metadata export doesn't work in client components
// SEO handled by root layout.tsx
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    contactMethod: 'email',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['+234 814 552 3052'],
      description: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['hello@smartflowafrica.com', 'support@smartflowafrica.com'],
      description: 'We respond within 24 hours',
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      details: ['123 Business District', 'Victoria Island, Lagos, Nigeria'],
      description: 'Visit by appointment only',
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      description: 'Closed on Sundays',
    },
  ]

  const subjects = [
    'General Inquiry',
    'Sales & Pricing',
    'Technical Support',
    'Partnership Opportunities',
    'Feature Request',
    'Billing Question',
    'Other',
  ]

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'You can start using SmartFlow within 24 hours. After signing up, we will schedule a quick onboarding call, connect your WhatsApp Business API, and you will be ready to automate!',
    },
    {
      question: 'Do I need technical knowledge?',
      answer: 'Not at all! SmartFlow is designed for business owners, not developers. Our interface is simple and intuitive. Plus, our team provides full training and ongoing support.',
    },
    {
      question: 'What if I need help?',
      answer: 'We are here for you! Professional and Enterprise plans include priority support via email, phone, and WhatsApp. We also have extensive documentation, video tutorials, and a monthly consultation call.',
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes! SmartFlow integrates with popular CRMs (HubSpot, Zoho, Salesforce), payment gateways (Paystack, Flutterwave), and many other business tools. Need a custom integration? We can build it.',
    },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      // In production, this would:
      // 1. Validate data on server
      // 2. Store in database
      // 3. Send email notification to team
      // 4. Send confirmation email to customer
      // 5. Add to CRM (HubSpot)
      // 6. Create ticket in support system
      // 7. Send WhatsApp confirmation (if phone provided)

      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsSuccess(true)

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        contactMethod: 'email',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Have questions? We would love to hear from you. Our team is here to help 
              you transform your business with automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-primary transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 mb-1">
                    {detail}
                  </p>
                ))}
                <p className="text-sm text-gray-500 mt-2">{info.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {isSuccess ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Message Sent Successfully! 🎉
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Thank you for contacting SmartFlow Africa. We have received your message 
                    and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Company (Optional) */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Company Name (Optional)
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Contact Method Preference */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          checked={formData.contactMethod === 'email'}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={formData.contactMethod === 'phone'}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-gray-700">Phone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="whatsapp"
                          checked={formData.contactMethod === 'whatsapp'}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-gray-700">WhatsApp</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full btn-primary text-lg py-4 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    We typically respond within 24 hours during business days
                  </p>
                </form>
              )}
            </motion.div>

            {/* Right Column - FAQs & WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Quick WhatsApp Contact */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Need Immediate Help?</h3>
                    <p className="text-white/90">Chat with us on WhatsApp</p>
                  </div>
                </div>
                <p className="text-white/90 mb-6">
                  Get instant responses to your questions. Our team is available during 
                  business hours to help you.
                </p>
                <a
                  href="https://wa.me/2348145523052"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-green-600 px-6 py-4 rounded-lg font-bold hover:bg-white/90 transition-all"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>

              {/* Quick FAQs */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
                    >
                      <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="/demo"
                  className="block mt-6 text-center bg-primary/10 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/20 transition-all"
                >
                  View All FAQs
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="bg-gray-200 h-96">
        <div className="h-full flex items-center justify-center text-gray-500">
          {/* In production, integrate Google Maps or similar */}
          <div className="text-center">
            <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">
              123 Business District, Victoria Island, Lagos, Nigeria
            </p>
            <p className="text-sm mt-2">Visit by appointment only</p>
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
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to See SmartFlow in Action?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Book a free demo and discover how we can transform your business with automation.
            </p>
            <a href="/demo" className="btn-secondary inline-block">
              Schedule Free Demo
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
