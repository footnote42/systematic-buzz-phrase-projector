import { describe, it, expect } from 'vitest'
import { EASTER_EGGS } from '@/constants/easterEggs'
import { resolvePhrase } from '@/utils/phraseResolver'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'

const MATRIX_FOR: Record<string, typeof ORIGINAL_MATRIX> = {
  original: ORIGINAL_MATRIX,
  modern: MODERN_MATRIX,
  chaos: CHAOS_MATRIX,
}

describe('EASTER_EGGS', () => {
  it('has an entry for code "000" in every mode', () => {
    expect(EASTER_EGGS.original['000']).toBeDefined()
    expect(EASTER_EGGS.modern['000']).toBeDefined()
    expect(EASTER_EGGS.chaos['000']).toBeDefined()
  })

  it('each "000" entry is a three-word tuple', () => {
    for (const mode of ['original', 'modern', 'chaos'] as const) {
      const words = EASTER_EGGS[mode]['000']
      expect(Array.isArray(words)).toBe(true)
      expect(words).toHaveLength(3)
      for (const word of words) {
        expect(typeof word).toBe('string')
        expect(word.length).toBeGreaterThan(0)
      }
    }
  })

  it('original "000" easter egg differs from matrix phrase at [0,0,0]', () => {
    const matrixPhrase = resolvePhrase('original', ORIGINAL_MATRIX, [0, 0, 0])
    expect(EASTER_EGGS.original['000']).not.toEqual(matrixPhrase.words)
  })

  it('modern "000" easter egg differs from matrix phrase at [0,0,0]', () => {
    const matrixPhrase = resolvePhrase('modern', MODERN_MATRIX, [0, 0, 0])
    expect(EASTER_EGGS.modern['000']).not.toEqual(matrixPhrase.words)
  })

  it('chaos "000" easter egg differs from matrix phrase at [0,0,0]', () => {
    const matrixPhrase = resolvePhrase('chaos', CHAOS_MATRIX, [0, 0, 0])
    expect(EASTER_EGGS.chaos['000']).not.toEqual(matrixPhrase.words)
  })

  it('all three "000" easter eggs are distinct from each other', () => {
    const original = EASTER_EGGS.original['000'].join(' ')
    const modern = EASTER_EGGS.modern['000'].join(' ')
    const chaos = EASTER_EGGS.chaos['000'].join(' ')
    expect(original).not.toBe(modern)
    expect(modern).not.toBe(chaos)
    expect(original).not.toBe(chaos)
  })

  it('a code with no easter egg entry returns undefined', () => {
    expect(EASTER_EGGS.original['999']).toBeUndefined()
    expect(EASTER_EGGS.modern['123']).toBeUndefined()
    expect(EASTER_EGGS.chaos['456']).toBeUndefined()
  })

  it('regression: original "000" easter egg is not "integrated management options"', () => {
    const words = EASTER_EGGS.original['000']
    expect(words.join(' ')).not.toBe('integrated management options')
  })

  it('regression: modern "000" easter egg is not "hyper-scale algorithmic paradigm"', () => {
    const words = EASTER_EGGS.modern['000']
    expect(words.join(' ')).not.toBe('hyper-scale algorithmic paradigm')
  })

  describe('matrix coverage — non-easter-egg codes still resolve normally', () => {
    it('original "257" resolves via matrix (not easter egg)', () => {
      expect(EASTER_EGGS.original['257']).toBeUndefined()
      const phrase = resolvePhrase('original', MATRIX_FOR.original, [2, 5, 7])
      expect(phrase.words).toEqual(['systemised', 'logistical', 'projection'])
    })

    it('modern "257" resolves via matrix (not easter egg)', () => {
      expect(EASTER_EGGS.modern['257']).toBeUndefined()
      const phrase = resolvePhrase('modern', MATRIX_FOR.modern, [2, 5, 7])
      expect(phrase.words).toEqual(['generative', 'telemetry', 'alignment'])
    })
  })
})
