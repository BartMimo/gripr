'use client'

import { useState, useTransition } from 'react'
import type { CategoryRow, ProductRow } from '@/lib/types'
import { deleteProduct } from '@/app/admin/products/actions'
import ProductForm from '@/components/admin/ProductForm'

type ProductRowActionsProps = {
  product: ProductRow
  categories: CategoryRow[]
}

export default function ProductRowActions({
  product,
  categories,
}: ProductRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    const confirmed = window.confirm(
      `Weet je zeker dat je "${product.name}" wilt verwijderen?`
    )

    if (!confirmed) return

    setError('')

    startTransition(async () => {
      try {
        await deleteProduct(product.id)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Er ging iets mis bij het verwijderen.'
        )
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="rounded-xl border border-stone-300 px-3 py-2 text-sm transition hover:bg-stone-100"
        >
          {isEditing ? 'Sluiten' : 'Bewerken'}
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-60"
        >
          Verwijderen
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {isEditing ? (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <ProductForm
            product={product}
            categories={categories}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  )
}