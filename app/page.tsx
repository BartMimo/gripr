import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  default_image_url: string | null
}

function formatPrice(price: number) {
  return `€ ${price.toFixed(2).replace('.', ',')}`
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, slug, name, description, price, default_image_url')
    .eq('active', true)
    .limit(6)

  const featured = (products ?? []) as Product[]

  return (
    <main className="bg-[#F8F8F7] text-[#111111]">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#C6A16E]">
            GRIPR
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight text-[#111111] sm:text-6xl">
            Deurknoppen met uw eigen logo
          </h1>

          <p className="mt-6 text-lg leading-8 text-stone-600">
            Een premium en herkenbare uitstraling voor kantoor, showroom of
            bedrijfsruimte. Upload eenvoudig uw logo en bestel gepersonaliseerde
            deurknoppen direct online.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/producten"
              className="rounded-2xl bg-[#111111] px-6 py-3 text-white transition hover:opacity-90"
            >
              Bekijk producten
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-stone-300 bg-white px-6 py-3 text-[#111111] transition hover:bg-stone-100"
            >
              Offerte aanvragen
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111111]">
                Logo uploaden
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Voeg uw ontwerp eenvoudig toe
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111111]">
                Premium uitstraling
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Voor bedrijven en professionals
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111111]">
                Maatwerk mogelijk
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Afwerking en uitvoering op aanvraag
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-stone-100">
            <Image
              src="/images/herov2.jpg"
              alt="GRIPR deurknoppen"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-[#111111]">Professionele afwerking</p>
            <p className="mt-1 text-stone-600">
              Ontworpen voor een sterke merkuitstraling
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#111111]">Zakelijke toepassing</p>
            <p className="mt-1 text-stone-600">
              Geschikt voor kantoor, showroom en hospitality
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#111111]">Eenvoudig proces</p>
            <p className="mt-1 text-stone-600">
              Kies een model, upload uw logo en bestel direct
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Zo werkt het
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111]">
            Van logo naar premium eindresultaat
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-[#C6A16E]">01</p>
            <h3 className="mt-3 text-lg font-semibold">Kies uw model</h3>
            <p className="mt-2 leading-7 text-stone-600">
              Selecteer de deurknop die past bij uw ruimte en uitstraling.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-[#C6A16E]">02</p>
            <h3 className="mt-3 text-lg font-semibold">Upload uw logo</h3>
            <p className="mt-2 leading-7 text-stone-600">
              Voeg uw logo of ontwerpbestand toe tijdens het bestellen.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold text-[#C6A16E]">03</p>
            <h3 className="mt-3 text-lg font-semibold">Wij produceren</h3>
            <p className="mt-2 leading-7 text-stone-600">
              Wij verzorgen een strak en representatief eindresultaat.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
              Collectie
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111]">
              Populaire producten
            </h2>
          </div>

          <Link
            href="/producten"
            className="text-sm font-medium text-stone-700 transition hover:text-[#111111]"
          >
            Alles bekijken
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-stone-600">
              Er zijn nog geen producten beschikbaar.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/producten/${product.slug}`}
                className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-square bg-stone-100">
                  <Image
                    src={
                      product.default_image_url ??
                      '/images/placeholder-product.jpg'
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#111111]">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                    {product.description ?? 'Premium gepersonaliseerde deurknop'}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-semibold text-[#111111]">
                      {formatPrice(product.price)}
                    </p>

                    <span className="rounded-2xl bg-[#111111] px-4 py-2 text-sm font-medium text-white">
                      Bekijk
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
                Voor bedrijven
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl">
                Geef uw merk een tastbare, onderscheidende uitstraling
              </h2>
              <p className="mt-4 max-w-2xl text-stone-600">
                GRIPR helpt bedrijven om ruimtes, meubels en entrees een premium
                en herkenbaar karakter te geven met gepersonaliseerde
                deurknoppen.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/producten"
                className="rounded-2xl bg-[#111111] px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Start bestelling
              </Link>

              <Link
                href="/contact"
                className="rounded-2xl border border-stone-300 bg-white px-6 py-3 font-medium text-[#111111] transition hover:bg-stone-100"
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