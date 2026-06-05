'use client'

import { useEffect, useRef, useState } from 'react'
import type { DisplayProps, ColourVariant } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAudio } from '@/hooks/useAudio'

const COLOUR_KEY = 'sbpp-dotmatrix-colour'
const CHAR_DELAY_MS = 40
const SPACE_EXTRA_MS = 160
const BLANK_PAUSE_MS = 150

function readColourVariant(): ColourVariant {
  if (typeof window === 'undefined') return 'green'
  const stored = localStorage.getItem(COLOUR_KEY)
  return stored === 'amber' ? 'amber' : 'green'
}

export default function DotMatrixDisplay({ words, isAnimating, onAnimationComplete }: DisplayProps) {
  const reducedMotion = useReducedMotion()
  const { playTick } = useAudio()
  const [displayedText, setDisplayedText] = useState('')
  const [colourVariant, setColourVariant] = useState<ColourVariant>(readColourVariant)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCompleteRef = useRef(onAnimationComplete)
  const playTickRef = useRef(playTick)

  useEffect(() => {
    onCompleteRef.current = onAnimationComplete
  })

  useEffect(() => {
    playTickRef.current = playTick
  })

  const phraseString = words.filter(Boolean).join(' ')
  const phosphorClass = colourVariant === 'amber' ? 'text-amber-400' : 'text-green-400'

  function toggleColour() {
    setColourVariant((prev) => {
      const next: ColourVariant = prev === 'green' ? 'amber' : 'green'
      try {
        localStorage.setItem(COLOUR_KEY, next)
      } catch {
        // Silently ignore quota errors
      }
      return next
    })
  }

  function cancelTypewriter() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    if (!isAnimating) return

    cancelTypewriter()

    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion fast-path: show phrase immediately then call completion synchronously
      setDisplayedText(phraseString)
      onCompleteRef.current()
      return
    }

    if (!phraseString) {
      setDisplayedText('')
      onCompleteRef.current()
      return
    }

    // Blank immediately, then pause 150 ms before typing begins
    setDisplayedText('')

    let charIndex = 0

    function revealNext() {
      const char = phraseString[charIndex]
      charIndex++
      playTickRef.current()
      setDisplayedText(phraseString.slice(0, charIndex))

      if (charIndex >= phraseString.length) {
        onCompleteRef.current()
        return
      }

      const delay = char === ' ' ? CHAR_DELAY_MS + SPACE_EXTRA_MS : CHAR_DELAY_MS
      timeoutRef.current = setTimeout(revealNext, delay)
    }

    timeoutRef.current = setTimeout(revealNext, BLANK_PAUSE_MS)

    return () => {
      cancelTypewriter()
    }
  }, [isAnimating, phraseString]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when words cleared
  useEffect(() => {
    if (words[0] === '' && words[1] === '' && words[2] === '') {
      cancelTypewriter()
      // eslint-disable-next-line react-hooks/set-state-in-effect -- empty state reset: wipe displayed text when no phrase is active
      setDisplayedText('')
    }
  }, [words[0], words[1], words[2]]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Display area */}
      <div
        aria-label="Dot-matrix display"
        aria-live="polite"
        className={`relative w-full min-h-12 bg-gray-950 rounded p-4 font-[family-name:var(--font-vt323)] text-2xl tracking-widest overflow-hidden ${phosphorClass}`}
      >
        {/* CRT scanline overlay (display-local) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          }}
          aria-hidden="true"
        />

        {/* Text and cursor */}
        <span className="relative z-10">
          {displayedText}
          <span
            className="inline-block"
            style={{ animation: 'blink 1s step-start infinite' }}
            aria-hidden="true"
          >
            &#x2588;
          </span>
        </span>
      </div>

      {/* Phosphor colour toggle */}
      <button
        type="button"
        onClick={toggleColour}
        aria-label={`Switch to ${colourVariant === 'green' ? 'amber' : 'green'} phosphor`}
        className="text-xs text-gray-400 hover:text-gray-200 transition-colors border border-gray-600 rounded px-2 py-0.5"
      >
        {colourVariant === 'green' ? 'green' : 'amber'} phosphor
      </button>
    </div>
  )
}
