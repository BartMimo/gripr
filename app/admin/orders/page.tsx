import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase/server'
import type { OrderRow } from '@/lib/types'

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
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

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-bold">
            Fout bij laden van bestellingen
          </h1>
          <p className="mt-2">{error.message}</p>
        </div>
      </main>
    )
  }

  const orders = (data ?? []) as OrderRow[]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Admin
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Bestellingen
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Overzicht van alle zakelijke bestellingen.
        </p>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-stone-600">Er zijn nog geen bestellingen.</p>
        </div>
      ) : (
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Ordernummer
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Bedrijf
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Contactpersoon
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    E-mail
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Totaal excl. btw
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                    Datum
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700" />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      {order.order_number ?? order.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-700">
                      {order.company_name ?? '—'}
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-700">
                      {order.first_name} {order.last_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-700">
                      {order.email}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-700">
                      € {Number(order.total_price).toFixed(2).replace('.', ',')}
                    </td>

                    <td className="px-6 py-4 text-sm text-stone-700">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-stone-900 hover:underline"
                      >
                        Bekijken
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}