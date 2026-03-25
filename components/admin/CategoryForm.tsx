'use client'

import { useState, useTransition } from 'react'
import { createCategory, updateCategory } from '@/app/admin/categories/actions'
import type { CategoryRow } from '@/lib/types'

type CategoryFormProps = {
  category?: CategoryRow
  onSuccess?: () => void
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function CategoryForm({
  category,
  onSuccess,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0)
  const [active, setActive] = useState(category?.active ?? true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleNameChange(value: string) {
    setName(value)

    if (!category) {
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

    startTransition(async () => {
      try {
        if (category) {
          await updateCategory({
            id: category.id,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            sortOrder: Number(sortOrder),
            active,
          })
        } else {
          await createCategory({
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            sortOrder: Number(sortOrder),
            active,
          })
        }

        if (!category) {
          setName('')
          setSlug('')
          setDescription('')
          setSortOrder(0)
          setActive(true)
        }

        onSuccess?.()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Er ging iets mis bij het opslaan van de categorie.'
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-stone-800"
        >
          Naam
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          placeholder="Bijvoorbeeld Tandendoosjes"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium text-stone-800"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          placeholder="bijvoorbeeld-tandendoosjes"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-stone-800"
        >
          Beschrijving
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
          placeholder="Korte omschrijving van deze categorie"
        />
      </div>

      <div>
        <label
          htmlFor="sortOrder"
          className="mb-2 block text-sm font-medium text-stone-800"
        >
          Sorteervolgorde
        </label>
        <input
          id="sortOrder"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-stone-800">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4"
        />
        Actief
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-stone-900 px-6 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? 'Opslaan...'
          : category
          ? 'Categorie bijwerken'
          : 'Categorie toevoegen'}
      </button>
    </form>
  )
}