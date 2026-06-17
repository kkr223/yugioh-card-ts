import { Card as e } from "../card/index.js";
import { Image as t, Rect as n } from "leafer-unified";
//#region packages/src/field-center-card/index.js
var r = class extends e {
	cardLeaf = null;
	imageLeaf = null;
	maskLeaf = null;
	cardWidth = 1488;
	cardHeight = 2079;
	data = {
		image: "",
		radius: !0,
		cardBack: !1,
		scale: 1
	};
	constructor(e = {}) {
		super(e), this.initLeafer(), this.setData(e.data);
	}
	get tag() {
		return "FieldCenterCard";
	}
	draw() {
		this.drawCard(), this.drawImage(), this.drawMask(), this.updateScale();
	}
	drawCard() {
		this.cardLeaf || (this.cardLeaf = new t(), this.leafer.add(this.cardLeaf)), this.cardLeaf.set({
			url: this.cardUrl,
			cornerRadius: this.data.radius ? 24 : 0,
			zIndex: 0
		});
	}
	drawImage() {
		this.imageLeaf || (this.imageLeaf = new n(), this.listenImageStatus(this.imageLeaf), this.leafer.add(this.imageLeaf)), this.imageLeaf.set({
			width: 1308,
			height: 1907,
			x: 90,
			y: 85,
			fill: {
				type: "image",
				url: this.data.image,
				mode: "cover",
				align: "top"
			},
			visible: this.data.image && !this.data.cardBack,
			zIndex: 10
		});
	}
	drawMask() {
		this.maskLeaf || (this.maskLeaf = new t(), this.leafer.add(this.maskLeaf));
		let e = `${this.baseImage}/card-mask.png`;
		this.maskLeaf.set({
			url: e,
			cornerRadius: this.data.radius ? 24 : 0,
			visible: !this.data.cardBack,
			zIndex: 20
		});
	}
	get baseImage() {
		return `${this.resourcePath}/field-center/image`;
	}
	get cardUrl() {
		return this.data.cardBack ? `${this.baseImage}/card-back.png` : `${this.baseImage}/card-background.png`;
	}
};
//#endregion
export { r as FieldCenterCard };
