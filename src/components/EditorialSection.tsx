export default function EditorialSection() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-10 px-6 w-full">
      <div className="max-w-2xl mx-auto space-y-6 text-gray-900 leading-relaxed text-sm">
        <h2 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)]">
          About the Projector
        </h2>
        <p>
          Philip Broughton, a program analyst at the U.S. Public Health Service, published his <em>Systematic Buzz Phrase Projector</em> in <em>Time</em> magazine on 13 May 1968. Frustrated by impenetrable bureaucratic jargon, he built a satirical 10×10×10 matrix of management vocabulary. Any three-digit number maps to a grammatically correct, authoritative-sounding phrase that is entirely devoid of meaning.
        </p>
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
          {"\"No-one will have the remotest idea of what you're talking about. But the important thing is that they're not going to admit it.\""}
          <span className="block text-xs font-semibold text-gray-500 mt-1">
            — Philip Broughton, 1968
          </span>
        </blockquote>
        <p>
          {"As a systems engineer who has navigated the corporate landscape, I felt the original 1968 jargon matrix, while brilliant, deserved an update for our modern era of AI, cloud computing, and agile frameworks. The Modern 2026 and Chaos modes are my additions to Philip Broughton's classic satire, bringing his concept into the 21st century."}
        </p>
        <p className="text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
          Original concept by Philip Broughton, published in <em>Time</em> magazine, 1968.
        </p>
      </div>
    </section>
  )
}
