/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./src/features/**/*.{ts,tsx}",
        "./src/providers/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                geist: ["var(--font-geist)"],
                inter: ["var(--font-inter)"],
                mono: ["var(--font-geist-mono)"],
            },
        },
    },
    plugins: [],
};
