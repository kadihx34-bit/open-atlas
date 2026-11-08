import { z } from "zod";
import { odaDesignSchema, type ODADesign, type ODAObject } from "./odaDesign";

const pathSegment = z.string().regex(/^[a-zA-Z0-9_-]+$/);
export const odaPatchOperationSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("replace"), path: z.array(pathSegment).min(1).max(6), value: z.unknown() }),
  z.object({ op: z.literal("add"), path: z.array(pathSegment).min(1).max(6), value: z.unknown() }),
  z.object({ op: z.literal("remove"), path: z.array(pathSegment).min(1).max(6) }),
]);

export const odaPatchSchema = z.object({
  schemaVersion: z.literal("oda.design/1.0"),
  patchVersion: z.literal("oda.patch/1.0"),
  id: z.string().min(1).max(100),
  intent: z.string().min(1).max(240),
  operations: z.array(odaPatchOperationSchema).min(1).max(40),
  source: z.enum(["mock-ai", "built-in-llm"]),
});
export type ODAPatch = z.infer<typeof odaPatchSchema>;

const allowedRoots = new Set(["brand", "document", "objects"]);
const allowedBrandKeys = new Set(["name", "colors", "fonts", "logoAssetId", "imageAssetIds"]);
const allowedDocumentKeys = new Set(["name", "background", "safeArea"]);
const allowedObjectKeys = new Set(["content", "style", "x", "y", "width", "height", "rotation", "opacity", "visible", "locked", "name"]);
const allowedStyleKeys = new Set(["fill", "stroke", "strokeWidth", "radius"]);

function assertSafePath(path: string[]) {
  if (!path.length || !allowedRoots.has(path[0])) throw new Error(`Patch path is not allowed: ${path.join(".")}`);
  if (path[0] === "brand" && path[1] && !allowedBrandKeys.has(path[1])) throw new Error(`Brand patch key is not allowed: ${path[1]}`);
  if (path[0] === "brand" && path[1] === "colors" && path[2] && !["primary", "secondary", "accent", "surface", "text"].includes(path[2])) throw new Error(`Brand color key is not allowed: ${path[2]}`);
  if (path[0] === "brand" && path[1] === "fonts" && path[2] && !["display", "body", "mono"].includes(path[2])) throw new Error(`Brand font key is not allowed: ${path[2]}`);
  if (path[0] === "document" && path[1] && !allowedDocumentKeys.has(path[1])) throw new Error(`Document patch key is not allowed: ${path[1]}`);
  if (path[0] === "objects") {
    if (path.length < 3 || !/^\d+$/.test(path[1] ?? "")) throw new Error(`Object patch path must target an indexed editable field`);
    const objectKey = path[2] === "children" ? path[4] : path[2];
    const isChildPath = path[2] === "children";
    if (isChildPath && (path.length < 5 || !/^\d+$/.test(path[3] ?? ""))) throw new Error(`Nested object patch path must target an indexed child`);
    if (!objectKey || !allowedObjectKeys.has(objectKey)) throw new Error(`Object patch key is not allowed: ${objectKey}`);
    const styleIndex = isChildPath ? 5 : 3;
    if (objectKey === "style") {
      if (path.length !== styleIndex + 1 || !allowedStyleKeys.has(path[styleIndex])) throw new Error(`Object style patch key is not allowed: ${path[styleIndex]}`);
    } else if (path.length !== styleIndex) {
      throw new Error(`Object patch path is too deep: ${path.join(".")}`);
    }
  }
  if (path.includes("__proto__") || path.includes("constructor") || path.includes("prototype")) throw new Error("Prototype mutation is not allowed");
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function getAt(root: unknown, path: string[]): unknown { return path.reduce<unknown>((current, segment) => (current as Record<string, unknown> | undefined)?.[segment], root); }
function setAt(root: Record<string, unknown>, path: string[], value: unknown) { let current = root; path.slice(0, -1).forEach((segment) => { const next = current[segment]; if (!next || typeof next !== "object") current[segment] = {}; current = current[segment] as Record<string, unknown>; }); current[path[path.length - 1]] = value; }
function removeAt(root: Record<string, unknown>, path: string[]) { const parent = getAt(root, path.slice(0, -1)) as Record<string, unknown> | unknown[] | undefined; const key = path[path.length - 1]; if (Array.isArray(parent)) parent.splice(Number(key), 1); else if (parent) delete parent[key]; }

export function validateODAPatch(input: unknown): ODAPatch {
  const patch = odaPatchSchema.parse(input);
  patch.operations.forEach((operation) => assertSafePath(operation.path));
  return patch;
}

export function applyODAPatch(design: ODADesign, input: unknown): { design: ODADesign; inverse: ODAPatch } {
  const patch = validateODAPatch(input);
  const next = clone(design) as unknown as Record<string, unknown>;
  const inverseOperations: z.infer<typeof odaPatchOperationSchema>[] = [];
  patch.operations.forEach((operation) => {
    const previous = clone(getAt(next, operation.path));
    if (operation.op === "replace") { setAt(next, operation.path, clone(operation.value)); inverseOperations.unshift({ op: "replace", path: operation.path, value: previous }); }
    if (operation.op === "add") { setAt(next, operation.path, clone(operation.value)); inverseOperations.unshift({ op: "remove", path: operation.path }); }
    if (operation.op === "remove") { removeAt(next, operation.path); inverseOperations.unshift({ op: "add", path: operation.path, value: previous }); }
  });
  const validated = odaDesignSchema.parse(next);
  return { design: validated, inverse: { schemaVersion: "oda.design/1.0", patchVersion: "oda.patch/1.0", id: `${patch.id}-inverse`, intent: `Undo: ${patch.intent}`, operations: inverseOperations, source: patch.source } };
}

export function createMockAIPatch(design: ODADesign): ODAPatch {
  return {
    schemaVersion: "oda.design/1.0",
    patchVersion: "oda.patch/1.0",
    id: `mock-ai-${Date.now()}`,
    intent: "Apply a deterministic brand accent to the headline",
    source: "mock-ai",
    operations: [
      { op: "replace", path: ["brand", "name"], value: `${design.brand.name} / Mock AI` },
      { op: "replace", path: ["brand", "colors", "accent"], value: design.brand.colors.secondary },
      { op: "replace", path: ["objects", "0", "style", "fill"], value: design.brand.colors.primary },
    ],
  };
}

export function mockPatchRoundTrip(design: ODADesign) {
  const patch = createMockAIPatch(design);
  const applied = applyODAPatch(design, patch);
  const undone = applyODAPatch(applied.design, applied.inverse);
  return { patch, applied: applied.design, undone: undone.design };
}

export type { ODAObject };
