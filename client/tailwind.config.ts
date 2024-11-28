import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          DEFAULT: '#121212',
          100: "#212121",
          200: "#333333",
          300: "#a3a8ae",
        },
        light: {
          DEFAULT: '#fefefe',
          100: '#efefef'
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
