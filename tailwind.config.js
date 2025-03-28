/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                'ludo-primary': {
                    'white-ice': '#FFFAF1',
                    'light-green': '#CFE2A8',
                    'ligh-blue': '#C0DFF3',
                    pink1: '#FFAFD4',
                    black1: '#5B5B5B',
                },
                'pet-primary': {
                    'light-brown': '#7D5D56',
                    'medium-gray': '#BEBEBE',
                    'beige': '#F4EDE1',
                    'light-yellow': '#FFD997'
                }
            },
        },
    },
    plugins: [],
}
