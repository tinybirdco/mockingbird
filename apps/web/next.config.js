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
}

module.exports = nextConfig
