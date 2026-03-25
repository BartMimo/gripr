'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { parseEuroPrice } from '@/lib/pricing'

type CheckoutItem = {
  slug: string
  name: string
  price: string
  category: string
  image: string
  personalizationName: string
  quantity: number
}

type CreateOrderInput = {
  firstName: string
  lastName: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  items: CheckoutItem[]
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient()

  if (!input.items.length) {
    throw new Error('De winkelwagen is leeg.')
  }

  const totalItems = input.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = input.items.reduce((sum, item) => {
    return sum + parseEuroPrice(item.price) * item.quantity
  }, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      street: input.street,
      house_number: input.houseNumber,
      postal_code: input.postalCode,
      city: input.city,
      total_price: totalPrice,
      total_items: totalItems,
      status: 'pending',
    })
    .select('id, order_number')
    .single()

  if (orderError || !order) {
    throw new Error(orderError?.message || 'Opslaan van order mislukt.')
  }

  const orderItems = input.items.map((item) => {
    const unitPrice = parseEuroPrice(item.price)
    const lineTotal = unitPrice * item.quantity

    return {
      order_id: order.id,
      product_slug: item.slug,
      product_name: item.name,
      product_category: item.category,
      product_image: item.image,
      personalization_name: item.personalizationName,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: lineTotal,
    }
  })

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  redirect(`/bevestiging?order=${order.order_number}`)
}