import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { createGlbAsset, getGlbAssetsByOwner } from "./db";
import { getRegistry } from "./registry";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const componentInput = z.object({ id: z.string(), name: z.string(), category: z.string(), slug: z.string(), source: z.string(), license: z.string(), attribution: z.string(), sourceUrl: z.string(), code: z.object({ html: z.string(), css: z.string() }) });

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
  assets: router({
    mine: protectedProcedure.query(({ ctx }) => getGlbAssetsByOwner(ctx.user.id)),
    uploadGlb: protectedProcedure.input(z.object({ name: z.string().min(1).max(180), mimeType: z.enum(["model/gltf-binary", "application/octet-stream"]), dataBase64: z.string().min(1).max(70_000_000), hotspots: z.array(z.object({ id: z.string(), label: z.string().max(120), description: z.string().max(500), position: z.tuple([z.number(), z.number(), z.number()]) })).max(32).default([]) })).mutation(async ({ ctx, input }) => { const buffer = Buffer.from(input.dataBase64, "base64"); if (buffer.length > 50 * 1024 * 1024) throw new Error("GLB dosyası 50 MB sınırını aşamaz"); const uploaded = await storagePut(`${ctx.user.id}-glb/${input.name}`, buffer, input.mimeType); return createGlbAsset({ ownerId: ctx.user.id, name: input.name, storageKey: uploaded.key, url: uploaded.url, mimeType: input.mimeType, sizeBytes: buffer.length, hotspotsJson: JSON.stringify(input.hotspots) }); }),
  }),
});

export type AppRouter = typeof appRouter;
