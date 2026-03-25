import Image from 'next/image'
import { notFound } from 'next/navigation'
import AddToCartForm from '@/components/AddToCartForm'
import { createClient } from '@/lib/supabase/server'

type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  long_description: string | null
  price: number | null
  price_excl_vat: number | null
  vat_rate: number | null
  price_incl_vat: number | null
  default_image_url: string | null
}

type ProductPageProps = {
  params: Promise<{
    slug: string
  }>
}

function formatPrice(price: number) {
  return `€ ${price.toFixed(2).replace('.', ',')}`
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) {
    notFound()
  }

  const product = data as Product

  const imageSrc =
    product.default_image_url ?? '/images/placeholder-product.jpg'

  const priceExclVat = product.price_excl_vat ?? product.price ?? 0
  const vatRate = product.vat_rate ?? 21
  const priceInclVat =
    product.price_incl_vat ?? Number((priceExclVat * (1 + vatRate / 100)).toFixed(2))

  return (
    <main className="bg-[#F8F8F7] text-stone-900">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-stone-100">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#C6A16E]">
            GRIPR
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
            {product.name}
          </h1>

          <div className="mt-4 space-y-1">
            <p className="text-2xl font-semibold text-stone-900">
              {formatPrice(priceExclVat)}
            </p>
            <p className="text-sm text-stone-500">
              excl. btw ({vatRate}%)
            </p>
            <p className="text-sm text-stone-500">
              incl. btw: {formatPrice(priceInclVat)}
            </p>
          </div>

          <p className="mt-6 leading-8 text-stone-600">
            {product.long_description ??
              product.description ??
              'Premium deurknop met uw eigen logo. Perfect voor bedrijven, kantoren en representatieve ruimtes.'}
          </p>

          <AddToCartForm
            slug={product.slug}
            name={product.name}
            price={formatPrice(priceExclVat)}
            category="Deurknoppen"
            image={imageSrc}
            vatRate={vatRate}
          />

          <div className="mt-8 space-y-3 text-sm text-stone-600">
            <p>✔ Premium afwerking</p>
            <p>✔ Geschikt voor bedrijven en zakelijke projecten</p>
            <p>✔ Eenvoudig uw logo uploaden tijdens het bestellen</p>
          </div>
        </div>
      </div>
    </main>
  )
}