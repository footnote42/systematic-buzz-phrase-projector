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
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l flex flex-col z-50"
    >
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">Saved Phrases</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close saved phrases"
          className="text-gray-500 hover:text-black text-2xl leading-none"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {phrases.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-8">
            Generate a phrase and star it to save it here.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {phrases.map((phrase) => (
              <li
                key={phrase.id}
                className="border rounded p-3 flex flex-col gap-2"
              >
                <p className="font-medium">{phrase.words.join(' ')}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="uppercase tracking-wide bg-gray-100 px-1.5 py-0.5 rounded">
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
                    className="text-xs text-gray-600 hover:text-black underline"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(phrase.id)}
                    className="text-xs text-red-600 hover:text-red-800 underline"
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
