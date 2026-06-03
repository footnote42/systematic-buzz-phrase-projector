import { describe, it, expect } from 'vitest'
import {
  addToFavourites,
  removeFromFavourites,
  isFavourited,
} from '@/utils/favouritesUtils'
import type { BuzzPhrase } from '@/types'

function makePhrase(id: string, savedAt?: number): BuzzPhrase {
  return {
    id,
    words: ['a', 'b', 'c'],
    indices: [0, 0, 0],
    mode: 'original',
    savedAt,
  }
}

describe('addToFavourites', () => {
  it('prepends the new phrase with a savedAt timestamp', () => {
    const before = Date.now()
    const result = addToFavourites([], makePhrase('p1'))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p1')
    expect(result[0].savedAt).toBeGreaterThanOrEqual(before)
  })

  it('re-adding a duplicate removes old entry and prepends with updated savedAt', () => {
    const old = makePhrase('p1', 1000)
    const collection = [old]
    const result = addToFavourites(collection, makePhrase('p1'))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p1')
    expect(result[0].savedAt).toBeGreaterThan(1000)
  })

  it('adding a 51st phrase removes the entry with the lowest savedAt', () => {
    const collection: BuzzPhrase[] = Array.from({ length: 50 }, (_, i) =>
      makePhrase(`p${i}`, i + 1)
    )
    // p0 has savedAt=1 (oldest)
    const result = addToFavourites(collection, makePhrase('p_new'))
    expect(result).toHaveLength(50)
    expect(result.find((p) => p.id === 'p0')).toBeUndefined()
    expect(result[0].id).toBe('p_new')
  })
})

describe('removeFromFavourites', () => {
  it('removes phrase by id', () => {
    const collection = [makePhrase('p1', 1), makePhrase('p2', 2)]
    const result = removeFromFavourites(collection, 'p1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p2')
  })

  it('returns collection unchanged when id not found', () => {
    const collection = [makePhrase('p1', 1)]
    const result = removeFromFavourites(collection, 'nonexistent')
    expect(result).toHaveLength(1)
    expect(result).toEqual(collection)
  })
})

describe('isFavourited', () => {
  it('returns true for a saved id', () => {
    expect(isFavourited([makePhrase('p1', 1)], 'p1')).toBe(true)
  })

  it('returns false for an unsaved id', () => {
    expect(isFavourited([makePhrase('p1', 1)], 'p2')).toBe(false)
  })

  it('returns false for empty collection', () => {
    expect(isFavourited([], 'p1')).toBe(false)
  })
})
