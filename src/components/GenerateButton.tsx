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
      className="px-8 py-3 rounded bg-black text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
    >
      Generate
    </button>
  )
}
