/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: '#0F172A',
        spaceDeep: '#070B14',
        surface: '#141B2E',
        purple: '#8B5CF6',
        purpleHover: '#7C3AED',
        cyan: '#06B6D4',
        emerald: '#10B981',
        amber: '#F59E0B',
        danger: '#EF4444',
        textMain: '#F1F5F9',
        textMuted: '#94A3B8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        neonPurple: '0 0 20px rgba(139, 92, 246, 0.35)',
        neonPurpleHover: '0 0 35px rgba(139, 92, 246, 0.55)',
        neonCyan: '0 0 20px rgba(6, 182, 212, 0.35)',
        card: '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'gradient-radial-purple': 'radial-gradient(circle at top, rgba(139,92,246,0.15), transparent 60%)',
        'gradient-radial-cyan': 'radial-gradient(circle at bottom right, rgba(6,182,212,0.12), transparent 55%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pop-in': 'popIn 0.15s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
};
