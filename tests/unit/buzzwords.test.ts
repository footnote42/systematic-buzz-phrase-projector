import { describe, it, expect } from 'vitest'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'

describe('ORIGINAL_MATRIX', () => {
  it('has exactly 10 entries in column1', () => {
    expect(ORIGINAL_MATRIX.column1).toHaveLength(10)
  })
  it('has exactly 10 entries in column2', () => {
    expect(ORIGINAL_MATRIX.column2).toHaveLength(10)
  })
  it('has exactly 10 entries in column3', () => {
    expect(ORIGINAL_MATRIX.column3).toHaveLength(10)
  })

  it('regression: column1[2] is "systemised"', () => {
    expect(ORIGINAL_MATRIX.column1[2]).toBe('systemised')
  })
  it('regression: column2[5] is "logistical"', () => {
    expect(ORIGINAL_MATRIX.column2[5]).toBe('logistical')
  })
  it('regression: column3[7] is "projection"', () => {
    expect(ORIGINAL_MATRIX.column3[7]).toBe('projection')
  })
})

describe('MODERN_MATRIX', () => {
  it('has exactly 10 entries in column1', () => {
    expect(MODERN_MATRIX.column1).toHaveLength(10)
  })
  it('has exactly 10 entries in column2', () => {
    expect(MODERN_MATRIX.column2).toHaveLength(10)
  })
  it('has exactly 10 entries in column3', () => {
    expect(MODERN_MATRIX.column3).toHaveLength(10)
  })

  it('regression: column1[2] is "generative"', () => {
    expect(MODERN_MATRIX.column1[2]).toBe('generative')
  })
  it('regression: column2[5] is "telemetry"', () => {
    expect(MODERN_MATRIX.column2[5]).toBe('telemetry')
  })
  it('regression: column3[7] is "alignment"', () => {
    expect(MODERN_MATRIX.column3[7]).toBe('alignment')
  })
})

describe('CHAOS_MATRIX', () => {
  it('has exactly 20 entries in column1', () => {
    expect(CHAOS_MATRIX.column1).toHaveLength(20)
  })
  it('has exactly 20 entries in column2', () => {
    expect(CHAOS_MATRIX.column2).toHaveLength(20)
  })
  it('has exactly 20 entries in column3', () => {
    expect(CHAOS_MATRIX.column3).toHaveLength(20)
  })

  it('first 10 entries of column1 equal ORIGINAL_MATRIX.column1', () => {
    expect(CHAOS_MATRIX.column1.slice(0, 10)).toEqual([...ORIGINAL_MATRIX.column1])
  })
})
