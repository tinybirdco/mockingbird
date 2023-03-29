/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tb-primary': '#1FCC83',
        'tb-body': '#f9f9f9',
        'tb-body2': '#f7f7f7',
        'tb-text': '#25283D',
        'tb-text1': '#636679',
        'tb-text2': '#A5A7B4',
      },
    },
  },
  plugins: [],
}
