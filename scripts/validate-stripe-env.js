/* eslint-disable no-console */
const requiredVars = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readEnv(name) {
  return (process.env[name] || "").trim();
}

function validate() {
  const vercelEnv = (process.env.VERCEL_ENV || "").toLowerCase();
  const nodeEnv = (process.env.NODE_ENV || "").toLowerCase();
  const isProd = vercelEnv === "production" || nodeEnv === "production";

  for (const name of requiredVars) {
    assert(readEnv(name).length > 0, `[stripe-env] faltando ${name}`);
  }

  const sk = readEnv("STRIPE_SECRET_KEY");
  const pk = readEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  const wh = readEnv("STRIPE_WEBHOOK_SECRET");

  assert(sk.startsWith("sk_"), "[stripe-env] STRIPE_SECRET_KEY inválida");
  assert(pk.startsWith("pk_"), "[stripe-env] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY inválida");
  assert(wh.startsWith("whsec_"), "[stripe-env] STRIPE_WEBHOOK_SECRET inválida");

  if (isProd) {
    assert(sk.startsWith("sk_live_"), "[stripe-env] produção exige STRIPE_SECRET_KEY sk_live_");
    assert(pk.startsWith("pk_live_"), "[stripe-env] produção exige NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY pk_live_");
  }

  console.log(`[stripe-env] OK (${isProd ? "production" : "non-production"})`);
}

try {
  validate();
} catch (error) {
  console.error(String(error instanceof Error ? error.message : error));
  process.exit(1);
}
