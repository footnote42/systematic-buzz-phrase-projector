'use client'

import { useState, useEffect, useRef } from 'react'
import type { Mode, Theme, BuzzPhrase } from '@/types'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'
import { randomIndices, resolvePhrase, validateCode, buildPhraseId } from '@/utils/phraseResolver'
import { EASTER_EGGS } from '@/constants/easterEggs'

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
  const [mode, setModeState] = useState<Mode>('original')
  const [theme, setThemeState] = useState<Theme>('splitflap')
  const [current, setCurrent] = useState<BuzzPhrase | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  // Used to prevent T001 (URL sync) from clearing the URL before T002 (URL read) runs on mount
  const isMountedRef = useRef(false)

  // SSR-safe hydration: server renders defaults; client updates from localStorage post-mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setModeState(readMode())
    setThemeState(readTheme())
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // T001 — URL sync: listed before T002 so isMountedRef guard prevents premature URL clearing on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isMountedRef.current) return
    if (current === null) {
      window.history.replaceState(null, '', window.location.pathname)
      return
    }
    const code = current.indices.join('')
    const params = new URLSearchParams({ code, mode, theme })
    window.history.replaceState(null, '', '?' + params.toString())
  }, [current, mode, theme])

  // T002 + T008 — URL read on mount; checks easter eggs before falling through to matrix lookup
  // SSR-safe: URL params only exist client-side; setState calls here are intentional one-time hydration
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    const urlTheme = params.get('theme')
    const urlCode = params.get('code')

    // Determine resolved mode from URL (overrides localStorage)
    const storedMode = readMode()
    let resolvedMode: Mode = storedMode

    if (urlMode && VALID_MODES.includes(urlMode as Mode)) {
      resolvedMode = urlMode as Mode
      setModeState(resolvedMode)
      safeSet(MODE_KEY, resolvedMode)
    }
    if (urlTheme && VALID_THEMES.includes(urlTheme as Theme)) {
      setThemeState(urlTheme as Theme)
      safeSet(THEME_KEY, urlTheme as Theme)
    }
    if (urlCode && /^\d{3}$/.test(urlCode)) {
      const result = validateCode(urlCode, resolvedMode)
      if (result.valid) {
        const easterEggWords = EASTER_EGGS[resolvedMode]?.[urlCode]
        if (easterEggWords) {
          setCurrent({
            id: buildPhraseId(resolvedMode, result.indices!),
            words: [...easterEggWords] as [string, string, string],
            indices: result.indices!,
            mode: resolvedMode,
          })
        } else {
          setCurrent(resolvePhrase(resolvedMode, getMatrix(resolvedMode), result.indices!))
        }
        setIsAnimating(true)
      }
    }

    isMountedRef.current = true
  }, []) // mount-only: all dependencies are stable setters or module-level constants
  /* eslint-enable react-hooks/set-state-in-effect */

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

  // T007 — submitCode checks EASTER_EGGS before falling through to standard matrix lookup
  function submitCode(code: string) {
    const result = validateCode(code, mode)
    if (!result.valid) {
      setValidationError(result.error ?? 'Invalid code.')
      setCurrent(null)
      return
    }
    setValidationError(null)
    const easterEggWords = EASTER_EGGS[mode]?.[code]
    if (easterEggWords) {
      setCurrent({
        id: buildPhraseId(mode, result.indices!),
        words: [...easterEggWords] as [string, string, string],
        indices: result.indices!,
        mode,
      })
      setIsAnimating(true)
      return
    }
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
