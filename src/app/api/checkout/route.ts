import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { assertLiveStripeKeysForProd, resolvePriceId } from "@/lib/stripe/config";

async function getAuthenticatedUserContext(request: NextRequest): Promise<{
  userId: number | null;
  email: string | null;
}> {
  const token = getAuthCookieFromRequest(request);
  if (!token) return { userId: null, email: null };

  const payload = await verifyToken(token);
  const userId = payload?.userId ? Number(payload.userId) : NaN;
  if (!Number.isInteger(userId) || userId <= 0) return { userId: null, email: null };

  const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  return {
    userId,
    email: user?.email ?? payload?.email ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    assertLiveStripeKeysForProd();

    const apiKey = process.env.CHECKOUT_API_KEY;
    const authenticator = process.env.CHECKOUT_AUTHENTICATOR;
    const isDev = process.env.NODE_ENV === "development";

    if (!apiKey || !authenticator) {
      if (isDev) {
        console.warn("Checkout API: Running in dev mode without credentials");
      } else {
        throw new Error("Neither apiKey nor config.authenticator provided");
      }
    }

    const { plano, periodo } = await request.json();

    if (plano === "free") {
      return NextResponse.json({ url: "/player" });
    }

    const priceId = resolvePriceId(plano, periodo);
    if (!priceId) {
      return NextResponse.json({ error: "Plano ou período inválido" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      if (isDev) {
        console.warn("Checkout API: STRIPE_SECRET_KEY ausente em desenvolvimento");
        return NextResponse.json({
          url: `${origin}/sucesso?session_id=dev-checkout-session`,
          debug: true,
        });
      }

      throw new Error("STRIPE_SECRET_KEY não configurada");
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2026-02-25.clover",
    });
    const authUser = await getAuthenticatedUserContext(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/planos`,
      locale: "pt-BR",
      customer_email: authUser.email ?? undefined,
      metadata: {
        plano,
        periodo,
        appUserId: authUser.userId ? String(authUser.userId) : "",
        appUserEmail: authUser.email ?? "",
      },
      subscription_data: {
        metadata: {
          plano,
          periodo,
          appUserId: authUser.userId ? String(authUser.userId) : "",
          appUserEmail: authUser.email ?? "",
        },
      },
      client_reference_id: authUser.userId ? String(authUser.userId) : undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout", details: String(error) },
      { status: 500 }
    );
  }
}
