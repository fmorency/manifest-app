/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["components/**/*.{js,jsx,ts,tsx}", "pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        scroll: "scroll 10s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      fontFamily: {
        body: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        light: {
          bg: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#EEEEEE",
            300: "#E0E0E0",
            400: "#BDBDBD",
            500: "#9E9E9E",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
          },
        },
        dark: {
          bg: {
            50: "#2B2B2B",
            100: "#262626",
            200: "#212121",
            300: "#1C1C1C",
            400: "#171717",
            500: "#121212",
            600: "#0D0D0D",
            700: "#080808",
            800: "#030303",
            900: "#000000",
          },
        },
        brown: {
          DEFAULT: "#795548",
          50: "#f2e8e5",
          100: "#dbcbc0",
          200: "#c3af9b",
          300: "#ab9276",
          400: "#937651",
          500: "#795548",
          600: "#5e4336",
          700: "#442f24",
          800: "#2b1c14",
          900: "#110803",
        },
        tan: {
          DEFAULT: "#D2B48C",
          50: "#FAF7F5",
          100: "#F3ECE2",
          200: "#E8DCC9",
          300: "#DCCEB1",
          400: "#D1BF98",
          500: "#D2B48C",
          600: "#C19A6B",
          700: "#B1804A",
          800: "#946638",
          900: "#7A4D2E",
        },
        mint: {
          DEFAULT: "#3EB489",
          50: "#F0F9F7",
          100: "#D2EDE6",
          200: "#A5DED2",
          300: "#78CFBD",
          400: "#4BC1A8",
          500: "#3EB489",
          600: "#2D9270",
          700: "#1C7056",
          800: "#0B4E3D",
          900: "#003227",
        },
        backgroundImage: (theme) => ({
          "gradient-to-r":
            "linear-gradient(to right, var(--tw-gradient-stops))",
        }),
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ["hover", "focus"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
  ],
};
