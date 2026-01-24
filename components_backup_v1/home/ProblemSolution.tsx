'use client'

export default function ProblemSolution() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problem */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Running a Business Shouldn't Be This Hard
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Missing 40-60% of customer calls</h3>
                  <p className="text-gray-600">Customers can't reach you during busy hours</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Staff wasting 4-5 hours daily</h3>
                  <p className="text-gray-600">Answering repetitive questions instead of serving customers</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-2xl">💸</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Losing ₦500k+ monthly</h3>
                  <p className="text-gray-600">Paying high commissions to third-party platforms</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Zero customer insights</h3>
                  <p className="text-gray-600">No data about your best customers or their preferences</p>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              SmartFlow Automates Everything
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Never Miss an Order</h3>
                  <p className="text-gray-600 mb-1">24/7 AI handles unlimited customers simultaneously</p>
                  <p className="text-green-600 font-semibold text-sm">100% capture rate</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Staff Focus on What Matters</h3>
                  <p className="text-gray-600 mb-1">Automation handles routine tasks, staff handle customers</p>
                  <p className="text-green-600 font-semibold text-sm">4 hours saved daily</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Keep All Your Revenue</h3>
                  <p className="text-gray-600 mb-1">Fixed monthly fee, no commission on orders</p>
                  <p className="text-green-600 font-semibold text-sm">₦465k saved monthly</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Know Your Customers</h3>
                  <p className="text-gray-600 mb-1">Complete database with preferences, history, analytics</p>
                  <p className="text-green-600 font-semibold text-sm">360° customer view</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
