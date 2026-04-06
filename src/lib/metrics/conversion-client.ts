"use client";

export type ConversionEventName = "page_view" | "sign_up" | "paywall_hit" | "purchase";

interface TrackConversionInput {
  event: ConversionEventName;
  path?: string;
  metadata?: Record<string, unknown>;
  source?: string;
}

export async function trackConversion(input: TrackConversionInput) {
  const payload = {
    event: input.event,
    path: input.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
    metadata: input.metadata ?? null,
    source: input.source ?? "frontend",
  };

  console.info("[conversion:client]", payload);

  try {
    await fetch("/api/metrics/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("[conversion:client] falha ao enviar evento", error);
  }
}
