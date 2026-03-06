/**
 * AI KIDS LABS - Stripe Products & Pricing
 * 
 * Define subscription plans and pricing for the AI Kids Labs platform
 */

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: "Plano Básico",
    description: "Acesso a conteúdo básico e 3 escolhas interativas por mês",
    priceMonthly: 1990, // R$ 19.90 in cents
    priceYearly: 19900, // R$ 199.00 in cents (2 meses grátis)
    features: [
      "Acesso a todas as séries",
      "3 escolhas interativas por mês",
      "Qualidade HD",
      "1 perfil",
    ],
  },
  PREMIUM: {
    name: "Plano Premium",
    description: "Escolhas ilimitadas + recomendações IA avançadas",
    priceMonthly: 3990, // R$ 39.90 in cents
    priceYearly: 39900, // R$ 399.00 in cents (2 meses grátis)
    features: [
      "Tudo do Plano Básico",
      "Escolhas interativas ilimitadas",
      "Recomendações IA avançadas",
      "Qualidade 4K",
      "Até 5 perfis",
      "Download para assistir offline",
    ],
  },
  FAMILY: {
    name: "Plano Família",
    description: "Perfeito para toda a família com perfis ilimitados",
    priceMonthly: 5990, // R$ 59.90 in cents
    priceYearly: 59900, // R$ 599.00 in cents (2 meses grátis)
    features: [
      "Tudo do Plano Premium",
      "Perfis ilimitados",
      "Controle parental avançado",
      "Relatórios de progresso",
      "Suporte prioritário",
    ],
  },
} as const;

export type SubscriptionPlanType = keyof typeof SUBSCRIPTION_PLANS;

/**
 * Get plan details by type
 */
export function getPlanDetails(planType: SubscriptionPlanType) {
  return SUBSCRIPTION_PLANS[planType];
}

/**
 * Check if user has access to premium features
 */
export function hasPremiumAccess(planType: SubscriptionPlanType | null): boolean {
  if (!planType) return false;
  return planType === "PREMIUM" || planType === "FAMILY";
}

/**
 * Check if user has family plan features
 */
export function hasFamilyAccess(planType: SubscriptionPlanType | null): boolean {
  if (!planType) return false;
  return planType === "FAMILY";
}

/**
 * Get monthly interactive choices limit
 */
export function getInteractiveChoicesLimit(planType: SubscriptionPlanType | null): number {
  if (!planType) return 0;
  if (planType === "BASIC") return 3;
  return Infinity; // Unlimited for PREMIUM and FAMILY
}
