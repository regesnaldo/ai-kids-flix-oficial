import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export const runtime = 'nodejs'

const PRICE_ID_TO_PLAN: Record<string, 'BASIC' | 'PREMIUM' | 'FAMILY'> = {
  price_1T8juHA8k5sJtQHotNEhgmOT: 'BASIC',
  price_1T8mgXA8k5sJtQHoeHgSJYa2: 'BASIC',
  price_1T8mbyA8k5sJtQHoROxgvUal: 'BASIC',
  price_1T8mRsA8k5sJtQHoST6p70CV: 'PREMIUM',
  price_1T8nD4A8k5sJtQHoBMK09CDF: 'PREMIUM',
  price_1T8mTRA8k5sJtQHooIIxPIe4: 'FAMILY',
  price_1T8nLRA8k5sJtQHo051GvCCd: 'FAMILY',
  price_1T8nIrA8k5sJtQHoPOKV6xyo: 'FAMILY',
}

function normalizeStripeId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value && 'id' in (value as any) && typeof (value as any).id === 'string') {
    return (value as any).id
  }
  return null
}

async function findUserIdByCustomerOrEmail(customerId: string | null, email: string | null) {
  if (customerId) {
    const byCustomer = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1)
    if (byCustomer[0]?.id) return byCustomer[0].id
  }

  if (email) {
    const byEmail = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    if (byEmail[0]?.id) return byEmail[0].id
  }

  return null
}

async function setUserPlan(userId: number, plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'FAMILY', stripeCustomerId?: string | null) {
  await db
    .update(users)
    .set({
      subscriptionPlan: plan,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    })
    .where(eq(users.id, userId))
}

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe env not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
  })

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = normalizeStripeId(session.customer)
        const email = session.customer_details?.email ?? null
        const userId = await findUserIdByCustomerOrEmail(customerId, email)

        const subscriptionId = normalizeStripeId(session.subscription)
        let plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'FAMILY' | null = null

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items.data.price'] })
          const priceId = subscription.items.data[0]?.price?.id
          if (priceId && PRICE_ID_TO_PLAN[priceId]) plan = PRICE_ID_TO_PLAN[priceId]
        }

        if (!plan) {
          break
        }

        if (!userId) {
          break
        }

        await setUserPlan(userId, plan, customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = normalizeStripeId(subscription.customer)
        const userId = await findUserIdByCustomerOrEmail(customerId, null)
        if (!userId) break
        await setUserPlan(userId, 'FREE', customerId)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = normalizeStripeId(subscription.customer)
        const userId = await findUserIdByCustomerOrEmail(customerId, null)
        const priceId = subscription.items.data[0]?.price?.id
        const mapped = priceId ? PRICE_ID_TO_PLAN[priceId] : undefined
        if (!mapped) break
        if (!userId) break
        await setUserPlan(userId, mapped, customerId)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error('Erro ao processar webhook:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
