import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { parseEuroPrice } from '@/lib/pricing'
import { createClient } from '@/lib/supabase/server'

type CheckoutItem = {
  id: string
  slug: string
  name: string
  price: string
  category: string
  image: string
  vatRate: number
  logoUrl: string
  logoFileName: string
  quantity: number
}

type CustomerDetails = {
  companyName: string
  firstName: string
  lastName: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items = (body.items ?? []) as CheckoutItem[]
    const customer = body.customer as CustomerDetails

    if (!items.length) {
      return NextResponse.json(
        { error: 'Uw winkelwagen is leeg.' },
        { status: 400 }
      )
    }

    if (
      !customer?.companyName ||
      !customer?.firstName ||
      !customer?.lastName ||
      !customer?.email ||
      !customer?.street ||
      !customer?.houseNumber ||
      !customer?.postalCode ||
      !customer?.city
    ) {
      return NextResponse.json(
        { error: 'Klantgegevens ontbreken.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const totalPriceExclVat = items.reduce((sum, item) => {
      return sum + parseEuroPrice(item.price) * item.quantity
    }, 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        company_name: customer.companyName,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        street: customer.street,
        house_number: customer.houseNumber,
        postal_code: customer.postalCode,
        city: customer.city,
        total_price: totalPriceExclVat,
        total_items: totalItems,
        status: 'pending',
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || 'Order opslaan mislukt.' },
        { status: 500 }
      )
    }

    const orderItems = items.map((item) => {
      const unitPriceExclVat = parseEuroPrice(item.price)
      const lineTotalExclVat = unitPriceExclVat * item.quantity

      return {
        order_id: order.id,
        product_slug: item.slug,
        product_name: item.name,
        product_category: item.category,
        product_image: item.image,
        personalization_name: null,
        logo_url: item.logoUrl,
        logo_file_name: item.logoFileName,
        unit_price: unitPriceExclVat,
        quantity: item.quantity,
        line_total: lineTotalExclVat,
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email,
      line_items: items.map((item) => {
        const unitPriceExclVat = parseEuroPrice(item.price)
        const unitPriceInclVat =
          unitPriceExclVat * (1 + item.vatRate / 100)

        return {
          quantity: item.quantity,
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
              metadata: {
                slug: item.slug,
                category: item.category,
                logo_file_name: item.logoFileName,
              },
            },
            unit_amount: Math.round(unitPriceInclVat * 100),
          },
        }
      }),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/bevestiging-betaald?order=${order.order_number}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
    })

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
      })
      .eq('id', order.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Aanmaken van Stripe Checkout mislukt.',
      },
      { status: 500 }
    )
  }
}