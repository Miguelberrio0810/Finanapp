import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f3f2f2",
        "paper-dark": "#1a1918",
        card: "#eae9e9",
        "card-dark": "#232120",
        ink: "#201e1d",
        "ink-dark": "#f3f2f2",
        "ink-soft": "#605d5d",
        "ink-soft-dark": "#bab6b6",
        rule: "#9b9797",
        "rule-dark": "#605d5d",
        ingreso: "#201e1d",
        "ingreso-dark": "#f3f2f2",
        gasto: "#ec3013",
        "gasto-dark": "#ff9783",
        ahorro: "#ae1800",
        "ahorro-dark": "#ff9783",
        accent: {
          DEFAULT: "#ec3013",
          100: "#fff2ef",
          200: "#ffe0d9",
          300: "#ffc4b8",
          600: "#dd2b0f",
          700: "#ae1800",
          800: "#7c1405",
        },
        neutral: {
          100: "#f8f4f4",
          300: "#d7d3d3",
          500: "#9b9797",
          700: "#605d5d",
          900: "#2d2b2b",
        },
      },
      borderRadius: {
        DEFAULT: "0",
        none: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        titular: "-0.015em",
      },
      maxWidth: {
        reticula: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;
