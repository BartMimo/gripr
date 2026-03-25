import Link from 'next/link'
import ClearCartOnLoad from '@/components/ClearCartOnLoad'

type BevestigingBetaaldPageProps = {
  searchParams: Promise<{
    order?: string
  }>
}

export default async function BevestigingBetaaldPage({
  searchParams,
}: BevestigingBetaaldPageProps) {
  const { order } = await searchParams

  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
        <ClearCartOnLoad />

        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Betaling ontvangen
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Bedankt voor uw bestelling
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-600">
            Uw betaling is succesvol ontvangen. We gaan aan de slag met uw
            bestelling en het aangeleverde bestand.
          </p>

          {order ? (
            <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Ordernummer</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {order}
              </p>
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm leading-7 text-stone-600">
              U ontvangt binnenkort een bevestiging per e-mail. We nemen contact
              op als er iets nodig is voor de verwerking van uw logo of
              ontwerpbestand.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-2xl bg-stone-900 px-6 py-3 text-white transition hover:opacity-90"
            >
              Terug naar home
            </Link>

            <Link
              href="/producten"
              className="rounded-2xl border border-stone-300 bg-white px-6 py-3 text-stone-900 transition hover:bg-stone-100"
            >
              Verder winkelen
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}