'use client'

import { useEffect } from 'react'
import type { DisplayProps } from '@/types'

export default function StaticDisplay({ words, isAnimating, onAnimationComplete }: DisplayProps) {
  useEffect(() => {
    if (isAnimating) {
      onAnimationComplete()
    }
  }, [isAnimating, onAnimationComplete])

  return <p className="text-2xl font-semibold">{words.filter(Boolean).join(' ')}</p>
}
