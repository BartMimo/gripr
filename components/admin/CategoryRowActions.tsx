'use client'

import { useState, useTransition } from 'react'
import { deleteCategory } from '@/app/admin/categories/actions'
import type { CategoryRow } from '@/lib/types'
import CategoryForm from '@/components/admin/CategoryForm'

type CategoryRowActionsProps = {
  category: CategoryRow
}

export default function CategoryRowActions({
  category,
}: CategoryRowActionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    const confirmed = window.confirm(
      `Weet je zeker dat je "${category.name}" wilt verwijderen?`
    )

    if (!confirmed) return

    setError('')

    startTransition(async () => {
      try {
        await deleteCategory(category.id)
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
          <CategoryForm
            category={category}
            onSuccess={() => setIsEditing(false)}
          />
        </div>
      ) : null}
    </div>
  )
}