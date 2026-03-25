import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase/server'
import type { OrderItemRow, OrderRow } from '@/lib/types'

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}

function formatEuro(amount: number) {
  return `€ ${Number(amount).toFixed(2).replace('.', ',')}`
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-stone-100 text-stone-700'
  }
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (orderError || !orderData) {
    notFound()
  }

  const order = orderData as OrderRow

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true })

  if (itemsError) {
    notFound()
  }

  const items = (itemsData ?? []) as OrderItemRow[]

  const totalExclVat = items.reduce((sum, item) => sum + Number(item.line_total), 0)

  const totalVat = items.reduce((sum, item) => {
    const productTotalIncl =
      order.total_items > 0 && order.total_price > 0
        ? null
        : null
    return sum + 0
  }, 0)

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Bestelling {order.order_number ?? order.id}
        </h1>

        <p className="mt-4 text-lg text-stone-600">
          Bekijk hier alle details van deze bestelling.
        </p>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="mt-8">
        <Link
          href="/admin/orders"
          className="inline-flex rounded-2xl border border-stone-300 bg-white px-5 py-3 transition hover:bg-stone-100"
        >
          Terug naar overzicht
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Klantgegevens</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Bedrijf" value={order.company_name ?? '—'} />
            <InfoCard
              label="Contactpersoon"
              value={`${order.first_name} ${order.last_name}`}
            />
            <InfoCard label="E-mail" value={order.email} />
            <InfoCard
              label="Adres"
              value={`${order.street} ${order.house_number}`}
            />
            <InfoCard
              label="Postcode / plaats"
              value={`${order.postal_code} ${order.city}`}
            />
            <InfoCard label="Besteld op" value={formatDate(order.created_at)} />
          </div>
        </section>

        <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Orderstatus</h2>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-stone-500">Status</p>
              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-stone-500">Totaal aantal</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {order.total_items}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Totaal excl. btw</p>
              <p className="mt-1 text-lg font-semibold text-stone-900">
                {formatEuro(order.total_price)}
              </p>
            </div>

            {order.paid_at ? (
              <div>
                <p className="text-sm text-stone-500">Betaald op</p>
                <p className="mt-1 text-stone-900">{formatDate(order.paid_at)}</p>
              </div>
            ) : null}

            {order.stripe_session_id ? (
              <div>
                <p className="text-sm text-stone-500">Stripe session</p>
                <p className="mt-1 break-all text-sm text-stone-700">
                  {order.stripe_session_id}
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Bestelde producten</h2>

        <div className="mt-6 space-y-5">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-stone-200 p-5"
            >
              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-stone-100">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6A16E]">
                      {item.product_category}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-stone-900">
                      {item.product_name}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm text-stone-600">
                      <p>
                        Aantal:{' '}
                        <span className="font-medium text-stone-900">
                          {item.quantity}
                        </span>
                      </p>
                      <p>
                        Prijs per stuk excl. btw:{' '}
                        <span className="font-medium text-stone-900">
                          {formatEuro(Number(item.unit_price))}
                        </span>
                      </p>
                      <p>
                        Regel totaal excl. btw:{' '}
                        <span className="font-medium text-stone-900">
                          {formatEuro(Number(item.line_total))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-sm font-medium text-stone-800">Bestand</p>

                  {item.logo_url ? (
                    <div className="mt-3 space-y-3">
                      <a
                        href={item.logo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm transition hover:bg-stone-100"
                      >
                        Open bestand
                      </a>

                      <p className="break-all text-sm text-stone-600">
                        {item.logo_file_name || item.logo_url}
                      </p>

                      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-2">
                        <img
                          src={item.logo_url}
                          alt={item.logo_file_name || 'Bestand'}
                          className="max-h-40 w-full object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-stone-500">
                      Er is geen logo of ontwerpbestand meegestuurd.
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Samenvatting</h2>

        <div className="mt-6 max-w-md space-y-3">
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>Totaal aantal</span>
            <span className="font-medium text-stone-900">{order.total_items}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>Totaal excl. btw</span>
            <span className="font-medium text-stone-900">
              {formatEuro(totalExclVat)}
            </span>
          </div>

          <div className="border-t border-stone-200 pt-3 text-sm text-stone-500">
            Deze bestelling gebruikt momenteel de opgeslagen orderregels excl. btw.
            Bij de volgende stap kunnen we dit uitbreiden met expliciete btw-bedragen
            en factuurgegevens per order.
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-stone-900">{value}</p>
    </div>
  )
}