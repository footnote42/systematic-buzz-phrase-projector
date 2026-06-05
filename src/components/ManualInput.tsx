interface ManualInputProps {
  onSubmit: (value: string) => void
  validationError: string | null
  disabled: boolean
  hint: string
}

const ALLOWED_KEYS = new Set([
  'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
])

export default function ManualInput({ onSubmit, validationError, disabled, hint }: ManualInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onSubmit(e.currentTarget.value)
      return
    }
    if (ALLOWED_KEYS.has(e.key)) return
    if (/^\d$/.test(e.key)) return
    e.preventDefault()
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="manual-code" className="text-sm font-medium text-[var(--color-text)]">
        Enter 3-digit code
      </label>
      <p className="text-xs text-[var(--color-text-muted)] max-w-[7rem]">{hint}</p>
      <input
        id="manual-code"
        type="text"
        maxLength={3}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 257"
        className="border rounded px-3 py-2 w-28 text-center text-lg tracking-widest disabled:opacity-50 bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        aria-describedby={validationError ? 'manual-code-error' : undefined}
      />
      {validationError && (
        <p id="manual-code-error" role="alert" className="text-red-400 text-sm">
          {validationError}
        </p>
      )}
    </div>
  )
}
