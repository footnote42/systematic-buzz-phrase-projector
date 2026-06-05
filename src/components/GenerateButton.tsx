interface GenerateButtonProps {
  onGenerate: () => void
  disabled: boolean
}

export default function GenerateButton({ onGenerate, disabled }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={disabled}
      className="px-8 py-3 rounded bg-[var(--color-accent)] text-[var(--color-base)] font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:opacity-80 transition-opacity"
    >
      Generate
    </button>
  )
}
