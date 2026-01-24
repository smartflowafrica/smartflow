'use client'

import Link from 'next/link'

const footerLinks = {
  services: [
    { label: 'WhatsApp Automation', url: '/services/whatsapp-automation' },
    { label: 'CRM Integration', url: '/services/crm-integration' },
    { label: 'Email Automation', url: '/services/email-automation' },
    { label: 'Payment Automation', url: '/services/payment-automation' },
    { label: 'Workflow Automation', url: '/services/workflow-automation' },
    { label: 'Custom Solutions', url: '/services/custom-solutions' }
  ],
  industries: [
    { label: 'Restaurants', url: '/industries/restaurants' },
    { label: 'E-commerce', url: '/industries/ecommerce' },
    { label: 'Hotels & Hospitality', url: '/industries/hotels' },
    { label: 'Healthcare', url: '/industries/healthcare' },
    { label: 'Real Estate', url: '/industries/real-estate' },
    { label: 'Professional Services', url: '/industries/professional-services' }
  ],
  company: [
    { label: 'About Us', url: '/about' },
    { label: 'Case Studies', url: '/case-studies' },
    { label: 'Pricing', url: '/pricing' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
    { label: 'Careers', url: '/careers' }
  ],
  resources: [
    { label: 'Guides & Downloads', url: '/resources/guides' },
    { label: 'FAQs', url: '/resources/faqs' },
    { label: 'ROI Calculator', url: '/resources/roi-calculator' },
    { label: 'Support', url: '/support' },
    { label: 'Privacy Policy', url: '/privacy' },
    { label: 'Terms of Service', url: '/terms' }
  ]
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Industries</h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {currentYear} SmartFlow Africa. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="mt-6 flex flex-col md:flex-row gap-6 text-sm">
            <a href="mailto:hello@smartflowafrica.com" className="hover:text-white transition-colors">
              hello@smartflowafrica.com
            </a>
            <a href="tel:+2348145523052" className="hover:text-white transition-colors">
              +234 814 552 3052
            </a>
            <a href="https://wa.me/2348145523052" className="hover:text-white transition-colors">
              WhatsApp: +234 814 552 3052
            </a>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex gap-6">
            <a
              href="https://linkedin.com/company/smartflowafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/smartflowafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com/smartflowafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/smartflowafrica"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
