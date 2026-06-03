'use client'

import { useState } from 'react'

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)

  function playClick() {
    // no-op stub — full Web Audio synthesis in spec 002
  }

  function toggleMute() {
    setIsMuted((prev) => !prev)
  }

  return { playClick, isMuted, toggleMute }
}
