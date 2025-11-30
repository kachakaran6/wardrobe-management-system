// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Ensure all paths where you use Tailwind classes are included here.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}", // 👈 Important to include your 'views' folder
    // Add any other files/folders like 'utils' or 'lib' if they contain classes
  ],
  theme: {
    extend: {
      // 2. 🚨 DEFINE THE CUSTOM COLOR PALETTE HERE 🚨
      colors: {
        coral: {
          50: "#FDECEE", // Pale Coral
          100: "#FADEE1",
          500: "#FF7F50", // Base Coral
          600: "#E67348",
          700: "#CC6741",
        },
      },
      // You can also add custom fonts, spacing, etc., here
    },
  },
  plugins: [],
};

export default config;
