const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra({
  basePath: process.env.VERCEL_ENV === 'production' ? '/docs' : '',
})
