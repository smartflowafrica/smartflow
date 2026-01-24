'use client'

import Link from 'next/link'

const services = [
  {
    icon: "💬",
    title: "WhatsApp Automation",
    description: "Transform WhatsApp into your 24/7 sales, support, and booking assistant",
    features: ["Order processing", "Booking management", "Customer support", "Payment integration"],
    link: "/services/whatsapp-automation",
    popular: true
  },
  {
    icon: "👥",
    title: "CRM Integration",
    description: "Centralize customer data and automate relationship management",
    features: ["Data synchronization", "Lead management", "Pipeline automation", "Analytics"],
    link: "/services/crm-integration"
  },
  {
    icon: "📧",
    title: "Email Automation",
    description: "Automated email campaigns, follow-ups, and customer journeys",
    features: ["Campaign automation", "Segmentation", "A/B testing", "Analytics"],
    link: "/services/email-automation"
  },
  {
    icon: "💳",
    title: "Payment Automation",
    description: "Seamless payment processing, invoicing, and reconciliation",
    features: ["Paystack integration", "Auto-invoicing", "Payment tracking", "Refunds"],
    link: "/services/payment-automation"
  },
  {
    icon: "🔄",
    title: "Workflow Automation",
    description: "Connect your tools and automate repetitive business processes",
    features: ["Multi-tool integration", "Custom workflows", "Data processing", "Scheduling"],
    link: "/services/workflow-automation"
  },
  {
    icon: "⚙️",
    title: "Custom Solutions",
    description: "Tailored automation solutions for your specific business needs",
    features: ["Consultation", "Custom development", "Integration", "Support"],
    link: "/services/custom-solutions"
  }
]

export default function ServicesOverview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Complete Business Automation Suite
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to automate and scale your business operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`card relative ${service.popular ? 'ring-2 ring-primary' : ''}`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-4 bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-4xl mb-4">{service.icon}</div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={service.link}
                className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all duration-200"
              >
                Learn More
                <span className="ml-1">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
