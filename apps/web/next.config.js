/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/docs',
        has: [{ type: 'host', value: 'mockingbird.tinybird.co' }],
        destination: 'https://mockingbird-docs.tinybird.co',
      },
      {
        source: '/docs/:path*',
        has: [{ type: 'host', value: 'mockingbird.tinybird.co' }],
        destination: 'https://mockingbird-docs.tinybird.co/:path*',
      },
    ]
  },
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      http2: false,
      dns: false,
      child_process: false,
      fs: false
    }
    return config
  },
}

module.exports = nextConfig
