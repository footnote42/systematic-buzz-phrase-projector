'use client'

import { useEffect } from 'react'
import { useBuzzword } from '@/hooks/useBuzzword'
import { useLocalFavourites } from '@/hooks/useLocalFavourites'
import { useAudio } from '@/hooks/useAudio'
import { ORIGINAL_MATRIX, MODERN_MATRIX, CHAOS_MATRIX } from '@/constants/buzzwords'
import ModeSelector from '@/components/ModeSelector'
import ThemeSelector from '@/components/ThemeSelector'
import GenerateButton from '@/components/GenerateButton'
import ManualInput from '@/components/ManualInput'
import SplitFlapDisplay from '@/components/display/SplitFlapDisplay'
import SlotMachineDisplay from '@/components/display/SlotMachineDisplay'
import DotMatrixDisplay from '@/components/display/DotMatrixDisplay'
import FavouritesSidebar from '@/components/FavouritesSidebar'
import EditorialSection from '@/components/EditorialSection'
import type { Theme, DisplayProps, Mode } from '@/types'
import type React from 'react'

type ColumnWords = readonly [readonly string[], readonly string[], readonly string[]]

type SkinProps = DisplayProps & { columnWords?: ColumnWords }

const SKIN_MAP: Record<Theme, React.ComponentType<SkinProps>> = {
  splitflap: SplitFlapDisplay as React.ComponentType<SkinProps>,
  slotmachine: SlotMachineDisplay as React.ComponentType<SkinProps>,
  dotmatrix: DotMatrixDisplay as React.ComponentType<SkinProps>,
}

const MANUAL_HINT: Record<Mode, string> = {
  original: 'Each digit (0–9) picks one word per column.',
  modern: 'Each digit (0–9) picks one word per column.',
  chaos: 'Each digit (0–9) picks from both matrices. Random covers 0–19.',
}

function getColumnWords(mode: Mode): ColumnWords {
  const matrix = mode === 'original' ? ORIGINAL_MATRIX : mode === 'modern' ? MODERN_MATRIX : CHAOS_MATRIX
  return [matrix.column1, matrix.column2, matrix.column3]
}

export default function BuzzPhraseApp() {
  const {
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
  } = useBuzzword()

  const { favourites, toggleFavourite, isFavourited, sidebarOpen, setSidebarOpen } =
    useLocalFavourites()

  const { toggleMute, isMuted } = useAudio()

  // T004 — Space bar generates a new phrase; guard against input fields
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== ' ') return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      event.preventDefault()
      generate()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [generate])

  const isFavd = current ? isFavourited(current.id) : false
  const ActiveSkin = SKIN_MAP[theme]
  const columnWords = getColumnWords(mode)

  return (
    <div
      data-skin={theme}
      className="flex flex-col min-h-screen relative bg-[var(--color-base)] text-[var(--color-text)]"
    >
      {/* Navigation */}
      <nav className="w-full px-6 pt-5 pb-2">
        <div className="max-w-2xl mx-auto">
          <a
            href="https://waynetellis.com/workshop"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors tracking-wide"
          >
            ← Workshop
          </a>
        </div>
      </nav>

      <main className="flex flex-col flex-1 items-center justify-center p-8 gap-8 max-w-2xl mx-auto w-full">
        <div className="text-center w-full flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cabinet-grotesk)] tracking-tight text-[var(--color-text)]">
            Systematic Buzz Phrase Projector
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md">
            {"A digital homage to Philip Broughton's 1968 management-jargon matrix."}
          </p>
        </div>

        <ModeSelector mode={mode} onModeChange={setMode} />

        <div className="flex items-center gap-4">
          <ThemeSelector theme={theme} onThemeChange={setTheme} />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>

        <section aria-label="Phrase display" className="min-h-16 flex items-center justify-center">
          <ActiveSkin
            key={mode}
            words={current?.words ?? ['', '', '']}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
            columnWords={columnWords}
          />
        </section>

        <div className="flex flex-col items-center gap-4">
          <GenerateButton onGenerate={generate} disabled={isAnimating} />
          <ManualInput
            onSubmit={submitCode}
            validationError={validationError}
            disabled={isAnimating}
            hint={MANUAL_HINT[mode]}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => current && toggleFavourite(current)}
            disabled={!current}
            aria-label={isFavd ? 'Remove from favourites' : 'Save to favourites'}
            aria-pressed={isFavd}
            className="text-2xl disabled:opacity-30 transition-opacity text-[var(--color-accent)]"
          >
            {isFavd ? '★' : '☆'}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Saved ★ {favourites.length}
          </button>
        </div>

        <FavouritesSidebar
          phrases={favourites}
          onRemove={(id) => {
            const phrase = favourites.find((p) => p.id === id)
            if (phrase) toggleFavourite(phrase)
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </main>

      <EditorialSection />
    </div>
  )
}
