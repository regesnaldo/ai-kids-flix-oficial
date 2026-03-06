import type { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events for subscription lifecycle
 * Route: POST /api/stripe/webhook
 * 
 * CRITICAL: This route MUST use express.raw({ type: 'application/json' })
 * middleware BEFORE express.json() to preserve the raw body for signature verification
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    // Construct event from raw body and signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // ⚠️ CRITICAL: Test events MUST return verification response
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing event ${event.type}:`, error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle checkout.session.completed
 * Creates Stripe customer and initial subscription record
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const customerEmail = session.metadata?.customer_email;

  if (!userId) {
    console.error("[Stripe Webhook] checkout.session.completed: missing user_id in metadata");
    return;
  }

  console.log(`[Stripe Webhook] Checkout completed for user ${userId}`);

  // Update user with Stripe customer ID
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  await db
    .update(users)
    .set({
      stripeCustomerId: session.customer as string,
      updatedAt: new Date(),
    })
    .where(eq(users.id, parseInt(userId)));

  // Subscription details will be updated by customer.subscription.created event
}

/**
 * Handle customer.subscription.created and customer.subscription.updated
 * Updates user subscription status
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  // Find user by Stripe customer ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.error(`[Stripe Webhook] User not found for customer ${customerId}`);
    return;
  }

  // Extract plan type from subscription metadata or price metadata
  const planType = (subscription.metadata?.plan_type as "BASIC" | "PREMIUM" | "FAMILY") || "BASIC";
  const status = subscription.status as "active" | "canceled" | "past_due" | "trialing";

  console.log(`[Stripe Webhook] Updating subscription for user ${user.id}: ${planType} (${status})`);

  await db
    .update(users)
    .set({
      stripeSubscriptionId: subscription.id,
      subscriptionPlan: planType,
      subscriptionStatus: status,
      subscriptionEndDate: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}

/**
 * Handle customer.subscription.deleted
 * Marks subscription as canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.error(`[Stripe Webhook] User not found for customer ${customerId}`);
    return;
  }

  console.log(`[Stripe Webhook] Subscription deleted for user ${user.id}`);

  await db
    .update(users)
    .set({
      subscriptionStatus: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}

/**
 * Handle invoice.paid
 * Logs successful payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`[Stripe Webhook] Invoice paid: ${invoice.id} for ${invoice.customer}`);
  // Payment successful - subscription will be updated by subscription.updated event
}

/**
 * Handle invoice.payment_failed
 * Logs failed payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id} for ${invoice.customer}`);
  // Payment failed - subscription status will be updated by subscription.updated event
}
