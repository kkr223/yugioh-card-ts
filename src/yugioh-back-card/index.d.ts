import { Card } from '../card/index.js';
export class YugiohBackCard extends Card<Record<string, unknown>> {
    constructor(data?: {});
    cardLeaf: null;
    konamiLeaf: null;
    registerLeaf: null;
    logoLeaf: null;
    data: {
        type: string;
        logo: string;
        konami: boolean;
        register: boolean;
        radius: boolean;
        scale: number;
    };
    draw(): void;
    drawCard(): void;
    drawKonami(): void;
    drawRegister(): void;
    drawLogo(): void;
    get baseImage(): string;
}
