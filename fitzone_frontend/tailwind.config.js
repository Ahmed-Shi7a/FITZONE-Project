/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        bg: { deep: '#090a0f', panel: '#12151c', card: '#1a1f2c' },
        neon: { orange: '#ff5722', 'orange-light': '#ff7043', blue: '#2979ff' }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,87,34,0.45)',
        'glow-blue': '0 0 20px rgba(41,121,255,0.45)'
      }
    }
  },
  plugins: []
};
