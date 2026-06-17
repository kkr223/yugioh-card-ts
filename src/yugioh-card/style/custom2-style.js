import { defineYugiohCardStyle as e } from "./types.js";
//#region packages/src/yugioh-card/style/custom2-style.ts
var t = e({
	fontFamily: "custom2",
	name: {
		top: 92,
		fontSize: 108
	},
	spellTrap: {
		top: 250,
		fontSize: 76,
		right: 104,
		icon: {
			marginTop: 12,
			marginLeft: 10
		}
	},
	pendulumDescription: {
		top: 1280,
		fontSize: 36,
		lineHeight: 1.2
	},
	effect: {
		top: 1525,
		fontSize: 44,
		lineHeight: 1.2,
		textIndent: -.4 * 44,
		minHeight: 10
	},
	description: {
		fontSize: 36,
		lineHeight: 1.2
	}
});
//#endregion
export { t as default };
