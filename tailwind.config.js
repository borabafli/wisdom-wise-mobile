/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Primary UI font - Clean, readable for interface elements
        'sans': ['System', 'system-ui'],
        'sans-light': ['System'],
        'sans-medium': ['System'],
        'sans-semibold': ['System'],
        'sans-bold': ['System'],
        
        // Display font - Friendly, warm for main headings and welcome messages
        'display': ['System'],
        'display-medium': ['System'],
        'display-semibold': ['System'],
        'display-bold': ['System'],
        'display-extrabold': ['System'],
        
        // Body font - Comfortable reading for longer text content
        'body': ['System'],
        'body-medium': ['System'],
        'body-semibold': ['System'],
        'body-bold': ['System'],
        
        // Meditation/Therapy font - Calming, therapeutic for exercise content
        'meditation': ['System'],
        'meditation-semibold': ['System'],
        'meditation-bold': ['System'],
        
        // Mindful/Quotes font - Elegant, inspirational for quotes and reflections
        'mindful': ['System'],
        'mindful-medium': ['System'],
        'mindful-semibold': ['System'],
        'mindful-bold': ['System'],
        
        // Emphasis font - Gentle serif for special content
        'accent': ['System'],
        'accent-semibold': ['System'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '16px' }],
        'sm': ['13px', { lineHeight: '18px' }],
        'base': ['15px', { lineHeight: '22px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '26px' }],
        '2xl': ['22px', { lineHeight: '30px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['32px', { lineHeight: '40px' }],
      },
      colors: {
        // Soft, therapeutic color palette
        'therapy': {
          50: '#fafbfc',
          100: '#f4f6f8',
          200: '#e6eaee',
          300: '#d1d9e0',
          400: '#a8b8c8',
          500: '#7c8fa3',
          600: '#5d6b79',
          700: '#4a5461',
          800: '#3c434d',
          900: '#2d3238',
        },
        'calm': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'warm': {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fed7b8',
          300: '#fdba8c',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        'soft': {
          white: '#fcfcfc',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      spacing: {
        '2.5': 10,
        '3.5': 14,
        '4.5': 18,
        '5.5': 22,
        '6.5': 26,
        '7.5': 30,
        '8.5': 34,
        '9.5': 38,
        '15': 60,
        '17': 68,
        '18': 72,
        '88': 352,
      },
      borderRadius: {
        'soft': 12,
        'medium': 16,
        'large': 20,
        'xl': 24,
        '2xl': 28,
        '3xl': 32,
      },
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  plugins: [],
};