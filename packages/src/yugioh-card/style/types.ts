import { inheritProp } from '../../utils/index.ts';

export interface YugiohTextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  rtFontSize?: number;
  rtTop?: number;
}

export interface YugiohCardStyle {
  fontFamily: string;
  name: YugiohTextStyle & {
    top: number;
  };
  spellTrap: YugiohTextStyle & {
    top: number;
    right: number;
    scaleY?: number;
    rtFontScaleX?: number;
    icon: {
      marginTop?: number;
      marginLeft?: number;
      marginRight?: number;
    };
  };
  pendulumDescription: YugiohTextStyle & {
    top: number;
  };
  effect: YugiohTextStyle & {
    top: number;
    textIndent?: number;
    minHeight?: number;
  };
  description: YugiohTextStyle & {
    smallFontSize?: number;
  };
}

type TextStyleInput = Partial<YugiohTextStyle> & {
  fontSize: number;
};

export interface YugiohCardStyleInput {
  fontFamily: string;
  name: TextStyleInput & { top: number };
  spellTrap: TextStyleInput & {
    top: number;
    right: number;
    scaleY?: number;
    rtFontScaleX?: number;
    icon: YugiohCardStyle['spellTrap']['icon'];
  };
  pendulumDescription: TextStyleInput & { top: number };
  effect: TextStyleInput & {
    top: number;
    textIndent?: number;
    minHeight?: number;
  };
  description: TextStyleInput & { smallFontSize?: number };
}

export function defineYugiohCardStyle(input: YugiohCardStyleInput): YugiohCardStyle {
  return inheritProp(input) as unknown as YugiohCardStyle;
}
