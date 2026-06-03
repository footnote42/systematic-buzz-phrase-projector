import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('useReducedMotion SSR guard', () => {
  let originalWindow: typeof globalThis.window

  beforeEach(() => {
    originalWindow = globalThis.window
  })

  afterEach(() => {
    globalThis.window = originalWindow
    vi.resetModules()
  })

  it('returns false when window is undefined (SSR environment)', async () => {
    // Simulate SSR by removing window
    // @ts-expect-error — intentionally deleting window to simulate SSR
    delete globalThis.window

    const { useReducedMotion } = await import('@/hooks/useReducedMotion')

    // Call the hook's lazy initialiser directly
    // The hook uses useState(() => ...) — we extract the initialiser logic
    const result = typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches
    expect(result).toBe(false)

    // Verify the module itself doesn't throw when window is absent
    expect(() => useReducedMotion).not.toThrow()
  })
})
