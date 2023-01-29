/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "fil-primary": "#0190FF",
      "fil-secondary": "#0C72C2",
      black: "#000000",
      white: "#FFFFFF",
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui", "Work Sans", "sans-serif"],
      display: ["Work Sans", "sans-serif"],
    },
    fontWeight: {
      thin: "100",
      hairline: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      "extra-bold": "800",
      black: "900",
    },

    extend: {
      inset: {
        100: "100px",
        235: "235px",
        142: "142px",
        140: "140px",
      },
    },
  },
  plugins: [],
};
