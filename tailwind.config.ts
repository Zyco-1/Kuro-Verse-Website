import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#a3e635",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#161617",
        },
        muted: "#111111",
        accent: "#facc15",
      },
    },
  },
  plugins: [],
};
export default config;
