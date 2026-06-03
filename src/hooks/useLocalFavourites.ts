'use client'

import { useState } from 'react'
import type { BuzzPhrase } from '@/types'
import {
  addToFavourites,
  removeFromFavourites,
  isFavourited as isFavouritedUtil,
} from '@/utils/favouritesUtils'

const STORAGE_KEY = 'sbpp-favourites'

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently ignore quota errors
  }
}

function loadFavourites(): BuzzPhrase[] {
  if (typeof window === 'undefined') return []
  const raw = safeGet(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as BuzzPhrase[]
    return []
  } catch {
    return []
  }
}

export function useLocalFavourites() {
  const [favourites, setFavourites] = useState<BuzzPhrase[]>(loadFavourites)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleFavourite(phrase: BuzzPhrase) {
    setFavourites((prev) => {
      const next = isFavouritedUtil(prev, phrase.id)
        ? removeFromFavourites(prev, phrase.id)
        : addToFavourites(prev, phrase)
      safeSet(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function isFavourited(id: string): boolean {
    return isFavouritedUtil(favourites, id)
  }

  return { favourites, toggleFavourite, isFavourited, sidebarOpen, setSidebarOpen }
}
