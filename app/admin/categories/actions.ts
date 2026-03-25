'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type CategoryInput = {
  id?: string
  name: string
  slug: string
  description: string
  sortOrder: number
  active: boolean
}

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient()

  const { error } = await supabase.from('categories').insert({
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    sort_order: input.sortOrder,
    active: input.active,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/categories')
}

export async function updateCategory(input: CategoryInput) {
  const supabase = await createClient()

  if (!input.id) {
    throw new Error('Categorie id ontbreekt.')
  }

  const { error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      sort_order: input.sortOrder,
      active: input.active,
    })
    .eq('id', input.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/categories')
}