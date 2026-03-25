'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ProductInput = {
  id?: string
  categoryId: string | null
  name: string
  slug: string
  description: string
  longDescription: string
  priceExclVat: number
  vatRate: number
  active: boolean
  featured: boolean
  allowPersonalization: boolean
  personalizationLabel: string
  defaultImageUrl: string | null
}

function calculatePriceInclVat(priceExclVat: number, vatRate: number) {
  return Number((priceExclVat * (1 + vatRate / 100)).toFixed(2))
}

export async function createProduct(input: ProductInput) {
  const supabase = await createClient()

  const priceInclVat = calculatePriceInclVat(input.priceExclVat, input.vatRate)

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      category_id: input.categoryId,
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      long_description: input.longDescription || null,
      price: input.priceExclVat,
      price_excl_vat: input.priceExclVat,
      vat_rate: input.vatRate,
      price_incl_vat: priceInclVat,
      active: input.active,
      featured: input.featured,
      allow_personalization: input.allowPersonalization,
      personalization_label: input.allowPersonalization
        ? input.personalizationLabel || 'Naam'
        : null,
      default_image_url: input.defaultImageUrl,
    })
    .select('id')
    .single()

  if (error || !product) {
    throw new Error(error?.message || 'Aanmaken van product mislukt.')
  }

  if (input.defaultImageUrl) {
    const { error: imageError } = await supabase.from('product_images').insert({
      product_id: product.id,
      image_url: input.defaultImageUrl,
      alt_text: input.name,
      sort_order: 1,
      is_primary: true,
    })

    if (imageError) {
      throw new Error(imageError.message)
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}

export async function updateProduct(input: ProductInput) {
  const supabase = await createClient()

  if (!input.id) {
    throw new Error('Product id ontbreekt.')
  }

  const priceInclVat = calculatePriceInclVat(input.priceExclVat, input.vatRate)

  const { error } = await supabase
    .from('products')
    .update({
      category_id: input.categoryId,
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      long_description: input.longDescription || null,
      price: input.priceExclVat,
      price_excl_vat: input.priceExclVat,
      vat_rate: input.vatRate,
      price_incl_vat: priceInclVat,
      active: input.active,
      featured: input.featured,
      allow_personalization: input.allowPersonalization,
      personalization_label: input.allowPersonalization
        ? input.personalizationLabel || 'Naam'
        : null,
      default_image_url: input.defaultImageUrl,
    })
    .eq('id', input.id)

  if (error) {
    throw new Error(error.message)
  }

  if (input.defaultImageUrl) {
    const { data: existingPrimary } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', input.id)
      .eq('is_primary', true)
      .maybeSingle()

    if (!existingPrimary) {
      await supabase.from('product_images').insert({
        product_id: input.id,
        image_url: input.defaultImageUrl,
        alt_text: input.name,
        sort_order: 1,
        is_primary: true,
      })
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}