import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const body = await req.text()
  const headerList = await headers()
  const signature = headerList.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new Response(
      `Webhook signature verification failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      { status: 400 }
    )
  }

  // 🔥 HIER gebeurt de magic
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id

    console.log('Webhook ontvangen: checkout.session.completed')
    console.log('orderId:', orderId)
    console.log('session.id:', session.id)

    if (!orderId) {
      return new Response('No order_id found in session metadata', {
        status: 400,
      })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) {
      console.error('Supabase update error in webhook:', error)
      return new Response(`Supabase update failed: ${error.message}`, {
        status: 500,
      })
    }

    console.log('Order succesvol bijgewerkt naar paid')
  }

  return new Response('ok', { status: 200 })
}