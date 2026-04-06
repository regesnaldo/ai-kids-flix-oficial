import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { assertLiveStripeKeysForProd, PRICE_ID_TO_PLAN, type SubscriptionPlan } from "@/lib/stripe/config";

export const runtime = "nodejs";

type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

interface UserLookupHints {
  customerId: string | null;
  email: string | null;
  userIdHint: number | null;
}

function normalizeStripeId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "id" in value && typeof (value as { id?: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

function parseUserId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isInteger(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function toSubscriptionStatus(status: string | null | undefined): SubscriptionStatus {
  if (status === "canceled") return "canceled";
  if (status === "past_due" || status === "unpaid" || status === "incomplete" || status === "incomplete_expired") {
    return "past_due";
  }
  if (status === "trialing") return "trialing";
  return "active";
}

function detectPlanFromPrice(priceId: string | undefined): SubscriptionPlan | null {
  if (!priceId) return null;
  return PRICE_ID_TO_PLAN[priceId] ?? null;
}

function renderWelcomeEmailHtml(nameOrEmail: string): string {
  return `
  <div style="font-family:Arial,sans-serif;background:#0a0e27;color:#fff;padding:24px">
    <h1 style="font-size:28px;margin:0 0 12px">Bem-vindo ao MENTE.AI</h1>
    <p style="font-size:16px;line-height:1.5;margin:0 0 12px">Obrigado por assinar, ${nameOrEmail}.</p>
    <p style="font-size:16px;line-height:1.5;margin:0 0 18px">Sua jornada começa agora.</p>
    <a href="https://www.menteaikids.com/universo/nexus" style="display:inline-block;background:#E50914;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">
      Entrar no universo NEXUS
    </a>
  </div>
  `;
}

async function sendWelcomeEmail(input: { to: string; nameOrEmail: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[stripe-webhook] RESEND_API_KEY/RESEND_FROM_EMAIL não configurados, email não enviado.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: "MENTE.AI | Sua jornada começa agora",
      html: renderWelcomeEmailHtml(input.nameOrEmail),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend HTTP ${response.status}: ${text}`);
  }
}

async function findUserByHints(hints: UserLookupHints) {
  if (hints.userIdHint) {
    const byId = await db.select().from(users).where(eq(users.id, hints.userIdHint)).limit(1);
    if (byId[0]) return byId[0];
  }

  if (hints.customerId) {
    const byCustomer = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, hints.customerId))
      .limit(1);
    if (byCustomer[0]) return byCustomer[0];
  }

  if (hints.email) {
    const byEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, hints.email))
      .limit(1);
    if (byEmail[0]) return byEmail[0];
  }

  return null;
}

async function updateUserSubscription(params: {
  userId: number;
  plan: SubscriptionPlan;
  customerId?: string | null;
  subscriptionId?: string | null;
  status?: SubscriptionStatus;
  periodEnd?: Date | null;
}) {
  await db
    .update(users)
    .set({
      subscriptionPlan: params.plan,
      subscriptionStatus: params.status ?? "active",
      subscriptionEndDate: params.periodEnd ?? null,
      ...(params.customerId ? { stripeCustomerId: params.customerId } : {}),
      ...(params.subscriptionId ? { stripeSubscriptionId: params.subscriptionId } : {}),
    })
    .where(eq(users.id, params.userId));
}

export async function POST(req: NextRequest) {
  assertLiveStripeKeysForProd();

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe env not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] assinatura inválida:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = normalizeStripeId(session.customer);
        const subscriptionId = normalizeStripeId(session.subscription);
        const email =
          session.customer_details?.email ??
          (typeof session.metadata?.appUserEmail === "string" ? session.metadata.appUserEmail : null);
        const userIdHint =
          parseUserId(session.client_reference_id) ??
          parseUserId(session.metadata?.appUserId);

        const user = await findUserByHints({
          customerId,
          email,
          userIdHint,
        });
        if (!user) break;

        let plan: SubscriptionPlan | null = null;
        let status: SubscriptionStatus = "active";
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["items.data.price"],
          });
          const priceId = subscription.items.data[0]?.price?.id;
          plan = detectPlanFromPrice(priceId);
          status = toSubscriptionStatus(subscription.status);
        }

        if (!plan) break;
        await updateUserSubscription({
          userId: user.id,
          plan,
          customerId,
          subscriptionId,
          status,
          periodEnd: null,
        });

        if (email) {
          try {
            await sendWelcomeEmail({
              to: email,
              nameOrEmail: user.name || email,
            });
          } catch (mailErr) {
            console.error("[stripe-webhook] falha ao enviar email de boas-vindas:", mailErr);
          }
        }

        console.info("[conversion] purchase", {
          userId: user.id,
          customerId,
          plan,
          eventId: event.id,
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = normalizeStripeId(subscription.customer);
        const subscriptionId = normalizeStripeId(subscription.id);
        const priceId = subscription.items.data[0]?.price?.id;
        const mappedPlan = detectPlanFromPrice(priceId);
        const isDeleted = event.type === "customer.subscription.deleted";

        const [user] = await db
          .select()
          .from(users)
          .where(
            and(
              eq(users.stripeCustomerId, customerId ?? "__missing__"),
              eq(users.stripeSubscriptionId, subscriptionId ?? "__missing__"),
            ),
          )
          .limit(1);

        if (!user) {
          const byCustomer = await findUserByHints({ customerId, email: null, userIdHint: null });
          if (!byCustomer) break;
          await updateUserSubscription({
            userId: byCustomer.id,
            plan: isDeleted ? "FREE" : mappedPlan ?? byCustomer.subscriptionPlan ?? "FREE",
            customerId,
            subscriptionId,
            status: isDeleted ? "canceled" : toSubscriptionStatus(subscription.status),
            periodEnd: null,
          });
          break;
        }

        await updateUserSubscription({
          userId: user.id,
          plan: isDeleted ? "FREE" : mappedPlan ?? user.subscriptionPlan ?? "FREE",
          customerId,
          subscriptionId,
          status: isDeleted ? "canceled" : toSubscriptionStatus(subscription.status),
          periodEnd: null,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[stripe-webhook] erro ao processar evento:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
