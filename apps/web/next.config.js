/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs',
        destination:
          'https://github.com/tinybirdco/mockingbird/blob/main/README.md',
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
