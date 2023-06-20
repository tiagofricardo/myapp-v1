/** @type {import('tailwindcss').Config} */
export default module.exports = {
  content: [
    "./pages/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#f4acb7",
        secondary: "#9d8189",
        tertiary: "#ffb3c6",
        light: "#ffe5d9",
        ultralight: "#fff0f3",
        greenSuccess: "#16A34A",
        redError: "#F20000",
        grayText: "#374151",
        grayTextLight: "#D1D5DB",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
