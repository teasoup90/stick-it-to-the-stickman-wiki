import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}", "./content/**/*.mdx"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--nav-theme))",
        "primary-light": "hsl(var(--nav-theme-light))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        ad: "hsl(var(--ad-background))",
        media: "hsl(var(--media-background))",
        "media-foreground": "hsl(var(--media-foreground))"
      },
      borderRadius: { xl: "var(--radius)", "2xl": "calc(var(--radius) + 4px)" },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        mono: ["Geist Mono", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
