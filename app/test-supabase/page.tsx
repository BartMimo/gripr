import { createClient } from '@/lib/supabase/server'

export default async function TestSupabasePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('products').select('*').limit(5)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">Supabase test</h1>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Er ging iets mis</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Connectie gelukt</p>
          <pre className="mt-4 overflow-x-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}