export const YUGIOH_CARD_DOCUMENT_KIND = 'yugioh-card' as const;
export const YUGIOH_CARD_DOCUMENT_VERSION = 1 as const;

export const YUGIOH_CARD_LANGUAGES = [
  'sc',
  'tc',
  'jp',
  'kr',
  'en',
  'astral',
  'custom1',
  'custom2',
] as const;
export const YUGIOH_CARD_TYPES = ['monster', 'spell', 'trap', 'pendulum'] as const;
export const YUGIOH_MONSTER_CARD_TYPES = [
  'normal',
  'effect',
  'ritual',
  'fusion',
  'synchro',
  'xyz',
  'link',
  'token',
] as const;
export const YUGIOH_PENDULUM_CARD_TYPES = [
  'normal-pendulum',
  'effect-pendulum',
  'ritual-pendulum',
  'fusion-pendulum',
  'synchro-pendulum',
  'xyz-pendulum',
  'link-pendulum',
] as const;
export const YUGIOH_TITLE_ALIGNS = ['left', 'center', 'right'] as const;
export const YUGIOH_ARTWORK_FITS = ['cover', 'contain', 'stretch'] as const;
export const YUGIOH_EFFECT_BOX_BORDER_STYLES = ['none', 'default', 'colored'] as const;
export const YUGIOH_LAYER_SLOTS = [
  'before-frame',
  'after-artwork',
  'before-text',
  'after-text',
  'top',
] as const;

export type YugiohCardLanguage = typeof YUGIOH_CARD_LANGUAGES[number];
export type YugiohCardType = typeof YUGIOH_CARD_TYPES[number];
export type YugiohMonsterCardType = typeof YUGIOH_MONSTER_CARD_TYPES[number];
export type YugiohPendulumCardType = typeof YUGIOH_PENDULUM_CARD_TYPES[number];
export type YugiohTitleAlign = typeof YUGIOH_TITLE_ALIGNS[number];
export type YugiohArtworkFit = typeof YUGIOH_ARTWORK_FITS[number];
export type YugiohEffectBoxBorderStyle = typeof YUGIOH_EFFECT_BOX_BORDER_STYLES[number];
export type YugiohCardLayerSlot = typeof YUGIOH_LAYER_SLOTS[number];
export type YugiohLinkArrow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface YugiohCardDocument {
  kind: typeof YUGIOH_CARD_DOCUMENT_KIND;
  version: typeof YUGIOH_CARD_DOCUMENT_VERSION;
  frame: {
    language: YugiohCardLanguage;
    font: '' | 'custom1' | 'custom2';
    type: YugiohCardType;
    attribute: string;
    icon: string;
    cardType: YugiohMonsterCardType;
    pendulumType: YugiohPendulumCardType;
    level: number;
    rank: number;
    pendulumScale: number;
    arrows: YugiohLinkArrow[];
    nameBlock: boolean;
  };
  title: {
    text: string;
    align: YugiohTitleAlign;
    fill: {
      color: string;
      gradient: boolean;
      gradientColor1: string;
      gradientColor2: string;
    };
    shadow: {
      enabled: boolean;
      color: string;
      gradient: boolean;
      gradientColor1: string;
      gradientColor2: string;
      offsetX: number;
      offsetY: number;
      opacity: number;
    };
    useRarityPreset: boolean;
  };
  artwork: {
    source: string;
    fit: YugiohArtworkFit;
  };
  foreground: {
    enabled: boolean;
    source: string;
    width: number;
    height: number;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    coverLevel: boolean;
  };
  effectBox: {
    enabled: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    opacity: number;
    borderStyle: YugiohEffectBoxBorderStyle;
  };
  text: {
    pendulumDescription: string;
    monsterType: string;
    description: string;
    firstLineCompress: boolean;
    descriptionAlign: boolean;
    descriptionZoom: number;
    descriptionWeight: number;
    showAtkBar: boolean;
    atk: number;
    def: number;
  };
  footer: {
    package: string;
    password: string;
    copyright: string;
    laser: string;
    rare: string;
    twentieth: boolean;
    mark25th: boolean;
  };
  render: {
    radius: boolean;
    scale: number;
  };
}

