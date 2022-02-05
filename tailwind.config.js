const colors = require('tailwindcss/colors')

let tailwindConfig = {
  content: [
    './static/**/*.js',
    './views/**/*.html',
    './static/**/*.html',
    './views/**/*.ejs'
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'sans': ['Gilroy','ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe\\ UI"', 'Roboto', '"Helvetica\\ Neue"', 'Arial', '"Noto\\ Sans"', 'sans-serif', '"Apple\\ Color\\ Emoji"', '"Segoe\\ UI\\ Emoji"', '"Segoe\\ UI\\ Symbol"', '"Noto\\ Color\\ Emoji"'],
      'serif': ['Georgia', 'Cambria', '"Times\\ New\\ Roman"', 'Times', 'serif'],
      'mono': ['Cascadia Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation\ Mono"', '"Courier\ New"', 'monospace']
    },
    extend: {
      colors: {
        gray: colors.neutral,
        purple: colors.violet,
      },
      keyframes: {
        'fade-out': {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' },
        },
        'fade-in': {
          '0%': { opacity: '0%' },
          '100%': { opacity: '100%' },
        }
      },
      fontSize: {
        'xxs': '0.5rem'
      }
    },
  },
  plugins: [],
}

tailwindConfig.theme.extend.colors.gray['950'] = '#0a0a0c'

module.exports = tailwindConfig
