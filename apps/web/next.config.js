/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs',
        destination: 'https://mockingbird-docs.tinybird.co',
        permanent: true,
      },
      {
        source: '/docs/:path*',
        destination: 'https://mockingbird-docs.tinybird.co/:path*',
        permanent: true,
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
      fs: false,
      // async_hooks: false,
    }
    return config
  },
}

module.exports = nextConfig
