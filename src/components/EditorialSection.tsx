export default function EditorialSection() {
  return (
    <section
      className="border-t py-10 px-6 w-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      <div
        className="max-w-2xl mx-auto"
        style={{ fontFamily: 'var(--font-spectral), Georgia, serif' }}
      >
        <h2
          className="text-xl font-bold mb-6"
          style={{ fontFamily: 'var(--font-cabinet-grotesk), system-ui, sans-serif' }}
        >
          About the Projector
        </h2>

        <p className="leading-relaxed text-sm mb-5">
          Philip Broughton was a program analyst at the U.S. Public Health Service. In May 1968
          he published his <em>Systematic Buzz Phrase Projector</em> in <em>Time</em> magazine —
          a 10×10×10 matrix of management vocabulary where any three-digit number produces a
          grammatically correct, authoritative-sounding phrase that means absolutely nothing.
        </p>

        <blockquote className="relative pl-10 py-1 my-8 italic text-sm leading-relaxed">
          <span
            className="absolute left-0 -top-3 text-7xl leading-none select-none not-italic"
            aria-hidden="true"
            style={{ color: 'var(--color-accent)', opacity: 0.4, fontFamily: 'Georgia, serif' }}
          >
            &ldquo;
          </span>
          No-one will have the remotest idea of what you&rsquo;re talking about. But the
          important thing is that they&rsquo;re not going to admit it.
          <span
            className="block text-xs font-semibold mt-2 not-italic"
            style={{ fontFamily: 'var(--font-cabinet-grotesk), system-ui, sans-serif' }}
          >
            — Philip Broughton, 1968
          </span>
        </blockquote>

        <p className="leading-relaxed text-sm mb-8">
          The original 1968 matrix is still precise. I&rsquo;ve added two new modes for the
          current vocabulary: Modern 2026 draws from AI, cloud architecture, and agile ceremonies;
          Chaos throws both matrices together and lets the collisions speak for themselves.
        </p>

        <details className="group">
          <summary
            className="cursor-pointer text-sm font-semibold select-none list-none flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{
              fontFamily: 'var(--font-cabinet-grotesk), system-ui, sans-serif',
              color: 'var(--color-accent)',
            }}
          >
            <span className="transition-transform group-open:rotate-90 inline-block">▶</span>
            Story of the Build
          </summary>

          <div className="mt-4 space-y-4 pl-4 border-l text-sm leading-relaxed" style={{ borderColor: 'var(--color-border)' }}>
            <p>
              This started as a single-evening idea that turned into three sessions. I didn&rsquo;t
              plan for that. I jumped in with momentum but not much forethought — which meant I
              took no useful notes along the way, hence this retrospective being written after
              the fact.
            </p>
            <p>
              Five specs. Three sessions.
            </p>
            <p>
              Spec 001 handled the core data and state. Spec 002 built the three display skins.
              Spec 003 added the editorial layer. Spec 004 deployed it. Spec 005 delivered the
              shareable links, Space bar shortcut, and easter eggs.
            </p>
            <p>
              The first working prototype had no personality. The words printed on screen in a
              standard font on a white background — technically correct, completely joyless. The
              hardest part of the whole project wasn&rsquo;t the code. It was thinking
              creatively enough to find a more interesting way to present the output: the
              split-flap board, the slot machine reels, the dot-matrix ticker. Once that
              direction existed, the technical work followed.
            </p>
            <p>
              I&rsquo;m honest about my role here. The architecture, animation models, and Web
              Audio synthesis were all Claude&rsquo;s work. What I contributed was direction,
              creative intent, and the occasional firm push back. There were sessions where my
              lack of clear direction led to duplicated effort and inefficient conversations —
              that&rsquo;s still part of how I collaborate with AI, and it&rsquo;s where
              I&rsquo;m still learning. Not just about code, but about how to work with something
              that takes you literally.
            </p>
            <p>
              Nine months in, I can build a working application from a half-baked idea in 48
              hours. That&rsquo;s the thing this project is meant to show.
            </p>
          </div>
        </details>

        <p
          className="text-xs mt-10 pt-4 border-t"
          style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}
        >
          Original concept by Philip Broughton, published in <em>Time</em> magazine, 1968.
        </p>
      </div>
    </section>
  )
}
