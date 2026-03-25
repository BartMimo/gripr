import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Admin
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          GRIPR beheer
        </h1>

        <p className="mt-4 text-lg text-stone-600">
          Beheer hier producten, bestellingen en andere onderdelen van uw webshop.
        </p>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#C6A16E]">
            Producten
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-900">
            Productbeheer
          </h2>
          <p className="mt-3 leading-7 text-stone-600">
            Voeg producten toe, bewerk prijzen, btw-percentages en afbeeldingen.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#C6A16E]">
            Bestellingen
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-900">
            Orderbeheer
          </h2>
          <p className="mt-3 leading-7 text-stone-600">
            Bekijk zakelijke bestellingen, klantgegevens en geüploade bestanden.
          </p>
        </Link>
      </div>
    </main>
  )
}