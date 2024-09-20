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
        has: [{ type: 'host', value: 'mockingbird-web-git-fix-docs-rewrite-tinybird.vercel.app' }],
        destination: 'https://https://mockingbird-docs-git-fix-docs-rewrite-tinybird.vercel.app/_next/:path*',
      },
    ]
  },
})
