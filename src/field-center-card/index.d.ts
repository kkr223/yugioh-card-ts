import { Card } from '../card/index.js';
export class FieldCenterCard extends Card<Record<string, unknown>> {
    constructor(data?: {});
    cardLeaf: null;
    imageLeaf: null;
    maskLeaf: null;
    data: {
        image: string;
        radius: boolean;
        cardBack: boolean;
        scale: number;
    };
    draw(): void;
    drawCard(): void;
    drawImage(): void;
    drawMask(): void;
    get baseImage(): string;
    get cardUrl(): string;
}
