import { z } from "zod";

export const ODA_SCHEMA_VERSION = "oda.design/1.0" as const;
export const ODA_FONT_FAMILIES = [
  "Inter",
  "IBM Plex Sans",
  "IBM Plex Mono",
  "Space Grotesk",
  "Source Sans 3",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "Raleway",
] as const;

const finite = z.number().finite();
const color = z.string().regex(/^(#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|rgb(a)?\([^)]*\)|hsl(a)?\([^)]*\))$/i);
const fontFamily = z.enum(ODA_FONT_FAMILIES);
const baseObject = z.object({
  id: z.string().min(1).max(80),
  name: z.string().max(120).optional(),
  x: finite,
  y: finite,
  width: finite.positive().max(1080),
  height: finite.positive().max(1080),
  rotation: finite.default(0),
  opacity: finite.min(0).max(1).default(1),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
  zIndex: z.number().int().min(-10000).max(10000).default(0),
});

const style = z.object({
  fill: color.optional(),
  stroke: color.nullable().optional(),
  strokeWidth: finite.min(0).max(100).optional(),
  radius: finite.min(0).max(540).optional(),
});

const textObject = baseObject.extend({
  type: z.literal("text"),
  content: z.string().max(2000),
  style: z.object({
    fontFamily,
    fontSize: finite.min(4).max(360),
    fontWeight: z.number().int().min(100).max(900),
    lineHeight: finite.min(0.5).max(3),
    letterSpacing: finite.min(-100).max(100),
    textAlign: z.enum(["left", "center", "right"]),
    fill: color,
  }),
});

const rectObject = baseObject.extend({ type: z.literal("rect"), style });
const ellipseObject = baseObject.extend({ type: z.literal("ellipse"), style });
const lineObject = baseObject.extend({
  type: z.literal("line"),
  x2: finite,
  y2: finite,
  style: z.object({ stroke: color, strokeWidth: finite.min(1).max(100) }),
});

const imageObject = baseObject.extend({
  type: z.literal("image"),
  assetId: z.string().min(1).max(100),
  sourceKind: z.enum(["user-upload", "generated", "bitmap" ]),
  alt: z.string().max(240),
  crop: z.object({ x: finite, y: finite, scale: finite.positive().max(20) }).optional(),
});

export const ODA_BRAND_COLOR_KEYS = ["primary", "secondary", "accent", "surface", "text"] as const;
export const ODA_BRAND_FONT_KEYS = ["display", "body", "mono"] as const;
const brandKitSchema = z.object({
  name: z.string().min(1).max(120),
  colors: z.object({
    primary: color,
    secondary: color,
    accent: color,
    surface: color,
    text: color,
  }),
  fonts: z.object({ display: fontFamily, body: fontFamily, mono: fontFamily }),
  logoAssetId: z.string().min(1).max(100).nullable(),
  imageAssetIds: z.array(z.string().min(1).max(100)).max(16),
});

export const odaObjectSchema: z.ZodType<ODAObject> = z.lazy(() => z.discriminatedUnion("type", [
  textObject,
  rectObject,
  ellipseObject,
  lineObject,
  imageObject,
  z.object({
    ...baseObject.shape,
    type: z.literal("group"),
    role: z.enum(["typographic-block", "card", "frame", "badge", "custom"]),
    children: z.array(odaObjectSchema).min(1).max(40),
  }),
]));

export const odaDesignSchema = z.object({
  schemaVersion: z.literal(ODA_SCHEMA_VERSION),
  document: z.object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(180),
    width: z.literal(1080),
    height: z.literal(1080),
    background: z.object({ type: z.literal("solid"), color }),
    safeArea: z.object({ x: finite, y: finite, width: finite.positive(), height: finite.positive() }),
  }),
  fonts: z.array(z.object({ family: fontFamily, weight: z.number().int().min(100).max(900), style: z.enum(["normal", "italic"]) })).max(32),
  assets: z.array(z.object({
    id: z.string().min(1).max(100),
    kind: z.literal("image"),
    src: z.string().min(1).max(2_000_000),
    alt: z.string().max(240),
    width: finite.positive(),
    height: finite.positive(),
    source: z.enum(["user-upload", "generated", "bitmap"]),
  })).max(64),
  brand: brandKitSchema,
  objects: z.array(odaObjectSchema).max(200),
  metadata: z.object({
    createdBy: z.enum(["human", "ai", "human-or-ai"]),
    lastOperation: z.enum(["create", "edit", "load", "undo", "redo"]),
    editable: z.literal(true),
  }),
}).superRefine((document, ctx) => {
  const ids = new Set<string>();
  const assetIds = new Set(document.assets.map((asset) => asset.id));
  if (document.brand.logoAssetId && !assetIds.has(document.brand.logoAssetId)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Missing brand logo asset: ${document.brand.logoAssetId}`, path: ["brand", "logoAssetId"] });
  }
  document.brand.imageAssetIds.forEach((assetId, index) => {
    if (!assetIds.has(assetId)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Missing brand image asset: ${assetId}`, path: ["brand", "imageAssetIds", index] });
  });
  const visit = (object: ODAObject) => {
    if (ids.has(object.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate object id: ${object.id}`, path: ["objects"] });
    ids.add(object.id);
    if (object.type === "image" && !assetIds.has(object.assetId)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Missing asset: ${object.assetId}`, path: ["assets"] });
    if (object.type === "group") object.children.forEach(visit);
  };
  document.objects.forEach(visit);
});

