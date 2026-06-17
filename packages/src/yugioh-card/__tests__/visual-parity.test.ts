import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import skia from 'skia-canvas';
import { YugiohCard as OldYugiohCard } from 'yugioh-card-v190';
import { YugiohCard } from '../index.ts';

const resourcePath = path.resolve('src/assets/yugioh-card');
const data = {
  language: 'sc',
  name: '青眼白龙',
  type: 'monster',
  attribute: 'light',
  cardType: 'normal',
  level: 8,
  monsterType: '龙族/通常',
  atk: 3000,
  def: 2500,
  description: '以高攻击力著称的传说之龙。',
  package: 'SD25-SC001',
  password: '89631139',
  radius: true,
  scale: 0.1,
};

function waitForView(card: { leafer: { waitViewCompleted(callback: () => void): void } }) {
  return new Promise<void>(resolve => {
    card.leafer.waitViewCompleted(resolve);
  });
}

async function pixelsFromCard(card: {
  leafer: {
    waitViewCompleted(callback: () => void): void;
    canvas: { view: { toBuffer(type: string): Promise<Buffer> } };
  };
}) {
  await waitForView(card);
  const buffer = await card.leafer.canvas.view.toBuffer('png');
  const image = await skia.loadImage(buffer);
  const canvas = new skia.Canvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  return {
    width: image.width,
    height: image.height,
    pixels: context.getImageData(0, 0, image.width, image.height).data,
  };
}

test('keeps legacy rendering within the pixel compatibility budget', async () => {
  const oldCard = new OldYugiohCard({ resourcePath, skia, data });
  const newCard = new YugiohCard({ resourcePath, skia, data });
  await newCard.whenReady();

  const [oldImage, newImage] = await Promise.all([
    pixelsFromCard(oldCard),
    pixelsFromCard(newCard),
  ]);
  assert.equal(newImage.width, oldImage.width);
  assert.equal(newImage.height, oldImage.height);

  let changedPixels = 0;
  const pixelCount = oldImage.width * oldImage.height;
  for (let index = 0; index < oldImage.pixels.length; index += 4) {
    let changed = false;
    for (let channel = 0; channel < 4; channel += 1) {
      if (Math.abs(oldImage.pixels[index + channel] - newImage.pixels[index + channel]) > 8) {
        changed = true;
        break;
      }
    }
    if (changed) {
      changedPixels += 1;
    }
  }

  oldCard.leafer.destroy();
  newCard.destroy();
  assert.ok(
    changedPixels / pixelCount <= 0.001,
    `${changedPixels}/${pixelCount} pixels exceeded tolerance`,
  );
});