export interface LegacyYugiohCardData {
  language?: string;
  font?: string;
  name?: string;
  color?: string;
  align?: string;
  gradient?: boolean;
  gradientColor1?: string;
  gradientColor2?: string;
  nameShadowColor?: string;
  nameShadowGradient?: boolean;
  nameShadowGradientColor1?: string;
  nameShadowGradientColor2?: string;
  nameShadowOffsetX?: number;
  nameShadowOffsetY?: number;
  nameShadowOpacity?: number;
  useRarityPreset?: boolean;
  type?: string;
  attribute?: string;
  icon?: string;
  image?: string;
  artworkFit?: string;
  cardType?: string;
  pendulumType?: string;
  level?: number;
  rank?: number;
  pendulumScale?: number;
  pendulumDescription?: string;
  monsterType?: string;
  atkBar?: boolean;
  atk?: number;
  def?: number;
  arrowList?: number[];
  nameBlock?: boolean;
  outFrameNameBlock?: boolean;
  outFrameNameBlockEnabled?: boolean;
  description?: string;
  firstLineCompress?: boolean;
  descriptionAlign?: boolean;
  descriptionZoom?: number;
  descriptionWeight?: number;
  package?: string;
  password?: string;
  copyright?: string;
  laser?: string;
  rare?: string;
  twentieth?: boolean;
  radius?: boolean;
  scale?: number;
  foregroundImage?: string;
  foregroundWidth?: number;
  foregroundHeight?: number;
  foregroundX?: number;
  foregroundY?: number;
  foregroundScale?: number;
  foregroundRotation?: number;
  foregroundCoverLevel?: boolean;
  effectBlockEnabled?: boolean;
  effectBlockX?: number;
  effectBlockY?: number;
  effectBlockWidth?: number;
  effectBlockHeight?: number;
  effectBlockColor?: string;
  effectBlockOpacity?: number;
  effectBlockBorder?: boolean;
  effectBlockBorderStyle?: string;
  mark25th?: boolean;
  twentyFifth?: boolean;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export class YugiohCardDocumentError extends Error {
  readonly path: string;

  constructor(message: string, path = '') {
    super(path ? `${path}: ${message}` : message);
    this.name = 'YugiohCardDocumentError';
    this.path = path;
  }
}

const DEFAULT_DOCUMENT: YugiohCardDocument = {
  kind: YUGIOH_CARD_DOCUMENT_KIND,
  version: YUGIOH_CARD_DOCUMENT_VERSION,
  frame: {
    language: 'sc',
    font: '',
    type: 'monster',
    attribute: 'dark',
    icon: '',
    cardType: 'normal',
    pendulumType: 'normal-pendulum',
    level: 0,
    rank: 0,
    pendulumScale: 0,
    arrows: [],
    nameBlock: false,
  },
  title: {
    text: '',
    align: 'left',
    fill: {
      color: '',
      gradient: false,
      gradientColor1: '#999999',
      gradientColor2: '#ffffff',
    },
    shadow: {
      enabled: false,
      color: '',
      gradient: false,
      gradientColor1: '#1f2937',
      gradientColor2: '#0f172a',
      offsetX: 7,
      offsetY: 7,
      opacity: 0.92,
    },
    useRarityPreset: false,
  },
  artwork: {
    source: '',
    fit: 'cover',
  },
  foreground: {
    enabled: false,
    source: '',
    width: 0,
    height: 0,
    x: 697,
    y: 1015.5,
    scale: 1,
    rotation: 0,
    coverLevel: true,
  },
  effectBox: {
    enabled: false,
    x: 77,
    y: 1501,
    width: 1239,
    height: 427,
    color: '#f6f2e8',
    opacity: 0.78,
    borderStyle: 'none',
  },
  text: {
    pendulumDescription: '',
    monsterType: '',
    description: '',
    firstLineCompress: false,
    descriptionAlign: false,
    descriptionZoom: 1,
    descriptionWeight: 0,
    showAtkBar: true,
    atk: 0,
    def: 0,
  },
  footer: {
    package: '',
    password: '',
    copyright: '',
    laser: '',
    rare: '',
    twentieth: false,
    mark25th: false,
  },
  render: {
    radius: true,
    scale: 1,
  },
};

function cloneDocument(document: YugiohCardDocument): YugiohCardDocument {
  return {
    ...document,
    frame: { ...document.frame, arrows: [...document.frame.arrows] },
    title: {
      ...document.title,
      fill: { ...document.title.fill },
      shadow: { ...document.title.shadow },
    },
    artwork: { ...document.artwork },
    foreground: { ...document.foreground },
    effectBox: { ...document.effectBox },
    text: { ...document.text },
    footer: { ...document.footer },
    render: { ...document.render },
  };
}

export function createYugiohCardDocument(
  input: DeepPartial<YugiohCardDocument> = {},
): YugiohCardDocument {
  const document = cloneDocument(DEFAULT_DOCUMENT);
  return {
    ...document,
    ...input,
    kind: YUGIOH_CARD_DOCUMENT_KIND,
    version: YUGIOH_CARD_DOCUMENT_VERSION,
    frame: {
      ...document.frame,
      ...input.frame,
      arrows: [...(input.frame?.arrows ?? document.frame.arrows)],
    },
    title: {
      ...document.title,
      ...input.title,
      fill: { ...document.title.fill, ...input.title?.fill },
      shadow: { ...document.title.shadow, ...input.title?.shadow },
    },
    artwork: { ...document.artwork, ...input.artwork },
    foreground: { ...document.foreground, ...input.foreground },
    effectBox: { ...document.effectBox, ...input.effectBox },
    text: { ...document.text, ...input.text },
    footer: { ...document.footer, ...input.footer },
    render: { ...document.render, ...input.render },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordAt(parent: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = parent[key];
  if (!isRecord(value)) {
    throw new YugiohCardDocumentError('expected an object', key);
  }
  return value;
}

function enumAt<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  path: string,
): T[number] {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new YugiohCardDocumentError(`expected one of ${allowed.join(', ')}`, path);
  }
  return value as T[number];
}

function stringAt(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    throw new YugiohCardDocumentError('expected a string', path);
  }
  return value;
}

