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
            'px-4 py-2 rounded border font-medium transition-colors',
            mode === value
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-black',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
