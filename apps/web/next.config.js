/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/docs',
        has: [{ type: 'host', value: 'mockingbird.tinybird.co' }],
        destination: 'https://mockingbird-docs.tinybird.co/docs',
      },
      {
        source: '/docs/:path*',
        has: [{ type: 'host', value: 'mockingbird.tinybird.co' }],
        destination: 'https://mockingbird-docs.tinybird.co/docs/:path*',
      },
    ]
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig
