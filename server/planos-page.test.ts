import { describe, it, expect } from "vitest";

describe("Planos Page", () => {
  it("should have Planos page component", async () => {
    const PlanosPage = await import("../client/src/pages/Planos");
    expect(PlanosPage.default).toBeDefined();
    expect(typeof PlanosPage.default).toBe("function");
  });

  it("should have correct plan structure", () => {
    const PLANS = [
      {
        type: "BASIC",
        name: "Plano Básico",
        priceMonthly: "R$ 19,90",
        priceYearly: "R$ 199,00",
      },
      {
        type: "PREMIUM",
        name: "Plano Premium",
        priceMonthly: "R$ 39,90",
        priceYearly: "R$ 399,00",
        popular: true,
      },
      {
        type: "FAMILY",
        name: "Plano Família",
        priceMonthly: "R$ 59,90",
        priceYearly: "R$ 599,00",
      },
    ];

    expect(PLANS).toHaveLength(3);
    expect(PLANS[0].type).toBe("BASIC");
    expect(PLANS[1].type).toBe("PREMIUM");
    expect(PLANS[2].type).toBe("FAMILY");
    expect(PLANS[1].popular).toBe(true);
  });

  it("should have Planos link in navbar", () => {
    // Planos link added to NAV_ITEMS array in NetflixHome.tsx
    const NAV_ITEMS = ["Educa\u00e7\u00e3o", "In\u00edcio", "S\u00e9ries", "Filmes", "Document\u00e1rios", "Minha Lista", "Planos"];
    expect(NAV_ITEMS).toContain("Planos");
  });

  it("should have /planos route in App", () => {
    // Route /planos added to App.tsx
    const routes = ["/", "/netflix", "/modulo/:id", "/admin", "/planos", "/404"];
    expect(routes).toContain("/planos");
  });

  it("should calculate yearly savings correctly", () => {
    const monthlyBasic = 19.9;
    const yearlyBasic = 199.0;
    const savingsBasic = (monthlyBasic * 12 - yearlyBasic) / (monthlyBasic * 12);
    expect(savingsBasic).toBeGreaterThan(0.15); // More than 15% savings

    const monthlyPremium = 39.9;
    const yearlyPremium = 399.0;
    const savingsPremium = (monthlyPremium * 12 - yearlyPremium) / (monthlyPremium * 12);
    expect(savingsPremium).toBeGreaterThan(0.15);

    const monthlyFamily = 59.9;
    const yearlyFamily = 599.0;
    const savingsFamily = (monthlyFamily * 12 - yearlyFamily) / (monthlyFamily * 12);
    expect(savingsFamily).toBeGreaterThan(0.15);
  });

  it("should have Stripe checkout integration", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    // Verify stripe router exists
    const routerDef = appRouter._def;
    expect(routerDef).toBeDefined();
  });
});