export type ODAObject =
  | z.infer<typeof textObject>
  | z.infer<typeof rectObject>
  | z.infer<typeof ellipseObject>
  | z.infer<typeof lineObject>
  | z.infer<typeof imageObject>
  | { id: string; name?: string; x: number; y: number; width: number; height: number; rotation: number; opacity: number; locked: boolean; visible: boolean; zIndex: number; type: "group"; role: "typographic-block" | "card" | "frame" | "badge" | "custom"; children: ODAObject[] };
export type ODAFont = z.infer<typeof odaDesignSchema>["fonts"][number];
export type ODADesign = z.infer<typeof odaDesignSchema>;
export type ODABrandKit = ODADesign["brand"];

export function validateODADesign(input: unknown): ODADesign {
  return odaDesignSchema.parse(input);
}

export const starterDesign: ODADesign = {
  schemaVersion: ODA_SCHEMA_VERSION,
  document: {
    id: "oda-spike-1080",
    name: "ODA Editor Spike",
    width: 1080,
    height: 1080,
    background: { type: "solid", color: "#111214" },
    safeArea: { x: 64, y: 64, width: 952, height: 952 },
  },
  fonts: [
    { family: "Space Grotesk", weight: 700, style: "normal" },
    { family: "IBM Plex Sans", weight: 400, style: "normal" },
  ],
  assets: [],
  brand: {
    name: "Open Design Atlas",
    colors: { primary: "#315CFF", secondary: "#F05A3C", accent: "#F2F0E9", surface: "#111214", text: "#F2F0E9" },
    fonts: { display: "Space Grotesk", body: "IBM Plex Sans", mono: "IBM Plex Mono" },
    logoAssetId: null,
    imageAssetIds: [],
  },
  objects: [
    {
      id: "headline",
      type: "text",
      name: "headline",
      x: 92,
      y: 108,
      width: 850,
      height: 180,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 3,
      content: "Design the next signal",
      style: { fontFamily: "Space Grotesk", fontSize: 82, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, textAlign: "left", fill: "#F2F0E9" },
    },
    {
      id: "card-group",
      type: "group",
      name: "card",
      role: "card",
      x: 92,
      y: 408,
      width: 896,
      height: 390,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 1,
      children: [
        { id: "card-bg", type: "rect", x: 0, y: 0, width: 896, height: 390, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 0, style: { fill: "#315CFF", stroke: null, radius: 18 } },
        { id: "card-label", type: "text", x: 42, y: 42, width: 650, height: 80, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 1, content: "LOCAL / EDITABLE / 01", style: { fontFamily: "IBM Plex Mono", fontSize: 24, fontWeight: 500, lineHeight: 1, letterSpacing: 0, textAlign: "left", fill: "#F2F0E9" } },
        { id: "card-copy", type: "text", x: 42, y: 150, width: 760, height: 150, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 2, content: "Every piece stays a real object.", style: { fontFamily: "IBM Plex Sans", fontSize: 48, fontWeight: 500, lineHeight: 1.05, letterSpacing: -1, textAlign: "left", fill: "#111214" } },
      ],
    },
  ],
  metadata: { createdBy: "human-or-ai", lastOperation: "create", editable: true },
};
