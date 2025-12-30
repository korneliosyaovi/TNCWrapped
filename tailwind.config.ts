import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Mobile-first custom heights for full-screen layouts
      height: {
        screen: "100dvh", // Dynamic viewport height (better for mobile)
      },
      minHeight: {
        screen: "100dvh",
      },
      // Custom animation durations for screen transitions
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;