function numberAt(value: unknown, path: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new YugiohCardDocumentError('expected a finite number', path);
  }
  return value;
}

function booleanAt(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') {
    throw new YugiohCardDocumentError('expected a boolean', path);
  }
  return value;
}

function optionalEnumAt<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
  path: string,
): T[number] {
  if (value === undefined) {
    return fallback;
  }
  return enumAt(value, allowed, path);
}

function optionalBooleanAt(value: unknown, fallback: boolean, path: string): boolean {
  if (value === undefined) {
    return fallback;
  }
  return booleanAt(value, path);
}

export function parseYugiohCardDocument(value: unknown): YugiohCardDocument {
  if (!isRecord(value)) {
    throw new YugiohCardDocumentError('expected an object');
  }
  if (value.kind !== YUGIOH_CARD_DOCUMENT_KIND) {
    throw new YugiohCardDocumentError(`expected ${YUGIOH_CARD_DOCUMENT_KIND}`, 'kind');
  }
  if (value.version !== YUGIOH_CARD_DOCUMENT_VERSION) {
    throw new YugiohCardDocumentError(
      `unsupported version ${String(value.version)}`,
      'version',
    );
  }

  const frame = recordAt(value, 'frame');
  const title = recordAt(value, 'title');
  const fill = recordAt(title, 'fill');
  const shadow = recordAt(title, 'shadow');
  const artwork = recordAt(value, 'artwork');
  const foreground = recordAt(value, 'foreground');
  const effectBox = recordAt(value, 'effectBox');
  const text = recordAt(value, 'text');
  const footer = recordAt(value, 'footer');
  const render = recordAt(value, 'render');
  const arrows = frame.arrows;
  if (!Array.isArray(arrows) || arrows.some(arrow => !Number.isInteger(arrow) || arrow < 1 || arrow > 8)) {
    throw new YugiohCardDocumentError('expected integers from 1 to 8', 'frame.arrows');
  }

  return {
    kind: YUGIOH_CARD_DOCUMENT_KIND,
    version: YUGIOH_CARD_DOCUMENT_VERSION,
    frame: {
      language: enumAt(frame.language, YUGIOH_CARD_LANGUAGES, 'frame.language'),
      font: enumAt(frame.font, ['', 'custom1', 'custom2'] as const, 'frame.font'),
      type: enumAt(frame.type, YUGIOH_CARD_TYPES, 'frame.type'),
      attribute: stringAt(frame.attribute, 'frame.attribute'),
      icon: stringAt(frame.icon, 'frame.icon'),
      cardType: enumAt(frame.cardType, YUGIOH_MONSTER_CARD_TYPES, 'frame.cardType'),
      pendulumType: enumAt(
        frame.pendulumType,
        YUGIOH_PENDULUM_CARD_TYPES,
        'frame.pendulumType',
      ),
      level: numberAt(frame.level, 'frame.level'),
      rank: numberAt(frame.rank, 'frame.rank'),
      pendulumScale: numberAt(frame.pendulumScale, 'frame.pendulumScale'),
      arrows: [...arrows] as YugiohLinkArrow[],
      nameBlock: optionalBooleanAt(frame.nameBlock, false, 'frame.nameBlock'),
    },
    title: {
      text: stringAt(title.text, 'title.text'),
      align: enumAt(title.align, YUGIOH_TITLE_ALIGNS, 'title.align'),
      fill: {
        color: stringAt(fill.color, 'title.fill.color'),
        gradient: booleanAt(fill.gradient, 'title.fill.gradient'),
        gradientColor1: stringAt(fill.gradientColor1, 'title.fill.gradientColor1'),
        gradientColor2: stringAt(fill.gradientColor2, 'title.fill.gradientColor2'),
      },
      shadow: {
        enabled: booleanAt(shadow.enabled, 'title.shadow.enabled'),
        color: stringAt(shadow.color, 'title.shadow.color'),
        gradient: booleanAt(shadow.gradient, 'title.shadow.gradient'),
        gradientColor1: stringAt(
          shadow.gradientColor1,
          'title.shadow.gradientColor1',
        ),
        gradientColor2: stringAt(
          shadow.gradientColor2,
          'title.shadow.gradientColor2',
        ),
        offsetX: numberAt(shadow.offsetX, 'title.shadow.offsetX'),
        offsetY: numberAt(shadow.offsetY, 'title.shadow.offsetY'),
        opacity: numberAt(shadow.opacity, 'title.shadow.opacity'),
      },
      useRarityPreset: booleanAt(title.useRarityPreset, 'title.useRarityPreset'),
    },
    artwork: {
      source: stringAt(artwork.source, 'artwork.source'),
      fit: enumAt(artwork.fit, YUGIOH_ARTWORK_FITS, 'artwork.fit'),
    },
    foreground: {
      enabled: booleanAt(foreground.enabled, 'foreground.enabled'),
      source: stringAt(foreground.source, 'foreground.source'),
      width: numberAt(foreground.width, 'foreground.width'),
      height: numberAt(foreground.height, 'foreground.height'),
      x: numberAt(foreground.x, 'foreground.x'),
      y: numberAt(foreground.y, 'foreground.y'),
      scale: numberAt(foreground.scale, 'foreground.scale'),
      rotation: numberAt(foreground.rotation, 'foreground.rotation'),
      coverLevel: optionalBooleanAt(
        foreground.coverLevel,
        true,
        'foreground.coverLevel',
      ),
    },
    effectBox: {
      enabled: booleanAt(effectBox.enabled, 'effectBox.enabled'),
      x: numberAt(effectBox.x, 'effectBox.x'),
      y: numberAt(effectBox.y, 'effectBox.y'),
      width: numberAt(effectBox.width, 'effectBox.width'),
      height: numberAt(effectBox.height, 'effectBox.height'),
      color: stringAt(effectBox.color, 'effectBox.color'),
      opacity: numberAt(effectBox.opacity, 'effectBox.opacity'),
      borderStyle: optionalEnumAt(
        effectBox.borderStyle,
        YUGIOH_EFFECT_BOX_BORDER_STYLES,
        'none',
        'effectBox.borderStyle',
      ),
    },
    text: {
      pendulumDescription: stringAt(
        text.pendulumDescription,
        'text.pendulumDescription',
      ),
      monsterType: stringAt(text.monsterType, 'text.monsterType'),
      description: stringAt(text.description, 'text.description'),
      firstLineCompress: booleanAt(
        text.firstLineCompress,
        'text.firstLineCompress',
      ),
      descriptionAlign: booleanAt(text.descriptionAlign, 'text.descriptionAlign'),
      descriptionZoom: numberAt(text.descriptionZoom, 'text.descriptionZoom'),
      descriptionWeight: numberAt(text.descriptionWeight, 'text.descriptionWeight'),
      showAtkBar: booleanAt(text.showAtkBar, 'text.showAtkBar'),
      atk: numberAt(text.atk, 'text.atk'),
      def: numberAt(text.def, 'text.def'),
    },
    footer: {
      package: stringAt(footer.package, 'footer.package'),
      password: stringAt(footer.password, 'footer.password'),
      copyright: stringAt(footer.copyright, 'footer.copyright'),
      laser: stringAt(footer.laser, 'footer.laser'),
      rare: stringAt(footer.rare, 'footer.rare'),
      twentieth: booleanAt(footer.twentieth, 'footer.twentieth'),
      mark25th: optionalBooleanAt(footer.mark25th, false, 'footer.mark25th'),
    },
    render: {
      radius: booleanAt(render.radius, 'render.radius'),
      scale: numberAt(render.scale, 'render.scale'),
    },
  };
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function numberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  return typeof value === 'string' && allowed.includes(value)
    ? value as T[number]
    : fallback;
}

