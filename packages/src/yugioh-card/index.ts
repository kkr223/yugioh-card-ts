import { Group, Image, Rect } from 'leafer-unified';
import { CompressText } from '../compress-text/index.ts';
import {
  createYugiohCardDocument,
  legacyDataToYugiohCardDocument,
  parseYugiohCardDocument,
  yugiohCardDocumentToLegacyData,
  YUGIOH_LAYER_SLOTS,
  type LegacyYugiohCardData,
  type YugiohCardDocument,
  type YugiohCardLayerSlot,
} from './document.ts';
import { LegacyYugiohCardRenderer } from './legacy-renderer.js';
import type { CardOptions } from '../card/index.ts';

export interface CardLayerExtensionContext {
  readonly group: Group;
  readonly document: Readonly<YugiohCardDocument>;
  resourceUrl(path: string): string;
  invalidate(): void;
}

export interface CardLayerExtension {
  readonly id: string;
  readonly slot: YugiohCardLayerSlot;
  update(context: CardLayerExtensionContext): void | Promise<void>;
  destroy?(context: Omit<CardLayerExtensionContext, 'document'>): void | Promise<void>;
}

export interface YugiohCardOptions extends CardOptions<LegacyYugiohCardData> {
  document?: YugiohCardDocument;
  extensions?: CardLayerExtension[];
}

export class YugiohCardRenderError extends Error {
  readonly revision: number;
  readonly cause: unknown;

  constructor(revision: number, cause: unknown) {
    super(`Failed to render YugiohCard revision ${revision}`);
    this.name = 'YugiohCardRenderError';
    this.revision = revision;
    this.cause = cause;
  }
}

type ExtensionRecord = {
  extension: CardLayerExtension;
  group: Group;
};

type RenderWaiter = {
  revision: number;
  resolve: () => void;
  reject: (reason: unknown) => void;
};

type CompressTextView = {
  set(data: Record<string, unknown>): void;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  rtFontSize?: number;
  rtTop?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  visible?: boolean;
  scaleX?: number;
  scaleY?: number;
  strokeWidth?: number;
};

type LegacyRendererShape = {
  nameLeaf?: CompressTextView | null;
  imageLeaf?: Rect | null;
  maskLeaf?: Image | null;
  levelLeaf?: Group | null;
  rankLeaf?: Group | null;
  linkArrowLeaf?: Group | null;
};

const SLOT_Z_INDEX: Record<YugiohCardLayerSlot, number> = {
  'before-frame': -100,
  'after-artwork': 25,
  'before-text': 29,
  'after-text': 90,
  top: 1000,
};

const RARITY_TITLE_PRESETS: Record<
  string,
  Pick<Required<LegacyYugiohCardData>, 'color' | 'gradient' | 'gradientColor1' | 'gradientColor2'>
> = {
  ur: {
    color: '#f3cc63',
    gradient: true,
    gradientColor1: '#8a5d17',
    gradientColor2: '#f8e6a2',
  },
  gr: {
    color: '#d8dde6',
    gradient: true,
    gradientColor1: '#6d7683',
    gradientColor2: '#f4f7fb',
  },
  hr: {
    color: '#eef2f8',
    gradient: true,
    gradientColor1: '#8e99a9',
    gradientColor2: '#ffffff',
  },
  ser: {
    color: '#edf2f8',
    gradient: true,
    gradientColor1: '#8b95a4',
    gradientColor2: '#ffffff',
  },
  gser: {
    color: '#f1d377',
    gradient: true,
    gradientColor1: '#8a6422',
    gradientColor2: '#fff1be',
  },
  pser: {
    color: '#f5d6ef',
    gradient: true,
    gradientColor1: '#855f86',
    gradientColor2: '#fff5fd',
  },
};

const OUT_FRAME_LAYOUT = {
  nameBlock: {
    url: '/yugioh/image/name-block.png',
    x: 76,
    y: 82,
    width: 1242,
    height: 157,
  },
  effectBox: {
    defaultUrl: '/yugioh/image/eblock-border.png',
    coloredUrl: '/yugioh/image/eblock-border-o.png',
  },
  mark25th: {
    url: '/yugioh/image/mark25th.png',
    x: 503,
    y: 1496,
    width: 388,
    height: 430,
  },
} as const;

