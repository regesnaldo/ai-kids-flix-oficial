import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as dbHelpers from "./db-helpers";
import { invokeLLM } from "./_core/llm";

export const videoInteractionRouter = router({
  /** Generate interactive question + 3 options for video interaction */
  generateQuestion: protectedProcedure
    .input(z.object({
      seriesId: z.number(),
      episodeId: z.number(),
      episodeTitle: z.string(),
      seriesTitle: z.string(),
      currentTime: z.number().optional(),
      ageGroup: z.enum(["child", "teen", "adult"]).default("teen"),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const agePrompts: Record<string, string> = {
          child: "Você é um narrador educativo para crianças. Crie uma pergunta simples, clara e respeitosa sobre o episódio. Use linguagem amigável e conceitos que crianças entendem. Sem termos técnicos complexos.",
          teen: "Você é um narrador educativo para jovens. Crie uma pergunta que estimule o pensamento crítico sobre o tema do episódio. Use linguagem clara e relevante para jovens.",
          adult: "Você é um narrador educativo para adultos. Crie uma pergunta que explore aspectos éticos, sociais ou técnicos do tema. Use linguagem profissional e respeitosa.",
        };

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `${agePrompts[input.ageGroup]}

Regras:
- Gere UMA pergunta curta (1-2 linhas)
- Gere exatamente 3 opções
- Cada opção deve ser concisa (1 linha)
- Não use emojis
- Não crie histórias longas
- Responda APENAS em JSON válido, sem markdown`,
            },
            {
              role: "user",
              content: `Série: "${input.seriesTitle}"
Episódio: "${input.episodeTitle}"
Tempo: ${input.currentTime || 0}s

Gere uma pergunta interativa com 3 opções em JSON:
{"question": "string", "options": [{"id": "string", "label": "string"}, ...]}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "video_interaction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  question: { type: "string", description: "Interactive question" },
                  options: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Option ID" },
                        label: { type: "string", description: "Option label" },
                      },
                      required: ["id", "label"],
                      additionalProperties: false,
                    },
                    minItems: 3,
                    maxItems: 3,
                  },
                },
                required: ["question", "options"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
        return parsed;
      } catch (error) {
        console.error("[Video Interaction] Error generating question:", error);
        return {
          question: "O que você achou do que viu neste momento?",
          options: [
            { id: "option_1", label: "Muito interessante" },
            { id: "option_2", label: "Preciso pensar mais" },
            { id: "option_3", label: "Quero saber mais" },
          ],
        };
      }
    }),

  /** Record video interaction choice */
  recordChoice: protectedProcedure
    .input(z.object({
      seriesId: z.number(),
      episodeId: z.number(),
      choiceId: z.string(),
      choiceLabel: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await dbHelpers.saveInteractiveDecision({
          userId: ctx.user.id,
          episodeId: input.episodeId,
          seriesId: input.seriesId,
          choiceId: input.choiceId,
          choiceLabel: input.choiceLabel,
          narrativeResponse: null,
          graphState: { type: "video_interaction" },
          decisionPath: [],
        });

        return { success: true };
      } catch (error) {
        console.error("[Video Interaction] Error recording choice:", error);
        throw error;
      }
    }),
});
