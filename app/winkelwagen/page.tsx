'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartProvider'

function parsePrice(price: string) {
  return Number(price.replace('€', '').replace(',', '.').trim())
}

function formatEuro(amount: number) {
  return `€ ${amount.toFixed(2).replace('.', ',')}`
}

export default function WinkelwagenPage() {
  const {
    items,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Winkelwagen
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Uw bestelling
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            Controleer hieronder uw producten, aantallen en geüploade bestanden.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-stone-600">Uw winkelwagen is nog leeg.</p>

            <Link
              href="/producten"
              className="mt-6 inline-flex rounded-2xl bg-stone-900 px-6 py-3 text-white transition hover:opacity-90"
            >
              Bekijk producten
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="space-y-5">
              {items.map((item) => {
                const lineExclVat = parsePrice(item.price) * item.quantity
                const lineVat = lineExclVat * (item.vatRate / 100)
                const lineInclVat = lineExclVat + lineVat

                return (
                  <article
                    key={item.id}
                    className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-stone-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6A16E]">
                            {item.category}
                          </p>

                          <h2 className="mt-2 text-xl font-semibold text-stone-900">
                            {item.name}
                          </h2>

                          <p className="mt-2 text-sm text-stone-600">
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

                          <p className="mt-2 text-sm text-stone-600">
                            Prijs per stuk:{' '}
                            <span className="font-medium text-stone-900">
                              {item.price}
                            </span>{' '}
                            <span className="text-stone-500">
                              excl. btw ({item.vatRate}%)
                            </span>
                          </p>

                          <p className="mt-2 text-sm text-stone-600">
                            Subtotaal excl. btw:{' '}
                            <span className="font-medium text-stone-900">
                              {formatEuro(lineExclVat)}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-stone-600">
                            Btw:{' '}
                            <span className="font-medium text-stone-900">
                              {formatEuro(lineVat)}
                            </span>
                          </p>

                          <p className="mt-1 text-sm font-semibold text-stone-900">
                            Subtotaal incl. btw: {formatEuro(lineInclVat)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 lg:items-end">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-stone-900">
                            Aantal
                          </label>

                          <div className="flex items-center overflow-hidden rounded-2xl border border-stone-300 bg-white">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-stone-100"
                            >
                              −
                            </button>

                            <span className="flex h-11 min-w-[52px] items-center justify-center border-x border-stone-300 text-sm font-medium">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="flex h-11 w-11 items-center justify-center text-lg transition hover:bg-stone-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">
                Overzicht
              </h2>

              <div className="mt-6 space-y-3">
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
                  <span className="font-semibold text-stone-900">
                    Totaal incl. btw
                  </span>
                  <span className="font-semibold text-stone-900">
                    {formatEuro(totalInclVat)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-2xl bg-stone-900 px-4 py-3 text-center font-medium text-white transition hover:opacity-90"
              >
                Doorgaan naar afrekenen
              </Link>

              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Winkelwagen legen
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}