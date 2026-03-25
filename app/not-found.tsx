import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold">Product niet gevonden</h1>
      <p className="mt-4 text-stone-600">
        Het product dat je zoekt bestaat niet of is niet meer beschikbaar.
      </p>
      <Link
        href="/producten"
        className="mt-8 inline-block rounded-2xl bg-stone-900 px-6 py-3 text-white"
      >
        Terug naar producten
      </Link>
    </main>
  )
}