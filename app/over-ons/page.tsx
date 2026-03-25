import Link from 'next/link'

export default function OverOnsPage() {
  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Voor bedrijven
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Gepersonaliseerde knoppen voor een sterke merkuitstraling
          </h1>

          <p className="mt-6 text-lg leading-8 text-stone-600">
            GRIPR helpt bedrijven om ruimtes, entrees en interieurs een
            herkenbare en premium uitstraling te geven met deurknoppen op maat.
            Upload uw logo of ontwerp en creëer een onderscheidend detail dat
            direct opvalt.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Voor kantoren</h2>
            <p className="mt-3 leading-7 text-stone-600">
              Geef werkruimtes, vergaderkamers en entrees een professionele en
              consistente uitstraling.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Voor showrooms</h2>
            <p className="mt-3 leading-7 text-stone-600">
              Versterk uw merkbeleving met tastbare details die passen bij uw
              interieur en presentatie.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Voor hospitality</h2>
            <p className="mt-3 leading-7 text-stone-600">
              Zorg voor een verfijnde, hoogwaardige afwerking in hotels,
              ontvangstruimtes en representatieve locaties.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
              Werkwijze
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Eenvoudig van aanvraag naar eindresultaat
            </h2>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-[#C6A16E]">01</p>
              <h3 className="mt-3 text-lg font-semibold">
                Kies het gewenste product
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                Selecteer een deurknop die past bij uw ruimte, stijl en
                toepassing.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-[#C6A16E]">02</p>
              <h3 className="mt-3 text-lg font-semibold">
                Upload uw logo of ontwerpbestand
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                Lever uw bestand eenvoudig aan tijdens het bestellen. Voor het
                beste resultaat ontvangen we bij voorkeur een scherp of vector
                bestand.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-2xl font-bold text-[#C6A16E]">03</p>
              <h3 className="mt-3 text-lg font-semibold">
                Wij verzorgen de afwerking
              </h3>
              <p className="mt-2 leading-7 text-stone-600">
                Wij zorgen voor een nette, professionele afwerking die aansluit
                bij uw merk en interieur.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
                Maatwerk
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Ook geschikt voor grotere aantallen en zakelijke aanvragen
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-stone-600">
                Heeft u meerdere locaties, een groter project of specifieke
                wensen voor afwerking, formaat of toepassing? Dan denken we
                graag mee over een passende oplossing.
              </p>
            </div>

            <div className="rounded-3xl bg-stone-50 p-6">
              <h3 className="text-lg font-semibold">Geschikt voor</h3>
              <ul className="mt-4 space-y-3 text-stone-600">
                <li>• Grotere zakelijke bestellingen</li>
                <li>• Branding van kantoor- en ontvangstruimtes</li>
                <li>• Showrooms en presentatieruimtes</li>
                <li>• Interieurprojecten en maatwerktoepassingen</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-stone-900 px-8 py-12 text-white shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Bespreek uw aanvraag met GRIPR
              </h2>
              <p className="mt-4 max-w-2xl text-stone-300">
                Neem contact op voor maatwerk, grotere aantallen of een
                specifieke toepassing binnen uw bedrijf of project.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/producten"
                className="rounded-2xl bg-white px-6 py-3 font-medium text-stone-900 transition hover:opacity-90"
              >
                Bekijk producten
              </Link>

              <Link
                href="/contact"
                className="rounded-2xl border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}