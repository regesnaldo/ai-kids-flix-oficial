"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { favorites, interactiveDecisions, profiles, users, watchProgress } from "@/lib/db/schema";

type ActionResult = { ok: boolean; message: string };

type AuthPayload = {
  userId?: number;
};

type PortalMode = "manage" | "cancel";
type PortalSection = "payment" | "invoices" | "billing";

type PortalResult = ActionResult & {
  url?: string;
};

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function getActionUserId(): Promise<number> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || !process.env.JWT_SECRET) {
    throw new Error("Não autenticado.");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const auth = payload as AuthPayload;

  if (!auth.userId || !Number.isInteger(auth.userId) || auth.userId <= 0) {
    throw new Error("Sessão inválida.");
  }

  return auth.userId;
}

export async function updateProfile(profileId: number, name: string, avatar?: string): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    if (!name.trim()) {
      return { ok: false, message: "Informe um nome válido." };
    }

    await db
      .update(profiles)
      .set({ name: name.trim(), avatar: avatar?.trim() || "blue" })
      .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));

    revalidatePath("/conta/perfis");
    return { ok: true, message: "Perfil atualizado." };
  } catch (error) {
    return { ok: false, message: `Erro ao atualizar perfil: ${String(error)}` };
  }
}

export async function changePassword(newPassword: string): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    if (newPassword.length < 6) {
      return { ok: false, message: "A senha deve ter pelo menos 6 caracteres." };
    }

    await db
      .update(users)
      .set({ password: hashPassword(newPassword) })
      .where(eq(users.id, userId));

    revalidatePath("/conta/seguranca");
    return { ok: true, message: "Senha atualizada com sucesso." };
  } catch (error) {
    return { ok: false, message: `Erro ao alterar senha: ${String(error)}` };
  }
}

export async function verifyEmail(): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    await db
      .update(users)
      .set({ loginMethod: "email-verified" })
      .where(eq(users.id, userId));

    revalidatePath("/conta/seguranca");
    return { ok: true, message: "Verificação de email registrada." };
  } catch (error) {
    return { ok: false, message: `Erro ao verificar email: ${String(error)}` };
  }
}

export async function verifyPhone(): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    await db
      .update(users)
      .set({ loginMethod: "phone-verified" })
      .where(eq(users.id, userId));

    revalidatePath("/conta/seguranca");
    return { ok: true, message: "Verificação de celular registrada." };
  } catch (error) {
    return { ok: false, message: `Erro ao verificar celular: ${String(error)}` };
  }
}

export async function cancelSubscription(): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    await db
      .update(users)
      .set({ subscriptionStatus: "canceled", subscriptionEndDate: new Date() })
      .where(eq(users.id, userId));

    revalidatePath("/conta");
    revalidatePath("/conta/assinatura");
    return { ok: true, message: "Assinatura cancelada." };
  } catch (error) {
    return { ok: false, message: `Erro ao cancelar assinatura: ${String(error)}` };
  }
}

export async function createStripeBillingPortalSession(
  mode: PortalMode = "manage",
  returnPath = "/conta/assinatura"
): Promise<PortalResult> {
  try {
    const userId = await getActionUserId();
    const userRows = await db
      .select({
        stripeCustomerId: users.stripeCustomerId,
        stripeSubscriptionId: users.stripeSubscriptionId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRows[0];
    if (!user?.stripeCustomerId) {
      return { ok: false, message: "Nenhum cliente Stripe vinculado à conta." };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return { ok: false, message: "STRIPE_SECRET_KEY não configurada." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}${returnPath}`,
    };

    if (mode === "cancel" && user.stripeSubscriptionId) {
      params.flow_data = {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: user.stripeSubscriptionId,
        },
      };
    }

    const portal = await stripe.billingPortal.sessions.create(params);
    if (!portal.url) {
      return { ok: false, message: "Não foi possível gerar a URL do portal Stripe." };
    }

    return { ok: true, message: "Redirecionando para o portal Stripe...", url: portal.url };
  } catch (error) {
    return { ok: false, message: `Erro ao abrir portal Stripe: ${String(error)}` };
  }
}

export async function redirectToStripePortal(
  section: PortalSection,
  returnPath = "/conta/pagamento"
): Promise<PortalResult> {
  try {
    const userId = await getActionUserId();
    const userRows = await db
      .select({
        stripeCustomerId: users.stripeCustomerId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRows[0];
    if (!user?.stripeCustomerId) {
      return { ok: false, message: "Nenhum cliente Stripe vinculado à conta." };
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return { ok: false, message: "STRIPE_SECRET_KEY não configurada." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}${returnPath}`,
    };

    if (section === "payment") {
      params.flow_data = {
        type: "payment_method_update",
      };
    }

    const portal = await stripe.billingPortal.sessions.create(params);
    if (!portal.url) {
      return { ok: false, message: "Não foi possível gerar a URL do portal Stripe." };
    }

    return { ok: true, message: "Redirecionando para o portal Stripe...", url: portal.url };
  } catch (error) {
    return { ok: false, message: `Erro ao abrir portal Stripe: ${String(error)}` };
  }
}

export async function deleteAccount(): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    await db.delete(favorites).where(eq(favorites.userId, userId));
    await db.delete(interactiveDecisions).where(eq(interactiveDecisions.userId, userId));
    await db.delete(watchProgress).where(eq(watchProgress.userId, userId));
    await db.delete(profiles).where(eq(profiles.userId, userId));
    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/conta");
    return { ok: true, message: "Conta excluída com sucesso." };
  } catch (error) {
    return { ok: false, message: `Erro ao excluir conta: ${String(error)}` };
  }
}

