const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  basePath: process.env.VERCEL_ENV === 'production' ? '/docs' : '',
  async rewrites() {
    return [
      {
        source: '/_next/:path*',
        has: [{ type: 'host', value: 'mockingbird.tinybird.co' }],
        destination: 'https://mockingbird-docs.tinybird.co/_next/:path*',
      },
    ]
  },
})
