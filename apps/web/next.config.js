/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/docs',
        has: [{ type: 'host', value: 'mockingbird-web-git-fix-docs-rewrite-tinybird.vercel.app' }],
        destination: 'https://mockingbird-docs-git-fix-docs-rewrite-tinybird.vercel.app.co',
      },
      {
        source: '/docs/:path*',
        has: [{ type: 'host', value: 'mockingbird-web-git-fix-docs-rewrite-tinybird.vercel.app' }],
        destination: 'https://mockingbird-docs-git-fix-docs-rewrite-tinybird.vercel.app.co/:path*',
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
