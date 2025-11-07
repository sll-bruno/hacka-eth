/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        background: '#0b0f14',
        surface: '#131a24',
        accent: '#50f0b8',
        'accent-muted': '#2bc18a',
        'card-border': 'rgba(255,255,255,0.06)',
      },
      dropShadow: {
        glow: '0 10px 35px rgba(80, 240, 184, 0.25)',
      },
    },
  },
  plugins: [],
}

