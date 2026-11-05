import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F5EFE4",
        forest: "#1E3A2C",
        saddle: "#A97445",
        clay: "#8A3F2F",
        ink: "#17231C",
        paper: "#FCFAF6",
        line: "#DED7CB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        card: "0 12px 36px rgba(32, 38, 29, 0.07)",
        float: "0 24px 70px rgba(18, 30, 21, 0.2)",
      },
      letterSpacing: {
        editorial: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;
