/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['smartflowafrica.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/services/payment-automation',
        destination: '/services/payment-processing',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
