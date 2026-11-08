import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownToLine, BadgeCheck, ChevronLeft, Circle, Copy, Frame, Layers3, Minus, Plus, Redo2, Square, Trash2, Type, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Canvas, Circle as FabricCircle, FabricObject, Group, IText, Line, Rect } from "fabric";
import {
  ODA_FONT_FAMILIES,
  type ODAObject,
  type ODADesign,
  odaDesignSchema,
  starterDesign,
  validateODADesign,
} from "@/lib/odaDesign";

const DB_NAME = "open-design-atlas-editor";
const STORE_NAME = "drafts";
const DRAFT_ID = "oda-spike-draft";

type HistoryEntry = { label: string; design: ODADesign };
type FabricWithOda = FabricObject & { odaId?: string; odaType?: ODAObject["type"] };

type Props = { onBack?: () => void };

function cloneDesign(design: ODADesign): ODADesign {
  return JSON.parse(JSON.stringify(design)) as ODADesign;
}

function openDraftDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveDraft(design: ODADesign) {
  const db = await openDraftDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(design, DRAFT_ID);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function loadDraft(): Promise<ODADesign | null> {
  const db = await openDraftDb();
  const design = await new Promise<ODADesign | null>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(DRAFT_ID);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return design ? validateODADesign(design) : null;
}

function fabricObjectFromODA(object: ODAObject, isChild = false): FabricWithOda {
  const common = { left: isChild ? object.x : object.x, top: isChild ? object.y : object.y, angle: object.rotation, opacity: object.opacity, visible: object.visible, selectable: !object.locked, evented: !object.locked };
  let result: FabricObject;
  if (object.type === "text") {
    result = new IText(object.content, { ...common, width: object.width, fontFamily: object.style.fontFamily, fontSize: object.style.fontSize, fontWeight: object.style.fontWeight, lineHeight: object.style.lineHeight, charSpacing: object.style.letterSpacing * 10, textAlign: object.style.textAlign, fill: object.style.fill, originX: "left", originY: "top" });
  } else if (object.type === "rect") {
    result = new Rect({ ...common, width: object.width, height: object.height, fill: object.style.fill ?? "transparent", stroke: object.style.stroke ?? undefined, strokeWidth: object.style.strokeWidth ?? 0, rx: object.style.radius ?? 0, ry: object.style.radius ?? 0, originX: "left", originY: "top" });
  } else if (object.type === "ellipse") {
    result = new FabricCircle({ ...common, radius: Math.min(object.width, object.height) / 2, scaleX: object.width / Math.min(object.width, object.height), scaleY: object.height / Math.min(object.width, object.height), fill: object.style.fill ?? "transparent", stroke: object.style.stroke ?? undefined, strokeWidth: object.style.strokeWidth ?? 0, originX: "left", originY: "top" });
  } else if (object.type === "line") {
    result = new Line([0, 0, object.x2 - object.x, object.y2 - object.y], { ...common, stroke: object.style.stroke, strokeWidth: object.style.strokeWidth, originX: "left", originY: "top" });
  } else if (object.type === "group") {
    const children = object.children.map((child) => fabricObjectFromODA(child, true));
    result = new Group(children, { ...common, width: object.width, height: object.height, subTargetCheck: true, interactive: true, originX: "left", originY: "top" });
  } else {
    result = new Rect({ ...common, width: object.width, height: object.height, fill: "#555", originX: "left", originY: "top" });
  }
  const withMetadata = result as FabricWithOda;
  withMetadata.odaId = object.id;
  withMetadata.odaType = object.type;
  return withMetadata;
}

function odaFromFabricObject(object: FabricWithOda, parentX = 0, parentY = 0): ODAObject | null {
  if (!object.odaId || !object.odaType) return null;
  const left = (object.left ?? 0) + parentX;
  const top = (object.top ?? 0) + parentY;
  const base = { id: object.odaId, x: left, y: top, width: object.getScaledWidth(), height: object.getScaledHeight(), rotation: object.angle ?? 0, opacity: object.opacity ?? 1, locked: object.selectable === false, visible: object.visible !== false, zIndex: 0 };
  if (object.odaType === "text" && object instanceof IText) {
    return { ...base, type: "text", content: object.text, style: { fontFamily: (object.fontFamily as typeof ODA_FONT_FAMILIES[number]) ?? "Inter", fontSize: object.fontSize ?? 16, fontWeight: Number(object.fontWeight ?? 400), lineHeight: object.lineHeight ?? 1.2, letterSpacing: (object.charSpacing ?? 0) / 10, textAlign: object.textAlign as "left" | "center" | "right", fill: String(object.fill ?? "#ffffff") } };
  }
  if (object.odaType === "group" && object instanceof Group) {
    const children = object.getObjects().map((child) => odaFromFabricObject(child as FabricWithOda, left, top)).filter((child): child is ODAObject => Boolean(child));
    return { ...base, type: "group", role: "custom", children };
  }
  if (object.odaType === "ellipse" && object instanceof FabricCircle) return { ...base, type: "ellipse", style: { fill: String(object.fill ?? "transparent"), stroke: object.stroke ? String(object.stroke) : null, strokeWidth: object.strokeWidth ?? 0, radius: 0 } };
  if (object.odaType === "line" && object instanceof Line) return { ...base, type: "line", x2: left + (object.x2 ?? 0), y2: top + (object.y2 ?? 0), style: { stroke: String(object.stroke ?? "#ffffff"), strokeWidth: object.strokeWidth ?? 1 } };
  if (object.odaType === "rect" && object instanceof Rect) return { ...base, type: "rect", style: { fill: String(object.fill ?? "transparent"), stroke: object.stroke ? String(object.stroke) : null, strokeWidth: object.strokeWidth ?? 0, radius: object.rx ?? 0 } };
  return null;
}

function designFromCanvas(canvas: Canvas, previous: ODADesign): ODADesign {
  const objects = canvas.getObjects().map((object) => odaFromFabricObject(object as FabricWithOda)).filter((object): object is ODAObject => Boolean(object));
  return validateODADesign({ ...cloneDesign(previous), objects, metadata: { ...previous.metadata, lastOperation: "edit" } });
}

function addObjectToDesign(design: ODADesign, object: ODAObject): ODADesign {
  return validateODADesign({ ...cloneDesign(design), objects: [...design.objects, object], metadata: { ...design.metadata, lastOperation: "edit" } });
}

export default function SocialPostEditor({ onBack }: Props) {
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const applying = useRef(false);
  const history = useRef<HistoryEntry[]>([{ label: "Initial", design: cloneDesign(starterDesign) }]);
  const historyIndex = useRef(0);
  const [design, setDesign] = useState<ODADesign>(() => cloneDesign(starterDesign));
  const [fontReady, setFontReady] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detachedGroup = useRef<{ group: Extract<ODAObject, { type: "group" }>; childIds: string[] } | null>(null);
  const [zoom, setZoom] = useState(() => typeof window === "undefined" ? 0.58 : Math.min(0.58, Math.max(0.3, (window.innerWidth - 24) / 1080)));
  const [, setHistoryTick] = useState(0);

  const commit = useCallback((next: ODADesign, label: string) => {
    const validated = validateODADesign(next);
    history.current = history.current.slice(0, historyIndex.current + 1).concat([{ label, design: cloneDesign(validated) }]);
    historyIndex.current = history.current.length - 1;
    setDesign(validated);
    setHistoryTick((value) => value + 1);
  }, []);

  const renderDesign = useCallback((next: ODADesign) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    applying.current = true;
    canvas.clear();
    canvas.backgroundColor = next.document.background.color;
    next.objects.slice().sort((a, b) => a.zIndex - b.zIndex).forEach((object) => canvas.add(fabricObjectFromODA(object)));
    canvas.setZoom(zoom);
    canvas.setDimensions({ width: 1080 * zoom, height: 1080 * zoom });
    canvas.renderAll();
    applying.current = false;
  }, [zoom]);

  const commitCanvasEdit = useCallback((label: string) => {
    if (applying.current || !fabricCanvas.current) return;
    try { commit(designFromCanvas(fabricCanvas.current, design), label); } catch (error) { console.error("[ODA] rejected canvas state", error); toast.error("Değişiklik sözleşmeye uymadı"); }
  }, [commit, design]);

  useEffect(() => {
    let active = true;
    Promise.all(ODA_FONT_FAMILIES.map((family) => document.fonts.load(`16px "${family}"`))).then(() => { if (active) setFontReady(true); }).catch(() => { if (active) setFontReady(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!canvasElement.current) return;
    const canvas = new Canvas(canvasElement.current, { width: 1080 * zoom, height: 1080 * zoom, preserveObjectStacking: true, selection: true, stopContextMenu: true });
    fabricCanvas.current = canvas;
    canvas.on("selection:created", (event) => setSelectedId((event.selected?.[0] as FabricWithOda | undefined)?.odaId ?? null));
    canvas.on("selection:updated", (event) => setSelectedId((event.selected?.[0] as FabricWithOda | undefined)?.odaId ?? null));
    canvas.on("selection:cleared", () => setSelectedId(null));
    canvas.on("object:modified", () => commitCanvasEdit("Modify object"));
    canvas.on("text:changed", () => commitCanvasEdit("Edit text"));
    renderDesign(design);
    return () => { canvas.dispose(); fabricCanvas.current = null; };
    // The canvas is intentionally created once; zoom/render updates use the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { renderDesign(design); }, [design, renderDesign]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        const canvas = fabricCanvas.current;
        const activeObjects = canvas?.getActiveObjects() ?? [];
        if (activeObjects.length) { activeObjects.forEach((object) => canvas?.remove(object)); canvas?.discardActiveObject(); canvas?.renderAll(); commitCanvasEdit("Delete object"); }
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  async function undo() { if (historyIndex.current === 0) return; historyIndex.current -= 1; const previous = cloneDesign(history.current[historyIndex.current].design); setDesign({ ...previous, metadata: { ...previous.metadata, lastOperation: "undo" } }); setHistoryTick((value) => value + 1); }
  async function redo() { if (historyIndex.current >= history.current.length - 1) return; historyIndex.current += 1; const next = cloneDesign(history.current[historyIndex.current].design); setDesign({ ...next, metadata: { ...next.metadata, lastOperation: "redo" } }); setHistoryTick((value) => value + 1); }

  async function save() { await saveDraft(validateODADesign(design)); setSavedAt(new Date().toLocaleTimeString()); toast.success("ODA taslağı IndexedDB'ye kaydedildi"); }
  async function open() { const draft = await loadDraft(); if (!draft) { toast.info("Kayıtlı local draft bulunamadı"); return; } history.current = [{ label: "Open draft", design: draft }]; historyIndex.current = 0; setDesign(draft); setSavedAt(new Date().toLocaleTimeString()); toast.success("Local draft açıldı"); }
  function exportPng() { if (!fontReady) { toast.error("Fontlar yüklenmeden export kilitli"); return; } const canvas = fabricCanvas.current; if (!canvas) return; const url = canvas.toDataURL({ format: "png", multiplier: 2, width: 1080, height: 1080 }); const link = document.createElement("a"); link.href = url; link.download = "open-design-atlas-1080x1080@2x.png"; link.click(); toast.success("2x PNG export hazırlandı"); }

  function addText() { commit(addObjectToDesign(design, { id: `text-${Date.now()}`, type: "text", name: "text", x: 130, y: 850, width: 700, height: 70, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 8, content: "Edit this text", style: { fontFamily: "IBM Plex Sans", fontSize: 42, fontWeight: 500, lineHeight: 1.1, letterSpacing: 0, textAlign: "left", fill: "#F2F0E9" } }), "Add text"); }
  function addCard() {
    const stamp = Date.now();
    commit(addObjectToDesign(design, { id: `card-${stamp}`, type: "group", name: "card", role: "card", x: 110, y: 730, width: 860, height: 220, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 7, children: [
      { id: `card-bg-${stamp}`, type: "rect", x: 0, y: 0, width: 860, height: 220, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 0, style: { fill: "#F05A3C", stroke: null, radius: 18 } },
      { id: `card-label-${stamp}`, type: "text", x: 28, y: 30, width: 240, height: 34, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 1, content: "CARD / EDITABLE", style: { fontFamily: "IBM Plex Mono", fontSize: 18, fontWeight: 500, lineHeight: 1, letterSpacing: 0, textAlign: "left", fill: "#111214" } },
      { id: `card-copy-${stamp}`, type: "text", x: 28, y: 84, width: 760, height: 70, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 2, content: "A compound card, still made of objects.", style: { fontFamily: "Space Grotesk", fontSize: 34, fontWeight: 700, lineHeight: 1, letterSpacing: -1, textAlign: "left", fill: "#111214" } },
    ] }), "Add card");
  }
  function addTypeBlock() {
    const stamp = Date.now();
    const id = `type-block-${stamp}`;
    commit(addObjectToDesign(design, { id, type: "group", name: "typographic-block", role: "typographic-block", x: 110, y: 310, width: 800, height: 160, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 6, children: [
      { id: `type-kicker-${stamp}`, type: "text", x: 0, y: 0, width: 300, height: 30, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 0, content: "TYPOGRAPHIC BLOCK", style: { fontFamily: "IBM Plex Mono", fontSize: 16, fontWeight: 500, lineHeight: 1, letterSpacing: 1, textAlign: "left", fill: "#F05A3C" } },
      { id: `type-title-${stamp}`, type: "text", x: 0, y: 42, width: 800, height: 82, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 1, content: "Objects, not pixels.", style: { fontFamily: "Space Grotesk", fontSize: 58, fontWeight: 700, lineHeight: 1, letterSpacing: -2, textAlign: "left", fill: "#F2F0E9" } },
    ] }), "Add typographic block");
    setSelectedId(id);
  }
  function addCircle() { commit(addObjectToDesign(design, { id: `ellipse-${Date.now()}`, type: "ellipse", name: "orb", x: 760, y: 710, width: 170, height: 170, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 7, style: { fill: "#F05A3C", stroke: null, radius: 85 } }), "Add circle"); }
  function addFrame() { commit(addObjectToDesign(design, { id: `frame-${Date.now()}`, type: "group", name: "frame", role: "frame", x: 120, y: 820, width: 840, height: 170, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 6, children: [{ id: `frame-inner-${Date.now()}`, type: "rect", x: 0, y: 0, width: 840, height: 170, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 0, style: { fill: "transparent", stroke: "#F2F0E9", strokeWidth: 3, radius: 12 } }, { id: `frame-label-${Date.now()}`, type: "text", x: 28, y: 55, width: 500, height: 50, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 1, content: "EDITABLE FRAME / 1080", style: { fontFamily: "IBM Plex Mono", fontSize: 24, fontWeight: 500, lineHeight: 1, letterSpacing: 0, textAlign: "left", fill: "#F2F0E9" } }] }), "Add frame"); }
  function addBadge() { commit(addObjectToDesign(design, { id: `badge-${Date.now()}`, type: "group", name: "badge", role: "badge", x: 760, y: 350, width: 190, height: 72, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 8, children: [{ id: `badge-bg-${Date.now()}`, type: "rect", x: 0, y: 0, width: 190, height: 72, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 0, style: { fill: "#F2F0E9", stroke: null, radius: 36 } }, { id: `badge-text-${Date.now()}`, type: "text", x: 25, y: 23, width: 140, height: 30, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 1, content: "ODA / READY", style: { fontFamily: "IBM Plex Mono", fontSize: 17, fontWeight: 500, lineHeight: 1, letterSpacing: 0, textAlign: "center", fill: "#111214" } }] }), "Add badge"); }
  function editGroupChildren() {
    const group = design.objects.find((object): object is Extract<ODAObject, { type: "group" }> => object.id === selectedId && object.type === "group");
    if (!group) return;
    detachedGroup.current = { group: cloneDesign({ ...design, objects: [group] }).objects[0] as Extract<ODAObject, { type: "group" }>, childIds: group.children.map((child) => child.id) };
    const children = group.children.map((child) => ({ ...child, x: child.x + group.x, y: child.y + group.y }));
    commit(validateODADesign({ ...cloneDesign(design), objects: design.objects.flatMap((object) => object.id === group.id ? children : [object]), metadata: { ...design.metadata, lastOperation: "edit" } }), "Edit group children");
    setSelectedId(null);
    toast.success("Group children ayrı ayrı düzenlenebilir");
  }
  function regroupLast() {
    const detached = detachedGroup.current;
    if (!detached) return;
    const children = design.objects.filter((object): object is ODAObject => detached.childIds.includes(object.id)).map((child) => ({ ...child, x: child.x - detached.group.x, y: child.y - detached.group.y }));
    if (children.length !== detached.childIds.length) { toast.error("Regroup için tüm child nesneleri gerekli"); return; }
    const group = { ...detached.group, children };
    commit(validateODADesign({ ...cloneDesign(design), objects: design.objects.filter((object) => !detached.childIds.includes(object.id)).concat(group), metadata: { ...design.metadata, lastOperation: "edit" } }), "Regroup children");
    detachedGroup.current = null;
    setSelectedId(group.id);
    toast.success("Child nesneler tekrar group oldu");
  }

  return <main className="editor-shell">
    <header className="editor-topbar"><button className="editor-back" onClick={onBack}><ChevronLeft size={16} /> Atlas</button><div><span className="editor-eyebrow">TECHNICAL SPIKE / ODA DESIGN</span><h1>SocialPostEditor</h1></div><div className="editor-top-actions"><span className={fontReady ? "editor-status ready" : "editor-status"}>{fontReady ? "FONTS READY" : "LOADING FONTS"}</span><button onClick={undo} title="Undo"><Undo2 size={17} /></button><button onClick={redo} title="Redo"><Redo2 size={17} /></button></div></header>
    <section className="editor-layout">
      <aside className="editor-sidebar"><span className="editor-label">OBJECTS / EDITABLE</span><div className="editor-tool-grid"><button onClick={addText}><Type size={17} />Text</button><button onClick={addTypeBlock}><Type size={17} />Type block</button><button onClick={addCard}><Square size={17} />Card</button><button onClick={addCircle}><Circle size={17} />Orb</button><button onClick={addFrame}><Frame size={17} />Frame</button><button onClick={addBadge}><BadgeCheck size={17} />Badge</button></div><div className="editor-divider" /><span className="editor-label">DOCUMENT</span><div className="editor-actions"><button onClick={save}><Copy size={16} /> Save draft</button><button onClick={open}><Layers3 size={16} /> Open draft</button><button className="export-action" onClick={exportPng}><ArrowDownToLine size={16} /> Export 2x PNG</button></div><p className="editor-hint">All objects remain in the ODA JSON model. Groups contain editable children; bitmap assets are kept separate and are not flattened into the document.</p></aside>
      <div className="editor-stage-wrap"><div className="editor-stage-head"><span>1080 × 1080 / {Math.round(zoom * 100)}%</span><span>{selectedId ? `SELECTED / ${selectedId}` : "SELECT AN OBJECT"}</span></div><div className="editor-stage"><canvas ref={canvasElement} /></div><div className="editor-stage-foot"><button onClick={() => setZoom((value) => Math.max(.3, value - .05))}><Minus size={14} /></button><button onClick={() => setZoom((value) => Math.min(.8, value + .05))}><Plus size={14} /></button><span>{savedAt ? `LOCAL DRAFT / ${savedAt}` : "LOCAL-FIRST / NOT SAVED"}</span><span className="editor-history">{historyIndex.current + 1} / {history.current.length} commands</span></div></div>
      <aside className="editor-inspector"><span className="editor-label">CONTRACT</span><div className="contract-card"><b>oda.design/1.0</b><span>Strict Zod validation</span><span>Editable object graph</span><span>Bitmap / editable split</span></div><span className="editor-label">SELECTION</span><div className="selection-card">{selectedId ? <><strong>{selectedId}</strong><span>Fabric object ↔ ODA object</span>{design.objects.find((object) => object.id === selectedId)?.type === "group" && <button onClick={editGroupChildren}><Layers3 size={15} /> Edit group children</button>}<button onClick={() => { const canvas = fabricCanvas.current; canvas?.getActiveObjects().forEach((object) => canvas.remove(object)); canvas?.discardActiveObject(); canvas?.renderAll(); commitCanvasEdit("Delete selected"); }}><Trash2 size={15} /> Delete selected</button></> : detachedGroup.current ? <><span>Group children are separate editable objects.</span><button onClick={regroupLast}><Layers3 size={15} /> Regroup last</button></> : <span>Click a text, card, frame or badge to edit it directly on the canvas. Select a group to edit its children separately.</span>}</div><span className="editor-label">ALLOWED FONTS</span><div className="font-list">{ODA_FONT_FAMILIES.slice(0, 7).map((font) => <span key={font}>{font}</span>)}</div></aside>
    </section>
  </main>;
}
