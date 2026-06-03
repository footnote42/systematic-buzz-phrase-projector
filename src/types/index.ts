export type Mode = 'original' | 'modern' | 'chaos'
export type Theme = 'splitflap' | 'slotmachine' | 'dotmatrix'
export type ColourVariant = 'green' | 'amber'

export interface WordMatrix {
  readonly column1: readonly string[]
  readonly column2: readonly string[]
  readonly column3: readonly string[]
}

export interface BuzzPhrase {
  id: string
  words: readonly [string, string, string]
  indices: readonly [number, number, number]
  mode: Mode
  savedAt?: number
}

export interface BuzzState {
  mode: Mode
  theme: Theme
  current: BuzzPhrase | null
  isAnimating: boolean
}

export interface DisplayProps {
  words: readonly [string, string, string]
  isAnimating: boolean
  onAnimationComplete: () => void
}

export interface ValidationResult {
  valid: boolean
  indices?: readonly [number, number, number]
  error?: string
}
