
import CategoryForm from '@/components/admin/CategoryForm'
import CategoryRowActions from '@/components/admin/CategoryRowActions'
import { createClient } from '@/lib/supabase/server'
import type { CategoryRow } from '@/lib/types'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-bold">Fout bij laden van categorieën</h1>
          <p className="mt-2">{error.message}</p>
        </div>
      </main>
    )
  }

  const categories = (data ?? []) as CategoryRow[]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
          Admin
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Categorieën
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          Beheer hier de categorieën van je webshop.
        </p>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Nieuwe categorie</h2>
          <p className="mt-2 text-stone-600">
            Voeg een nieuwe categorie toe voor je producten.
          </p>

          <div className="mt-6">
            <CategoryForm />
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Bestaande categorieën</h2>

          {categories.length === 0 ? (
            <p className="mt-6 text-stone-600">
              Er zijn nog geen categorieën.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {categories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-stone-900">
                          {category.name}
                        </h3>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            category.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {category.active ? 'Actief' : 'Inactief'}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-stone-500">
                        Slug: {category.slug}
                      </p>

                      {category.description ? (
                        <p className="mt-3 text-stone-600">
                          {category.description}
                        </p>
                      ) : null}

                      <p className="mt-3 text-sm text-stone-500">
                        Sorteervolgorde: {category.sort_order}
                      </p>
                    </div>

                    <div className="lg:w-[320px]">
                      <CategoryRowActions category={category} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}