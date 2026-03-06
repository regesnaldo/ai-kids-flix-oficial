import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, Sparkles, Crown, Users } from "lucide-react";

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * Planos Page - Subscription plans comparison with Stripe checkout
 * 
 * Design: Netflix-style pricing cards with cyberpunk neural theme
 * Features: Visual comparison, current plan indicator, Stripe integration
 */

const PLANS = [
  {
    type: "BASIC" as const,
    name: "Plano Básico",
    description: "Perfeito para começar sua jornada",
    priceMonthly: "R$ 19,90",
    priceYearly: "R$ 199,00",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-500",
    features: [
      "Acesso a todas as séries",
      "3 escolhas interativas por mês",
      "Qualidade HD",
      "1 perfil",
    ],
  },
  {
    type: "PREMIUM" as const,
    name: "Plano Premium",
    description: "Escolhas ilimitadas + IA avançada",
    priceMonthly: "R$ 39,90",
    priceYearly: "R$ 399,00",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    popular: true,
    features: [
      "Tudo do Plano Básico",
      "Escolhas interativas ilimitadas",
      "Recomendações IA avançadas",
      "Qualidade 4K",
      "Até 5 perfis",
      "Download para assistir offline",
    ],
  },
  {
    type: "FAMILY" as const,
    name: "Plano Família",
    description: "Para toda a família dominar a IA",
    priceMonthly: "R$ 59,90",
    priceYearly: "R$ 599,00",
    icon: Users,
    color: "from-orange-500 to-red-500",
    features: [
      "Tudo do Plano Premium",
      "Perfis ilimitados",
      "Controle parental avançado",
      "Relatórios de progresso",
      "Suporte prioritário",
    ],
  },
];

export default function Planos() {
  const { user, isAuthenticated } = useAuth();

  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const subscriptionStatus = trpc.stripe.getSubscriptionStatus.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, "_blank");
        // Success - user will be redirected to Stripe
      }
      setLoadingPlan(null);
    },
    onError: (error) => {
      alert(`Erro ao criar checkout: ${error.message}`);
      setLoadingPlan(null);
    },
  });

  const handleSubscribe = (planType: "BASIC" | "PREMIUM" | "FAMILY") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setLoadingPlan(planType);
    createCheckout.mutate({ planType, interval });
  };

  const currentPlan = subscriptionStatus.data?.plan;
  const isActive = subscriptionStatus.data?.status === "active";

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      {/* Neural background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ESCOLHA SEU PODER
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Domine a Inteligência Artificial com o plano perfeito para você.
            Cancele quando quiser.
          </p>

          {/* Interval toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setInterval("month")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                interval === "month"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setInterval("year")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                interval === "year"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.type && isActive;
            const isLoading = loadingPlan === plan.type;

            return (
              <Card
                key={plan.type}
                className={`relative bg-gray-900/50 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular
                    ? "border-purple-500 shadow-lg shadow-purple-500/30"
                    : "border-gray-800 hover:border-cyan-500/50"
                } ${isCurrentPlan ? "ring-4 ring-green-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    MAIS POPULAR
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    SEU PLANO
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan name */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {interval === "month" ? plan.priceMonthly : plan.priceYearly}
                      </span>
                      <span className="text-gray-400">
                        /{interval === "month" ? "mês" : "ano"}
                      </span>
                    </div>
                    {interval === "year" && (
                      <p className="text-sm text-green-400 mt-2">
                        Economize 2 meses!
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.type)}
                    disabled={isLoading || isCurrentPlan}
                    className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
                      isCurrentPlan
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${plan.color} hover:shadow-2xl hover:scale-105`
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processando...
                      </>
                    ) : isCurrentPlan ? (
                      "Plano Atual"
                    ) : (
                      "Assinar Agora"
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-lg mb-4">
            Todos os planos incluem 7 dias de teste grátis. Cancele quando quiser.
          </p>
          <p className="text-sm">
            Pagamento seguro processado pelo Stripe. Aceita cartões de crédito e débito.
          </p>
        </div>
      </div>
    </div>
  );
}
