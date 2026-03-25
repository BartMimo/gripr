'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductImageRow } from '@/lib/types'
import {
  createProductImage,
  deleteProductImage,
  setPrimaryProductImage,
} from '@/app/admin/products/images/actions'

type ProductImagesManagerProps = {
  productId: string
  images: ProductImageRow[]
}

export default function ProductImagesManager({
  productId,
  images,
}: ProductImagesManagerProps) {
  const [altText, setAltText] = useState('')
  const [sortOrder, setSortOrder] = useState(images.length + 1)
  const [isPrimary, setIsPrimary] = useState(images.length === 0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setError('')
    setUploading(true)

    try {
      const supabase = createClient()

      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const fileExt = file.name.split('.').pop() || 'png'
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `products/${productId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            upsert: false,
          })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        if (!data?.publicUrl) {
          throw new Error('Geen publieke URL ontvangen van Supabase Storage.')
        }

        await createProductImage({
          productId,
          imageUrl: data.publicUrl,
          altText: altText.trim(),
          sortOrder: Number(sortOrder) + index,
          isPrimary: index === 0 ? isPrimary : false,
        })
      }

      setAltText('')
      setSortOrder(images.length + files.length + 1)
      setIsPrimary(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Uploaden van afbeeldingen mislukt.'
      )
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleSetPrimary(image: ProductImageRow) {
    setError('')

    startTransition(async () => {
      try {
        await setPrimaryProductImage(productId, image.id, image.image_url)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Instellen van hoofdafbeelding mislukt.'
        )
      }
    })
  }

  function handleDelete(image: ProductImageRow) {
    const confirmed = window.confirm(
      'Weet je zeker dat je deze afbeelding wilt verwijderen?'
    )
    if (!confirmed) return

    setError('')

    startTransition(async () => {
      try {
        await deleteProductImage(
          productId,
          image.id,
          image.image_url,
          image.is_primary
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Verwijderen van afbeelding mislukt.'
        )
      }
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <h4 className="text-sm font-semibold text-stone-900">
          Nieuwe afbeeldingen toevoegen
        </h4>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-800">
              Alt-tekst
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
              placeholder="Bijvoorbeeld: Houten tandendoosje voorkant"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-800">
              Start sorteervolgorde
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-stone-800">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-4 w-4"
            />
            Eerste geüploade afbeelding als hoofdafbeelding instellen
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-800">
              Bestanden
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-stone-700"
            />
            <p className="mt-2 text-xs text-stone-500">
              Je kunt meerdere afbeeldingen tegelijk selecteren.
            </p>
          </div>

          {uploading ? (
            <p className="text-sm text-stone-500">Afbeeldingen uploaden...</p>
          ) : null}

          {isPending ? (
            <p className="text-sm text-stone-500">Gegevens opslaan...</p>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-stone-900">
          Bestaande afbeeldingen
        </h4>

        {images.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">
            Er zijn nog geen extra afbeeldingen toegevoegd.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="rounded-2xl border border-stone-200 bg-white p-4"
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? 'Productafbeelding'}
                  className="h-32 w-full rounded-xl object-cover"
                />

                <div className="mt-3 space-y-1 text-sm text-stone-600">
                  <p>
                    <span className="font-medium">Volgorde:</span>{' '}
                    {image.sort_order}
                  </p>
                  <p>
                    <span className="font-medium">Alt-tekst:</span>{' '}
                    {image.alt_text || '—'}
                  </p>
                  <p>
                    <span className="font-medium">Hoofdafbeelding:</span>{' '}
                    {image.is_primary ? 'Ja' : 'Nee'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {!image.is_primary ? (
                    <button
                      onClick={() => handleSetPrimary(image)}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm transition hover:bg-stone-100"
                    >
                      Maak hoofdafbeelding
                    </button>
                  ) : (
                    <span className="rounded-xl bg-green-100 px-3 py-2 text-sm text-green-700">
                      Hoofdafbeelding
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(image)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}