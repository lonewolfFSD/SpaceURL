/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        scroll: 'scrollBg 80s linear infinite',
      },
      keyframes: {
        scrollBg: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }, // Moves left continuously
        },
      },
    },
  },
  plugins: [],
};
