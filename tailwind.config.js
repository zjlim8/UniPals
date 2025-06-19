/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        auxiliary: "#90A4AE",
        headingtext: "#323232",
        bodytext: "#5C5C5C",
        buttontext: "#FDFDFD",
        linktext: "#7C7C7C",
        background: "#FDFDFD",
      },
    },
  },
  plugins: [],
};
