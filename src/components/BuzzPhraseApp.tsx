'use client'

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
import type { Theme, DisplayProps, Mode } from '@/types'
import type React from 'react'

type ColumnWords = readonly [readonly string[], readonly string[], readonly string[]]

type SkinProps = DisplayProps & { columnWords?: ColumnWords }

const SKIN_MAP: Record<Theme, React.ComponentType<SkinProps>> = {
  splitflap: SplitFlapDisplay as React.ComponentType<SkinProps>,
  slotmachine: SlotMachineDisplay as React.ComponentType<SkinProps>,
  dotmatrix: DotMatrixDisplay as React.ComponentType<SkinProps>,
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

  const isFavd = current ? isFavourited(current.id) : false
  const ActiveSkin = SKIN_MAP[theme]
  const columnWords = getColumnWords(mode)

  return (
    <main className="flex flex-col flex-1 items-center justify-center p-8 gap-8 max-w-2xl mx-auto w-full">
      <header className="w-full flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Systematic Buzz Phrase Projector</h1>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </header>

      <ModeSelector mode={mode} onModeChange={setMode} />
      <ThemeSelector theme={theme} onThemeChange={setTheme} />

      <section aria-label="Phrase display" className="min-h-16 flex items-center justify-center">
        <ActiveSkin
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
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => current && toggleFavourite(current)}
          disabled={!current}
          aria-label={isFavd ? 'Remove from favourites' : 'Save to favourites'}
          aria-pressed={isFavd}
          className="text-2xl disabled:opacity-30 transition-opacity"
        >
          {isFavd ? '★' : '☆'}
        </button>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="text-sm font-medium hover:underline"
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
  )
}
