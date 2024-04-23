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
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        fadeIn: "fadeIn 300ms ease-in forwards",
        fadeOut: "fadeOut 300ms ease-out forwards",
      },
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
        body: ["Rubik", "sans-serif"],
      },
      colors: {
        light: {
          bg: {
            DEFAULT: "#faede5",
            100: "#faf0ea",
            200: "#f8e9e0",
            300: "#f1d4c3",
            400: "#e7b89c",
            500: "#de9c75",
            600: "#d5804e",
            700: "#c3662f",
          },
        },
        dark: {
          bg: {
            DEFAULT: "#452E33",
            50: "#67454c",
            100: "#614047",
            200: "#5a3c42",
            300: "#53373d",
            400: "#4c3338",
            500: "#3e292e",
            600: "#372529",
            700: "#302024",
            800: "#291c1f",
            900: "#22171a",
          },
        },
        brown: {
          900: "#322622",
          800: "#3d2e28",
          700: "#47362f",
          600: "#513e36",
          500: "#5b453c",
          DEFAULT: "#654D43",
          400: "#6d5348",
          300: "#75594e",
          200: "#7d5f53",
          100: "#856658",
          50: "#8d6c5e",
        },
        shell: {
          900: "#5a373e",
          800: "#6c424a",
          700: "#7d4e57",
          600: "#8f5963",
          500: "#a06570",
          DEFAULT: "#AB7781",
          400: "#b4858e",
          300: "#bd949c",
          200: "#c6a2a9",
          100: "#ceb0b6",
          50: "#d7bfc3",
        },
        tan: {
          500: "#af5529",
          400: "#cf6633",
          300: "#d78056",
          200: "#e09b79",
          100: "#e8b59c",
          DEFAULT: "#F0CFBF",
        },
        orange: {
          900: "#8a4325",
          800: "#a5512c",
          700: "#c15e34",
          600: "#ce7149",
          500: "#d68764",
          DEFAULT: "#DD9C80",
          400: "#e3ad96",
          300: "#e9beac",
          200: "#efd0c2",
          100: "#f5e1d8",
          50: "#faefeb",
        },
        mint: {
          light: {
            900: "#288e80",
            800: "#30ab9a",
            700: "#38c7b4",
            600: "#54cfbf",
            500: "#71d7c9",
            DEFAULT: "#8DDFD4",
            400: "#a4e5dd",
            300: "#baece5",
            200: "#d1f2ee",
            100: "#e8f9f6",
            50: "#ebf9f7",
          },
          dark: {
            900: "#001a14",
            800: "#001e17",
            700: "#00231b",
            600: "#00281f",
            500: "#002d23",
            DEFAULT: "#003227",
            400: "#00362a",
            300: "#003a2d",
            200: "#003e30",
            100: "#004233",
            50: "#004637",
          },
        },
        backgroundImage: (theme) => ({
          "gradient-to-r":
            "linear-gradient(to right, var(--tw-gradient-stops))",
        }),
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ["hover", "focus"],
    },
  },
  daisyui: {
    themes: false,
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
    themes: [
      {
        light: {
          primary: "#8DDFD4",
          "primary-focus": "#dd9c80",
          "primary-content": "#ffffff",
          secondary: "#ab7781",
          "secondary-focus": "#8a4325",
          "secondary-content": "#ffffff",
          accent: "#8DDFD4",
          "accent-focus": "#54cfbf",
          "accent-content": "#ffffff",
          neutral: "#452E33",
          "neutral-focus": "#322622",
          "neutral-content": "#ffffff",
          "base-100": "#faf0ea",
          "base-200": "#f8e9e0",
          "base-300": "#f1d4c3",
          "base-content": "#452E33",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
      {
        dark: {
          primary: "#324D4B",
          "primary-focus": "#22444B",
          "primary-content": "#ffffff",
          secondary: "#543842",
          "secondary-focus": "#753B35",
          "secondary-content": "#ffffff",
          accent: "#324D4B",
          "accent-focus": "#1A656D",
          "accent-content": "#ffffff",
          neutral: "#E0D1D4",
          "neutral-focus": "#DDD4D0",
          "neutral-content": "#452E33",
          "base-100": "#2B2B2B",
          "base-200": "#252525",
          "base-300": "#202020",
          "base-content": "#E0D1D4",
          info: "#3DA7DB",
          success: "#23C4A9",
          warning: "#E0A455",
          error: "#F15C4C",
        },
      },
    ],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("daisyui"),
  ],
};
