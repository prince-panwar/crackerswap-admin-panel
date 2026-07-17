import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
} | null>(null);

const STORAGE_KEY = "cracker-admin-theme";

// Adapted from cracker-swap-frontend/lib/theme/index.tsx (same `dark`
// class-toggle mechanism — see tailwind.config.ts `darkMode: "class"` and the
// `:root`/`.dark` tokens in index.css) but NOT a byte-for-byte port: the
// frontend's version reads localStorage in a separate mount-only `useEffect`
// that calls `setTheme`, then a second `[theme]`-keyed effect applies the
// class + re-persists to localStorage. Both effects fire on the same first
// mount (doubly so under React 19 StrictMode, which invokes effects twice in
// dev) — the second effect can run once with the *stale* default ("dark")
// before the first effect's `setTheme` re-render lands, writing "dark" back
// into localStorage and clobbering whatever was actually stored. Reading
// localStorage synchronously via a lazy `useState` initializer avoids the
// race entirely: state starts correct on the very first render, so there's
// only one effect, and it only ever runs with the true current value.
function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// This is a Vite SPA (no server render), so instead of a bootstrap script
// injected by a layout, the pre-paint class is set directly in index.html's
// <head> — see the inline <script> there, which mirrors this same
// read-localStorage-or-prefers-color-scheme logic.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
