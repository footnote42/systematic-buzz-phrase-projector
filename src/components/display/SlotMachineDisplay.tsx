'use client'

import { useEffect, useRef } from 'react'
import type { DisplayProps } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type SlotMachineProps = DisplayProps & {
  columnWords: readonly [readonly string[], readonly string[], readonly string[]]
}

const ROW_HEIGHT = 48

export default function SlotMachineDisplay({
  words,
  isAnimating,
  onAnimationComplete,
  columnWords,
}: SlotMachineProps) {
  const reducedMotion = useReducedMotion()

  const reel0Ref = useRef<HTMLDivElement>(null)
  const reel1Ref = useRef<HTMLDivElement>(null)
  const reel2Ref = useRef<HTMLDivElement>(null)

  const generationRef = useRef(0)
  const settledRef = useRef(0)
  const onCompleteRef = useRef(onAnimationComplete)

  useEffect(() => {
    onCompleteRef.current = onAnimationComplete
  })

  function getTargetIndex(wi: number): number {
    const idx = (columnWords[wi] as readonly string[]).indexOf(words[wi])
    return idx === -1 ? 0 : idx + 1 // +1 for leading dash entry
  }

  useEffect(() => {
    if (!isAnimating) return

    // Capture ref values inside the effect so cleanup can safely use them
    const reels = [reel0Ref.current, reel1Ref.current, reel2Ref.current]

    const generation = ++generationRef.current
    settledRef.current = 0

    const newIndices: [number, number, number] = [
      getTargetIndex(0),
      getTargetIndex(1),
      getTargetIndex(2),
    ]

    if (reducedMotion) {
      for (let wi = 0; wi < 3; wi++) {
        const reel = reels[wi]
        if (!reel) continue
        reel.style.transition = 'none'
        reel.style.transform = `translateY(-${newIndices[wi] * ROW_HEIGHT}px)`
      }
      onCompleteRef.current()
      return
    }

    const cleanupFns: Array<() => void> = []

    for (let wi = 0; wi < 3; wi++) {
      const reel = reels[wi]
      if (!reel) continue

      // Remove transition and snap to top (reset reel to start position)
      reel.style.transition = 'none'
      reel.style.transform = 'translateY(0)'
      // Force reflow so the browser applies the snap before adding transition
      reel.getBoundingClientRect()

      // Apply transition and scroll to target with bounce easing
      reel.style.transition = 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      reel.style.transform = `translateY(-${newIndices[wi] * ROW_HEIGHT}px)`

      const handleEnd = () => {
        if (generationRef.current !== generation) return
        settledRef.current++
        if (settledRef.current >= 3) {
          onCompleteRef.current()
        }
      }

      reel.addEventListener('transitionend', handleEnd)
      cleanupFns.push(() => reel.removeEventListener('transitionend', handleEnd))
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- incrementing generationRef stales pending transitionend handlers; safe to write in cleanup
      generationRef.current++
      for (const reel of reels) {
        if (reel) reel.style.transition = 'none'
      }
      cleanupFns.forEach((fn) => fn())
    }
  }, [isAnimating, words[0], words[1], words[2]]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-label="Slot machine display"
      className="flex flex-col sm:flex-row gap-6 items-center justify-center font-mono"
    >
      {([0, 1, 2] as const).map((wi) => {
        const items = ['-', ...(columnWords[wi] as readonly string[])]
        const reelRef = wi === 0 ? reel0Ref : wi === 1 ? reel1Ref : reel2Ref

        return (
          <div
            key={wi}
            className="overflow-hidden border-2 border-gray-500 rounded bg-gray-900 text-white"
            style={{ height: ROW_HEIGHT, minWidth: '10rem' }}
            aria-label={`Word ${wi + 1}`}
          >
            <div ref={reelRef}>
              {items.map((word, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center text-lg font-bold px-3"
                  style={{ height: ROW_HEIGHT }}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
