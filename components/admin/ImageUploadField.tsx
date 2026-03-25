'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ImageUploadFieldProps = {
  value: string | null
  onChange: (url: string | null) => void
}

export default function ImageUploadField({
  value,
  onChange,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const supabase = createClient()

      const fileExt = file.name.split('.').pop() || 'png'
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `products/${fileName}`

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

      onChange(data.publicUrl)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Uploaden van afbeelding mislukt.'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-stone-700"
      />

      {uploading ? (
        <p className="text-sm text-stone-500">Afbeelding uploaden...</p>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {value ? (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
          <p className="mb-2 text-sm text-stone-600">Huidige afbeelding</p>
          <img
            src={value}
            alt="Preview"
            className="h-28 w-28 rounded-xl border border-stone-200 object-cover"
          />
          <p className="mt-2 break-all text-xs text-stone-500">{value}</p>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-3 rounded-xl border border-stone-300 px-3 py-2 text-sm transition hover:bg-stone-100"
          >
            Afbeelding verwijderen
          </button>
        </div>
      ) : null}
    </div>
  )
}