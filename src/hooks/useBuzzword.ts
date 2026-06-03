'use client'

import { useState } from 'react'
import type { Mode, Theme, BuzzPhrase } from '@/types'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'
import { randomIndices, resolvePhrase, validateCode } from '@/utils/phraseResolver'

const MODE_KEY = 'sbpp-mode'
const THEME_KEY = 'sbpp-theme'

const VALID_MODES: Mode[] = ['original', 'modern', 'chaos']
const VALID_THEMES: Theme[] = ['splitflap', 'slotmachine', 'dotmatrix']

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

function readMode(): Mode {
  if (typeof window === 'undefined') return 'original'
  const stored = safeGet(MODE_KEY)
  return VALID_MODES.includes(stored as Mode) ? (stored as Mode) : 'original'
}

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'splitflap'
  const stored = safeGet(THEME_KEY)
  return VALID_THEMES.includes(stored as Theme) ? (stored as Theme) : 'splitflap'
}

function getMatrix(mode: Mode) {
  if (mode === 'original') return ORIGINAL_MATRIX
  if (mode === 'modern') return MODERN_MATRIX
  return CHAOS_MATRIX
}

export function useBuzzword() {
  const [mode, setModeState] = useState<Mode>(readMode)
  const [theme, setThemeState] = useState<Theme>(readTheme)
  const [current, setCurrent] = useState<BuzzPhrase | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  function setMode(newMode: Mode) {
    setModeState(newMode)
    safeSet(MODE_KEY, newMode)
    setCurrent(null)
    setIsAnimating(false)
    setValidationError(null)
  }

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme)
    safeSet(THEME_KEY, newTheme)
  }

  function generate() {
    const indices = randomIndices(mode)
    const phrase = resolvePhrase(mode, getMatrix(mode), indices)
    setCurrent(phrase)
    setIsAnimating(true)
  }

  function submitCode(code: string) {
    const result = validateCode(code, mode)
    if (!result.valid) {
      setValidationError(result.error ?? 'Invalid code.')
      setCurrent(null)
      return
    }
    setValidationError(null)
    const phrase = resolvePhrase(mode, getMatrix(mode), result.indices!)
    setCurrent(phrase)
    setIsAnimating(true)
  }

  function handleAnimationComplete() {
    setIsAnimating(false)
  }

  return {
    mode,
    theme,
    current,
    isAnimating,
    validationError,
    setMode,
    setTheme,
    generate,
    submitCode,
    handleAnimationComplete,
  }
}
