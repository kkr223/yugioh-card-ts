import path from 'node:path';
import test from 'node:test';
import skia from 'skia-canvas';
import { FieldCenterCard } from '../../field-center-card/index.js';
import { RushDuelCard } from '../../rush-duel-card/index.js';
import { YugiohBackCard } from '../../yugioh-back-card/index.js';
import { YugiohSeries2Card } from '../../yugioh-series-2-card/index.js';

const resourcePath = path.resolve('src/assets/yugioh-card');

test('legacy card types still construct, draw and destroy', () => {
  const constructors = [
    FieldCenterCard,
    RushDuelCard,
    YugiohBackCard,
    YugiohSeries2Card,
  ];

  for (const CardConstructor of constructors) {
    const card = new CardConstructor({ resourcePath, skia });
    card.draw();
    card.destroy();
  }
});
