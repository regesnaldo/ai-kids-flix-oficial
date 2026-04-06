/* eslint-disable no-console */
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const requiredVars = ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"];

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

  if (isProd) {
    assert(wh.startsWith("whsec_"), "[stripe-env] produção exige STRIPE_WEBHOOK_SECRET (whsec_)");
    assert(sk.startsWith("sk_live_"), "[stripe-env] produção exige STRIPE_SECRET_KEY sk_live_");
    assert(pk.startsWith("pk_live_"), "[stripe-env] produção exige NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY pk_live_");
  } else if (wh && !wh.startsWith("whsec_")) {
    assert(false, "[stripe-env] STRIPE_WEBHOOK_SECRET inválida (esperado whsec_)");
  }

  console.log(`\x1b[32m[stripe-env] OK (${isProd ? "production" : "non-production"})\x1b[0m`);
}

try {
  validate();
} catch (error) {
  console.error(String(error instanceof Error ? error.message : error));
  process.exit(1);
}
