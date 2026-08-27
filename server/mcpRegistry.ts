import type { Express, Request, Response } from "express";
import { getRegistry } from "./registry";

function sendJson(res: Response, payload: Record<string, unknown>) {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({ protocol: "open-design-atlas-mcp/v1", ...payload });
}

export function registerMcpRegistryRoutes(app: Express) {
  app.get("/api/mcp/registry", async (req: Request, res: Response) => {
    const data = await getRegistry();
    const query = typeof req.query.query === "string" ? req.query.query.trim().toLowerCase() : "";
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const requestedLimit = Number(req.query.limit ?? 24);
    const limit = Number.isFinite(requestedLimit) ? Math.min(100, Math.max(1, requestedLimit)) : 24;
    const items = data.components.filter((component) => (!category || component.category === category) && (!query || `${component.name} ${component.category} ${component.slug}`.toLowerCase().includes(query))).slice(0, limit);
    return sendJson(res, { operation: "search_components", total: data.total, count: items.length, query, category: category ?? null, components: items });
  });

  app.get("/api/mcp/registry/categories", async (_req: Request, res: Response) => {
    const data = await getRegistry();
    return sendJson(res, { operation: "list_categories", categories: Array.from(new Set(data.components.map((component) => component.category))).sort() });
  });

  app.get("/api/mcp/registry/stats", async (_req: Request, res: Response) => {
    const data = await getRegistry();
    return sendJson(res, { operation: "get_registry_stats", total: data.total, source: data.source, license: data.license });
  });

  app.get("/api/mcp/registry/:id", async (req: Request, res: Response) => {
    const data = await getRegistry();
    const component = data.components.find((item) => item.id === req.params.id);
    if (!component) return sendJson(res.status(404), { operation: "get_component", error: "component_not_found" });
    return sendJson(res, { operation: "get_component", component });
  });
}
