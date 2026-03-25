'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type CreateProductImageInput = {
  productId: string
  imageUrl: string
  altText: string
  sortOrder: number
  isPrimary: boolean
}

export async function createProductImage(input: CreateProductImageInput) {
  const supabase = await createClient()

  if (input.isPrimary) {
    await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', input.productId)

    await supabase
      .from('products')
      .update({ default_image_url: input.imageUrl })
      .eq('id', input.productId)
  }

  const { error } = await supabase.from('product_images').insert({
    product_id: input.productId,
    image_url: input.imageUrl,
    alt_text: input.altText || null,
    sort_order: input.sortOrder,
    is_primary: input.isPrimary,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
  imageUrl: string
) {
  const supabase = await createClient()

  const { error: resetError } = await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId)

  if (resetError) {
    throw new Error(resetError.message)
  }

  const { error: primaryError } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)

  if (primaryError) {
    throw new Error(primaryError.message)
  }

  const { error: productError } = await supabase
    .from('products')
    .update({ default_image_url: imageUrl })
    .eq('id', productId)

  if (productError) {
    throw new Error(productError.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
  imageUrl: string,
  wasPrimary: boolean
) {
  const supabase = await createClient()

  const filePathMatch = imageUrl.match(/\/product-images\/(.+)$/)
  const filePath = filePathMatch ? filePathMatch[1] : null

  const { error: deleteRowError } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (deleteRowError) {
    throw new Error(deleteRowError.message)
  }

  if (filePath) {
    await supabase.storage.from('product-images').remove([filePath])
  }

  if (wasPrimary) {
    const { data: fallbackImage } = await supabase
      .from('product_images')
      .select('id, image_url')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (fallbackImage) {
      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', fallbackImage.id)

      await supabase
        .from('products')
        .update({ default_image_url: fallbackImage.image_url })
        .eq('id', productId)
    } else {
      await supabase
        .from('products')
        .update({ default_image_url: null })
        .eq('id', productId)
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/producten')
}