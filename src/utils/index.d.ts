type SkiaFontRuntime = {
    FontLibrary: {
        use(family: string, paths: string[]): void;
    };
};
export declare const isBrowser: boolean;
export declare const isNode: boolean;
export declare const loadFontBrowser: (fontPath: string) => Promise<void>;
export declare const loadFontNode: (fontPath: string, skia?: SkiaFontRuntime) => void;
export declare const numberToFull: (value: string | number) => string;
export declare const inheritProp: <T extends object>(obj: T, parentObj?: Record<string, unknown>) => T;
export {};