function legacyEffectBoxBorderStyle(
  data: LegacyYugiohCardData,
  fallback: YugiohEffectBoxBorderStyle,
): YugiohEffectBoxBorderStyle {
  if (typeof data.effectBlockBorderStyle === 'string') {
    if (data.effectBlockBorderStyle === 'o' || data.effectBlockBorderStyle === 'alternate') {
      return 'colored';
    }
    return enumValue(
      data.effectBlockBorderStyle,
      YUGIOH_EFFECT_BOX_BORDER_STYLES,
      fallback,
    );
  }
  if (typeof data.effectBlockBorder === 'boolean') {
    return data.effectBlockBorder ? 'default' : 'none';
  }
  return fallback;
}

export function legacyDataToYugiohCardDocument(
  data: LegacyYugiohCardData = {},
  base: YugiohCardDocument = createYugiohCardDocument(),
): YugiohCardDocument {
  const shadowColor = stringValue(data.nameShadowColor, base.title.shadow.color);
  const foregroundSource = stringValue(data.foregroundImage, base.foreground.source);
  const arrows = Array.isArray(data.arrowList)
    ? data.arrowList.filter(
      (arrow): arrow is YugiohLinkArrow =>
        Number.isInteger(arrow) && arrow >= 1 && arrow <= 8,
    )
    : base.frame.arrows;

  return createYugiohCardDocument({
    frame: {
      language: enumValue(data.language, YUGIOH_CARD_LANGUAGES, base.frame.language),
      font: enumValue(data.font, ['', 'custom1', 'custom2'] as const, base.frame.font),
      type: enumValue(data.type, YUGIOH_CARD_TYPES, base.frame.type),
      attribute: stringValue(data.attribute, base.frame.attribute),
      icon: stringValue(data.icon, base.frame.icon),
      cardType: enumValue(data.cardType, YUGIOH_MONSTER_CARD_TYPES, base.frame.cardType),
      pendulumType: enumValue(
        data.pendulumType,
        YUGIOH_PENDULUM_CARD_TYPES,
        base.frame.pendulumType,
      ),
      level: numberValue(data.level, base.frame.level),
      rank: numberValue(data.rank, base.frame.rank),
      pendulumScale: numberValue(data.pendulumScale, base.frame.pendulumScale),
      arrows,
      nameBlock: booleanValue(
        data.nameBlock ?? data.outFrameNameBlock ?? data.outFrameNameBlockEnabled,
        base.frame.nameBlock,
      ),
    },
    title: {
      text: stringValue(data.name, base.title.text),
      align: enumValue(data.align, YUGIOH_TITLE_ALIGNS, base.title.align),
      fill: {
        color: stringValue(data.color, base.title.fill.color),
        gradient: booleanValue(data.gradient, base.title.fill.gradient),
        gradientColor1: stringValue(
          data.gradientColor1,
          base.title.fill.gradientColor1,
        ),
        gradientColor2: stringValue(
          data.gradientColor2,
          base.title.fill.gradientColor2,
        ),
      },
      shadow: {
        enabled: Boolean(
          shadowColor
          || data.nameShadowGradient
          || base.title.shadow.enabled,
        ),
        color: shadowColor,
        gradient: booleanValue(
          data.nameShadowGradient,
          base.title.shadow.gradient,
        ),
        gradientColor1: stringValue(
          data.nameShadowGradientColor1,
          base.title.shadow.gradientColor1,
        ),
        gradientColor2: stringValue(
          data.nameShadowGradientColor2,
          base.title.shadow.gradientColor2,
        ),
        offsetX: numberValue(data.nameShadowOffsetX, base.title.shadow.offsetX),
        offsetY: numberValue(data.nameShadowOffsetY, base.title.shadow.offsetY),
        opacity: numberValue(data.nameShadowOpacity, base.title.shadow.opacity),
      },
      useRarityPreset: booleanValue(
        data.useRarityPreset,
        base.title.useRarityPreset,
      ),
    },
    artwork: {
      source: stringValue(data.image, base.artwork.source),
      fit: enumValue(data.artworkFit, YUGIOH_ARTWORK_FITS, base.artwork.fit),
    },
    foreground: {
      enabled: Boolean(foregroundSource),
      source: foregroundSource,
      width: numberValue(data.foregroundWidth, base.foreground.width),
      height: numberValue(data.foregroundHeight, base.foreground.height),
      x: numberValue(data.foregroundX, base.foreground.x),
      y: numberValue(data.foregroundY, base.foreground.y),
      scale: numberValue(data.foregroundScale, base.foreground.scale),
      rotation: numberValue(data.foregroundRotation, base.foreground.rotation),
      coverLevel: booleanValue(
        data.foregroundCoverLevel,
        base.foreground.coverLevel,
      ),
    },
    effectBox: {
      enabled: booleanValue(data.effectBlockEnabled, base.effectBox.enabled),
      x: numberValue(data.effectBlockX, base.effectBox.x),
      y: numberValue(data.effectBlockY, base.effectBox.y),
      width: numberValue(data.effectBlockWidth, base.effectBox.width),
      height: numberValue(data.effectBlockHeight, base.effectBox.height),
      color: stringValue(data.effectBlockColor, base.effectBox.color),
      opacity: numberValue(data.effectBlockOpacity, base.effectBox.opacity),
      borderStyle: legacyEffectBoxBorderStyle(data, base.effectBox.borderStyle),
    },
    text: {
      pendulumDescription: stringValue(
        data.pendulumDescription,
        base.text.pendulumDescription,
      ),
      monsterType: stringValue(data.monsterType, base.text.monsterType),
      description: stringValue(data.description, base.text.description),
      firstLineCompress: booleanValue(
        data.firstLineCompress,
        base.text.firstLineCompress,
      ),
      descriptionAlign: booleanValue(
        data.descriptionAlign,
        base.text.descriptionAlign,
      ),
      descriptionZoom: numberValue(
        data.descriptionZoom,
        base.text.descriptionZoom,
      ),
      descriptionWeight: numberValue(
        data.descriptionWeight,
        base.text.descriptionWeight,
      ),
      showAtkBar: booleanValue(data.atkBar, base.text.showAtkBar),
      atk: numberValue(data.atk, base.text.atk),
      def: numberValue(data.def, base.text.def),
    },
    footer: {
      package: stringValue(data.package, base.footer.package),
      password: stringValue(data.password, base.footer.password),
      copyright: stringValue(data.copyright, base.footer.copyright),
      laser: stringValue(data.laser, base.footer.laser),
      rare: stringValue(data.rare, base.footer.rare),
      twentieth: booleanValue(data.twentieth, base.footer.twentieth),
      mark25th: booleanValue(data.mark25th ?? data.twentyFifth, base.footer.mark25th),
    },
    render: {
      radius: booleanValue(data.radius, base.render.radius),
      scale: numberValue(data.scale, base.render.scale),
    },
  });
}

