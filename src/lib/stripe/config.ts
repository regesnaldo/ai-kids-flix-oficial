export type BillingCycle = "semanal" | "quinzenal" | "mensal";
export type CheckoutPlanId = "basico" | "premio" | "familiar";
export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "FAMILY";

export const STRIPE_PRICE_IDS: Record<CheckoutPlanId, Record<BillingCycle, string>> = {
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

export const PRICE_ID_TO_PLAN: Record<string, SubscriptionPlan> = {
  price_1T8juHA8k5sJtQHotNEhgmOT: "BASIC",
  price_1T8mgXA8k5sJtQHoeHgSJYa2: "BASIC",
  price_1T8mbyA8k5sJtQHoROxgvUal: "BASIC",
  price_1T8mRsA8k5sJtQHoST6p70CV: "PREMIUM",
  price_1T8nD4A8k5sJtQHoBMK09CDF: "PREMIUM",
  price_1T8mTRA8k5sJtQHooIIxPIe4: "FAMILY",
  price_1T8nLRA8k5sJtQHo051GvCCd: "FAMILY",
  price_1T8nIrA8k5sJtQHoPOKV6xyo: "FAMILY",
};

export function resolvePriceId(plan: string, cycle: string): string | null {
  if (plan !== "basico" && plan !== "premio" && plan !== "familiar") return null;
  if (cycle !== "semanal" && cycle !== "quinzenal" && cycle !== "mensal") return null;
  return STRIPE_PRICE_IDS[plan][cycle];
}

export function assertLiveStripeKeysForProd() {
  const env = (process.env.VERCEL_ENV || process.env.NODE_ENV || "").toLowerCase();
  const isProd = env === "production";
  if (!isProd) return;

  const secret = process.env.STRIPE_SECRET_KEY || "";
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (secret.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY de teste detectada em produção. Use sk_live_.");
  }
  if (publishable.startsWith("pk_test_")) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY de teste detectada em produção. Use pk_live_.",
    );
  }
}
