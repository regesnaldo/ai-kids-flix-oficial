import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import Stripe from "stripe";

const PRICE_IDS: Record<string, Record<string, string>> = {
  basico: {
    mensal: "price_1T8juHA8k5sJtQHotNEhgmOT",
    semanal: "price_1T8mgXA8k5sJtQHoeHgSJYa2",
    quinzenal: "price_1T8mbyA8k5sJtQHoROxgvUal",
  },
  premio: {
    mensal: "price_1T8mRsA8k5sJtQHoST6p70CV",
    semanal: "price_1T8nD4A8k5sJtQHoBMK09CDF",
    quinzenal: "price_1T8nD4A8k5sJtQHoBMK09CDF",
  },
  familiar: {
    mensal: "price_1T8mTRA8k5sJtQHooIIxPIe4",
    semanal: "price_1T8nLRA8k5sJtQHo051GvCCd",
    quinzenal: "price_1T8nIrA8k5sJtQHoPOKV6xyo",
  },
};

export async function POST(request: NextRequest) {
  try {
    // Auth: extract userId from JWT (same pattern as all other API routes)
    const token = getAuthCookieFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    const userId = Number(payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
    }

    const isDev = process.env.NODE_ENV === "development";

    const { plano, periodo } = await request.json();

    if (plano === "free") {
      return NextResponse.json({ url: "/player" });
    }

    const priceId = PRICE_IDS[plano]?.[periodo];
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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/planos`,
      locale: "pt-BR",
      client_reference_id: String(userId),
      metadata: {
        userId: String(userId),
      },
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
