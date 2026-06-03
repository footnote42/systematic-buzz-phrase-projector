import type { Mode, BuzzPhrase, ValidationResult, WordMatrix } from '@/types'

export const MATRIX_SIZES: Record<Mode, number> = {
  original: 10,
  modern: 10,
  chaos: 20,
}

export function buildPhraseId(
  mode: Mode,
  indices: readonly [number, number, number]
): string {
  return `${mode}-${indices[0]}${indices[1]}${indices[2]}`
}

export function resolvePhrase(
  mode: Mode,
  matrix: WordMatrix,
  indices: readonly [number, number, number]
): BuzzPhrase {
  const size = MATRIX_SIZES[mode]
  const i1 = ((indices[0] % size) + size) % size
  const i2 = ((indices[1] % size) + size) % size
  const i3 = ((indices[2] % size) + size) % size
  const words: [string, string, string] = [
    matrix.column1[i1] as string,
    matrix.column2[i2] as string,
    matrix.column3[i3] as string,
  ]
  return {
    id: buildPhraseId(mode, [i1, i2, i3]),
    words,
    indices: [i1, i2, i3],
    mode,
  }
}

// mode param is part of the public API contract (callers pass it for future per-mode validation)
export function validateCode(code: string, mode: Mode): ValidationResult {
  void mode
  if (code.length !== 3) {
    return { valid: false, error: 'Code must be exactly 3 digits.' }
  }
  if (!/^\d{3}$/.test(code)) {
    return { valid: false, error: 'Code must contain only digits 0–9.' }
  }
  const indices: readonly [number, number, number] = [
    parseInt(code[0], 10),
    parseInt(code[1], 10),
    parseInt(code[2], 10),
  ]
  return { valid: true, indices }
}

export function randomIndices(mode: Mode): readonly [number, number, number] {
  const size = MATRIX_SIZES[mode]
  return [
    Math.floor(Math.random() * size),
    Math.floor(Math.random() * size),
    Math.floor(Math.random() * size),
  ]
}