export function yugiohCardDocumentToLegacyData(
  document: YugiohCardDocument,
): Required<LegacyYugiohCardData> {
  const value = parseYugiohCardDocument(document);
  return {
    language: value.frame.language,
    font: value.frame.font,
    name: value.title.text,
    color: value.title.fill.color,
    align: value.title.align,
    gradient: value.title.fill.gradient,
    gradientColor1: value.title.fill.gradientColor1,
    gradientColor2: value.title.fill.gradientColor2,
    nameShadowColor: value.title.shadow.color,
    nameShadowGradient: value.title.shadow.gradient,
    nameShadowGradientColor1: value.title.shadow.gradientColor1,
    nameShadowGradientColor2: value.title.shadow.gradientColor2,
    nameShadowOffsetX: value.title.shadow.offsetX,
    nameShadowOffsetY: value.title.shadow.offsetY,
    nameShadowOpacity: value.title.shadow.opacity,
    useRarityPreset: value.title.useRarityPreset,
    type: value.frame.type,
    attribute: value.frame.attribute,
    icon: value.frame.icon,
    image: value.artwork.source,
    artworkFit: value.artwork.fit,
    cardType: value.frame.cardType,
    pendulumType: value.frame.pendulumType,
    level: value.frame.level,
    rank: value.frame.rank,
    pendulumScale: value.frame.pendulumScale,
    nameBlock: value.frame.nameBlock,
    outFrameNameBlock: value.frame.nameBlock,
    outFrameNameBlockEnabled: value.frame.nameBlock,
    pendulumDescription: value.text.pendulumDescription,
    monsterType: value.text.monsterType,
    atkBar: value.text.showAtkBar,
    atk: value.text.atk,
    def: value.text.def,
    arrowList: [...value.frame.arrows],
    description: value.text.description,
    firstLineCompress: value.text.firstLineCompress,
    descriptionAlign: value.text.descriptionAlign,
    descriptionZoom: value.text.descriptionZoom,
    descriptionWeight: value.text.descriptionWeight,
    package: value.footer.package,
    password: value.footer.password,
    copyright: value.footer.copyright,
    laser: value.footer.laser,
    rare: value.footer.rare,
    twentieth: value.footer.twentieth,
    mark25th: value.footer.mark25th,
    twentyFifth: value.footer.mark25th,
    radius: value.render.radius,
    scale: value.render.scale,
    foregroundImage: value.foreground.source,
    foregroundWidth: value.foreground.width,
    foregroundHeight: value.foreground.height,
    foregroundX: value.foreground.x,
    foregroundY: value.foreground.y,
    foregroundScale: value.foreground.scale,
    foregroundRotation: value.foreground.rotation,
    foregroundCoverLevel: value.foreground.coverLevel,
    effectBlockEnabled: value.effectBox.enabled,
    effectBlockX: value.effectBox.x,
    effectBlockY: value.effectBox.y,
    effectBlockWidth: value.effectBox.width,
    effectBlockHeight: value.effectBox.height,
    effectBlockColor: value.effectBox.color,
    effectBlockOpacity: value.effectBox.opacity,
    effectBlockBorder: value.effectBox.borderStyle !== 'none',
    effectBlockBorderStyle: value.effectBox.borderStyle,
  };
}
