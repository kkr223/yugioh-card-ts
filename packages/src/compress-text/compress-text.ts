import { LegacyCompressText } from './legacy-compress-text.js';
import type { IFontWeight, ITextAlign } from 'leafer-unified';

export interface CompressTextData {
  text: string | number;
  fontFamily: string;
  fontSize: number;
  fontWeight: IFontWeight;
  fontScale: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  firstLineCompress: boolean;
  textAlign: ITextAlign;
  textJustifyLast: boolean;
  color: string;
  strokeWidth: number;
  gradient: boolean;
  gradientColor1: string;
  gradientColor2: string;
  rtFontFamily: string;
  rtFontSize: number;
  rtFontWeight: IFontWeight;
  rtFontScaleX: number;
  rtLineHeight: number;
  rtLetterSpacing: number;
  rtColor: string;
  rtStrokeWidth: number;
  rtTop: number;
  autoSmallSize: boolean;
  smallFontSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  visible: boolean;
  opacity: number;
  scaleX: number;
  scaleY: number;
}

export interface CompressTextBounds {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export class CompressText extends LegacyCompressText {
  declare text: string | number;
  declare fontFamily: string;
  declare fontSize: number;
  declare fontWeight: IFontWeight;
  declare fontScale: number;
  declare lineHeight: number;
  declare letterSpacing: number;
  declare wordSpacing: number;
  declare firstLineCompress: boolean;
  declare textAlign: CompressTextData['textAlign'];
  declare textJustifyLast: boolean;
  declare color: string;
  declare strokeWidth: number;
  declare gradient: boolean;
  declare gradientColor1: string;
  declare gradientColor2: string;
  declare rtFontFamily: string;
  declare rtFontSize: number;
  declare rtFontWeight: IFontWeight;
  declare rtFontScaleX: number;
  declare rtLineHeight: number;
  declare rtLetterSpacing: number;
  declare rtColor: string;
  declare rtStrokeWidth: number;
  declare rtTop: number;
  declare autoSmallSize: boolean;
  declare smallFontSize: number;
  declare bounds: CompressTextBounds;

  constructor(data: Partial<CompressTextData> = {}) {
    super(data);
  }

  override set(data: Partial<CompressTextData> = {}): void {
    super.set(data);
  }
}