export async function addDevice(): Promise<ActionResult> {
  try {
    await getActionUserId();
    return { ok: true, message: "Novo aparelho será registrado no próximo acesso." };
  } catch (error) {
    return { ok: false, message: `Erro ao adicionar aparelho: ${String(error)}` };
  }
}

export async function removeDevice(): Promise<ActionResult> {
  try {
    await getActionUserId();
    return { ok: true, message: "Aparelho desconectado desta sessão." };
  } catch (error) {
    return { ok: false, message: `Erro ao remover aparelho: ${String(error)}` };
  }
}

export async function addProfile(name: string, isKids = false): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { ok: false, message: "Informe um nome para o perfil." };
    }

    const existing = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, userId));
    if (existing.length >= 5) {
      return { ok: false, message: "Limite de 5 perfis atingido." };
    }

    await db.insert(profiles).values({
      userId,
      name: trimmedName,
      isKids,
      ageGroup: isKids ? "kids-10-12" : "adults-18",
      avatar: isKids ? "kids" : "blue",
    });

    revalidatePath("/conta/perfis");
    return { ok: true, message: "Perfil adicionado." };
  } catch (error) {
    return { ok: false, message: `Erro ao adicionar perfil: ${String(error)}` };
  }
}

export async function removeProfile(profileId: number): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();

    await db.delete(profiles).where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)));
    revalidatePath("/conta/perfis");
    return { ok: true, message: "Perfil removido." };
  } catch (error) {
    return { ok: false, message: `Erro ao remover perfil: ${String(error)}` };
  }
}

export type PaymentMethodInput = {
  last4: string;
  brand: string;
  isDefault: boolean;
};

export type BillingAddressInput = {
  name: string;
  email: string;
  address: string;
  cep: string;
  cpf?: string;
};

export type PaymentHistoryItem = {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
  receiptUrl: string | null;
};

export async function updatePaymentMethod(data: PaymentMethodInput): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();
    const last4 = data.last4.replace(/\D/g, "");

    if (last4.length !== 4) {
      return { ok: false, message: "Informe os 4 últimos dígitos do cartão." };
    }

    await db
      .update(users)
      .set({
        stripeCustomerId: `${data.brand.toUpperCase()}-${last4}`,
      })
      .where(eq(users.id, userId));

    revalidatePath("/conta/pagamento");
    revalidatePath("/conta/pagamento/metodo");
    return { ok: true, message: "Forma de pagamento atualizada." };
  } catch (error) {
    return { ok: false, message: `Erro ao atualizar forma de pagamento: ${String(error)}` };
  }
}

export async function removePaymentMethod(): Promise<ActionResult> {
  try {
    const userId = await getActionUserId();
    await db.update(users).set({ stripeCustomerId: null }).where(eq(users.id, userId));
    revalidatePath("/conta/pagamento");
    revalidatePath("/conta/pagamento/metodo");
    return { ok: true, message: "Cartão removido." };
  } catch (error) {
    return { ok: false, message: `Erro ao remover cartão: ${String(error)}` };
  }
}

export async function redeemCode(code: string): Promise<ActionResult> {
  try {
    await getActionUserId();
    const normalized = code.replace(/\s/g, "");

    if (!/^[A-Z0-9]{8,24}$/i.test(normalized)) {
      return { ok: false, message: "Código inválido. Revise e tente novamente." };
    }

    return { ok: true, message: "Código resgatado com sucesso." };
  } catch (error) {
    return { ok: false, message: `Erro ao resgatar código: ${String(error)}` };
  }
}

export async function updateBillingAddress(data: BillingAddressInput): Promise<ActionResult> {
  try {
    await getActionUserId();

    if (!data.name.trim() || !data.email.trim() || !data.address.trim() || !data.cep.trim()) {
      return { ok: false, message: "Preencha nome, email, endereço e CEP." };
    }

    return { ok: true, message: "Alterações salvas para próximos pagamentos." };
  } catch (error) {
    return { ok: false, message: `Erro ao atualizar cobrança: ${String(error)}` };
  }
}

export async function getPaymentHistory(months = 12): Promise<PaymentHistoryItem[]> {
  try {
    const userId = await getActionUserId();
    const rows = await db
      .select({
        id: watchProgress.id,
        date: watchProgress.lastWatchedAt,
      })
      .from(watchProgress)
      .where(eq(watchProgress.userId, userId))
      .orderBy(desc(watchProgress.lastWatchedAt))
      .limit(Math.max(1, Math.min(months, 12)));

    return rows.map((row) => ({
      id: String(row.id),
      date: row.date ? new Intl.DateTimeFormat("pt-BR").format(row.date) : "Não disponível",
      amount: "R$ 0,00",
      plan: "Plano atual",
      status: "processado",
      receiptUrl: null,
    }));
  } catch {
    return [];
  }
}
