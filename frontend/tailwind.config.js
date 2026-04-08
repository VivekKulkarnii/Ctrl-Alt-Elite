/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        parchment: "#F5F0E8",
        ink: "#1A1A2E",
        verdict: "#C8963E",
        risk: {
          high: "#DC2626",
          medium: "#D97706",
          low: "#16A34A",
        },
        seal: "#8B1A1A",
      },
    },
  },
  plugins: [],
};
