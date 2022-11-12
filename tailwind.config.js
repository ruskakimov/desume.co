/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: [
        "Roboto",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    // colors: {
    //   white: "#FFFFFF",
    //   blue: "#0060EF",
    //   gray: {
    //     1: "#FCFCFC",
    //     2: "#E6E6E6",
    //     3: "#CFCFCF",
    //     4: "#828282",
    //     5: "#333333",
    //   },
    // },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
