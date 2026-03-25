import ProductCard from '@/components/ProductCard'
import { createClient } from '@/lib/supabase/server'

type ProductWithCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  price: number | null
  price_excl_vat: number | null
  vat_rate: number | null
  price_incl_vat: number | null
  default_image_url: string | null
  categories: {
    name: string
  } | null
}

function formatPrice(price: number) {
  return `€ ${Number(price).toFixed(2).replace('.', ',')}`
}

export default async function ProductenPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      description,
      price,
      price_excl_vat,
      vat_rate,
      price_incl_vat,
      default_image_url,
      categories (
        name
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-bold">Fout bij laden van producten</h1>
          <p className="mt-2">{error.message}</p>
        </div>
      </main>
    )
  }

  const typedProducts = (products ?? []) as ProductWithCategory[]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#C6A16E]">
          Collectie
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl">
          Deurknoppen met logo
        </h1>

        <p className="mt-5 text-lg leading-8 text-stone-600">
          Ontdek onze collectie premium deurknoppen voor bedrijven, kantoren en
          showrooms. Upload eenvoudig uw logo of ontwerpbestand en bestel direct
          online.
        </p>
      </div>

      {typedProducts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-stone-600">
            Er zijn op dit moment nog geen producten beschikbaar.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {typedProducts.map((product) => {
            const priceToShow = product.price_excl_vat ?? product.price ?? 0

            return (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                description={product.description ?? ''}
                price={formatPrice(priceToShow)}
                category={product.categories?.name ?? 'Product'}
                image={
                  product.default_image_url ?? '/images/placeholder-product.jpg'
                }
              />
            )
          })}
        </div>
      )}
    </main>
  )
}