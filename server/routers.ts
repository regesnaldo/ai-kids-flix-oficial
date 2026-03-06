import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as dbHelpers from "./db-helpers";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import Stripe from "stripe";
import { SUBSCRIPTION_PLANS, type SubscriptionPlanType } from "./products";
import { videoInteractionRouter } from "./video-interaction-router";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  series: router({
    getAll: publicProcedure.query(() => dbHelpers.getAllSeries()),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(({ input }) => dbHelpers.getSeriesByCategory(input.category)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => dbHelpers.getSeriesById(input.id)),
  }),

  episodes: router({
    getBySeriesAndSeason: publicProcedure
      .input(z.object({ seriesId: z.number(), seasonNumber: z.number() }))
      .query(({ input }) => dbHelpers.getEpisodesBySeriesAndSeason(input.seriesId, input.seasonNumber)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => dbHelpers.getEpisodeById(input.id)),
    getBySeriesId: publicProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(({ input }) => dbHelpers.getEpisodesBySeriesId(input.seriesId)),
  }),

  watchProgress: router({
    getUserProgress: protectedProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(({ ctx, input }) => dbHelpers.getUserWatchProgress(ctx.user.id, input.seriesId)),
    getEpisodeProgress: protectedProcedure
      .input(z.object({ episodeId: z.number() }))
      .query(({ ctx, input }) => dbHelpers.getEpisodeProgress(ctx.user.id, input.episodeId)),
    updateProgress: protectedProcedure
      .input(z.object({
        seriesId: z.number(),
        episodeId: z.number(),
        seasonNumber: z.number(),
        episodeNumber: z.number(),
        progressSeconds: z.number(),
        totalSeconds: z.number(),
        isCompleted: z.boolean(),
      }))
      .mutation(({ ctx, input }) =>
        dbHelpers.updateWatchProgress({
          userId: ctx.user.id,
          ...input,
        })
      ),
    getContinueWatching: protectedProcedure.query(({ ctx }) =>
      dbHelpers.getContinueWatching(ctx.user.id)
    ),
    getWatchHistory: protectedProcedure.query(({ ctx }) =>
      dbHelpers.getWatchHistory(ctx.user.id)
    ),
  }),

  favorites: router({
    getUserFavorites: protectedProcedure.query(({ ctx }) =>
      dbHelpers.getUserFavorites(ctx.user.id)
    ),
    isFavorite: protectedProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(({ ctx, input }) => dbHelpers.isFavorite(ctx.user.id, input.seriesId)),
    addToFavorites: protectedProcedure
      .input(z.object({ seriesId: z.number() }))
      .mutation(({ ctx, input }) =>
        dbHelpers.addToFavorites({
          userId: ctx.user.id,
          seriesId: input.seriesId,
        })
      ),
    removeFromFavorites: protectedProcedure
      .input(z.object({ seriesId: z.number() }))
      .mutation(({ ctx, input }) =>
        dbHelpers.removeFromFavorites(ctx.user.id, input.seriesId)
      ),
  }),

  chat: router({
    sendMessage: protectedProcedure
      .input(z.object({ message: z.string(), context: z.any().optional() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "Você é um assistente amigável da plataforma A.I. Kids Labs. Ajude os usuários a aprender sobre inteligência artificial de forma divertida e educativa. Responda em português brasileiro.",
              },
              {
                role: "user",
                content: input.message,
              },
            ],
          });

          const botResponse = (typeof response.choices[0]?.message?.content === 'string' ? response.choices[0]?.message?.content : 'Desculpe, não consegui processar sua mensagem.') || 'Desculpe, não consegui processar sua mensagem.';

          await dbHelpers.saveChatMessage({
            userId: ctx.user.id,
            userMessage: input.message,
            botResponse,
            context: input.context,
          });

          return {
            userMessage: input.message,
            botResponse: String(botResponse),
          };
        } catch (error) {
          console.error("[Chat] Error:", error);
          return {
            userMessage: input.message,
            botResponse: "Desculpe, houve um erro ao processar sua mensagem. Tente novamente.",
          };
        }
      }),
    getHistory: protectedProcedure.query(({ ctx }) =>
      dbHelpers.getUserChatHistory(ctx.user.id)
    ),
  }),

  videoInteraction: videoInteractionRouter,

  interactive: router({
    /** Generate choices for an episode using LLM (LangGraph-style state machine) */
    generateChoices: protectedProcedure
      .input(z.object({
        seriesId: z.number(),
        episodeId: z.number(),
        episodeTitle: z.string(),
        seriesTitle: z.string(),
        previousDecisions: z.array(z.object({
          choiceLabel: z.string(),
          narrativeResponse: z.string().nullable(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Build decision history context
          const historyContext = input.previousDecisions && input.previousDecisions.length > 0
            ? `\n\nDecisões anteriores do usuário nesta série:\n${input.previousDecisions.map((d, i) => `${i + 1}. Escolheu: "${d.choiceLabel}" -> Resultado: ${d.narrativeResponse || 'N/A'}`).join('\n')}`
            : '';

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é o narrador interativo da plataforma A.I. Kids Labs. Após cada episódio, você gera escolhas narrativas que afetam a história.

Regras:
- Gere exatamente 4 escolhas ramificadas relacionadas ao tema do episódio
- Cada escolha deve ter um ID curto (snake_case), um label em português, e uma descrição curta
- As escolhas devem incluir: cooperação, confronto, investigação e um dilema ético
- Adapte as escolhas com base nas decisões anteriores do usuário (se houver)
- Responda APENAS em JSON válido, sem markdown`,
              },
              {
                role: "user",
                content: `Série: "${input.seriesTitle}"\nEpisódio: "${input.episodeTitle}"${historyContext}\n\nGere 4 escolhas interativas em JSON com o formato:\n{"choices": [{"id": "string", "label": "string", "description": "string", "type": "cooperate|confront|investigate|ethical_dilemma", "emoji": "string"}]}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "interactive_choices",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    choices: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Short snake_case ID" },
                          label: { type: "string", description: "Choice label in Portuguese" },
                          description: { type: "string", description: "Brief description" },
                          type: { type: "string", enum: ["cooperate", "confront", "investigate", "ethical_dilemma"] },
                          emoji: { type: "string", description: "Single emoji" },
                        },
                        required: ["id", "label", "description", "type", "emoji"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["choices"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0]?.message?.content;
          const parsed = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content));
          return parsed;
        } catch (error) {
          console.error("[Interactive] Error generating choices:", error);
          // Fallback choices
          return {
            choices: [
              { id: "cooperate", label: "Cooperar com a IA", description: "Trabalhar junto com a inteligência artificial", type: "cooperate", emoji: "🤝" },
              { id: "confront", label: "Questionar a IA", description: "Desafiar as decisões da máquina", type: "confront", emoji: "⚡" },
              { id: "investigate", label: "Investigar mais", description: "Buscar mais informações antes de decidir", type: "investigate", emoji: "🔍" },
              { id: "ethical_dilemma", label: "Dilema ético", description: "Refletir sobre as consequências morais", type: "ethical_dilemma", emoji: "🧠" },
            ],
          };
        }
      }),

    /** Process a user's choice and generate narrative response */
    makeChoice: protectedProcedure
      .input(z.object({
        seriesId: z.number(),
        episodeId: z.number(),
        choiceId: z.string(),
        choiceLabel: z.string(),
        choiceType: z.string(),
        episodeTitle: z.string(),
        seriesTitle: z.string(),
        previousDecisions: z.array(z.object({
          choiceLabel: z.string(),
          narrativeResponse: z.string().nullable(),
        })).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const historyContext = input.previousDecisions && input.previousDecisions.length > 0
            ? `\n\nDecisões anteriores:\n${input.previousDecisions.map((d, i) => `${i + 1}. "${d.choiceLabel}"`).join('\n')}`
            : '';

          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `Você é o narrador interativo da plataforma A.I. Kids Labs. O usuário fez uma escolha após assistir um episódio. Gere uma resposta narrativa emocionante e educativa (2-3 parágrafos) que reaja à escolha dele. A resposta deve:\n- Ser em português brasileiro\n- Ter tom adequado para crianças/jovens\n- Conectar com o tema de IA e tecnologia\n- Mostrar consequências da escolha\n- Terminar com uma reflexão ou lição`,
              },
              {
                role: "user",
                content: `Série: "${input.seriesTitle}"\nEpisódio: "${input.episodeTitle}"\nEscolha: "${input.choiceLabel}" (tipo: ${input.choiceType})${historyContext}\n\nGere a resposta narrativa:`,
              },
            ],
          });

          const narrativeResponse = typeof response.choices[0]?.message?.content === 'string'
            ? response.choices[0].message.content
            : 'A aventura continua...';

          // Get existing decision path
          const existingDecisions = await dbHelpers.getDecisionPath(ctx.user.id, input.seriesId);
          const decisionPath = [
            ...existingDecisions.map(d => ({ choiceId: d.choiceId, choiceLabel: d.choiceLabel })),
            { choiceId: input.choiceId, choiceLabel: input.choiceLabel },
          ];

          // Save to database
          await dbHelpers.saveInteractiveDecision({
            userId: ctx.user.id,
            episodeId: input.episodeId,
            seriesId: input.seriesId,
            choiceId: input.choiceId,
            choiceLabel: input.choiceLabel,
            narrativeResponse,
            graphState: { currentNode: input.choiceType, episodeId: input.episodeId },
            decisionPath,
          });

          return {
            narrativeResponse,
            decisionPath,
          };
        } catch (error) {
          console.error("[Interactive] Error processing choice:", error);
          return {
            narrativeResponse: `Você escolheu "${input.choiceLabel}". A aventura continua e suas decisões moldam o futuro da história!`,
            decisionPath: [],
          };
        }
      }),

    /** Get user's decision history for a series */
    getDecisionHistory: protectedProcedure
      .input(z.object({ seriesId: z.number() }))
      .query(({ ctx, input }) => dbHelpers.getUserDecisionsForSeries(ctx.user.id, input.seriesId)),
  }),

  admin: router({
    /** Get all episodes for admin management */
    getEpisodes: adminProcedure.query(() => dbHelpers.getAllEpisodesAdmin()),
    
    /** Upload video to S3 and update episode URL */
    uploadVideo: adminProcedure
      .input(z.object({
        episodeId: z.number(),
        fileName: z.string(),
        fileBase64: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileBase64, 'base64');
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const fileKey = `videos/episode-${input.episodeId}/${input.fileName}-${randomSuffix}`;
        
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        const updated = await dbHelpers.updateEpisodeVideoUrl(input.episodeId, url);
        
        return { url, episode: updated };
      }),

    /** Update episode video URL directly (for external URLs) */
    updateVideoUrl: adminProcedure
      .input(z.object({
        episodeId: z.number(),
        videoUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const updated = await dbHelpers.updateEpisodeVideoUrl(input.episodeId, input.videoUrl);
        return { episode: updated };
      }),

    /** Get all series for admin */
    getSeries: adminProcedure.query(() => dbHelpers.getAllSeries()),
  }),

  /** Recommendation engine */
  recommendations: router({
    /** Get personalized recommendations based on watch history + decisions + preferences */
    getPersonalized: protectedProcedure.query(async ({ ctx }) => {
      const [progress, decisions, prefs, allSeries] = await Promise.all([
        dbHelpers.getAllUserWatchProgress(ctx.user.id),
        dbHelpers.getAllUserDecisions(ctx.user.id),
        dbHelpers.getUserPreferences(ctx.user.id),
        dbHelpers.getAllSeries(),
      ]);

      // Continue watching: incomplete episodes
      const continueWatching = progress
        .filter(p => !p.isCompleted && (p.progressSeconds ?? 0) > 0)
        .slice(0, 10);

      // Watched series IDs
      const watchedSeriesIds = new Set(progress.map(p => p.seriesId));

      // Decision-based: series where user made choices
      const decisionSeriesIds = new Set(decisions.map(d => d.seriesId));
      const basedOnDecisions = allSeries.filter(s => decisionSeriesIds.has(s.id)).slice(0, 10);

      // Recommended: series not yet watched
      const recommended = allSeries.filter(s => !watchedSeriesIds.has(s.id)).slice(0, 10);

      // Trending: all series sorted by rating
      const trending = [...allSeries].sort((a, b) => parseFloat(String(b.rating || '0')) - parseFloat(String(a.rating || '0'))).slice(0, 10);

      return {
        continueWatching,
        basedOnDecisions,
        recommended,
        trending,
        userPreferences: prefs,
        totalWatched: progress.filter(p => p.isCompleted).length,
        totalDecisions: decisions.length,
      };
    }),
  }),
  userPreferences: router({
    get: protectedProcedure.query(({ ctx }) =>
      dbHelpers.getUserPreferences(ctx.user.id)
    ),
    update: protectedProcedure
      .input(z.object({
        themeMode: z.enum(["kids", "teens", "adults"]).optional(),
        language: z.string().optional(),
        notificationsEnabled: z.boolean().optional(),
        autoPlayEnabled: z.boolean().optional(),
      }))
      .mutation(({ ctx, input }) =>
        dbHelpers.updateUserPreferences(ctx.user.id, input)
      ),
  }),

  // Stripe Checkout & Subscriptions
  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        planType: z.enum(["BASIC", "PREMIUM", "FAMILY"]),
        interval: z.enum(["month", "year"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const plan = SUBSCRIPTION_PLANS[input.planType];
        const priceAmount = input.interval === "month" ? plan.priceMonthly : plan.priceYearly;
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "brl",
                product_data: {
                  name: plan.name,
                  description: plan.description,
                },
                unit_amount: priceAmount,
                recurring: {
                  interval: input.interval,
                },
              },
              quantity: 1,
            },
          ],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan_type: input.planType,
          },
          subscription_data: {
            metadata: {
              plan_type: input.planType,
            },
          },
          allow_promotion_codes: true,
          success_url: `${ctx.req.headers.origin}/netflix?payment=success`,
          cancel_url: `${ctx.req.headers.origin}/netflix?payment=canceled`,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      }),

    getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
      return {
        plan: ctx.user.subscriptionPlan || null,
        status: ctx.user.subscriptionStatus || null,
        endDate: ctx.user.subscriptionEndDate || null,
      };
    }),

    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeSubscriptionId) {
        throw new Error("No active subscription found");
      }

      // Cancel at period end (user keeps access until end of billing period)
      await stripe.subscriptions.update(ctx.user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