const MASK_LAYOUT = {
  normal: {
    url: '/yugioh/image/card-mask.png',
    x: 117,
    y: 322,
    width: 1162,
    height: 1162,
  },
  pendulum: {
    url: '/yugioh/image/card-mask-pendulum.png',
    x: 68,
    y: 342,
    width: 1257,
    height: 1595,
  },
  pendulumArt: {
    url: '/yugioh/image/card-mask-pendulum-art.png',
    x: 68,
    y: 342,
    width: 1257,
    height: 914,
  },
  pendulumEffect: {
    url: '/yugioh/image/card-mask-pendulum-effect.png',
    x: 68,
    y: 1256,
    width: 1257,
    height: 681,
  },
} as const;

function readonlyDocument(document: YugiohCardDocument): Readonly<YugiohCardDocument> {
  const clone = parseYugiohCardDocument(document);
  Object.freeze(clone.frame.arrows);
  Object.freeze(clone.frame);
  Object.freeze(clone.title.fill);
  Object.freeze(clone.title.shadow);
  Object.freeze(clone.title);
  Object.freeze(clone.artwork);
  Object.freeze(clone.foreground);
  Object.freeze(clone.effectBox);
  Object.freeze(clone.text);
  Object.freeze(clone.footer);
  Object.freeze(clone.render);
  return Object.freeze(clone);
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object'
    && value !== null
    && 'then' in value
    && typeof value.then === 'function';
}

export class YugiohCard extends LegacyYugiohCardRenderer {
  private documentValue!: YugiohCardDocument;
  private revisionValue = 0;
  private completedRevision = 0;
  private renderQueued = false;
  private rendering = false;
  private waiters: RenderWaiter[] = [];
  private extensions = new Map<string, ExtensionRecord>();
  private slotGroups = new Map<YugiohCardLayerSlot, Group>();
  private nameBlockLeaf: Image | null = null;
  private titleShadowLeaf: CompressText | null = null;
  private foregroundLeaf: Image | null = null;
  private pendulumEffectMaskLeaf: Image | null = null;
  private effectBoxFillLeaf: Rect | null = null;
  private effectBoxBorderLeaf: Image | null = null;
  private mark25thLeaf: Image | null = null;

  constructor(options: YugiohCardOptions = {}) {
    super(options);

    this.documentValue = options.document
      ? parseYugiohCardDocument(options.document)
      : legacyDataToYugiohCardDocument(options.data);
    this.data = yugiohCardDocumentToLegacyData(this.documentValue) as unknown as typeof this.data;
    this.initializeSlotGroups();
    for (const extension of options.extensions ?? []) {
      this.registerExtension(extension);
    }
    this.scheduleRender();
  }

  override get tag(): string {
    return 'YugiohCard';
  }

  get revision(): number {
    return this.revisionValue;
  }

  override setData(data: LegacyYugiohCardData = {}): void {
    if (!this.documentValue) {
      super.setData(data as unknown as Partial<typeof this.data>);
      return;
    }
    this.documentValue = legacyDataToYugiohCardDocument(data, this.documentValue);
    this.data = yugiohCardDocumentToLegacyData(this.documentValue) as unknown as typeof this.data;
    this.scheduleRender();
  }

  async setDocument(document: YugiohCardDocument): Promise<void> {
    this.assertActive();
    this.documentValue = parseYugiohCardDocument(document);
    this.data = yugiohCardDocumentToLegacyData(this.documentValue) as unknown as typeof this.data;
    await this.scheduleRender();
  }

  async updateDocument(
    updater: (
      document: Readonly<YugiohCardDocument>,
    ) => YugiohCardDocument,
  ): Promise<void> {
    await this.setDocument(updater(this.getDocument()));
  }

  getDocument(): Readonly<YugiohCardDocument> {
    return readonlyDocument(this.documentValue ?? createYugiohCardDocument());
  }

  registerExtension(extension: CardLayerExtension): void {
    this.assertActive();
    if (!YUGIOH_LAYER_SLOTS.includes(extension.slot)) {
      throw new Error(`Unknown YugiohCard layer slot: ${String(extension.slot)}`);
    }
    if (this.extensions.has(extension.id)) {
      throw new Error(`Duplicate YugiohCard extension id: ${extension.id}`);
    }
    const slotGroup = this.slotGroups.get(extension.slot);
    if (!slotGroup) {
      throw new Error(`Layer slot is not initialized: ${extension.slot}`);
    }
    const group = new Group();
    slotGroup.add(group);
    this.extensions.set(extension.id, { extension, group });
    this.scheduleRender();
  }

  async unregisterExtension(id: string): Promise<boolean> {
    const record = this.extensions.get(id);
    if (!record) {
      return false;
    }
    this.extensions.delete(id);
    await record.extension.destroy?.({
      group: record.group,
      resourceUrl: path => this.resourceUrl(path),
      invalidate: () => {
        void this.scheduleRender();
      },
    });
    record.group.destroy();
    return true;
  }

