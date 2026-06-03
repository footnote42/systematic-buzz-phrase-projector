import { describe, it, expect } from 'vitest'
import {
  resolvePhrase,
  validateCode,
  buildPhraseId,
  randomIndices,
  MATRIX_SIZES,
} from '@/utils/phraseResolver'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'

describe('resolvePhrase', () => {
  it('canonical regression: original 257 → "systemised logistical projection"', () => {
    const result = resolvePhrase('original', ORIGINAL_MATRIX, [2, 5, 7])
    expect(result.words).toEqual(['systemised', 'logistical', 'projection'])
    expect(result.id).toBe('original-257')
    expect(result.mode).toBe('original')
    expect(result.indices).toEqual([2, 5, 7])
  })

  it('canonical regression: modern 257 → "generative telemetry alignment"', () => {
    const result = resolvePhrase('modern', MODERN_MATRIX, [2, 5, 7])
    expect(result.words).toEqual(['generative', 'telemetry', 'alignment'])
    expect(result.id).toBe('modern-257')
    expect(result.mode).toBe('modern')
    expect(result.indices).toEqual([2, 5, 7])
  })

  it('boundary index 0 in original resolves correctly', () => {
    const result = resolvePhrase('original', ORIGINAL_MATRIX, [0, 0, 0])
    expect(result.words[0]).toBe(ORIGINAL_MATRIX.column1[0])
    expect(result.words[1]).toBe(ORIGINAL_MATRIX.column2[0])
    expect(result.words[2]).toBe(ORIGINAL_MATRIX.column3[0])
  })

  it('boundary index 9 in original resolves correctly', () => {
    const result = resolvePhrase('original', ORIGINAL_MATRIX, [9, 9, 9])
    expect(result.words[0]).toBe(ORIGINAL_MATRIX.column1[9])
    expect(result.words[1]).toBe(ORIGINAL_MATRIX.column2[9])
    expect(result.words[2]).toBe(ORIGINAL_MATRIX.column3[9])
  })

  it('chaos boundary index 0 resolves to original column word', () => {
    const result = resolvePhrase('chaos', CHAOS_MATRIX, [0, 0, 0])
    expect(result.words[0]).toBe(ORIGINAL_MATRIX.column1[0])
  })

  it('chaos boundary index 19 resolves to modern column word (index 9 within modern)', () => {
    const result = resolvePhrase('chaos', CHAOS_MATRIX, [19, 19, 19])
    expect(result.words[0]).toBe(MODERN_MATRIX.column1[9])
    expect(result.words[1]).toBe(MODERN_MATRIX.column2[9])
    expect(result.words[2]).toBe(MODERN_MATRIX.column3[9])
  })

  it('does not include savedAt', () => {
    const result = resolvePhrase('original', ORIGINAL_MATRIX, [0, 0, 0])
    expect(result.savedAt).toBeUndefined()
  })
})

describe('validateCode', () => {
  it('valid code "257" returns valid: true with indices [2,5,7]', () => {
    const result = validateCode('257', 'original')
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([2, 5, 7])
  })

  it('"abc" returns valid: false', () => {
    const result = validateCode('abc', 'original')
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('"25" (too short) returns valid: false', () => {
    const result = validateCode('25', 'original')
    expect(result.valid).toBe(false)
  })

  it('"2577" (too long) returns valid: false', () => {
    const result = validateCode('2577', 'original')
    expect(result.valid).toBe(false)
  })

  it('"000" is valid', () => {
    const result = validateCode('000', 'original')
    expect(result.valid).toBe(true)
    expect(result.indices).toEqual([0, 0, 0])
  })
})

describe('randomIndices', () => {
  it('returns 3 integers within bounds for original mode', () => {
    const size = MATRIX_SIZES['original']
    for (let i = 0; i < 20; i++) {
      const [a, b, c] = randomIndices('original')
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThan(size)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(size)
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThan(size)
    }
  })

  it('returns indices within 0–19 for chaos mode', () => {
    const size = MATRIX_SIZES['chaos']
    for (let i = 0; i < 20; i++) {
      const [a, b, c] = randomIndices('chaos')
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThan(size)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(size)
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThan(size)
    }
  })
})

describe('buildPhraseId', () => {
  it('builds correct id for chaos [0,3,4]', () => {
    expect(buildPhraseId('chaos', [0, 3, 4])).toBe('chaos-034')
  })

  it('builds correct id for original [2,5,7]', () => {
    expect(buildPhraseId('original', [2, 5, 7])).toBe('original-257')
  })
})
