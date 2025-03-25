/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'ludo-primary': {
                    'white-ice': '#FFFAF1',
                    'light-green': '#CFE2A8',
                    'ligh-blue': '#C0DFF3',
                    'black-text': '#5B5B5B',
                },
            },
        },
    },
    plugins: [],
}
