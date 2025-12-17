import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
}

export default config
