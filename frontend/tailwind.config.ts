import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        "background": "#0a1529",
        "background-content": "#FBF4DF",
        "neutral": "#1C1603",
        "neutral-content": "#FBF4DF",
        "primary": "#FFB805",
        "primary-content": "#023047",
        "secondary": "#24478A",
        "secondary-content": "#023047",
        "accent": "#88E222",
        "accent-content": "#FFB703",
      }
    },
  },
};
export default config;
