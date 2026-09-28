import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', 'Figtree', ...defaultTheme.fontFamily.sans],
                cairo: ['Cairo', 'sans-serif'],
            },
            colors: {
                navy: {
                    DEFAULT: '#0E3A2E',
                    deep: '#081F19',
                    mid: '#1F5A45',
                    light: '#2D6B52',
                },
                brand: {
                    orange:    '#C9A96A',
                    'orange-dk': '#8B5E3C',
                    gold:      '#E8DCC1',
                    cream:     '#F5EFDF',
                },
            },
            boxShadow: {
                glow:        '0 0 30px rgba(201,169,106,0.35)',
                'glow-sm':   '0 0 14px rgba(201,169,106,0.25)',
                card:        '0 4px 24px rgba(14,58,46,0.08)',
                'card-hover':'0 14px 44px rgba(14,58,46,0.16)',
                sidebar:     '4px 0 24px rgba(14,58,46,0.18)',
            },
            animation: {
                'spin-slow':  'spin 8s linear infinite',
                'ping-slow':  'ping 3s cubic-bezier(0,0,0.2,1) infinite',
                'float':      'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0px)' },
                    '50%':     { transform: 'translateY(-10px)' },
                },
            },
        },
    },

    plugins: [forms],
};
