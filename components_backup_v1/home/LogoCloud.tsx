'use client'

import Image from 'next/image'

const clients = [
  { name: "Restaurant 1", logo: "/assets/clients/client-1.png" },
  { name: "E-commerce 1", logo: "/assets/clients/client-2.png" },
  { name: "Hotel 1", logo: "/assets/clients/client-3.png" },
  { name: "Clinic 1", logo: "/assets/clients/client-4.png" },
  { name: "Service 1", logo: "/assets/clients/client-5.png" },
  { name: "Retail 1", logo: "/assets/clients/client-6.png" }
]

export default function LogoCloud() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-12">
          Trusted by Leading Nigerian Businesses
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-gray-400 font-semibold text-sm">{client.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
