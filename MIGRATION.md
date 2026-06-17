# Migrating to yugioh-card-ts 2.0

## Package Rename

Replace the old package:

```bash
pnpm remove yugioh-card
pnpm add yugioh-card-ts leafer leafer-unified
```

Existing constructor data and `setData()` calls remain supported:

```js
import { YugiohCard } from 'yugioh-card-ts';

const card = new YugiohCard({ view, data, resourcePath });
await card.whenReady();
```

## Structured Documents

New integrations should use the versioned document API:

```js
import {
  YugiohCard,
  createYugiohCardDocument,
} from 'yugioh-card-ts';

const document = createYugiohCardDocument({
  title: { text: 'Blue-Eyes White Dragon' },
});

const card = new YugiohCard({ view, document, resourcePath });
await card.updateDocument(current => ({
  ...current,
  title: { ...current.title, shadow: { ...current.title.shadow, enabled: true } },
}));
```

Use `parseYugiohCardDocument()` at persistence and network boundaries. It rejects
unknown document versions and invalid enum values. Legacy flat data continues to
use permissive defaults through `legacyDataToYugiohCardDocument()`.

## Export And Lifecycle

`export()` and `whenReady()` wait for the current render revision and resources:

```js
const result = await card.export('png');
card.destroy();
```

`draw()` is retained for compatibility. Internal Leafer leaves and individual
`drawXxx()` methods are no longer public API.

## Layer Extensions

Code that previously changed internal leaf `zIndex` values should register a
`CardLayerExtension`. Available slots are `before-frame`, `after-artwork`,
`before-text`, `after-text`, and `top`. Extension IDs must be unique, and an
extension must release its own nodes from `destroy()`.

## Out-Frame Overlays

The 2.0 document model includes optional out-frame resources for over-frame card
layouts. They are disabled by default to preserve old output:

```js
await card.updateDocument(document => ({
  ...document,
  frame: {
    ...document.frame,
    nameBlock: true,
  },
  effectBox: {
    ...document.effectBox,
    borderStyle: 'colored', // 'none' | 'default' | 'colored'
  },
  foreground: {
    ...document.foreground,
    coverLevel: false,
  },
  footer: {
    ...document.footer,
    mark25th: true,
  },
}));
```

Legacy flat data can use `nameBlock`, `effectBlockBorderStyle`, and `mark25th`.
`effectBlockBorderStyle: 'default'` uses `eblock-border.png`; `'colored'` uses
`eblock-border-o.png`. Use `foregroundCoverLevel: false` when the foreground
image should stay behind level, rank, and link-marker overlays.

Pendulum cards with a visible foreground automatically split the pendulum mask:
`card-mask-pendulum-art.png` stays below the foreground, while
`card-mask-pendulum-effect.png` stays above it. Pendulum cards without a
foreground keep using the original `card-mask-pendulum.png`.

## Node Rendering

Node 22 or newer is required. Install `@leafer/node` and `skia-canvas` when
rendering outside the browser. `skia-canvas` remains an optional peer dependency
for browser-only consumers.
