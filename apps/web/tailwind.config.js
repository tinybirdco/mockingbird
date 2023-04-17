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
        'tb-primary': '#1FCC83',
        'tb-body': '#f9f9f9',
        'tb-body2': '#f7f7f7',
        'tb-text': '#25283D',
        'tb-text1': '#636679',
        'tb-text2': '#A5A7B4',
        'tb-text3': '#28607D',
        'tb-bg1': '#F6F7F9',
        'tb-bg2': '#EEFAFF',
        'tb-border1': '#E8E9ED',
      },
      backgroundImage: {
        'landing-bg': "url('/landing-bg.svg')",
      },
    },
  },
  plugins: [],
}
