import { describe, expect, it } from "vitest";
import { odaDesignSchema, starterDesign } from "../client/src/lib/odaDesign";

describe("ODA design contract", () => {
  it("accepts and round-trips the 1080x1080 starter design", () => {
    const parsed = odaDesignSchema.parse(JSON.parse(JSON.stringify(starterDesign)));
    expect(parsed.schemaVersion).toBe("oda.design/1.0");
    expect(parsed.document.width).toBe(1080);
    expect(parsed.objects.find((object) => object.type === "group")?.type).toBe("group");
  });

  it("rejects duplicate object ids", () => {
    const invalid = JSON.parse(JSON.stringify(starterDesign));
    invalid.objects.push({ ...invalid.objects[0] });
    expect(() => odaDesignSchema.parse(invalid)).toThrow(/Duplicate object id/);
  });

  it("rejects an image object whose asset is not declared", () => {
    const invalid = JSON.parse(JSON.stringify(starterDesign));
    invalid.objects.push({
      id: "missing-image",
      type: "image",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 1,
      assetId: "not-in-assets",
      sourceKind: "bitmap",
      alt: "missing",
    });
    expect(() => odaDesignSchema.parse(invalid)).toThrow(/Missing asset/);
  });

  it("accepts a local user-upload image asset with crop metadata", () => {
    const design = JSON.parse(JSON.stringify(starterDesign));
    design.assets.push({
      id: "asset-local-test",
      kind: "image",
      src: "data:image/jpeg;base64,local-test",
      alt: "local fixture",
      width: 640,
      height: 360,
      source: "user-upload",
    });
    design.objects.push({
      id: "image-local-test",
      type: "image",
      x: 120,
      y: 240,
      width: 720,
      height: 460,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 4,
      assetId: "asset-local-test",
      sourceKind: "user-upload",
      alt: "local fixture",
      crop: { x: 0, y: 0, scale: 1.7 },
    });
    const parsed = odaDesignSchema.parse(design);
    const image = parsed.objects.find((object) => object.id === "image-local-test");
    expect(image?.type).toBe("image");
    expect(image?.type === "image" ? image.crop?.scale : undefined).toBe(1.7);
  });
});
