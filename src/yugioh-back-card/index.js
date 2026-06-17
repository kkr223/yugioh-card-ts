import { Card as e } from "../card/index.js";
import { Image as t } from "leafer-unified";
//#region packages/src/yugioh-back-card/index.js
var n = class extends e {
	cardLeaf = null;
	konamiLeaf = null;
	registerLeaf = null;
	logoLeaf = null;
	cardWidth = 1394;
	cardHeight = 2031;
	data = {
		type: "normal",
		logo: "ocg",
		konami: !0,
		register: !0,
		radius: !0,
		scale: 1
	};
	constructor(e = {}) {
		super(e), this.initLeafer(), this.setData(e.data);
	}
	get tag() {
		return "YugiohBackCard";
	}
	draw() {
		this.drawCard(), this.drawKonami(), this.drawRegister(), this.drawLogo(), this.updateScale();
	}
	drawCard() {
		this.cardLeaf || (this.cardLeaf = new t(), this.leafer.add(this.cardLeaf));
		let e = `${this.baseImage}/card-${this.data.type}.png`;
		this.cardLeaf.set({
			url: e,
			cornerRadius: this.data.radius ? 24 : 0,
			zIndex: 0
		});
	}
	drawKonami() {
		this.konamiLeaf || (this.konamiLeaf = new t(), this.leafer.add(this.konamiLeaf));
		let e = `${this.baseImage}/konami.png`;
		this.konamiLeaf.set({
			url: e,
			x: 94,
			y: 95,
			visible: this.data.konami,
			zIndex: 10
		});
	}
	drawRegister() {
		this.registerLeaf || (this.registerLeaf = new t(), this.leafer.add(this.registerLeaf));
		let e = `${this.baseImage}/register.png`;
		this.registerLeaf.set({
			url: e,
			x: 370,
			y: 114,
			visible: this.data.register,
			zIndex: 10
		});
	}
	drawLogo() {
		this.logoLeaf || (this.logoLeaf = new t(), this.leafer.add(this.logoLeaf));
		let e = this.data.logo ? `${this.baseImage}/logo-${this.data.logo}.png` : "", n, r;
		this.data.logo === "ocg" ? (n = 878, r = 1722) : this.data.logo === "tcg" ? (n = 859, r = 1763) : this.data.logo === "rd" && (n = 864, r = 1763), this.logoLeaf.set({
			url: e,
			x: n,
			y: r,
			visible: this.data.logo,
			zIndex: 10
		});
	}
	get baseImage() {
		return `${this.resourcePath}/yugioh-back/image`;
	}
};
//#endregion
export { n as YugiohBackCard };
