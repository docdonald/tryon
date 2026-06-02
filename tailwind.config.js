/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.9792 0.0029 264.5411)',
        foreground: 'oklch(0.1448 0 0)',
        card: 'oklch(1.0000 0 0)',
        'card-foreground': 'oklch(0.1448 0 0)',
        popover: 'oklch(1.0000 0 0)',
        'popover-foreground': 'oklch(0.1448 0 0)',
        primary: 'oklch(0.4772 0.2860 264.2491)',
        'primary-foreground': 'oklch(1.0000 0 0)',
        secondary: 'oklch(0.9680 0.0069 247.8968)',
        'secondary-foreground': 'oklch(0.1448 0 0)',
        muted: 'oklch(0.9680 0.0069 247.8968)',
        'muted-foreground': 'oklch(0.5544 0.0407 257.4166)',
        accent: 'oklch(0.9680 0.0069 247.8968)',
        'accent-foreground': 'oklch(0.1448 0 0)',
        destructive: 'oklch(0.6368 0.2078 25.3313)',
        'destructive-foreground': 'oklch(1.0000 0 0)',
        border: 'oklch(0.9288 0.0126 255.5078)',
        input: 'oklch(0.9288 0.0126 255.5078)',
        ring: 'oklch(0.4772 0.2860 264.2491)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
    },
  },
  plugins: [],
}
