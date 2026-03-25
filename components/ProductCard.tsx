import Link from 'next/link'
import Image from 'next/image'

type ProductCardProps = {
  slug: string
  name: string
  description: string
  price: string
  category: string
  image: string | null
}

export default function ProductCard({
  slug,
  name,
  description,
  price,
  category,
  image,
}: ProductCardProps) {
  const imageSrc = image || '/images/placeholder-product.jpg'

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <Link href={`/producten/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-100">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C6A16E]">
          {category}
        </p>

        <h2 className="mt-3 line-clamp-2 text-xl font-semibold tracking-tight text-stone-900">
          <Link
            href={`/producten/${slug}`}
            className="transition hover:text-black"
          >
            {name}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-7 text-stone-600">
          {description}
        </p>

        <div className="mt-6">
          <p className="text-base font-semibold text-stone-900">{price}</p>
          <p className="text-xs text-stone-500">excl. btw</p>
        </div>

        <Link
          href={`/producten/${slug}`}
          className="mt-6 block w-full rounded-2xl bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
        >
          Bekijk product
        </Link>
      </div>
    </article>
  )
}