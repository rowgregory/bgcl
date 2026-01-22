/** @type {import('tailwindcss').Config} */
export const content = [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}'
]
export const darkMode = 'class'
export const theme = {
  extend: {
    screens: {
      // Mobile first approach
      xs: '475px', // Extra small devices (large phones)
      sm: '640px', // Small devices (tablets)
      md: '768px', // Medium devices (small laptops)
      lg: '1024px', // Large devices (laptops/desktops)
      'bp-1145': '1145px', // Large devices (laptops/desktops)
      xl: '1280px', // Extra large devices (large desktops)
      '2xl': '1536px', // 2X large devices (larger desktops)
      '3xl': '1700px',

      // Custom breakpoints for specific use cases
      tablet: '768px', // Tablet-specific styles
      laptop: '1024px', // Laptop-specific styles
      desktop: '1280px', // Desktop-specific styles
      wide: '1440px', // Wide screen desktops
      ultrawide: '1920px', // Ultra-wide monitors

      // Height-based breakpoints (useful for mobile)
      'h-sm': { raw: '(min-height: 640px)' },
      'h-md': { raw: '(min-height: 768px)' },
      'h-lg': { raw: '(min-height: 1024px)' },

      // Custom ranges (between breakpoints)
      'mobile-only': { max: '767px' }, // Only mobile
      'tablet-only': { min: '768px', max: '1023px' }, // Only tablet
      'desktop-up': '1024px', // Desktop and up

      // Orientation breakpoints
      portrait: { raw: '(orientation: portrait)' },
      landscape: { raw: '(orientation: landscape)' },

      // Print styles
      print: { raw: 'print' },

      // Hover capability (helps with mobile vs desktop interactions)
      hover: { raw: '(hover: hover)' },
      'no-hover': { raw: '(hover: none)' }
    },
    colors: {
      'test-red': '#ff0000',
      // Dark modern palette
      dark: {
        50: '#f8fafc', // Very light gray (for light mode accents)
        100: '#f1f5f9', // Light gray
        200: '#e2e8f0', // Lighter gray
        300: '#cbd5e1', // Medium light gray
        400: '#94a3b8', // Medium gray
        500: '#64748b', // Base gray
        600: '#475569', // Medium dark gray
        700: '#334155', // Dark gray (cards, elevated surfaces)
        800: '#1e293b', // Darker gray (main background)
        900: '#0f172a', // Darkest (deep backgrounds)
        950: '#020617' // Ultra dark (modals, overlays)
      },
      // Accent colors for dark theme
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554'
      },
      secondary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // Main secondary/success
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16'
      },
      accent: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef', // Purple accent
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
        950: '#4a044e'
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b', // Warning yellow
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03'
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444', // Error red
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a'
      },
      // Text colors optimized for dark backgrounds
      text: {
        primary: '#f8fafc', // Primary text on dark
        secondary: '#cbd5e1', // Secondary text on dark
        muted: '#94a3b8', // Muted text on dark
        inverse: '#1e293b' // Dark text for light backgrounds
      },
      // Border colors
      border: {
        primary: '#334155', // Main borders
        secondary: '#475569', // Elevated borders
        muted: '#1e293b' // Subtle borders
      },
      // Background variations
      bg: {
        primary: '#0f172a', // Main app background
        secondary: '#1e293b', // Cards, panels
        elevated: '#334155', // Modals, dropdowns
        hover: '#475569', // Hover states
        active: '#64748b' // Active states
      }
    },
    fontSize: {
      '2xs': '0.625rem'
    }
  }
}
export const plugins = []
