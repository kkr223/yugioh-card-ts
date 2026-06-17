import { Group } from 'leafer-unified';
import { LegacyYugiohCardData, YugiohCardDocument, YugiohCardLayerSlot } from './document.js';
import { LegacyYugiohCardRenderer } from './legacy-renderer.js';
import { CardOptions } from '../card/index.js';
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
export declare class YugiohCardRenderError extends Error {
    readonly revision: number;
    readonly cause: unknown;
    constructor(revision: number, cause: unknown);
}
export declare class YugiohCard extends LegacyYugiohCardRenderer {
    private documentValue;
    private revisionValue;
    private completedRevision;
    private renderQueued;
    private rendering;
    private waiters;
    private extensions;
    private slotGroups;
    private nameBlockLeaf;
    private titleShadowLeaf;
    private foregroundLeaf;
    private pendulumEffectMaskLeaf;
    private effectBoxFillLeaf;
    private effectBoxBorderLeaf;
    private mark25thLeaf;
    constructor(options?: YugiohCardOptions);
    get tag(): string;
    get revision(): number;
    setData(data?: LegacyYugiohCardData): void;
    setDocument(document: YugiohCardDocument): Promise<void>;
    updateDocument(updater: (document: Readonly<YugiohCardDocument>) => YugiohCardDocument): Promise<void>;
    getDocument(): Readonly<YugiohCardDocument>;
    registerExtension(extension: CardLayerExtension): void;
    unregisterExtension(id: string): Promise<boolean>;
    draw(): void;
    whenReady(): Promise<void>;
    export(type: string, options?: Record<string, unknown>): Promise<unknown>;
    destroy(): void;
    private assertActive;
    private initializeSlotGroups;
    private scheduleRender;
    private waitForRevision;
    private flushRenderQueue;
    private renderRevision;
    private applyRarityTitlePreset;
    private applyArtworkFit;
    private foregroundVisible;
    private drawPendulumSplitMask;
    private drawTitleShadow;
    private drawNameBlock;
    private drawForeground;
    private applyForegroundLevelPolicy;
    private drawEffectBox;
    private drawMark25th;
    private resolveWaiters;
    private rejectWaiters;
}
export * from './document.js';
