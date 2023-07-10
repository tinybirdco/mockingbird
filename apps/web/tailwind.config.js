const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', ...fontFamily.sans],
        'ia-writer': ['var(--font-ia-writer)'],
      },
      colors: {
        'tb-primary': 'var(--primary-color)',
        'tb-neutral-64': 'var(--neutral-64-color)',
        'tb-neutral-40': 'var(--neutral-40-color)',
        'tb-darkblue-01': 'var(--darkblue-01-color)',
        'tb-neutral-04': 'var(--neutral-04-color)',
        'tb-background-05': 'var(--background-05-color)',
        'tb-border1': 'var(--background-02-color)',
      },
      backgroundImage: {
        'landing-bg': "url('/landing-bg.svg')",
      },
    },
  },
  plugins: [],
}
