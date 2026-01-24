import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SmartFlow Africa, our mission to empower Nigerian businesses with intelligent automation, and the team behind the platform.',
  keywords: ['about smartflow africa', 'business automation company nigeria', 'ai automation lagos', 'nigerian tech startups'],
  openGraph: {
    title: 'About Us - SmartFlow Africa',
    description: 'Learn about SmartFlow Africa, our mission to empower Nigerian businesses with intelligent automation.',
    url: 'https://smartflowafrica.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - SmartFlow Africa',
    description: 'Learn about SmartFlow Africa, our mission to empower Nigerian businesses with intelligent automation.',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            We're Building the Future of Business in Africa
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            SmartFlow Africa empowers Nigerian businesses with intelligent automation that saves time, reduces costs, and drives growth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600">
              To make world-class business automation accessible and affordable for every Nigerian business, regardless of size.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                Every Nigerian business automated, efficient, and thriving in the digital economy.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Our Approach</h3>
              <p className="text-gray-600">
                Simple, practical automation solutions built specifically for the Nigerian market.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Our Commitment</h3>
              <p className="text-gray-600">
                24/7 local support, transparent pricing, and genuine partnership with our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              SmartFlow Africa was born from a simple observation: Nigerian businesses were losing money every day because they couldn't keep up with customer demands. Missed calls, unanswered messages, manual data entry—these weren't just inconveniences, they were bleeding revenue.
            </p>
            <p>
              We saw restaurants turning away customers because staff couldn't answer phones during rush hour. We saw e-commerce shops spending 6+ hours daily answering the same questions. We saw hotels losing bookings to competitors with better response times.
            </p>
            <p>
              The problem wasn't lack of effort—Nigerian entrepreneurs work harder than anyone. The problem was that automation tools were either too expensive, too complex, or simply not built for the African market.
            </p>
            <p>
              So we built SmartFlow Africa: intelligent automation designed specifically for Nigerian businesses. No technical degree required. No massive upfront investment. Just practical tools that work, backed by a team that understands your business.
            </p>
            <p>
              Today, we're proud to serve 100+ businesses across Nigeria, helping them capture every customer interaction, automate repetitive tasks, and focus on what they do best: serving their customers and growing their businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">🇳🇬</div>
              <h3 className="text-2xl font-bold mb-3">Built for Nigeria</h3>
              <p className="text-gray-700">
                We understand the unique challenges of doing business in Nigeria—from payment systems to internet connectivity to customer expectations. Our solutions are designed specifically for this market.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-2xl font-bold mb-3">Simplicity First</h3>
              <p className="text-gray-700">
                Technology should make your life easier, not harder. We obsess over simplicity, stripping away complexity until only the essential remains.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-3">Results-Driven</h3>
              <p className="text-gray-700">
                We measure success by your success. Every feature we build must directly contribute to saving you time, money, or both.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-3">True Partnership</h3>
              <p className="text-gray-700">
                We're not just a vendor—we're your technology partner. Your success is our success, and we're invested in your long-term growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SmartFlow by Numbers</h2>
            <p className="text-xl text-white/90">
              The impact we've made together with our clients
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-white/90">Active Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">847K+</div>
              <div className="text-white/90">Messages Automated</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">₦2.4B+</div>
              <div className="text-white/90">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">99.5%</div>
              <div className="text-white/90">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Meet the Team</h2>
          <p className="text-xl text-gray-600 mb-12">
            A diverse group of engineers, designers, and business experts passionate about empowering Nigerian businesses.
          </p>
          <p className="text-gray-700">
            Our team is distributed across Lagos, Abuja, and Port Harcourt, ensuring we understand the unique needs of businesses in different parts of Nigeria. We're engineers who code, designers who care about user experience, and business people who understand your challenges firsthand.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 100+ Nigerian businesses that have automated their operations and accelerated their growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="btn-primary">
              Book a Demo
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
