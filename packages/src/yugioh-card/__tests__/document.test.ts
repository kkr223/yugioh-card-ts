import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createYugiohCardDocument,
  legacyDataToYugiohCardDocument,
  parseYugiohCardDocument,
  yugiohCardDocumentToLegacyData,
  YugiohCardDocumentError,
} from '../document.ts';

test('creates independent default documents', () => {
  const first = createYugiohCardDocument();
  const second = createYugiohCardDocument();

  first.frame.arrows.push(1);
  assert.deepEqual(second.frame.arrows, []);
});

test('maps legacy data to a structured document and back', () => {
  const document = legacyDataToYugiohCardDocument({
    language: 'jp',
    name: 'テスト',
    type: 'pendulum',
    pendulumType: 'xyz-pendulum',
    arrowList: [1, 9, 3],
    foregroundImage: 'foreground.png',
    foregroundWidth: 400,
    foregroundHeight: 600,
    foregroundCoverLevel: false,
    nameShadowColor: '#111111',
    nameBlock: true,
    effectBlockEnabled: true,
    effectBlockX: 80,
    effectBlockWidth: 1200,
    effectBlockBorderStyle: 'colored',
    mark25th: true,
  });

  assert.equal(document.frame.language, 'jp');
  assert.deepEqual(document.frame.arrows, [1, 3]);
  assert.equal(document.title.shadow.enabled, true);
  assert.equal(document.frame.nameBlock, true);
  assert.equal(document.foreground.enabled, true);
  assert.equal(document.foreground.coverLevel, false);
  assert.equal(document.effectBox.x, 80);
  assert.equal(document.effectBox.borderStyle, 'colored');
  assert.equal(document.footer.mark25th, true);

  const legacy = yugiohCardDocumentToLegacyData(document);
  assert.equal(legacy.name, 'テスト');
  assert.equal(legacy.nameBlock, true);
  assert.equal(legacy.foregroundImage, 'foreground.png');
  assert.equal(legacy.foregroundCoverLevel, false);
  assert.equal(legacy.effectBlockWidth, 1200);
  assert.equal(legacy.effectBlockBorderStyle, 'colored');
  assert.equal(legacy.mark25th, true);
});

test('legacy data uses defaults for invalid enum values', () => {
  const document = legacyDataToYugiohCardDocument({
    language: 'invalid',
    type: 'invalid',
  });

  assert.equal(document.frame.language, 'sc');
  assert.equal(document.frame.type, 'monster');
});

test('strict parser rejects unknown versions and invalid enums', () => {
  const document = createYugiohCardDocument();

  assert.throws(
    () => parseYugiohCardDocument({ ...document, version: 2 }),
    YugiohCardDocumentError,
  );
  assert.throws(
    () => parseYugiohCardDocument({
      ...document,
      frame: { ...document.frame, language: 'invalid' },
    }),
    /frame\.language/,
  );
  assert.throws(
    () => parseYugiohCardDocument({
      ...document,
      effectBox: { ...document.effectBox, borderStyle: 'invalid' },
    }),
    /effectBox\.borderStyle/,
  );
});

test('strict parser returns a detached document', () => {
  const input = createYugiohCardDocument({
    frame: { arrows: [1, 2] },
  });
  const parsed = parseYugiohCardDocument(input);

  input.frame.arrows.push(3);
  assert.deepEqual(parsed.frame.arrows, [1, 2]);
});
