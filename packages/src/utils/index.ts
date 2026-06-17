type NodeFileSystem = {
  readFileSync(path: string, encoding: 'utf-8'): string;
};

type RuntimeProcess = {
  versions?: { node?: string };
  getBuiltinModule?: (name: string) => NodeFileSystem | undefined;
};

type SkiaFontRuntime = {
  FontLibrary: {
    use(family: string, paths: string[]): void;
  };
};

const runtimeProcess = (globalThis as typeof globalThis & {
  process?: RuntimeProcess;
}).process;
const browserFontLoads = new Map<string, Promise<void>>();
const nodeFontLoads = new WeakMap<object, Set<string>>();
const nodeFontLoadsWithoutRuntime = new Set<string>();
let nodeFs: NodeFileSystem | null = null;

export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const isNode = Boolean(runtimeProcess?.versions?.node);

const getNodeFs = (): NodeFileSystem => {
  if (!isNode) {
    throw new Error('fs is not available in browser builds');
  }
  if (!nodeFs) {
    nodeFs = runtimeProcess?.getBuiltinModule?.('node:fs')
      ?? runtimeProcess?.getBuiltinModule?.('fs')
      ?? null;
  }
  if (!nodeFs) {
    throw new Error('fs is not available in the current Node.js runtime');
  }
  return nodeFs;
};

export const loadFontBrowser = (fontPath: string): Promise<void> => {
  const cached = browserFontLoads.get(fontPath);
  if (cached) {
    return cached;
  }

  const promise = fetch(`${fontPath}/font-list.json`)
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Failed to load font manifest: ${response.status}`);
      }
      const data = await response.json() as unknown;
      if (!Array.isArray(data) || data.some(family => typeof family !== 'string')) {
        throw new Error('Invalid font manifest');
      }
      const fontList = data.map(family => {
        const font = new FontFace(
          family,
          `url(${fontPath}/${family}.woff2) format('woff2')`,
          {
            display: 'swap',
          },
        );
        document.fonts.add(font);
        return font;
      });
      const results = await Promise.allSettled(fontList.map(font => font.load()));
      const failure = results.find(result => result.status === 'rejected');
      if (failure?.status === 'rejected') {
        throw new Error('Failed to load one or more card fonts', {
          cause: failure.reason,
        });
      }
    })
    .catch(error => {
      browserFontLoads.delete(fontPath);
      throw error;
    });
  browserFontLoads.set(fontPath, promise);
  return promise;
};

export const loadFontNode = (
  fontPath: string,
  skia?: SkiaFontRuntime,
): void => {
  const loadedPaths = skia
    ? nodeFontLoads.get(skia) ?? new Set<string>()
    : nodeFontLoadsWithoutRuntime;
  if (loadedPaths.has(fontPath)) {
    return;
  }
  const raw = getNodeFs().readFileSync(`${fontPath}/font-list.json`, 'utf-8');
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data) || data.some(family => typeof family !== 'string')) {
    throw new Error(`Invalid font manifest: ${fontPath}/font-list.json`);
  }
  for (const family of data) {
    skia?.FontLibrary.use(family, [`${fontPath}/${family}.woff2`]);
  }
  loadedPaths.add(fontPath);
  if (skia) {
    nodeFontLoads.set(skia, loadedPaths);
  }
};

export const numberToFull = (value: string | number): string => {
  return String(value).replace(
    /\d/g,
    digit => String.fromCharCode(digit.charCodeAt(0) + 0xFEE0),
  );
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export const inheritProp = <T extends object>(
  obj: T,
  parentObj: Record<string, unknown> = {},
): T => {
  const record = obj as Record<string, unknown>;
  const inheritPropList = ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordSpacing'];
  inheritPropList.forEach(inherit => {
    if (!Object.hasOwn(obj, inherit) && Object.hasOwn(parentObj, inherit)) {
      record[inherit] = parentObj[inherit];
    }
  });
  Object.keys(record).forEach(key => {
    if (isPlainObject(record[key])) {
      inheritProp(record[key], record);
    }
  });
  return obj;
};
