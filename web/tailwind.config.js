/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          black: '#0a0e27',
          darkBlue: '#0f1729',
          deepBlue: '#1a1f3a',
          blue: '#2d3561',
          lightBlue: '#4a5f8f',
          cyan: '#64b5f6',
          gold: '#ffd700',
          orange: '#ff6b35',
          white: '#e8f4f8',
        },
        cosmic: {
          nebula: '#6a0dad',
          galaxy: '#4b0082',
          star: '#fffacd',
          comet: '#00ffff',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(100, 181, 246, 0.5), 0 0 10px rgba(100, 181, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(100, 181, 246, 0.8), 0 0 30px rgba(100, 181, 246, 0.5)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0a0e27, #1a1f3a, #2d3561)',
        'nebula-gradient': 'radial-gradient(ellipse at center, rgba(106, 13, 173, 0.4) 0%, transparent 70%)',
        'galaxy-gradient': 'radial-gradient(ellipse at center, rgba(75, 0, 130, 0.3) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
