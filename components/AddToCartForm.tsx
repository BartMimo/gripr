'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { createClient } from '@/lib/supabase/client'

type AddToCartFormProps = {
  slug: string
  name: string
  price: string
  category: string
  image: string
  vatRate: number
}

export default function AddToCartForm({
  slug,
  name,
  price,
  category,
  image,
  vatRate,
}: AddToCartFormProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [logoUrl, setLogoUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  function increaseQuantity() {
    setQuantity((prev) => prev + 1)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const supabase = createClient()

      const fileExt = file.name.split('.').pop() || 'png'
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `logos/${slug}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('customer-uploads')
        .upload(filePath, file, {
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data } = supabase.storage
        .from('customer-uploads')
        .getPublicUrl(filePath)

      if (!data?.publicUrl) {
        throw new Error('Geen publieke URL ontvangen van Supabase Storage.')
      }

      setLogoUrl(data.publicUrl)
      setLogoFileName(file.name)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Uploaden van bestand mislukt.'
      )
    } finally {
      setUploading(false)
    }
  }

  function handleAddToCart() {
    if (!logoUrl) {
      setError('Kies eerst een bestand voordat u dit product toevoegt.')
      return
    }

    setSubmitting(true)
    setError('')

    addItem({
      slug,
      name,
      price,
      category,
      image,
      vatRate,
      logoUrl,
      logoFileName,
      quantity,
    })

    router.push('/winkelwagen')
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-7 text-stone-600">
          Upload uw logo tijdens het bestellen. Voor het beste resultaat
          adviseren wij een scherp bestand of vectorbestand, zoals PNG, SVG of
          PDF.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="cursor-pointer rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            Bestand kiezen
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <span className="text-sm">
            {logoFileName ? (
              <span className="font-medium text-blue-600">{logoFileName}</span>
            ) : (
              <span className="text-stone-500">Geen bestand gekozen</span>
            )}
          </span>
        </div>

        {uploading ? (
          <p className="mt-3 text-sm text-stone-500">Bestand uploaden...</p>
        ) : null}

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-900">
            Aantal
          </label>

          <div className="flex items-center overflow-hidden rounded-2xl border border-stone-300 bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              className="flex h-12 w-12 items-center justify-center text-lg transition hover:bg-stone-100"
            >
              −
            </button>

            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const value = Number(e.target.value)
                setQuantity(Number.isNaN(value) || value < 1 ? 1 : value)
              }}
              className="h-12 w-20 border-x border-stone-300 text-center outline-none"
            />

            <button
              type="button"
              onClick={increaseQuantity}
              className="flex h-12 w-12 items-center justify-center text-lg transition hover:bg-stone-100"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={uploading || submitting}
          className="rounded-2xl bg-stone-900 px-6 py-4 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Toevoegen aan bestelling
        </button>
      </div>
    </div>
  )
}