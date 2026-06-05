import type { BuzzPhrase } from '@/types'

interface FavouritesSidebarProps {
  phrases: BuzzPhrase[]
  onRemove: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

function getCodeFromPhrase(phrase: BuzzPhrase): string {
  return phrase.indices.join('')
}

export default function FavouritesSidebar({
  phrases,
  onRemove,
  isOpen,
  onClose,
}: FavouritesSidebarProps) {
  if (!isOpen) return null

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Saved phrases"
      className="fixed inset-y-0 right-0 w-80 shadow-xl border-l flex flex-col z-50 bg-[var(--color-surface-high)] border-[var(--color-border)] text-[var(--color-text)]"
    >
      <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <h2 className="font-semibold text-lg">Saved Phrases</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close saved phrases"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {phrases.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-sm text-center mt-8">
            Generate a phrase and star it to save it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {phrases.map((phrase) => (
              <li
                key={phrase.id}
                className="border rounded p-3 flex flex-col gap-2 border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <p className="font-medium">{phrase.words.join(' ')}</p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span className="uppercase tracking-wide bg-[var(--color-surface-high)] px-1.5 py-0.5 rounded">
                    {phrase.mode}
                  </span>
                  <span>Code: {getCodeFromPhrase(phrase)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(phrase.words.join(' '))
                    }
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(phrase.id)}
                    className="text-xs text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
