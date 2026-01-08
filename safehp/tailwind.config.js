/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // These EXACTLY match your inspiration HTML
        "primary": "#137fec",
        "primary-hover": "#116cc9",
        "background-dark": "#101922", 
        "card-dark": "#1c242d", 
        "border-dark": "#283039",
        "text-muted": "#9dabb9"
      },
    },
  },
  plugins: [],
}