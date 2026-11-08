import { describe, expect, it } from "vitest";
import { starterDesign, odaDesignSchema } from "../client/src/lib/odaDesign";
import { applyODAPatch, createMockAIPatch, mockPatchRoundTrip, validateODAPatch } from "../client/src/lib/odaPatch";

describe("ODA brand kit and AI patch contract", () => {
  it("accepts editable brand tokens and preset-compatible fonts", () => {
    const parsed = odaDesignSchema.parse(starterDesign);
    expect(parsed.brand.colors.primary).toBe("#315CFF");
    expect(parsed.brand.fonts.display).toBe("Space Grotesk");
    expect(parsed.brand.logoAssetId).toBeNull();
  });

  it("round-trips a deterministic mock AI patch through apply and inverse undo", () => {
    const result = mockPatchRoundTrip(starterDesign);
    expect(result.patch.source).toBe("mock-ai");
    expect(result.patch.operations).toHaveLength(3);
    expect(result.applied.brand.name).toContain("Mock AI");
    expect(result.applied.objects[0]).not.toEqual(starterDesign.objects[0]);
    expect(result.undone.brand.name).toBe(starterDesign.brand.name);
    expect(result.undone.objects[0]).toEqual(starterDesign.objects[0]);
  });

  it("rejects unsafe patch paths and unvalidated values", () => {
    expect(() => validateODAPatch({
      schemaVersion: "oda.design/1.0",
      patchVersion: "oda.patch/1.0",
      id: "unsafe",
      intent: "unsafe",
      source: "mock-ai",
      operations: [{ op: "replace", path: ["__proto__", "polluted"], value: true }],
    })).toThrow(/not allowed|Prototype/);

    const patch = createMockAIPatch(starterDesign);
    patch.operations[0] = { op: "replace", path: ["brand", "colors", "unknown"], value: starterDesign.brand.colors.accent };
    expect(() => applyODAPatch(starterDesign, patch)).toThrow(/not allowed/);

    patch.operations[0] = { op: "replace", path: ["objects", "0", "style", "__proto__"], value: starterDesign.brand.colors.accent };
    expect(() => applyODAPatch(starterDesign, patch)).toThrow(/not allowed|Prototype/);
  });
});