  override draw(): void {
    if (!this.documentValue) {
      super.draw();
      return;
    }
    void this.scheduleRender();
  }

  override async whenReady(): Promise<void> {
    await super.whenReady();
    if (this.completedRevision < this.revisionValue) {
      await this.waitForRevision(this.revisionValue);
    }
  }

  override async export(
    type: string,
    options?: Record<string, unknown>,
  ): Promise<unknown> {
    await this.whenReady();
    return super.export(type, options);
  }

  override destroy(): void {
    if (this.destroyed) {
      return;
    }
    const error = new Error('YugiohCard was destroyed');
    for (const waiter of this.waiters.splice(0)) {
      waiter.reject(error);
    }
    for (const id of [...this.extensions.keys()]) {
      void this.unregisterExtension(id);
    }
    this.nameBlockLeaf = null;
    this.titleShadowLeaf = null;
    this.foregroundLeaf = null;
    this.pendulumEffectMaskLeaf = null;
    this.effectBoxFillLeaf = null;
    this.effectBoxBorderLeaf = null;
    this.mark25thLeaf = null;
    super.destroy();
  }

  private assertActive(): void {
    if (this.destroyed) {
      throw new Error('YugiohCard was destroyed');
    }
  }

  private initializeSlotGroups(): void {
    if (!this.leafer) {
      throw new Error('YugiohCard renderer is not initialized');
    }
    for (const slot of YUGIOH_LAYER_SLOTS) {
      const group = new Group({ zIndex: SLOT_Z_INDEX[slot] });
      this.leafer.add(group);
      this.slotGroups.set(slot, group);
    }
  }

  private scheduleRender(): Promise<void> {
    this.assertActive();
    const revision = ++this.revisionValue;
    const promise = this.waitForRevision(revision);
    this.renderReady = promise;
    if (!this.renderQueued && !this.rendering) {
      this.renderQueued = true;
      queueMicrotask(() => {
        void this.flushRenderQueue();
      });
    }
    return promise;
  }

