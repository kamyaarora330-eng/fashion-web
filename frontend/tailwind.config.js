/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0D0D0E',
          noir: '#141416',
          charcoal: '#222225',
          graphite: '#38383E',
          cream: '#F9F8F5',
          sand: '#EFECE6',
          gold: '#C5A880',
          darkGold: '#A58256',
          lightGold: '#E8D8C3',
          roseMuted: '#B89B96',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Didot', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: {
        widestLuxury: '0.25em',
        ultraWide: '0.35em',
      },
    },
  },
  plugins: [],
}

