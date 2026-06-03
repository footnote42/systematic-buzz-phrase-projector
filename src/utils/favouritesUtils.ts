import type { BuzzPhrase } from '@/types'

const MAX_FAVOURITES = 50

export function addToFavourites(
  collection: BuzzPhrase[],
  phrase: BuzzPhrase
): BuzzPhrase[] {
  const withoutExisting = collection.filter((p) => p.id !== phrase.id)
  const updated: BuzzPhrase[] = [{ ...phrase, savedAt: Date.now() }, ...withoutExisting]
  if (updated.length <= MAX_FAVOURITES) return updated
  // Remove entry with the lowest savedAt
  let minIdx = 0
  let minSavedAt = updated[0].savedAt ?? 0
  for (let i = 1; i < updated.length; i++) {
    const t = updated[i].savedAt ?? 0
    if (t < minSavedAt) {
      minSavedAt = t
      minIdx = i
    }
  }
  return updated.filter((_, i) => i !== minIdx)
}

export function removeFromFavourites(
  collection: BuzzPhrase[],
  id: string
): BuzzPhrase[] {
  return collection.filter((p) => p.id !== id)
}

export function isFavourited(collection: BuzzPhrase[], id: string): boolean {
  return collection.some((p) => p.id === id)
}
