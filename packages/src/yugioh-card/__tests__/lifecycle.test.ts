import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { Rect } from 'leafer-unified';
import skia from 'skia-canvas';
import {
  createYugiohCardDocument,
  YugiohCard,
  type CardLayerExtension,
} from '../index.ts';

const resourcePath = path.resolve('src/assets/yugioh-card');

test('coalesces document updates and exports the stable revision', async () => {
  let extensionUpdates = 0;
  let extensionDestroyed = 0;
  const extension: CardLayerExtension = {
    id: 'test-extension',
    slot: 'top',
    update({ group, document }) {
      extensionUpdates += 1;
      group.clear();
      group.add(new Rect({
        width: 10,
        height: 10,
        fill: document.title.text ? '#ffffff' : '#000000',
      }));
    },
    destroy() {
      extensionDestroyed += 1;
    },
  };
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      title: { text: 'first' },
      render: { scale: 0.1 },
    }),
    extensions: [extension],
  });

  card.setData({ name: 'second' });
  card.setData({ name: 'third' });
  await card.whenReady();

  assert.equal(card.getDocument().title.text, 'third');
  assert.ok(card.revision >= 3);
  assert.ok(extensionUpdates >= 1);

  const exported = await card.export('png', { density: 1 }) as { data: string };
  assert.match(exported.data, /^data:image\/png;base64,/);

  await assert.rejects(
    async () => card.registerExtension(extension),
    /Duplicate YugiohCard extension id/,
  );

  assert.equal(await card.unregisterExtension(extension.id), true);
  assert.equal(extensionDestroyed, 1);
  card.destroy();
  card.destroy();
});

test('updateDocument receives a detached readonly document', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    data: { name: 'before', scale: 0.1 },
  });

  await card.updateDocument(document => {
    assert.equal(Object.isFrozen(document), true);
    assert.equal(Object.isFrozen(document.title), true);
    return {
      ...document,
      title: {
        ...document.title,
        text: 'after',
      },
    };
  });

  assert.equal(card.getDocument().title.text, 'after');
  card.destroy();
});

test('renders optional out-frame resources from document switches', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: { nameBlock: true },
      effectBox: {
        enabled: false,
        borderStyle: 'colored',
      },
      footer: { mark25th: true },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    nameBlockLeaf: { visible?: boolean; x?: number; y?: number };
    effectBoxFillLeaf: { visible?: boolean };
    effectBoxBorderLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
    foregroundLeaf: { zIndex?: number };
    mark25thLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
    };
  };

  assert.equal(internals.nameBlockLeaf.visible, true);
  assert.equal(internals.nameBlockLeaf.x, 76);
  assert.equal(internals.nameBlockLeaf.y, 82);
  assert.equal(internals.effectBoxFillLeaf.visible, false);
  assert.equal(internals.effectBoxBorderLeaf.visible, true);
  assert.match(String(internals.effectBoxBorderLeaf.url), /eblock-border-o\.png$/);
  assert.equal(internals.effectBoxBorderLeaf.x, 77);
  assert.equal(internals.effectBoxBorderLeaf.y, 1501);
  assert.equal(internals.effectBoxBorderLeaf.width, 1239);
  assert.equal(internals.effectBoxBorderLeaf.height, 427);
  assert.ok(
    Number(internals.effectBoxBorderLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );
  assert.equal(internals.mark25thLeaf.visible, true);
  assert.match(String(internals.mark25thLeaf.url), /mark25th\.png$/);
  assert.equal(internals.mark25thLeaf.x, 503);
  assert.equal(internals.mark25thLeaf.y, 1496);
  assert.equal(internals.mark25thLeaf.width, 388);
  assert.equal(internals.mark25thLeaf.height, 430);

  card.destroy();
});

test('foreground can avoid covering level, rank and link-marker overlays', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: {
        cardType: 'link',
        level: 4,
        arrows: [1, 3],
      },
      foreground: {
        enabled: true,
        source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        width: 100,
        height: 100,
        coverLevel: false,
      },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    foregroundLeaf: { zIndex?: number };
    nameLeaf: { zIndex?: number };
    levelLeaf: { zIndex?: number };
    rankLeaf: { zIndex?: number };
    linkArrowLeaf: { zIndex?: number };
  };
  assert.ok(Number(internals.nameLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.levelLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.rankLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));
  assert.ok(Number(internals.linkArrowLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex));

  await card.updateDocument(document => ({
    ...document,
    foreground: {
      ...document.foreground,
      coverLevel: true,
    },
  }));

  assert.equal(internals.levelLeaf.zIndex, 10);
  assert.equal(internals.rankLeaf.zIndex, 10);
  assert.ok(Number(internals.linkArrowLeaf.zIndex) < Number(internals.foregroundLeaf.zIndex));
  card.destroy();
});

test('pendulum foreground cards split art and effect masks around the foreground', async () => {
  const card = new YugiohCard({
    resourcePath,
    skia,
    document: createYugiohCardDocument({
      frame: {
        type: 'pendulum',
      },
      foreground: {
        enabled: true,
        source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        width: 100,
        height: 100,
      },
      render: { scale: 0.1 },
    }),
  });

  await card.whenReady();
  const internals = card as unknown as {
    foregroundLeaf: { zIndex?: number };
    maskLeaf: {
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
    pendulumEffectMaskLeaf: {
      visible?: boolean;
      url?: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      zIndex?: number;
    };
  };

  assert.match(String(internals.maskLeaf.url), /card-mask-pendulum-art\.png$/);
  assert.equal(internals.maskLeaf.x, 68);
  assert.equal(internals.maskLeaf.y, 342);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 914);
  assert.ok(Number(internals.foregroundLeaf.zIndex) > Number(internals.maskLeaf.zIndex));
  assert.equal(internals.pendulumEffectMaskLeaf.visible, true);
  assert.match(
    String(internals.pendulumEffectMaskLeaf.url),
    /card-mask-pendulum-effect\.png$/,
  );
  assert.equal(internals.pendulumEffectMaskLeaf.x, 68);
  assert.equal(internals.pendulumEffectMaskLeaf.y, 1256);
  assert.equal(internals.pendulumEffectMaskLeaf.width, 1257);
  assert.equal(internals.pendulumEffectMaskLeaf.height, 681);
  assert.ok(
    Number(internals.pendulumEffectMaskLeaf.zIndex) > Number(internals.foregroundLeaf.zIndex),
  );

  await card.updateDocument(document => ({
    ...document,
    foreground: {
      ...document.foreground,
      enabled: false,
    },
  }));

  assert.match(String(internals.maskLeaf.url), /card-mask-pendulum\.png$/);
  assert.equal(internals.maskLeaf.width, 1257);
  assert.equal(internals.maskLeaf.height, 1595);
  assert.equal(internals.pendulumEffectMaskLeaf.visible, false);
  card.destroy();
});
