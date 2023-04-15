/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

module.exports = nextConfig
