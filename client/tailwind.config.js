
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F172A',
                    light: '#1E293B',
                    dark: '#020617'
                },
                accent: {
                    DEFAULT: '#38BDF8',
                    light: '#7DD3FC',
                    dark: '#0284C7'
                },
                background: {
                    DEFAULT: '#F8FAFC',
                    card: '#FFFFFF'
                },
                text: {
                    primary: '#020617',
                    secondary: '#64748B'
                },
                border: {
                    DEFAULT: '#E2E8F0'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '128': '32rem'
            },
            borderRadius: {
                'apple': '12px',
                'apple-sm': '8px'
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'soft-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
                'soft-hover': '0 4px 16px rgba(0, 0, 0, 0.1)'
            },
            transitionDuration: {
                '250': '250ms'
            }
        },
    },
    plugins: [],
}
