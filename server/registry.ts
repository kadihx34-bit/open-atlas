import { readFile } from "node:fs/promises";
import path from "node:path";

export type RegistryComponent = { id: string; name: string; category: string; slug: string; source: string; license: string; attribution: string; sourceUrl: string; code: { html: string; css: string } };
export type RegistryPayload = { source: string; license: string; total: number; components: RegistryComponent[] };
let cache: RegistryPayload | null = null;

export async function getRegistry(): Promise<RegistryPayload> {
  if (cache) return cache;
  const filePath = path.resolve(process.cwd(), "client/src/data/uiverse-registry.json");
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as RegistryPayload;
  cache = parsed;
  return parsed;
}
