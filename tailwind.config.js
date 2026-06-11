/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#111111',
        card: '#FFFFFF',
        'card-foreground': '#111111',
        popover: '#FFFFFF',
        'popover-foreground': '#111111',
        primary: '#111111',
        'primary-foreground': '#FFFFFF',
        secondary: '#F5F5F7',
        'secondary-foreground': '#111111',
        muted: '#F5F5F7',
        'muted-foreground': '#737373',
        accent: '#F5F5F7',
        'accent-foreground': '#111111',
        destructive: '#DC2626',
        'destructive-foreground': '#FFFFFF',
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#111111',
        'fashion-white': '#FFFFFF',
        'fashion-black': '#111111',
        'fashion-gray': '#737373',
        'fashion-light': '#F5F5F7',
        'fashion-border': '#E5E5E5',
        'fashion-accent': '#F97316',
      },
      fontFamily: {
        sans: ['DM Sans', 'PingFang SC', 'Microsoft YaHei', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif SC', 'STSong', 'serif'],
        display: ['Playfair Display', 'Noto Serif SC', 'STSong', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
