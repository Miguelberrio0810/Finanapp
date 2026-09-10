import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EEF2E3",
        "paper-dark": "#12160F",
        ink: "#202B22",
        "ink-dark": "#E8EEDD",
        "ink-soft": "#5B6B5C",
        "ink-soft-dark": "#9CAB93",
        rule: "#C3D2B0",
        "rule-dark": "#33402B",
        card: "#FBFCF4",
        "card-dark": "#1A2016",
        ingreso: "#2E6B3A",
        "ingreso-dark": "#6FCB7F",
        gasto: "#A3301D",
        "gasto-dark": "#E8735A",
        ahorro: "#B07F1E",
        "ahorro-dark": "#E7B54C",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
