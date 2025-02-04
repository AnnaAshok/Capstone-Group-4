/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], 
  theme: {
    extend: {
      colors: {
        primary: '#fad25b',   // Custom primary color
        secondary: '#0f3460', // Custom secondary color
      },
    },
  },
  plugins: [],
};
