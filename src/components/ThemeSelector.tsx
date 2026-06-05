import type { Theme } from '@/types'
import { THEME_LABELS } from '@/constants/themes'

interface ThemeSelectorProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const THEMES = (Object.keys(THEME_LABELS) as Theme[])

export default function ThemeSelector({ theme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div role="group" aria-label="Select theme" className="flex gap-2">
      {THEMES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onThemeChange(value)}
          aria-pressed={theme === value}
          className={[
            'px-3 py-1.5 rounded border text-sm font-medium transition-colors',
            theme === value
              ? 'bg-[var(--color-accent)] text-[var(--color-base)] border-[var(--color-accent)]'
              : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]',
          ].join(' ')}
        >
          {THEME_LABELS[value]}
        </button>
      ))}
    </div>
  )
}
