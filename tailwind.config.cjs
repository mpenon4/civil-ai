/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'civil-primary': '#0f172a', // Slate 900
                'civil-secondary': '#334155', // Slate 700
                'civil-accent': '#f59e0b', // Amber 500
            }
        },
    },
    plugins: [],
}
