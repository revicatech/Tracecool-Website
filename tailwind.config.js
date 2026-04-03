/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        primary: '#071525',
        secondary: '#5A7896',
        accent: '#1A6FDB',
        'accent-light': '#4D9EFF',
        'accent-glow': 'rgba(26,111,219,0.2)',
        surface: '#F2F6FC',
        'surface-mid': '#E4EBF5',
        navy: '#071525',
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(140deg, rgba(7,21,37,0.92) 0%, rgba(14,40,80,0.75) 60%, rgba(26,111,219,0.3) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')",
      },
    },
  },
  plugins: [],
}
