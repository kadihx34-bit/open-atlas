import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } satisfies TrpcContext;

describe("registry", () => {
  it("reports the imported Uiverse registry and categories", async () => {
    const caller = appRouter.createCaller(publicContext);
    const stats = await caller.registry.stats();
    expect(stats.total).toBeGreaterThanOrEqual(3802);
    expect(stats.license).toBe("MIT");
    expect(stats.categories.length).toBeGreaterThan(0);
  });

  it("searches by query and returns copy-ready code", async () => {
    const caller = appRouter.createCaller(publicContext);
    const results = await caller.registry.search({ query: "button", limit: 2 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.code.html).toContain("<button");
    expect(results[0]?.code.css.length).toBeGreaterThan(0);
  });
});
