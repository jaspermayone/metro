import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // screens: { md: { max: "1050px" }, sm: { max: "550px" } },

    extend: {
      colors: {
        bgGrey: "#303030",
        blue: { 900: "#003da5" },
        blue_gray: { 400: "#7c878e", 900: "#2f2f2f" },
        orange: { 600: "#ed8b00" },
        red: { 700: "#da291c" },
        teal: { 800: "#00843d" },
        white: { a700: "#ffffff" },
      },
      boxShadow: {},
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
