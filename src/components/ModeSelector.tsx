import type { Mode } from '@/types'

const MODES: { value: Mode; label: string }[] = [
  { value: 'original', label: 'Original 1968' },
  { value: 'modern', label: 'Modern 2026' },
  { value: 'chaos', label: 'Chaos' },
]

interface ModeSelectorProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div role="group" aria-label="Select mode" className="flex gap-2">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          aria-pressed={mode === value}
          className={[
            'px-4 py-2 rounded border text-sm font-medium transition-colors',
            mode === value
              ? 'bg-[var(--color-accent)] text-[var(--color-base)] border-[var(--color-accent)]'
              : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
