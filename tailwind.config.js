/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', 
    './scripts/**/*.js', 
  ],
  theme: {
    extend: {
      colors: {
        background: '#2c3e50',
        primaryText: '#ecf0f1',
        secondaryText: '#bdc3c7',
        accent: '#1abc9c',
        cardBackground: '#34495e',
        border: '#1a252f',
        shadow: 'rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [
    // Add any plugins you want to use, e.g. forms, typography, etc.
  ],
}