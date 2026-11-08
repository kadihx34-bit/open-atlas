import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { createGlbAsset, getGlbAssetsByOwner } from "./db";
import { getRegistry } from "./registry";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { odaDesignSchema } from "../client/src/lib/odaDesign";
import { odaPatchSchema, validateODAPatch } from "../client/src/lib/odaPatch";

const componentInput = z.object({ id: z.string(), name: z.string(), category: z.string(), slug: z.string(), source: z.string(), license: z.string(), attribution: z.string(), sourceUrl: z.string(), code: z.object({ html: z.string(), css: z.string() }) });
let livePatchCalls = 0;
const livePatchBudget = 1;
const livePatchInput = z.object({ prompt: z.string().min(8).max(600), design: z.unknown(), catalog: z.array(z.object({ id: z.string().max(100), license: z.string().max(80), category: z.string().max(100), best_for: z.string().max(160), placement: z.string().max(160), blend_mode: z.string().max(40), tintable: z.boolean(), suggested_opacity: z.number().min(0).max(1), scale: z.number().positive().max(20) })).max(24).default([]) });
const livePatchResponseSchema = { type: "object", additionalProperties: false, properties: { schemaVersion: { type: "string", enum: ["oda.design/1.0"] }, patchVersion: { type: "string", enum: ["oda.patch/1.0"] }, id: { type: "string" }, intent: { type: "string" }, source: { type: "string", enum: ["built-in-llm"] }, operations: { type: "array", minItems: 1, maxItems: 12, items: { type: "object", additionalProperties: false, properties: { op: { type: "string", enum: ["replace", "add", "remove"] }, path: { type: "array", minItems: 3, maxItems: 6, items: { type: "string" } }, value: {} }, required: ["op", "path", "value"] } } }, required: ["schemaVersion", "patchVersion", "id", "intent", "source", "operations"] } as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  registry: router({
    stats: publicProcedure.query(async () => { const data = await getRegistry(); return { total: data.total, categories: Array.from(new Set(data.components.map((component) => component.category))).sort(), source: data.source, license: data.license }; }),
    categories: publicProcedure.query(async () => { const data = await getRegistry(); return Array.from(new Set(data.components.map((component) => component.category))).sort(); }),
    search: publicProcedure.input(z.object({ query: z.string().default(""), category: z.string().optional(), limit: z.number().int().min(1).max(100).default(24) })).query(async ({ input }) => { const data = await getRegistry(); const query = input.query.trim().toLowerCase(); return data.components.filter((component) => (!input.category || component.category === input.category) && (!query || `${component.name} ${component.category} ${component.slug}`.toLowerCase().includes(query))).slice(0, input.limit).map((component) => componentInput.parse(component)); }),
    get: publicProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input }) => { const data = await getRegistry(); return data.components.find((component) => component.id === input.id) ?? null; }),
  }),
  ai: router({
    generatePatch: publicProcedure.input(livePatchInput).mutation(async ({ input }) => {
      if (livePatchCalls >= livePatchBudget) throw new Error("Built-in AI pilot budget reached; no further LLM request was made");
      const design = odaDesignSchema.parse(input.design);
      const models = await listLLMModels();
      const model = models.data.find((candidate) => candidate.id === "gpt-6-luna");
      if (!model) throw new Error("The selected gpt-6-luna model is not available in the live built-in catalog");
      livePatchCalls += 1;
      const response = await invokeLLM({
        model: model.id,
        reasoning: { effort: "minimal" },
        maxCompletionTokens: 1200,
        messages: [
          { role: "system", content: "You are a constrained ODA design patch generator. Return only a valid oda.patch/1.0 JSON object. Create a Lunatic esports social post core using the supplied brand tokens. Keep text and layout as editable ODA objects. Bitmap assets may only be referenced as assets; never claim a bitmap is editable. Use only allowed paths: brand name/colors/fonts; document name/background color; objects indexed fields content/style/x/y/width/height/rotation/opacity/visible/locked/name; group children by objects.<index>.children.<index>.<field>. Do not add assets, URLs, code, scripts, arbitrary keys, or prototype paths. Limit to 12 operations." },
          { role: "user", content: JSON.stringify({ prompt: input.prompt, brand: design.brand, objects: design.objects.map((object) => ({ id: object.id, type: object.type, name: object.name, role: object.type === "group" ? object.role : undefined, children: object.type === "group" ? object.children.map((child) => ({ id: child.id, type: child.type, content: child.type === "text" ? child.content : undefined })) : undefined })), catalog: input.catalog }) },
        ],
        responseFormat: { type: "json_schema", json_schema: { name: "oda_patch", strict: true, schema: livePatchResponseSchema } },
      });
      const content = response.choices[0]?.message?.content;
      if (typeof content !== "string") throw new Error("Built-in LLM returned no structured patch content");
      const patch = validateODAPatch(JSON.parse(content));
      return { patch: odaPatchSchema.parse(patch), model: response.model, usage: response.usage ?? null, callNumber: livePatchCalls, budget: { maxCalls: livePatchBudget, remainingCalls: Math.max(0, livePatchBudget - livePatchCalls) } };
    }),
  }),
  assets: router({
    mine: protectedProcedure.query(({ ctx }) => getGlbAssetsByOwner(ctx.user.id)),
    uploadGlb: protectedProcedure.input(z.object({ name: z.string().min(1).max(180), mimeType: z.enum(["model/gltf-binary", "application/octet-stream"]), dataBase64: z.string().min(1).max(70_000_000), hotspots: z.array(z.object({ id: z.string(), label: z.string().max(120), description: z.string().max(500), position: z.tuple([z.number(), z.number(), z.number()]) })).max(32).default([]) })).mutation(async ({ ctx, input }) => { const buffer = Buffer.from(input.dataBase64, "base64"); if (buffer.length > 50 * 1024 * 1024) throw new Error("GLB dosyası 50 MB sınırını aşamaz"); const uploaded = await storagePut(`${ctx.user.id}-glb/${input.name}`, buffer, input.mimeType); return createGlbAsset({ ownerId: ctx.user.id, name: input.name, storageKey: uploaded.key, url: uploaded.url, mimeType: input.mimeType, sizeBytes: buffer.length, hotspotsJson: JSON.stringify(input.hotspots) }); }),
  }),
});

export type AppRouter = typeof appRouter;
