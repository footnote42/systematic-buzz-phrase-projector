'use client'

import { useEffect, useRef, useState } from 'react'
import type { DisplayProps } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useAudio } from '@/hooks/useAudio'

type SplitFlapProps = DisplayProps & {
  columnWords: readonly [readonly string[], readonly string[], readonly string[]]
}

const TILE_STAGGER_MS = 30
const FLIP_DURATION_MS = 80
const BASE_TILE_W = 28
const BASE_TILE_H = 40
const BASE_FONT_PX = 18

function padWord(word: string, length: number): string {
  return word.padEnd(length, '-')
}

function getMaxLengths(
  columnWords: readonly [readonly string[], readonly string[], readonly string[]]
): [number, number, number] {
  return [
    Math.max(...columnWords[0].map((w) => w.length), 1),
    Math.max(...columnWords[1].map((w) => w.length), 1),
    Math.max(...columnWords[2].map((w) => w.length), 1),
  ]
}

function computeTileSize(columnWords: readonly [readonly string[], readonly string[], readonly string[]]): {
  width: number
  height: number
  fontSize: number
} {
  const maxLen = Math.max(
    ...columnWords[0].map((w) => w.length),
    ...columnWords[1].map((w) => w.length),
    ...columnWords[2].map((w) => w.length),
    1,
  )
  if (maxLen <= 12) return { width: BASE_TILE_W, height: BASE_TILE_H, fontSize: BASE_FONT_PX }
  const scale = Math.max(16, Math.round(BASE_TILE_W * 12 / maxLen))
  return {
    width: scale,
    height: Math.round(scale * BASE_TILE_H / BASE_TILE_W),
    fontSize: Math.round(scale * BASE_FONT_PX / BASE_TILE_W),
  }
}

interface TileState {
  char: string
  flipping: boolean
  flipPhase: 'top' | 'bottom' | null
}

function makeBlankTiles(maxLengths: [number, number, number]): TileState[][] {
  return maxLengths.map((len) =>
    Array.from({ length: len }, () => ({ char: '-', flipping: false, flipPhase: null }))
  )
}

export default function SplitFlapDisplay({
  words,
  isAnimating,
  onAnimationComplete,
  columnWords,
}: SplitFlapProps) {
  const reducedMotion = useReducedMotion()
  const { playClick } = useAudio()
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([])
  const onCompleteRef = useRef(onAnimationComplete)

  useEffect(() => {
    onCompleteRef.current = onAnimationComplete
  })

  const maxLengths = getMaxLengths(columnWords)
  const tileSize = computeTileSize(columnWords)

  const [tiles, setTiles] = useState<TileState[][]>(() => makeBlankTiles(maxLengths))

  function clearTimeouts() {
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current = []
  }

  useEffect(() => {
    if (!isAnimating) return

    clearTimeouts()

    const targetWords = [
      padWord(words[0], maxLengths[0]),
      padWord(words[1], maxLengths[1]),
      padWord(words[2], maxLengths[2]),
    ]

    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion fast-path: set final state then call completion synchronously
      setTiles(
        targetWords.map((w) =>
          w.split('').map((char) => ({ char, flipping: false, flipPhase: null }))
        )
      )
      onCompleteRef.current()
      return
    }

    let totalTiles = 0
    let completedTiles = 0

    for (let wi = 0; wi < 3; wi++) {
      totalTiles += maxLengths[wi]
    }

    let wordDelay = 0
    for (let wi = 0; wi < 3; wi++) {
      const wordLen = maxLengths[wi]
      const targetChars = targetWords[wi].split('')

      for (let ti = 0; ti < wordLen; ti++) {
        const tileDelay = wordDelay + ti * TILE_STAGGER_MS
        const wordIndex = wi
        const tileIndex = ti
        const targetChar = targetChars[ti]

        // Phase 1: top half folds down
        const id1 = setTimeout(() => {
          playClick()
          setTiles((prev) => {
            const next = prev.map((row) => row.map((t) => ({ ...t })))
            next[wordIndex][tileIndex] = {
              char: prev[wordIndex][tileIndex].char,
              flipping: true,
              flipPhase: 'top',
            }
            return next
          })
        }, tileDelay)
        timeoutIds.current.push(id1)

        // Phase 2: bottom half unfolds with new char
        const id2 = setTimeout(() => {
          setTiles((prev) => {
            const next = prev.map((row) => row.map((t) => ({ ...t })))
            next[wordIndex][tileIndex] = { char: targetChar, flipping: true, flipPhase: 'bottom' }
            return next
          })
        }, tileDelay + FLIP_DURATION_MS / 2)
        timeoutIds.current.push(id2)

        // Phase 3: settle
        const id3 = setTimeout(() => {
          setTiles((prev) => {
            const next = prev.map((row) => row.map((t) => ({ ...t })))
            next[wordIndex][tileIndex] = { char: targetChar, flipping: false, flipPhase: null }
            return next
          })
          completedTiles++
          if (completedTiles === totalTiles) {
            onCompleteRef.current()
          }
        }, tileDelay + FLIP_DURATION_MS)
        timeoutIds.current.push(id3)
      }

      wordDelay += wordLen * TILE_STAGGER_MS + FLIP_DURATION_MS + 60
    }

    return () => {
      clearTimeouts()
    }
  }, [isAnimating, words]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to dashes when words cleared
  useEffect(() => {
    if (words[0] === '' && words[1] === '' && words[2] === '') {
      clearTimeouts()
      // eslint-disable-next-line react-hooks/set-state-in-effect -- empty state reset: synchronous wipe is intentional
      setTiles(makeBlankTiles(maxLengths))
    }
  }, [words[0], words[1], words[2]]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      aria-label="Split-flap display"
      className="flex flex-col sm:flex-row gap-4 items-center justify-center font-mono"
    >
      {tiles.map((panelTiles, wi) => (
        <div key={wi} className="flex gap-0.5" aria-label={`Word ${wi + 1}`}>
          {panelTiles.map((tile, ti) => (
            <div
              key={ti}
              className="relative overflow-hidden bg-gray-900 text-white flex flex-col select-none"
              style={{ width: tileSize.width, height: tileSize.height, perspective: '400px' }}
            >
              {/* Top half */}
              <div
                className="absolute top-0 left-0 w-full h-1/2 overflow-hidden flex items-end justify-center bg-gray-800 text-white font-bold"
                style={{
                  transformOrigin: 'bottom center',
                  backfaceVisibility: 'hidden',
                  animation:
                    tile.flipping && tile.flipPhase === 'top'
                      ? `flipTop ${FLIP_DURATION_MS / 2}ms ease-in forwards`
                      : undefined,
                }}
              >
                <span className="leading-none pb-0.5" style={{ fontSize: tileSize.fontSize }}>{tile.char.toUpperCase()}</span>
              </div>

              {/* Bottom half */}
              <div
                className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden flex items-start justify-center bg-gray-700 text-white font-bold"
                style={{
                  transformOrigin: 'top center',
                  backfaceVisibility: 'hidden',
                  animation:
                    tile.flipping && tile.flipPhase === 'bottom'
                      ? `flipBottom ${FLIP_DURATION_MS / 2}ms ease-out forwards`
                      : undefined,
                }}
              >
                <span className="leading-none pt-0.5" style={{ fontSize: tileSize.fontSize }}>{tile.char.toUpperCase()}</span>
              </div>

              {/* Divider */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-black z-10" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
