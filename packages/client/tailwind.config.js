/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Extended coffee garden palette
        sage: {
          DEFAULT: 'hsl(var(--sage))',
          light: 'hsl(var(--sage-light))',
          dark: 'hsl(var(--sage-dark))',
        },
        terracotta: {
          DEFAULT: 'hsl(var(--terracotta))',
          light: 'hsl(var(--terracotta-light))',
        },
        peach: 'hsl(var(--peach))',
        cream: 'hsl(var(--cream))',
        'coffee-deep': 'hsl(var(--coffee-deep))',
        olive: {
          DEFAULT: 'hsl(var(--olive))',
          light: 'hsl(var(--olive-light))',
        },
        // Legacy coffee colors for compatibility
        coffee: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d9c0',
          300: '#e8be96',
          400: '#dd9c69',
          500: '#d4814a',
          600: '#c56a3f',
          700: '#a45236',
          800: '#854432',
          900: '#6c392b',
          950: '#3a1c15',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        '4.5xl': ['2.5rem', { lineHeight: '1.1' }],
        '5.5xl': ['3.5rem', { lineHeight: '1.1' }],
        '6.5xl': ['4rem', { lineHeight: '1.05' }],
        '7.5xl': ['5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'wave': 'wave 15s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
