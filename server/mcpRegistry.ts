import { randomUUID } from "node:crypto";
import type { Express, Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod/v4";
import { getRegistry } from "./registry";

type RegistryTransport = StreamableHTTPServerTransport;
const transports = new Map<string, RegistryTransport>();

function sendJson(res: Response, payload: Record<string, unknown>) {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.json({ protocol: "open-design-atlas-mcp/v1", ...payload });
}

async function searchComponents(query: string, category?: string, limit = 24) {
  const data = await getRegistry();
  const normalized = query.trim().toLowerCase();
  const safeLimit = Math.min(100, Math.max(1, Number.isFinite(limit) ? limit : 24));
  return {
    total: data.total,
    components: data.components
      .filter((component) => (!category || component.category === category) && (!normalized || `${component.name} ${component.category} ${component.slug}`.toLowerCase().includes(normalized)))
      .slice(0, safeLimit),
  };
}

function createMcpServer() {
  const server = new McpServer({ name: "open-design-atlas", version: "1.0.0" });
  server.registerTool("search_components", {
    description: "Search the local Open Design Atlas component registry.",
    inputSchema: { query: z.string().optional(), category: z.string().optional(), limit: z.number().int().min(1).max(100).optional() },
  }, async ({ query = "", category, limit = 24 }) => {
    const result = await searchComponents(query, category, limit);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  });
  server.registerTool("get_component", {
    description: "Get one component from the local registry by id or slug.",
    inputSchema: { id: z.string().min(1) },
  }, async ({ id }) => {
    const data = await getRegistry();
    const component = data.components.find((item) => item.id === id || item.slug === id);
    if (!component) return { isError: true, content: [{ type: "text", text: "component_not_found" }] };
    return { content: [{ type: "text", text: JSON.stringify(component) }] };
  });
  server.registerTool("list_categories", {
    description: "List all categories in the local component registry.",
    inputSchema: {},
  }, async () => {
    const data = await getRegistry();
    const categories = Array.from(new Set(data.components.map((component) => component.category))).sort();
    return { content: [{ type: "text", text: JSON.stringify({ categories }) }] };
  });
  server.registerTool("get_registry_stats", {
    description: "Get registry totals and source metadata.",
    inputSchema: {},
  }, async () => {
    const data = await getRegistry();
    return { content: [{ type: "text", text: JSON.stringify({ total: data.total, source: data.source, license: data.license }) }] };
  });
  return server;
}

async function handleMcpRequest(req: Request, res: Response) {
  try {
    const sessionId = req.headers["mcp-session-id"];
    let transport = typeof sessionId === "string" ? transports.get(sessionId) : undefined;
    if (!transport && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: true,
        onsessioninitialized: (id) => { if (transport) transports.set(id, transport); },
      });
      await createMcpServer().connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }
    if (!transport) {
      res.status(400).json({ jsonrpc: "2.0", error: { code: -32000, message: "Missing or invalid MCP session" }, id: null });
      return;
    }
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("[MCP] request failed", error);
    if (!res.headersSent) res.status(500).json({ jsonrpc: "2.0", error: { code: -32603, message: "Internal MCP server error" }, id: null });
  }
}

export function registerMcpRegistryRoutes(app: Express) {
  app.get("/api/mcp/registry", async (req: Request, res: Response) => {
    const query = typeof req.query.query === "string" ? req.query.query : "";
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const limit = Number(req.query.limit ?? 24);
    const result = await searchComponents(query, category, limit);
    return sendJson(res, { operation: "search_components", query, category: category ?? null, count: result.components.length, ...result });
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
    const component = data.components.find((item) => item.id === req.params.id || item.slug === req.params.id);
    if (!component) return sendJson(res.status(404), { operation: "get_component", error: "component_not_found" });
    return sendJson(res, { operation: "get_component", component });
  });
  app.post("/api/mcp", handleMcpRequest);
  app.get("/api/mcp", (_req: Request, res: Response) => res.status(405).set("Allow", "POST").send("Method Not Allowed"));
  app.delete("/api/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"];
    if (typeof sessionId === "string") {
      const transport = transports.get(sessionId);
      transports.delete(sessionId);
      await transport?.close();
    }
    res.status(200).json({ ok: true });
  });
}
