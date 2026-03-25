'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'
import CheckoutForm from '@/components/CheckoutForm'

function parsePrice(price: string) {
  return Number(price.replace('€', '').replace(',', '.').trim())
}

function formatEuro(amount: number) {
  return `€ ${amount.toFixed(2).replace('.', ',')}`
}

export default function CheckoutPage() {
  const { items, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <main className="bg-[#F8F8F7] text-stone-900">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">Uw winkelwagen is leeg</h1>
            <p className="mt-4 text-stone-600">
              Voeg eerst een product toe voordat u kunt afrekenen.
            </p>
            <Link
              href="/producten"
              className="mt-6 inline-flex rounded-2xl bg-stone-900 px-6 py-3 text-white transition hover:opacity-90"
            >
              Bekijk producten
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const totalExclVat = items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity
  }, 0)

  const totalVat = items.reduce((sum, item) => {
    const lineExclVat = parsePrice(item.price) * item.quantity
    return sum + lineExclVat * (item.vatRate / 100)
  }, 0)

  const totalInclVat = totalExclVat + totalVat

  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Checkout
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Gegevens en afrekening
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            Vul hieronder uw gegevens in om uw bestelling af te ronden.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <CheckoutForm />
          </section>

          <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-semibold text-stone-900">
              Uw bestelling
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              {totalItems} {totalItems === 1 ? 'product' : 'producten'}
            </p>

            <div className="mt-6 space-y-4">
              {items.map((item) => {
  const lineExclVat = parsePrice(item.price) * item.quantity
  const lineVat = lineExclVat * (item.vatRate / 100)
  const lineInclVat = lineExclVat + lineVat

  return (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-stone-200 p-4"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-stone-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-stone-600">
                        Bestand:{' '}
                        <a
                          href={item.logoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-600 underline"
                        >
                          {item.logoFileName || 'Bestand bekijken'}
                        </a>
                      </p>

                      <p className="mt-1 text-sm text-stone-600">
                        Aantal: <span className="font-medium">{item.quantity}</span>
                      </p>

                      <p className="mt-1 text-sm text-stone-600">
                        Btw: <span className="font-medium">{item.vatRate}%</span>
                      </p>

                      <div className="mt-2 space-y-1 text-sm">
  <p className="text-stone-600">
    Excl. btw:{' '}
    <span className="font-medium text-stone-900">
      {formatEuro(lineExclVat)}
    </span>
  </p>

  <p className="text-stone-600">
    Incl. btw:{' '}
    <span className="font-semibold text-stone-900">
      {formatEuro(lineInclVat)}
    </span>
  </p>
</div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6 space-y-3">
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>Totaal excl. btw</span>
                <span className="font-medium text-stone-900">
                  {formatEuro(totalExclVat)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>Btw</span>
                <span className="font-medium text-stone-900">
                  {formatEuro(totalVat)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-base">
                <span className="font-semibold text-stone-900">Totaal incl. btw</span>
                <span className="font-semibold text-stone-900">
                  {formatEuro(totalInclVat)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}