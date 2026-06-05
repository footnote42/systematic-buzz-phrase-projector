'use client'

import { useState, useRef } from 'react'

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }

  function playClick() {
    if (isMuted) return
    const ctx = getCtx()

    const sampleCount = 660
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

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(1.0, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }

  // Two descending sine tones on slot machine settle (~800 Hz → 600 Hz, 80 ms each)
  function playSettle() {
    if (isMuted) return
    const ctx = getCtx()

    const freqs = [800, 600]
    const noteDuration = 0.08

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq

      const startTime = ctx.currentTime + i * noteDuration
      gain.gain.setValueAtTime(0.3, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + noteDuration + 0.01)
    })
  }

  // Short square-wave pulse per dot-matrix character reveal (~400 Hz, ~2 ms)
  function playTick() {
    if (isMuted) return
    const ctx = getCtx()

    const sampleCount = Math.floor(44100 * 0.002)
    const buffer = ctx.createBuffer(1, sampleCount, 44100)
    const data = buffer.getChannelData(0)
    const halfPeriod = Math.floor(44100 / 800) // half-period for 400 Hz square wave
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.floor(i / halfPeriod) % 2 === 0 ? 0.15 : -0.15)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.002)

    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }

  function toggleMute() {
    setIsMuted((prev) => !prev)
  }

  return { playClick, playSettle, playTick, isMuted, toggleMute }
}
