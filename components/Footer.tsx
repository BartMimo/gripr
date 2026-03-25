import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo-griprv2.png"
                alt="GRIPR"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-stone-600">
              Premium deurknoppen met uw eigen logo. Ontworpen voor bedrijven,
              kantoren, showrooms en representatieve ruimtes.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C6A16E]">
              Navigatie
            </p>

            <div className="mt-4 space-y-3 text-sm text-stone-600">
              <Link href="/" className="block transition hover:text-stone-900">
                Home
              </Link>

              <Link
                href="/producten"
                className="block transition hover:text-stone-900"
              >
                Producten
              </Link>

              <Link
                href="/over-ons"
                className="block transition hover:text-stone-900"
              >
                Voor bedrijven
              </Link>

              <Link
                href="/contact"
                className="block transition hover:text-stone-900"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#C6A16E]">
              Contact
            </p>

            <p className="mt-4 text-sm leading-7 text-stone-600">
              Neem contact op voor maatwerk, grotere aantallen of een zakelijke
              aanvraag.
            </p>

            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Contact opnemen
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} GRIPR. Alle rechten voorbehouden.</p>

          <div className="flex gap-4">
            <Link href="/contact" className="transition hover:text-stone-700">
              Contact
            </Link>
            <Link href="/over-ons" className="transition hover:text-stone-700">
              Voor bedrijven
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}