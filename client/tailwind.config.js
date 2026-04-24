/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF7BCB',
          DEFAULT: '#AD49E1',
          dark: '#4C4CFF',
        },
        background: '#0B0F1D',
        card: '#151A2F',
        accent: '#F6F2FF',
        success: '#00D98B',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #FF7BCB, #AD49E1, #4C4CFF)',
      },
    },
  },
  plugins: [],
}
