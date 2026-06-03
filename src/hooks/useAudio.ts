'use client'

import { useState, useRef } from 'react'

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  function playClick() {
    if (isMuted) return

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current

    const sampleCount = 220
    const buffer = ctx.createBuffer(1, sampleCount, 44100)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2000
    filter.Q.value = 1

    source.connect(filter)
    filter.connect(ctx.destination)
    source.start()
  }

  function toggleMute() {
    setIsMuted((prev) => !prev)
  }

  return { playClick, isMuted, toggleMute }
}
