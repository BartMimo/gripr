import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Neem contact op met GRIPR
          </h1>

          <p className="mt-6 text-lg leading-8 text-stone-600">
            Heeft u vragen over maatwerk, grotere aantallen of een specifieke
            zakelijke toepassing? We denken graag met u mee.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Zakelijke aanvragen</h2>
            <p className="mt-4 leading-8 text-stone-600">
              GRIPR is geschikt voor bedrijven, showrooms, ontvangstruimtes,
              interieurprojecten en andere toepassingen waarbij uitstraling en
              merkbeleving belangrijk zijn.
            </p>

            <div className="mt-8 space-y-4 text-stone-700">
              <p>
                <span className="font-medium">Waarvoor kunt u contact opnemen?</span>
              </p>
              <ul className="space-y-2 text-stone-600">
                <li>• Grotere aantallen</li>
                <li>• Maatwerk of speciale afwerkingen</li>
                <li>• Branding met uw eigen logo</li>
                <li>• Zakelijke of projectmatige toepassingen</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Direct contact</h2>

            <div className="mt-6 space-y-5 text-stone-700">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#C6A16E]">
                  E-mail
                </p>
                <p className="mt-2 text-stone-600">
                  info@gripr.nl
                </p>
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#C6A16E]">
                  Reactietijd
                </p>
                <p className="mt-2 text-stone-600">
                  We reageren doorgaans binnen 1 werkdag.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#C6A16E]">
                  Hulp nodig met uw bestand?
                </p>
                <p className="mt-2 text-stone-600">
                  Stuur gerust uw logo of ontwerpbestand mee bij uw aanvraag. We
                  kijken graag met u mee.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/producten"
                className="inline-flex rounded-2xl bg-stone-900 px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Bekijk producten
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-stone-900 px-8 py-12 text-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
                GRIPR
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Premium deurknoppen met een herkenbare uitstraling
              </h2>
              <p className="mt-4 max-w-2xl text-stone-300">
                Voor bedrijven die oog hebben voor detail, kwaliteit en een
                consistente merkbeleving.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/producten"
                className="rounded-2xl bg-white px-6 py-3 font-medium text-stone-900 transition hover:opacity-90"
              >
                Start bestelling
              </Link>

              <Link
                href="/over-ons"
                className="rounded-2xl border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Voor bedrijven
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}