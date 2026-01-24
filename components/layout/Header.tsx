'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  {
    label: 'Services',
    type: 'dropdown',
    items: [
      { label: 'WhatsApp Automation', url: '/services/whatsapp-automation', icon: 'message-circle' },
      { label: 'CRM Integration', url: '/services/crm-integration', icon: 'users' },
      { label: 'Email Automation', url: '/services/email-automation', icon: 'mail' },
      { label: 'Payment Automation', url: '/services/payment-automation', icon: 'credit-card' },
      { label: 'Workflow Automation', url: '/services/workflow-automation', icon: 'git-branch' },
      { label: 'Custom Solutions', url: '/services/custom-solutions', icon: 'settings' },
      { label: 'View All Services →', url: '/services', featured: true }
    ]
  },
  {
    label: 'Industries',
    type: 'dropdown',
    items: [
      { label: 'Restaurants', url: '/industries/restaurants', icon: 'utensils' },
      { label: 'E-commerce', url: '/industries/ecommerce', icon: 'shopping-cart' },
      { label: 'Hotels', url: '/industries/hotels', icon: 'home' },
      { label: 'Healthcare', url: '/industries/healthcare', icon: 'heart' },
      { label: 'Real Estate', url: '/industries/real-estate', icon: 'building' },
      { label: 'Professional Services', url: '/industries/professional-services', icon: 'briefcase' }
    ]
  },
  {
    label: 'Pricing',
    type: 'link',
    url: '/pricing'
  },
  {
    label: 'Case Studies',
    type: 'link',
    url: '/case-studies'
  },
  {
    label: 'Resources',
    type: 'dropdown',
    items: [
      { label: 'Blog', url: '/blog' },
      { label: 'Guides & Downloads', url: '/resources/guides' },
      { label: 'FAQs', url: '/resources/faqs' },
      { label: 'ROI Calculator', url: '/resources/roi-calculator' }
    ]
  },
  {
    label: 'About',
    type: 'link',
    url: '/about'
  }
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <nav className="container-custom" aria-label="Global">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">SmartFlow Africa</span>
              <img
                src="/newlogo.png"
                alt="SmartFlow Africa Logo"
                className="h-64 w-64 object-contain"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <div key={item.label} className="relative">
                {item.type === 'link' ? (
                  <Link
                    href={item.url!}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors">
                      {item.label}
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-3 w-screen max-w-md overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5"
                        >
                          <div className="p-4">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.url}
                                className={`group relative flex items-center gap-x-4 rounded-lg p-3 text-sm leading-6 hover:bg-gray-50 ${(subItem as any).featured ? 'border-t border-gray-200 mt-2 pt-4 font-semibold text-primary' : ''
                                  }`}
                              >
                                <div className="flex-auto">
                                  <span className={(subItem as any).featured ? 'text-primary' : 'text-gray-900'}>
                                    {subItem.label}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Link
              href="/contact"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/demo"
              className="btn-primary text-sm py-2 px-6"
            >
              Book Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:hidden"
            >
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">SmartFlow Africa</span>
                  <img
                    src="/newlogo.png"
                    alt="SmartFlow Africa Logo"
                    className="h-56 w-56 object-contain"
                  />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <div key={item.label}>
                        {item.type === 'link' ? (
                          <Link
                            href={item.url!}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <div>
                            <button
                              onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                              className="-mx-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.label}
                              <ChevronDownIcon
                                className={`h-5 w-5 transform transition-transform ${openDropdown === item.label ? 'rotate-180' : ''
                                  }`}
                              />
                            </button>
                            {openDropdown === item.label && (
                              <div className="mt-2 space-y-2 pl-6">
                                {item.items?.map((subItem) => (
                                  <Link
                                    key={subItem.label}
                                    href={subItem.url}
                                    className="block rounded-lg px-3 py-2 text-sm leading-7 text-gray-600 hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="py-6 space-y-4">
                    <Link
                      href="/contact"
                      className="btn-secondary text-center block w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <Link
                      href="/demo"
                      className="btn-primary text-center block w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Book Demo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
