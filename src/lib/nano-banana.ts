export interface NanoBananaConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeout: number;
}

export const DEFAULT_CONFIG: NanoBananaConfig = {
  apiKey: process.env.NANO_BANANA_API_KEY || "",
  baseUrl: process.env.NANO_BANANA_BASE_URL || "https://api.nanobanana.ai/v1",
  model: process.env.NANO_BANANA_MODEL || "pro-generator-v2",
  timeout: 60000,
};

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  cfgScale?: number;
  style?: string;
}

export async function generateImage(
  params: GenerateImageParams,
  config: NanoBananaConfig = DEFAULT_CONFIG
): Promise<Buffer> {
  if (!config.apiKey) {
    throw new Error("NANO_BANANA_API_KEY não configurada");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const response = await fetch(`${config.baseUrl}/images/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        width: params.width || 1024,
        height: params.height || 1024,
        steps: params.steps || 30,
        cfg_scale: params.cfgScale || 7,
        style_preset: params.style,
        output_format: "png",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`Nano Banana API error: ${response.status} - ${error}`);
    }

    const data = await response.arrayBuffer();
    return Buffer.from(data);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkUsage(config: NanoBananaConfig = DEFAULT_CONFIG) {
  if (!config.apiKey) return null;
  try {
    const response = await fetch(`${config.baseUrl}/usage`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

