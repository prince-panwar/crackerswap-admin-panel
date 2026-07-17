/** @type {import('tailwindcss').Config} */
export default {
  // Class-based (matches cracker-swap-frontend's `.dark` toggle, not OS
  // `prefers-color-scheme` — see src/lib/theme.tsx).
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Semantic tokens ported 1:1 from cracker-swap-frontend/app/globals.css
      // (same names — `:root` = light, `.dark` = dark, see src/index.css).
      // Plain `var(--x)` rather than the old oklch-scale trick: the frontend's
      // source values are already hex/rgba, not oklch components, and none of
      // them need Tailwind's alpha-slash modifier (alpha is baked into the
      // rgba() values themselves, matching how the frontend consumes them).
      colors: {
        bg: "var(--bg)",
        "bg-deep": "var(--bg-deep)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        "surface-inset": "var(--surface-inset)",
        "card-border": "var(--card-border)",
        "card-highlight": "var(--card-highlight)",
        divider: "var(--divider)",
        fg: "var(--fg)",
        "fg-secondary": "var(--fg-secondary)",
        "fg-muted": "var(--fg-muted)",
        "fg-tertiary": "var(--fg-tertiary)",
        "fg-subtle": "var(--fg-subtle)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        success: "var(--success)",
        danger: "var(--danger)",
        info: "var(--info)",
        warning: "var(--warning)",
        "success-soft": "var(--success-soft)",
        "danger-soft": "var(--danger-soft)",
        "warning-soft": "var(--warning-soft)",
        "overlay-backdrop": "var(--overlay-backdrop)",
        "header-pill": "var(--header-pill)",
        "header-pill-border": "var(--header-pill-border)",
        "popup-bg": "var(--popup-bg)",
        "popup-border": "var(--popup-border)",
        "chip-bg": "var(--chip-bg)",
        "chip-active-bg": "var(--chip-active-bg)",
        "chip-active-fg": "var(--chip-active-fg)",
        "cta-bg-active": "var(--cta-bg-active)",
        "cta-fg-active": "var(--cta-fg-active)",
        "cta-soft": "var(--cta-soft)",
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
        label: ['var(--font-label)'],
      },
    },
  },
  plugins: [],
}