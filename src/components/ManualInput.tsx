interface ManualInputProps {
  onSubmit: (value: string) => void
  validationError: string | null
  disabled: boolean
}

const ALLOWED_KEYS = new Set([
  'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'End',
])

export default function ManualInput({ onSubmit, validationError, disabled }: ManualInputProps) {
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
      <label htmlFor="manual-code" className="text-sm font-medium">
        Enter 3-digit code
      </label>
      <input
        id="manual-code"
        type="text"
        maxLength={3}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 257"
        className="border rounded px-3 py-2 w-28 text-center text-lg tracking-widest disabled:opacity-50"
        aria-describedby={validationError ? 'manual-code-error' : undefined}
      />
      {validationError && (
        <p id="manual-code-error" role="alert" className="text-red-600 text-sm">
          {validationError}
        </p>
      )}
    </div>
  )
}
