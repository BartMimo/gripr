'use client'

import { useMemo, useState, useTransition } from 'react'
import type { CategoryRow, ProductRow } from '@/lib/types'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import ImageUploadField from '@/components/admin/ImageUploadField'

type ProductFormProps = {
  product?: ProductRow
  categories: CategoryRow[]
  onSuccess?: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function ProductForm({
  product,
  categories,
  onSuccess,
}: ProductFormProps) {
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [longDescription, setLongDescription] = useState(
    product?.long_description ?? ''
  )
  const [priceExclVat, setPriceExclVat] = useState(
    product ? String(product.price_excl_vat).replace('.', ',') : ''
  )
  const [vatRate, setVatRate] = useState(
    product ? String(product.vat_rate) : '21'
  )
  const [active, setActive] = useState(product?.active ?? true)
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [allowPersonalization, setAllowPersonalization] = useState(
    product?.allow_personalization ?? false
  )
  const [personalizationLabel, setPersonalizationLabel] = useState(
    product?.personalization_label ?? 'Naam'
  )
  const [defaultImageUrl, setDefaultImageUrl] = useState<string | null>(
    product?.default_image_url ?? null
  )
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const parsedPriceExclVat = useMemo(() => {
    return Number(priceExclVat.replace(',', '.'))
  }, [priceExclVat])

  const parsedVatRate = useMemo(() => {
    return Number(vatRate)
  }, [vatRate])

  const calculatedPriceInclVat = useMemo(() => {
    if (Number.isNaN(parsedPriceExclVat) || Number.isNaN(parsedVatRate)) {
      return ''
    }

    return (parsedPriceExclVat * (1 + parsedVatRate / 100))
      .toFixed(2)
      .replace('.', ',')
  }, [parsedPriceExclVat, parsedVatRate])

  function handleNameChange(value: string) {
    setName(value)

    if (!product) {
      setSlug(slugify(value))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !slug.trim()) {
      setError('Naam en slug zijn verplicht.')
      return
    }

    if (Number.isNaN(parsedPriceExclVat)) {
      setError('Vul een geldige prijs excl. btw in.')
      return
    }

    if (![0, 9, 21].includes(parsedVatRate)) {
      setError('Kies een geldig btw-percentage.')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          id: product?.id,
          categoryId: categoryId || null,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          longDescription: longDescription.trim(),
          priceExclVat: parsedPriceExclVat,
          vatRate: parsedVatRate,
          active,
          featured,
          allowPersonalization,
          personalizationLabel: allowPersonalization
            ? personalizationLabel.trim()
            : '',
          defaultImageUrl,
        }

        if (product) {
          await updateProduct(payload)
        } else {
          await createProduct(payload)
        }

        if (!product) {
          setCategoryId('')
          setName('')
          setSlug('')
          setDescription('')
          setLongDescription('')
          setPriceExclVat('')
          setVatRate('21')
          setActive(true)
          setFeatured(false)
          setAllowPersonalization(false)
          setPersonalizationLabel('Naam')
          setDefaultImageUrl(null)
        }

        onSuccess?.()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Er ging iets mis bij het opslaan van het product.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Categorie
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
        >
          <option value="">Geen categorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Naam
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          placeholder="Bijvoorbeeld Premium deurknop zwart"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          placeholder="premium-deurknop-zwart"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Korte beschrijving
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Lange beschrijving
        </label>
        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Prijs excl. btw
          </label>
          <input
            type="text"
            value={priceExclVat}
            onChange={(e) => setPriceExclVat(e.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
            placeholder="100,00"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Btw
          </label>
          <select
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          >
            <option value="0">0%</option>
            <option value="9">9%</option>
            <option value="21">21%</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm text-stone-500">Prijs incl. btw</p>
        <p className="mt-1 text-lg font-semibold text-stone-900">
          {calculatedPriceInclVat ? `€ ${calculatedPriceInclVat}` : '—'}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-800">
          Hoofdafbeelding
        </label>
        <p className="mb-3 text-sm text-stone-500">
          Bij het aanmaken van een product voegt u hier de eerste hoofdafbeelding toe.
          Na het opslaan kunt u extra afbeeldingen toevoegen en beheren.
        </p>
        <ImageUploadField
          value={defaultImageUrl}
          onChange={setDefaultImageUrl}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4"
          />
          Actief
        </label>

        <label className="flex items-center gap-3 text-sm text-stone-800">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Uitgelicht product
        </label>

        <label className="flex items-center gap-3 text-sm text-stone-800 sm:col-span-2">
          <input
            type="checkbox"
            checked={allowPersonalization}
            onChange={(e) => setAllowPersonalization(e.target.checked)}
            className="h-4 w-4"
          />
          Personalisatie toestaan
        </label>
      </div>

      {allowPersonalization ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-800">
            Label voor personalisatieveld
          </label>
          <input
            type="text"
            value={personalizationLabel}
            onChange={(e) => setPersonalizationLabel(e.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
            placeholder="Naam"
          />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-stone-900 px-6 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? 'Opslaan...'
          : product
          ? 'Product bijwerken'
          : 'Product toevoegen'}
      </button>
    </form>
  )
}