  private waitForRevision(revision: number): Promise<void> {
    if (this.completedRevision >= revision) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.waiters.push({ revision, resolve, reject });
    });
  }

  private async flushRenderQueue(): Promise<void> {
    if (this.rendering || this.destroyed) {
      return;
    }
    this.renderQueued = false;
    this.rendering = true;

    try {
      while (!this.destroyed && this.completedRevision < this.revisionValue) {
        const revision = this.revisionValue;
        try {
          await this.renderRevision(revision);
          this.completedRevision = revision;
          this.resolveWaiters(revision);
        } catch (cause) {
          const error = new YugiohCardRenderError(revision, cause);
          this.completedRevision = revision;
          this.rejectWaiters(revision, error);
        }
      }
    } finally {
      this.rendering = false;
      if (!this.destroyed && this.completedRevision < this.revisionValue) {
        this.renderQueued = true;
        queueMicrotask(() => {
          void this.flushRenderQueue();
        });
      }
    }
  }

  private async renderRevision(revision: number): Promise<void> {
    const document = parseYugiohCardDocument(this.documentValue);
    const data = yugiohCardDocumentToLegacyData(document);
    this.applyRarityTitlePreset(data);
    this.data = data as unknown as typeof this.data;
    super.draw();
    this.applyArtworkFit(document);
    this.drawPendulumSplitMask(document);
    this.drawNameBlock(document);
    this.drawTitleShadow(document);
    this.drawForeground(document);
    this.applyForegroundTitlePolicy();
    this.applyForegroundLevelPolicy(document);
    this.drawEffectBox(document);
    this.drawMark25th(document);

    const readonlyValue = readonlyDocument(document);
    for (const { extension, group } of this.extensions.values()) {
      const result = extension.update({
        group,
        document: readonlyValue,
        resourceUrl: path => this.resourceUrl(path),
        invalidate: () => {
          void this.scheduleRender();
        },
      });
      if (isThenable(result)) {
        await result;
      }
      if (revision !== this.revisionValue) {
        return;
      }
    }
  }

  private applyRarityTitlePreset(data: Required<LegacyYugiohCardData>): void {
    if (!data.useRarityPreset || data.color || data.gradient) {
      return;
    }
    const preset = RARITY_TITLE_PRESETS[data.rare.trim().toLowerCase()];
    if (preset) {
      Object.assign(data, preset);
    }
  }

  private applyArtworkFit(document: YugiohCardDocument): void {
    const renderer = this as unknown as LegacyRendererShape;
    if (!renderer.imageLeaf) {
      return;
    }
    const mode = document.artwork.fit === 'contain' ? 'fit' : document.artwork.fit;
    renderer.imageLeaf.set({
      fill: {
        type: 'image',
        url: document.artwork.source,
        mode,
        align: 'top',
      },
    });
  }

  private foregroundVisible(document: YugiohCardDocument): boolean {
    const foreground = document.foreground;
    return foreground.enabled
      && Boolean(foreground.source)
      && foreground.width > 0
      && foreground.height > 0
      && foreground.scale > 0;
  }

  private drawPendulumSplitMask(document: YugiohCardDocument): void {
    if (!this.leafer) {
      return;
    }
    const renderer = this as unknown as LegacyRendererShape;
    const maskLeaf = renderer.maskLeaf;
    if (!maskLeaf) {
      return;
    }
    if (!this.pendulumEffectMaskLeaf) {
      this.pendulumEffectMaskLeaf = new Image();
      this.leafer.add(this.pendulumEffectMaskLeaf);
    }

    const split = document.frame.type === 'pendulum' && this.foregroundVisible(document);
    if (!split) {
      const layout = document.frame.type === 'pendulum'
        ? MASK_LAYOUT.pendulum
        : MASK_LAYOUT.normal;
      maskLeaf.set({
        url: this.resourceUrl(layout.url),
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
        visible: true,
        zIndex: 20,
      });
      this.pendulumEffectMaskLeaf.set({ visible: false });
      return;
    }

    maskLeaf.set({
      url: this.resourceUrl(MASK_LAYOUT.pendulumArt.url),
      x: MASK_LAYOUT.pendulumArt.x,
      y: MASK_LAYOUT.pendulumArt.y,
      width: MASK_LAYOUT.pendulumArt.width,
      height: MASK_LAYOUT.pendulumArt.height,
      visible: true,
      zIndex: 20,
    });
    this.pendulumEffectMaskLeaf.set({
      url: this.resourceUrl(MASK_LAYOUT.pendulumEffect.url),
      x: MASK_LAYOUT.pendulumEffect.x,
      y: MASK_LAYOUT.pendulumEffect.y,
      width: MASK_LAYOUT.pendulumEffect.width,
      height: MASK_LAYOUT.pendulumEffect.height,
      visible: true,
      zIndex: 22,
    });
  }

  private drawTitleShadow(document: YugiohCardDocument): void {
    const renderer = this as unknown as LegacyRendererShape;
    const nameLeaf = renderer.nameLeaf;
    if (!nameLeaf || !this.leafer) {
      return;
    }
    if (!this.titleShadowLeaf) {
      this.titleShadowLeaf = new CompressText();
      this.leafer.add(this.titleShadowLeaf);
    }
    const shadow = document.title.shadow;
    if (!shadow.enabled) {
      this.titleShadowLeaf.set({ visible: false });
      return;
    }
    this.titleShadowLeaf.set({
      text: nameLeaf.text,
      fontFamily: nameLeaf.fontFamily,
      fontSize: nameLeaf.fontSize,
      letterSpacing: nameLeaf.letterSpacing,
      wordSpacing: nameLeaf.wordSpacing,
      textAlign: nameLeaf.textAlign,
      rtFontSize: nameLeaf.rtFontSize,
      rtTop: nameLeaf.rtTop,
      rtColor: shadow.gradient ? shadow.gradientColor1 : shadow.color,
      width: nameLeaf.width,
      height: nameLeaf.height,
      x: (nameLeaf.x ?? 0) + shadow.offsetX,
      y: (nameLeaf.y ?? 0) + shadow.offsetY,
      zIndex: 22,
      visible: nameLeaf.visible !== false,
      opacity: shadow.opacity,
      scaleX: nameLeaf.scaleX,
      scaleY: nameLeaf.scaleY,
      strokeWidth: nameLeaf.strokeWidth,
      color: shadow.color,
      gradient: shadow.gradient,
      gradientColor1: shadow.gradientColor1,
      gradientColor2: shadow.gradientColor2,
    });
  }

  private drawNameBlock(document: YugiohCardDocument): void {
    if (!this.leafer) {
      return;
    }
    if (!this.nameBlockLeaf) {
      this.nameBlockLeaf = new Image();
      this.leafer.add(this.nameBlockLeaf);
    }
    const layout = OUT_FRAME_LAYOUT.nameBlock;
    this.nameBlockLeaf.set({
      url: this.resourceUrl(layout.url),
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      visible: document.frame.nameBlock,
      zIndex: 9,
    });
  }

  private drawForeground(document: YugiohCardDocument): void {
    if (!this.leafer) {
      return;
    }
    if (!this.foregroundLeaf) {
      this.foregroundLeaf = new Image();
      this.leafer.add(this.foregroundLeaf);
    }
    const foreground = document.foreground;
    const visible = this.foregroundVisible(document);
    this.foregroundLeaf.set({
      url: foreground.source,
      width: foreground.width,
      height: foreground.height,
      x: foreground.x,
      y: foreground.y,
      scaleX: foreground.scale,
      scaleY: foreground.scale,
      rotation: foreground.rotation,
      around: { type: 'percent', x: 0.5, y: 0.5 },
      visible,
      zIndex: 21,
    });
  }

  private applyForegroundTitlePolicy(): void {
    const renderer = this as unknown as LegacyRendererShape;
    renderer.nameLeaf?.set({ zIndex: 23 });
  }

  private applyForegroundLevelPolicy(document: YugiohCardDocument): void {
    const renderer = this as unknown as LegacyRendererShape;
    const levelZIndex = document.foreground.coverLevel ? 10 : 22;
    renderer.levelLeaf?.set({ zIndex: levelZIndex });
    renderer.rankLeaf?.set({ zIndex: levelZIndex });
    const foregroundVisible = this.foregroundVisible(document);
    const linkArrowZIndex = foregroundVisible
      ? (document.foreground.coverLevel ? 20.5 : 22)
      : 120;
    renderer.linkArrowLeaf?.set({ zIndex: linkArrowZIndex });
  }

  private drawEffectBox(document: YugiohCardDocument): void {
    if (!this.leafer) {
      return;
    }
    if (!this.effectBoxFillLeaf) {
      this.effectBoxFillLeaf = new Rect();
      this.leafer.add(this.effectBoxFillLeaf);
    }
    if (!this.effectBoxBorderLeaf) {
      this.effectBoxBorderLeaf = new Image();
      this.leafer.add(this.effectBoxBorderLeaf);
    }

    const effectBox = document.effectBox;
    const fillVisible = effectBox.enabled
      && effectBox.width > 0
      && effectBox.height > 0
      && effectBox.opacity > 0;
    const borderVisible = effectBox.borderStyle !== 'none'
      && effectBox.width > 0
      && effectBox.height > 0;
    const insetX = Math.min(16, effectBox.width / 2);
    const insetTop = Math.min(16, effectBox.height / 2);
    const insetBottom = Math.min(20, effectBox.height / 2);
    this.effectBoxFillLeaf.set({
      x: effectBox.x + insetX,
      y: effectBox.y + insetTop,
      width: Math.max(0, effectBox.width - insetX * 2),
      height: Math.max(0, effectBox.height - insetTop - insetBottom),
      fill: effectBox.color,
      opacity: effectBox.opacity,
      visible: fillVisible,
      zIndex: 28,
    });
    const borderUrl = effectBox.borderStyle === 'colored'
      ? OUT_FRAME_LAYOUT.effectBox.coloredUrl
      : OUT_FRAME_LAYOUT.effectBox.defaultUrl;
    this.effectBoxBorderLeaf.set({
      url: this.resourceUrl(borderUrl),
      x: effectBox.x,
      y: effectBox.y,
      width: effectBox.width,
      height: effectBox.height,
      visible: borderVisible,
      zIndex: 29,
    });
  }

  private drawMark25th(document: YugiohCardDocument): void {
    if (!this.leafer) {
      return;
    }
    if (!this.mark25thLeaf) {
      this.mark25thLeaf = new Image();
      this.leafer.add(this.mark25thLeaf);
    }
    const layout = OUT_FRAME_LAYOUT.mark25th;
    this.mark25thLeaf.set({
      url: this.resourceUrl(layout.url),
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      visible: document.footer.mark25th,
      zIndex: 10,
    });
  }

  private resolveWaiters(revision: number): void {
    const pending: RenderWaiter[] = [];
    for (const waiter of this.waiters) {
      if (waiter.revision <= revision) {
        waiter.resolve();
      } else {
        pending.push(waiter);
      }
    }
    this.waiters = pending;
  }

  private rejectWaiters(revision: number, error: unknown): void {
    const pending: RenderWaiter[] = [];
    for (const waiter of this.waiters) {
      if (waiter.revision <= revision) {
        waiter.reject(error);
      } else {
        pending.push(waiter);
      }
    }
    this.waiters = pending;
  }
}

export * from './document.ts';
