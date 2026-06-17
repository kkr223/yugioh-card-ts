import { Image, Leafer } from 'leafer-unified';
export interface NodeSkiaCanvas {
    FontLibrary: {
        use(family: string, paths: string[]): void;
    };
}
export interface CardOptions<TData extends object = Record<string, unknown>> {
    view?: string | HTMLElement | HTMLCanvasElement;
    resourcePath?: string;
    skia?: NodeSkiaCanvas;
    data?: Partial<TData>;
}
export declare class Card<TData extends object = Record<string, unknown>> {
    readonly leafer: Leafer | null;
    imageStatusLeaf: Image | null;
    cardWidth: number;
    cardHeight: number;
    data: TData;
    readonly view: CardOptions<TData>['view'];
    readonly resourcePath: string;
    readonly skia: NodeSkiaCanvas | undefined;
    protected fontReady: Promise<void>;
    protected renderReady: Promise<void>;
    protected destroyed: boolean;
    constructor(options?: CardOptions<TData>);
    get tag(): string;
    resourceUrl(path: string): string;
    setData(data?: Partial<TData>): void;
    initLeafer(): Leafer;
    draw(): void | Promise<void>;
    listenImageStatus(imageLeaf: Image): void;
    drawImageStatus(imageLeaf: Image, status: string): void;
    updateScale(): void;
    whenReady(): Promise<void>;
    export(type: string, options?: Record<string, unknown>): Promise<unknown>;
    destroy(): void;
}
