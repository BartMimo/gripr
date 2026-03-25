import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ClearCartOnLoad from '@/components/ClearCartOnLoad'
import { createClient } from '@/lib/supabase/server'
import type { OrderItemRow, OrderRow } from '@/lib/types'

type BevestigingPageProps = {
  searchParams: Promise<{
    order?: string
  }>
}

export default async function BevestigingPage({
  searchParams,
}: BevestigingPageProps) {
  const { order } = await searchParams

  if (!order) {
    notFound()
  }

  const supabase = await createClient()

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', order)
    .single()

  if (orderError || !orderData) {
    notFound()
  }

  const typedOrder = orderData as OrderRow

  const { data: orderItemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', typedOrder.id)
    .order('created_at', { ascending: true })

  if (itemsError) {
    notFound()
  }

  const orderItems = (orderItemsData ?? []) as OrderItemRow[]

  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
        <ClearCartOnLoad />

        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
            Bestelling ontvangen
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Bedankt voor uw bestelling
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-600">
            Uw bestelling is succesvol geplaatst. We gaan er met veel zorg mee
            aan de slag.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Ordernummer</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {typedOrder.order_number}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Bedrijf</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {typedOrder.company_name ?? '—'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
            <p>
              {typedOrder.first_name} {typedOrder.last_name}
            </p>
            <p className="mt-1">{typedOrder.email}</p>
            <p className="mt-1">
              {typedOrder.street} {typedOrder.house_number},{' '}
              {typedOrder.postal_code} {typedOrder.city}
            </p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Uw bestelling</h2>

            <div className="mt-6 space-y-4">
              {orderItems.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-stone-200 p-4"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-stone-900">
                      {item.product_name}
                    </h3>

                    {item.logo_url ? (
                      <p className="mt-1 text-sm text-stone-600">
                        Bestand:{' '}
                        <a
                          href={item.logo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-blue-600 underline"
                        >
                          {item.logo_file_name || 'Bestand bekijken'}
                        </a>
                      </p>
                    ) : null}

                    <p className="mt-1 text-sm text-stone-600">
                      Aantal: <span className="font-medium">{item.quantity}</span>
                    </p>

                    <p className="mt-2 text-sm font-semibold text-stone-900">
                      € {Number(item.line_total).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex items-center justify-between text-stone-600">
              <span>Totaal aantal</span>
              <span className="font-medium text-stone-900">
                {typedOrder.total_items}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-stone-600">
              <span>Totaal excl. btw</span>
              <span className="font-semibold text-stone-900">
                € {Number(typedOrder.total_price).toFixed(2).replace('.', ',')}
              </span>
            </div>
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