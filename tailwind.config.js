/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        onyx: '#0A0A0A',
        surface: '#111315',
        divider: '#202428',
        'text-muted': '#B9C0C7',
        accent: '#77CCFF',
        'accent-hover': '#A1DDFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'gutter': '24px',
      },
      maxWidth: {
        'container': '1280px',
      },
      borderRadius: {
        'brand': '16px',
      },
      transitionDuration: {
        'brand': '250ms',
      },
      letterSpacing: {
        'tight-brand': '-0.02em',
      },
    },
  },
  plugins: [],
};
