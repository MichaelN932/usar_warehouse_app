/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CacheDEX Primary Palette - Professional Emergency Services
        primary: {
          900: '#0D1B2A', // Deep navy - primary text, headers
          800: '#1B263B', // Dark blue - secondary backgrounds
          700: '#2D3E50', // Navy - card backgrounds
          600: '#415A77', // Steel blue - borders, dividers
          500: '#778DA9', // Slate - secondary text
          400: '#A8BCCC', // Light slate - disabled states
          100: '#E8EEF2', // Off-white - backgrounds
          50:  '#F7F9FB', // Near white - page backgrounds
        },
        // Action Colors - High Visibility
        action: {
          primary: '#0066FF',  // Bright blue - primary actions
          hover: '#0052CC',    // Darker blue - hover states
          pressed: '#003D99',  // Deep blue - pressed states
        },
        // Status Colors - Clear Meaning
        success: {
          500: '#059669', // Green - success, received, approved
          100: '#D1FAE5', // Light green - success backgrounds
        },
        warning: {
          500: '#D97706', // Amber - warnings, low stock, pending
          100: '#FEF3C7', // Light amber - warning backgrounds
        },
        danger: {
          500: '#DC2626', // Red - errors, critical, rejected
          100: '#FEE2E2', // Light red - error backgrounds
        },
        info: {
          500: '#0284C7', // Sky blue - information, in-progress
          100: '#E0F2FE', // Light sky - info backgrounds
        },
        // Grant Source Colors - Budget Tracking
        grant: {
          fema:  '#1E40AF', // FEMA blue
          state: '#7C3AED', // State purple
          prm:   '#059669', // PRM green
        },
        // Functional Colors
        surface: '#FFFFFF',
        background: '#F8FAFC',
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      // Polaris Typography Scale (base 14px)
      fontSize: {
        // 12px - captions, badges
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '450' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        // 13px - small body, labels
        'label': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '550' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '450' }],
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        // 14px - DEFAULT body, buttons, inputs
        'body': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '450' }],
        'base': ['0.875rem', { lineHeight: '1.25rem' }],
        // 16px - body large, headingXs
        'body-lg': ['1rem', { lineHeight: '1.25rem', fontWeight: '450' }],
        'heading-xs': ['1rem', { lineHeight: '1.25rem', fontWeight: '650' }],
        'lg': ['1rem', { lineHeight: '1.25rem' }],
        // 18px - headingSm
        'heading-sm': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '650' }],
        'xl': ['1.125rem', { lineHeight: '1.5rem' }],
        // 20px - headingMd
        'heading-md': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        '2xl': ['1.25rem', { lineHeight: '1.5rem' }],
        // 24px - headingLg
        'heading-lg': ['1.5rem', { lineHeight: '1.75rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        '3xl': ['1.5rem', { lineHeight: '1.75rem' }],
        // 32px - heading2xl
        'heading-2xl': ['2rem', { lineHeight: '2rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        '4xl': ['2rem', { lineHeight: '2rem' }],
        // Legacy aliases
        'h1': ['2rem', { lineHeight: '2rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        'h2': ['1.5rem', { lineHeight: '1.75rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        'h3': ['1.25rem', { lineHeight: '1.5rem', fontWeight: '650', letterSpacing: '-0.2px' }],
        'h4': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '650' }],
        'display': ['2rem', { lineHeight: '2rem', fontWeight: '650', letterSpacing: '-0.2px' }],
      },
      fontWeight: {
        normal: '450',
        regular: '450',
        medium: '550',
        semibold: '650',
        bold: '650',
      },
      letterSpacing: {
        tighter: '-0.2px',
        tight: '-0.1px',
        normal: '0',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'button': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'button-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'focus': '0 0 0 3px rgba(0, 102, 255, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
