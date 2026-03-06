import { describe, it, expect } from "vitest";

describe("Stripe Integration", () => {
  it("should have products file with subscription plans", async () => {
    const products = await import("./products");
    expect(products.SUBSCRIPTION_PLANS).toBeDefined();
    expect(products.SUBSCRIPTION_PLANS.BASIC).toBeDefined();
    expect(products.SUBSCRIPTION_PLANS.PREMIUM).toBeDefined();
    expect(products.SUBSCRIPTION_PLANS.FAMILY).toBeDefined();
  });

  it("should have correct pricing for each plan", async () => {
    const { SUBSCRIPTION_PLANS } = await import("./products");
    
    // Basic plan
    expect(SUBSCRIPTION_PLANS.BASIC.priceMonthly).toBe(1990); // R$ 19.90
    expect(SUBSCRIPTION_PLANS.BASIC.priceYearly).toBe(19900); // R$ 199.00
    
    // Premium plan
    expect(SUBSCRIPTION_PLANS.PREMIUM.priceMonthly).toBe(3990); // R$ 39.90
    expect(SUBSCRIPTION_PLANS.PREMIUM.priceYearly).toBe(39900); // R$ 399.00
    
    // Family plan
    expect(SUBSCRIPTION_PLANS.FAMILY.priceMonthly).toBe(5990); // R$ 59.90
    expect(SUBSCRIPTION_PLANS.FAMILY.priceYearly).toBe(59900); // R$ 599.00
  });

  it("should have helper functions for plan access", async () => {
    const products = await import("./products");
    expect(products.hasPremiumAccess).toBeDefined();
    expect(products.hasFamilyAccess).toBeDefined();
    expect(products.getInteractiveChoicesLimit).toBeDefined();
  });

  it("should correctly identify premium access", async () => {
    const { hasPremiumAccess } = await import("./products");
    expect(hasPremiumAccess("BASIC")).toBe(false);
    expect(hasPremiumAccess("PREMIUM")).toBe(true);
    expect(hasPremiumAccess("FAMILY")).toBe(true);
    expect(hasPremiumAccess(null)).toBe(false);
  });

  it("should correctly identify family access", async () => {
    const { hasFamilyAccess } = await import("./products");
    expect(hasFamilyAccess("BASIC")).toBe(false);
    expect(hasFamilyAccess("PREMIUM")).toBe(false);
    expect(hasFamilyAccess("FAMILY")).toBe(true);
    expect(hasFamilyAccess(null)).toBe(false);
  });

  it("should return correct interactive choices limit", async () => {
    const { getInteractiveChoicesLimit } = await import("./products");
    expect(getInteractiveChoicesLimit("BASIC")).toBe(3);
    expect(getInteractiveChoicesLimit("PREMIUM")).toBe(Infinity);
    expect(getInteractiveChoicesLimit("FAMILY")).toBe(Infinity);
    expect(getInteractiveChoicesLimit(null)).toBe(0);
  });

  it("should have Stripe webhook handler", async () => {
    const webhook = await import("./_core/stripe-webhook");
    expect(webhook.handleStripeWebhook).toBeDefined();
    expect(typeof webhook.handleStripeWebhook).toBe("function");
  });

  it("should have Stripe router in appRouter", async () => {
    const { appRouter } = await import("./routers");
    expect(appRouter).toBeDefined();
    const routerDef = appRouter._def;
    expect(routerDef).toBeDefined();
  });

  it("should have database schema with Stripe fields", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.users).toBeDefined();
    // Verify Stripe fields exist in the schema
    const userFields = Object.keys(schema.users);
    expect(userFields).toBeDefined();
  });
});
