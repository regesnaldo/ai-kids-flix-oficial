import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, users, watchProgress } from "@/lib/db/schema";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export type AccountPlan = "free" | "pro" | "enterprise";
export type AccountStatus = "ativa" | "inativa";
export type AccountSubscriptionStatusRaw = "active" | "pending" | "canceled";

export type AccountProfile = {
  id: number;
  nome: string;
  avatar: string;
  tipo: "Adulto" | "Infantil";
};

export type AccountAccess = {
  id: number;
  nome: string;
  ultimoAcesso: string;
  local: string;
};

export type AccountData = {
  userId: number;
  nome: string;
  email: string;
  plano: AccountPlan;
  planoLabel: string;
  status: AccountStatus;
  assinaturaDesde: string;
  proximoPagamento: string;
  valorMensal: string;
  metodoPagamento: string;
  cartaoMasked: string;
  resolucao: string;
  anuncios: string;
  perfis: AccountProfile[];
  acessosRecentes: AccountAccess[];
  senhaInfo: string;
  emailVerificado: boolean;
  celularVerificado: boolean;
  celular: string;
  doisFatores: string;
  subscriptionStatusRaw: AccountSubscriptionStatusRaw;
  hasStripeCustomer: boolean;
};

type AuthPayload = {
  userId?: string;
};

function formatDate(date: Date | null): string {
  if (!date) {
    return "Não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatRelative(date: Date | null): string {
  if (!date) {
    return "Sem registros";
  }

  const now = new Date();
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.floor((startOfNow - startOfTarget) / 86400000);

  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);

  if (diffDays <= 0) {
    return `Hoje, ${time}`;
  }
  if (diffDays === 1) {
    return `Ontem, ${time}`;
  }

  return `${new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)}, ${time}`;
}

function mapPlan(plan: "FREE" | "BASIC" | "PREMIUM" | "FAMILY" | null): {
  plano: AccountPlan;
  planoLabel: string;
  valorMensal: string;
  resolucao: string;
  anuncios: string;
} {
  if (plan === "FREE") {
    return {
      plano: "free",
      planoLabel: "Gratuito",
      valorMensal: "R$ 0,00/mês",
      resolucao: "720p",
      anuncios: "Com anúncios",
    };
  }

  if (plan === "FAMILY") {
    return {
      plano: "enterprise",
      planoLabel: "Família",
      valorMensal: "R$ 79,90/mês",
      resolucao: "4K",
      anuncios: "Sem anúncios",
    };
  }

  if (plan === "PREMIUM") {
    return {
      plano: "pro",
      planoLabel: "Premium",
      valorMensal: "R$ 55,90/mês",
      resolucao: "4K",
      anuncios: "Intervalos limitados",
    };
  }

  return {
    plano: "pro",
    planoLabel: "Padrão",
    valorMensal: "R$ 39,90/mês",
    resolucao: "1080p",
    anuncios: "Intervalos limitados",
  };
}

function mapStatus(status: "active" | "canceled" | "past_due" | "trialing" | null): AccountStatus {
  if (status === "active" || status === "trialing") {
    return "ativa";
  }
  return "inativa";
}

function mapSubscriptionStatusRaw(
  status: "active" | "canceled" | "past_due" | "trialing" | null
): AccountSubscriptionStatusRaw {
  if (status === "active") {
    return "active";
  }
  if (status === "canceled") {
    return "canceled";
  }
  return "pending";
}

async function getAuthenticatedUserId(): Promise<number> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const auth = (await verifyToken(token)) as AuthPayload | null;
    const userId = auth?.userId ? Number(auth.userId) : NaN;

    if (!Number.isInteger(userId) || userId <= 0) {
      redirect("/login");
    }

    return userId;
  } catch {
    redirect("/login");
  }
}

export async function getAccountData(): Promise<AccountData> {
  const userId = await getAuthenticatedUserId();

  const userRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.subscriptionPlan,
      status: users.subscriptionStatus,
      subscriptionEndDate: users.subscriptionEndDate,
      stripeCustomerId: users.stripeCustomerId,
      createdAt: users.createdAt,
      lastSignedIn: users.lastSignedIn,
      updatedAt: users.updatedAt,
      loginMethod: users.loginMethod,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = userRows[0];
  if (!user) {
    redirect("/login");
  }

  const plan = mapPlan(user.plan ?? null);

  const userProfiles = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      avatar: profiles.avatar,
      isKids: profiles.isKids,
    })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(8);

  const recentAccessRows = await db
    .select({
      id: watchProgress.id,
      lastWatchedAt: watchProgress.lastWatchedAt,
      seasonNumber: watchProgress.seasonNumber,
      episodeNumber: watchProgress.episodeNumber,
    })
    .from(watchProgress)
    .where(and(eq(watchProgress.userId, userId)))
    .orderBy(desc(watchProgress.lastWatchedAt))
    .limit(5);

  const mappedProfiles: AccountProfile[] = userProfiles.map((profile) => ({
    id: profile.id,
    nome: profile.name,
    avatar: profile.avatar ?? "blue",
    tipo: profile.isKids ? "Infantil" : "Adulto",
  }));

  const mappedAccesses: AccountAccess[] = recentAccessRows.map((access) => ({
    id: access.id,
    nome: `Sessão web #${access.id}`,
    ultimoAcesso: formatRelative(access.lastWatchedAt),
    local: "São Paulo, BR",
  }));

  if (mappedAccesses.length === 0) {
    mappedAccesses.push({
      id: 0,
      nome: "Sessão atual",
      ultimoAcesso: formatRelative(user.lastSignedIn),
      local: "São Paulo, BR",
    });
  }

  const emailVerificado = Boolean(user.email);
  const celularVerificado = false;
  const paymentLast4 = user.stripeCustomerId ? user.stripeCustomerId.slice(-4) : null;

  return {
    userId,
    nome: user.name ?? "Usuário",
    email: user.email ?? "Não disponível",
    plano: plan.plano,
    planoLabel: plan.planoLabel,
    status: mapStatus(user.status ?? null),
    assinaturaDesde: formatDate(user.createdAt),
    proximoPagamento: user.subscriptionEndDate ? formatDate(user.subscriptionEndDate) : "Em breve",
    valorMensal: plan.valorMensal,
    metodoPagamento: user.stripeCustomerId ? "Cartão cadastrado via Stripe" : "Não cadastrado",
    cartaoMasked: paymentLast4 ?? "Não disponível",
    resolucao: plan.resolucao,
    anuncios: plan.anuncios,
    perfis: mappedProfiles,
    acessosRecentes: mappedAccesses,
    senhaInfo: `Última alteração em ${formatDate(user.updatedAt)}`,
    emailVerificado,
    celularVerificado,
    celular: "Não cadastrado",
    doisFatores: user.loginMethod === "2fa" ? "Ativado" : "Desativado",
    subscriptionStatusRaw: mapSubscriptionStatusRaw(user.status ?? null),
    hasStripeCustomer: Boolean(user.stripeCustomerId),
  };
}
