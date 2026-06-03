'use client'

import { useBuzzword } from '@/hooks/useBuzzword'
import { useLocalFavourites } from '@/hooks/useLocalFavourites'
import { useAudio } from '@/hooks/useAudio'
import ModeSelector from '@/components/ModeSelector'
import ThemeSelector from '@/components/ThemeSelector'
import GenerateButton from '@/components/GenerateButton'
import ManualInput from '@/components/ManualInput'
import StaticDisplay from '@/components/display/StaticDisplay'
import FavouritesSidebar from '@/components/FavouritesSidebar'

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
        <StaticDisplay
          words={current?.words ?? ['', '', '']}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
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
