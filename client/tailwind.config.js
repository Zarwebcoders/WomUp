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
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        secondary: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        accent: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        dark: {
          DEFAULT: '#020617',
          light: '#0F172A',
          lighter: '#1E293B',
        },
        surface: {
          DEFAULT: '#ffffff08',
          hover: '#ffffff10',
          border: '#ffffff1a',
        }
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(16, 185, 129, 0.1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.1) 0, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
