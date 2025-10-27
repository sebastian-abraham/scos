import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#17cf17",
        "background-light": "#f6f8f6",
        "background-dark": "#112111",
      },
      fontFamily: {
        display: ["Work Sans", "Noto Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [forms, containerQueries],
};

export default config;
