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
          DEFAULT: '#2563EB', // Sapphire Blue
          light: '#60A5FA',
          dark: '#1D4ED8',
          pale: '#EFF6FF',
        },
        slate: {
          400: '#94a3b8',
          500: '#64748b',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #1D4ED8 100%)',
        'dark-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 50%, #FFFFFF 100%)',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.02) 40%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        'primary': '0 0 20px rgba(37,99,235,0.15), 0 0 40px rgba(37,99,235,0.05)',
        'primary-sm': '0 0 10px rgba(37,99,235,0.1)',
        'card': '0 10px 40px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(37,99,235,0.2)',
        'glow-purple': '0 0 30px rgba(37,99,235,0.1)',
        'inner-glow': 'inset 0 1px 0 rgba(0,0,0,0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-primary': 'pulseprimary 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fadeIn 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseprimary: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(37,99,235,0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(37,99,235,0.3)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px rgba(37,99,235,0.2)' },
          '100%': { textShadow: '0 0 10px rgba(37,99,235,0.4), 0 0 20px rgba(37,99,235,0.1)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(37,99,235,0.2)' },
          '50%': { borderColor: 'rgba(37,99,235,0.5)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
