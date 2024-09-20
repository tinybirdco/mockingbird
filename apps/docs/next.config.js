const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  basePath: '/docs',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/docs',
        basePath: false,
        permanent: false,
      },
    ]
  }
})
