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
  async rewrites() {
    return [
      {
        source: '/manager/:path*',
        destination: 'http://127.0.0.1:8081/manager/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://127.0.0.1:8081/socket.io/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
}

module.exports = nextConfig
