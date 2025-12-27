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
                primary: '#4A7C59', // Sage Green
                secondary: '#D1E8E2', // Soft Mint
                accent: '#718096', // Warm Grey
                cta: {
                    DEFAULT: '#2C7A7B', // Deep Teal
                    hover: '#285E61',
                },
                text: {
                    primary: '#1F2933',
                    secondary: '#4A5568',
                    muted: '#718096',
                },
                background: {
                    light: '#F7FAFC',
                    subtle: '#EDF2F7',
                }
            },
            fontFamily: {
                heading: ['"Libre Baskerville"', 'serif'],
                body: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 8px 30px rgba(0,0,0,0.04)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
            transitionDuration: {
                'fast': '150ms',
                'base': '200ms',
                'slow': '300ms',
            },
            transitionTimingFunction: {
                'out': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-up-fade': {
                    '0%': { transform: 'translateY(16px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'enter': {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                'fade-in': 'fade-in 0.2s ease-out forwards',
                'scale-in': 'scale-in 0.2s ease-out forwards',
                'enter': 'enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }
        },
    },
    plugins: [],
}
