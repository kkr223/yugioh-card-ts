import { Image, ImageEvent, Leafer, Text, useCanvas } from 'leafer-unified';
import { isBrowser, isNode, loadFontBrowser, loadFontNode } from '../utils/index.ts';
import loaderIconUrl from '../svg/loader.js';
import imageIconUrl from '../svg/image.js';

const fontPathMap: Partial<Record<string, string>> = {
  YugiohCard: '/yugioh/font',
  YugiohSeries2Card: '/yugioh/font',
  RushDuelCard: '/rush-duel/font',
};

const resetAttr = () => {
  Text.changeAttr('lineHeight', {
    type: 'percent',
    value: 1.15,
  });
};

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

type NodeExportCanvas = {
  toDataURL(extension?: string, options?: Record<string, unknown>): Promise<string>;
  saveAs(path: string, options?: Record<string, unknown>): Promise<void>;
};

type LeaferExportRuntime = Leafer & {
  canvas?: {
    view?: NodeExportCanvas;
  };
  waitViewCompleted(callback: () => void): void;
};

function normalizeResourcePath(resourcePath: string | undefined): string {
  return (resourcePath ?? '').replace(/[\\/]+$/, '');
}

export class Card<TData extends object = Record<string, unknown>> {
  readonly leafer: Leafer | null = null;
  imageStatusLeaf: Image | null = null;
  cardWidth = 100;
  cardHeight = 100;
  data = {} as TData;
  readonly view: CardOptions<TData>['view'];
  readonly resourcePath: string;
  readonly skia: NodeSkiaCanvas | undefined;
  protected fontReady: Promise<void> = Promise.resolve();
  protected renderReady: Promise<void> = Promise.resolve();
  protected destroyed = false;

  constructor(options: CardOptions<TData> = {}) {
    this.view = options.view;
    this.resourcePath = normalizeResourcePath(options.resourcePath);
    this.skia = options.skia;
    resetAttr();

    if (isNode) {
      if (!this.skia) {
        throw new Error('skia-canvas is required in Node environment');
      }
      useCanvas('skia', this.skia as never);
    }

    const fontPath = fontPathMap[this.tag];
    if (fontPath) {
      const resourceUrl = this.resourceUrl(fontPath);
      if (isNode) {
        loadFontNode(resourceUrl, this.skia);
      } else {
        this.fontReady = loadFontBrowser(resourceUrl).then(() => {
          if (!this.destroyed) {
            return this.draw();
          }
        });
      }
    }
  }

  get tag(): string {
    return 'Card';
  }

  resourceUrl(path: string): string {
    const suffix = path.replace(/^[\\/]+/, '');
    if (!this.resourcePath) {
      return suffix;
    }
    const separator = this.resourcePath.includes('\\') && !this.resourcePath.includes('://')
      ? '\\'
      : '/';
    return `${this.resourcePath}${separator}${suffix}`;
  }

  setData(data: Partial<TData> = {}): void {
    Object.assign(this.data, data);
    void this.draw();
  }

  initLeafer(): Leafer {
    if (this.leafer) {
      return this.leafer;
    }
    const leafer = new Leafer({
      view: this.view,
      width: this.cardWidth,
      height: this.cardHeight,
    });
    Object.defineProperty(this, 'leafer', {
      configurable: true,
      enumerable: true,
      value: leafer,
      writable: false,
    });
    return leafer;
  }

  draw(): void | Promise<void> {
    // need to be overridden
  }

  listenImageStatus(imageLeaf: Image): void {
    if (isNode) {
      return;
    }
    imageLeaf.on(ImageEvent.LOAD, () => {
      this.drawImageStatus(imageLeaf, ImageEvent.LOAD);
    });
    imageLeaf.on(ImageEvent.LOADED, () => {
      this.drawImageStatus(imageLeaf, ImageEvent.LOADED);
    });
    imageLeaf.on(ImageEvent.ERROR, () => {
      this.drawImageStatus(imageLeaf, ImageEvent.ERROR);
    });
  }

  drawImageStatus(imageLeaf: Image, status: string): void {
    if (!this.leafer) {
      return;
    }
    const { url, width, height, x, y, zIndex } = imageLeaf;
    if (!this.imageStatusLeaf) {
      this.imageStatusLeaf = new Image();
      this.leafer.add(this.imageStatusLeaf);
    }

    let statusUrl = '';
    if (status === ImageEvent.LOAD) {
      statusUrl = loaderIconUrl;
    } else if (status === ImageEvent.ERROR) {
      statusUrl = imageIconUrl;
    }

    this.imageStatusLeaf.set({
      url: statusUrl,
      width: 120,
      height: 120,
      around: 'center',
      x: (x ?? 0) + (width ?? 0) / 2,
      y: (y ?? 0) + (height ?? 0) / 2,
      visible: [ImageEvent.LOAD, ImageEvent.ERROR].includes(status) && Boolean(url),
      zIndex: (zIndex ?? 0) + 1,
    });
  }

  updateScale(): void {
    if (!this.leafer) {
      return;
    }
    const data = this.data as TData & { scale?: number };
    const scale = data.scale ?? 1;
    const pixelRatio = isBrowser ? devicePixelRatio : 1;
    this.leafer.pixelRatio = pixelRatio;
    this.leafer.width = this.cardWidth * scale / pixelRatio;
    this.leafer.height = this.cardHeight * scale / pixelRatio;
    this.leafer.scaleX = scale / pixelRatio;
    this.leafer.scaleY = scale / pixelRatio;
  }

  async whenReady(): Promise<void> {
    await this.fontReady;
    await this.renderReady;
    if (this.leafer) {
      await new Promise<void>(resolve => {
        (this.leafer as LeaferExportRuntime).waitViewCompleted(resolve);
      });
    }
  }

  async export(type: string, options?: Record<string, unknown>): Promise<unknown> {
    await this.whenReady();
    if (!this.leafer) {
      throw new Error('Card renderer is not initialized');
    }
    const leafer = this.leafer as LeaferExportRuntime;
    if (isNode && leafer.canvas?.view) {
      if (/\.[a-z0-9]+$/i.test(type)) {
        await leafer.canvas.view.saveAs(type, options);
        return { data: type };
      }
      const data = await leafer.canvas.view.toDataURL(type, options);
      return { data };
    }
    const result = await this.leafer.export(type, options) as {
      error?: unknown;
    };
    if (result?.error) {
      throw result.error;
    }
    return result;
  }

  destroy(): void {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.leafer?.destroy();
  }
}
