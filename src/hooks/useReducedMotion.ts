'use client'

import { useState } from 'react'

export function useReducedMotion(): boolean {
  return useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })[0]
}
