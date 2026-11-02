import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { navy: "#071426", navy2: "#0B1F3A", accent: "#18A8FF", bg: "#F5F8FC", ink: "#111827", sale: "#EF4444" },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    keyframes: { glow: { "0%,100%": { opacity: ".5" }, "50%": { opacity: ".9" } } },
    animation: { glow: "glow 6s ease-in-out infinite" },
  } },
  plugins: [],
} satisfies Config;
