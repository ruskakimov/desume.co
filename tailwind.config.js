/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: ["Roboto", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
