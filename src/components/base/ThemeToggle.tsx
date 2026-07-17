import { useTheme } from '@/lib/theme';

// Light/dark toggle for the admin header. Uses the same remixicon `<i>` icon
// convention as every other icon in this app (ri-moon-line / ri-sun-line),
// not lucide-react, so it reads as the same icon system as the rest of the
// nav — not a pixel port of the frontend's custom sliding-pill glyph, just
// its light/dark behavior and token colors.
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="w-9 h-9 rounded-full flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface transition-all cursor-pointer border border-transparent hover:border-card-border"
    >
      <i className={`text-lg ${isDark ? 'ri-sun-line' : 'ri-moon-line'}`}></i>
    </button>
  );
}
