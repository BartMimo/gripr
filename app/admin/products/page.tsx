import ProductForm from '@/components/admin/ProductForm'
import ProductRowActions from '@/components/admin/ProductRowActions'
import AdminNav from '@/components/admin/AdminNav'
import { createClient } from '@/lib/supabase/server'
import type { CategoryRow, ProductRow } from '@/lib/types'

function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const [
    { data: productsData, error: productsError },
    { data: categoriesData, error: categoriesError },
  ] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
  ])

  if (productsError || categoriesError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-bold">Fout bij laden van producten</h1>
          <p className="mt-2">{productsError?.message || categoriesError?.message}</p>
        </div>
      </main>
    )
  }

  const products = (productsData ?? []) as ProductRow[]
  const categories = (categoriesData ?? []) as CategoryRow[]
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]))

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Admin
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Producten</h1>
        <p className="mt-4 text-lg text-stone-600">
          Beheer hier de producten van je webshop.
        </p>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[460px_1fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Nieuw product</h2>
          <p className="mt-2 text-stone-600">Voeg een nieuw product toe aan je webshop.</p>

          <div className="mt-6">
            <ProductForm categories={categories} />
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Bestaande producten</h2>

          {products.length === 0 ? (
            <p className="mt-6 text-stone-600">Er zijn nog geen producten.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-stone-200 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-stone-900">
                          {product.name}
                        </h3>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            product.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {product.active ? 'Actief' : 'Inactief'}
                        </span>

                        {product.featured ? (
                          <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
                            Uitgelicht
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm text-stone-500">Slug: {product.slug}</p>

                      <p className="mt-2 text-sm text-stone-500">
                        Categorie:{' '}
                        {product.category_id
                          ? categoryMap.get(product.category_id) ?? 'Onbekend'
                          : 'Geen categorie'}
                      </p>

                      <div className="mt-2 space-y-1">
                        <p className="font-medium text-stone-900">
                          Excl. btw: {formatPrice(product.price_excl_vat ?? product.price ?? 0)}
                        </p>
                        <p className="text-sm text-stone-600">
                          Btw: {product.vat_rate ?? 21}%
                        </p>
                        <p className="text-sm text-stone-600">
                          Incl. btw: {formatPrice(product.price_incl_vat ?? 0)}
                        </p>
                      </div>

                      {product.description ? (
                        <p className="mt-3 text-stone-600">{product.description}</p>
                      ) : null}

                      <div className="mt-4">
                        {product.default_image_url ? (
                          <img
                            src={product.default_image_url}
                            alt={product.name}
                            className="h-24 w-24 rounded-2xl border border-stone-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-xs text-stone-400">
                            Geen afbeelding
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-stone-500">
                        Personalisatie:{' '}
                        {product.allow_personalization
                          ? `Ja (${product.personalization_label ?? 'Naam'})`
                          : 'Nee'}
                      </p>
                    </div>

                    <div className="lg:w-[340px]">
                      <ProductRowActions product={product} categories={categories} />
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