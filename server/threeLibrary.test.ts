import { describe, expect, it } from "vitest";
import { getThreePreset, threePresetIds } from "../client/src/components/ThreeGallery";

describe("Three.js library preset contract", () => {
  it("keeps the ten curated scenes addressable", () => {
    expect(threePresetIds).toHaveLength(11);
    expect(threePresetIds).toContain("particles");
    expect(threePresetIds).toContain("product");
    expect(threePresetIds).toContain("mesh3d-object");
  });

  it("falls back to the first safe scene for an unknown id", () => {
    expect(getThreePreset("missing-scene").id).toBe("orbit");
    expect(getThreePreset("particles").title).toBe("Particle Weather");
  });
});
