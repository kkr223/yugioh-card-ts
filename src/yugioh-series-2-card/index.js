import { Card as e } from "../card/index.js";
import { CompressText as t } from "../compress-text/compress-text.js";
import n from "./style/jp-style.js";
import r from "./style/custom1-style.js";
import i from "./style/custom2-style.js";
import { Group as a, Image as o, Rect as s } from "leafer-unified";
//#region packages/src/yugioh-series-2-card/index.js
var c = class extends e {
	cardLeaf = null;
	nameLeaf = null;
	attributeLeaf = null;
	levelLeaf = null;
	spellTrapLeaf = null;
	imageLeaf = null;
	maskLeaf = null;
	packageLeaf = null;
	effectLeaf = null;
	descriptionLeaf = null;
	atkDefLeaf = null;
	passwordLeaf = null;
	copyrightLeaf = null;
	laserLeaf = null;
	cardWidth = 1394;
	cardHeight = 2031;
	data = {
		language: "jp",
		name: "",
		color: "",
		align: "left",
		gradient: !1,
		gradientColor1: "#999999",
		gradientColor2: "#ffffff",
		type: "monster",
		attribute: "dark",
		icon: "",
		image: "",
		cardType: "normal",
		level: 0,
		monsterType: "",
		atk: 0,
		def: 0,
		description: "",
		firstLineCompress: !1,
		descriptionAlign: !1,
		descriptionZoom: 1,
		descriptionWeight: 0,
		package: "",
		password: "",
		copyright: "",
		laser: "",
		rare: "",
		radius: !0,
		scale: 1
	};
	constructor(e = {}) {
		super(e), this.initLeafer(), this.setData(e.data);
	}
	get tag() {
		return "YugiohSeries2Card";
	}
	draw() {
		this.drawCard(), this.drawName(), this.drawAttribute(), this.drawLevel(), this.drawSpellTrap(), this.drawImage(), this.drawMask(), this.drawPackage(), this.drawEffect(), this.drawDescription(), this.drawAtkDef(), this.drawPassword(), this.drawCopyright(), this.drawLaser(), this.updateScale();
	}
	drawCard() {
		this.cardLeaf || (this.cardLeaf = new o(), this.leafer.add(this.cardLeaf)), this.cardLeaf.set({
			url: this.cardUrl,
			cornerRadius: this.data.radius ? 24 : 0,
			zIndex: 0
		});
	}
	drawName() {
		let { name: e } = this.style;
		this.nameLeaf || (this.nameLeaf = new t(), this.leafer.add(this.nameLeaf)), this.nameLeaf.set({
			text: this.data.name,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: e.letterSpacing || 0,
			textAlign: this.data.align || "left",
			color: this.data.color || this.autoNameColor,
			gradient: this.data.gradient,
			gradientColor1: this.data.gradientColor1,
			gradientColor2: this.data.gradientColor2,
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			rtColor: this.autoNameColor,
			width: this.showAttribute ? 953 : 1104,
			height: 200,
			x: 147,
			y: e.top,
			zIndex: 10
		});
	}
	drawAttribute() {
		this.attributeLeaf || (this.attributeLeaf = new o(), this.leafer.add(this.attributeLeaf)), this.attributeLeaf.set({
			url: this.attributeUrl,
			x: 1119,
			y: 128,
			visible: this.showAttribute,
			zIndex: 10
		});
	}
	drawLevel() {
		if (!this.levelLeaf) {
			this.levelLeaf = new a();
			for (let e = 0; e < 12; e++) {
				let e = new o();
				this.levelLeaf.add(e);
			}
			this.leafer.add(this.levelLeaf);
		}
		let e = `${this.baseImage}/level.png`, t = this.data.level < 12 ? 172 : 129;
		this.levelLeaf.children.forEach((n, r) => {
			n.set({
				url: e,
				x: this.cardWidth - t - r * 95,
				y: 314,
				around: {
					type: "percent",
					x: 1,
					y: 0
				},
				visible: r < this.data.level
			});
		}), this.levelLeaf.set({
			visible: this.data.type === "monster",
			zIndex: 10
		});
	}
	drawSpellTrap() {
		if (!this.spellTrapLeaf) {
			this.spellTrapLeaf = new a();
			let e = new t(), n = new o(), r = new t();
			this.spellTrapLeaf.add(e), this.spellTrapLeaf.add(n), this.spellTrapLeaf.add(r), this.leafer.add(this.spellTrapLeaf);
		}
		let { spellTrap: e } = this.style, { icon: n } = e, r = this.data.icon ? `${this.baseImage}/icon-${this.data.icon}.png` : "", i = this.data.icon ? 72 : 0, s = e.letterSpacing || 0, c = this.spellTrapLeaf.children[0], l = this.spellTrapLeaf.children[1], u = this.spellTrapLeaf.children[2];
		c.set({
			text: "】",
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: s,
			y: e.top
		});
		let d = c.bounds;
		c.x = this.cardWidth - e.right - d.width, l.set({
			url: r,
			x: c.x - (this.data.icon && n.marginRight || 0) - i,
			y: e.top + (n.marginTop || 0)
		}), u.set({
			text: "【" + this.spellTrapName,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			letterSpacing: s,
			scaleY: e.scaleY || 1,
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			rtFontScaleX: e.rtFontScaleX || 1,
			y: e.top
		});
		let f = u.bounds;
		u.x = l.x - (this.data.icon && n.marginLeft || 0) - f.width, this.spellTrapLeaf.set({
			visible: ["spell", "trap"].includes(this.data.type),
			zIndex: 10
		});
	}
	drawImage() {
		this.imageLeaf || (this.imageLeaf = new s(), this.listenImageStatus(this.imageLeaf), this.leafer.add(this.imageLeaf)), this.imageLeaf.set({
			width: 990,
			height: 1100,
			x: 202,
			y: 468,
			fill: {
				type: "image",
				url: this.data.image,
				mode: "cover",
				align: "top"
			},
			visible: this.data.image,
			zIndex: 10
		});
	}
	drawMask() {
		this.maskLeaf || (this.maskLeaf = new o(), this.leafer.add(this.maskLeaf));
		let e = `${this.baseImage}/card-mask.png`;
		this.maskLeaf.set({
			url: e,
			x: 143,
			y: 414,
			zIndex: 20
		});
	}
	drawPackage() {
		this.packageLeaf || (this.packageLeaf = new t(), this.leafer.add(this.packageLeaf)), this.packageLeaf.set({
			text: this.data.package,
			fontFamily: "ygo-tip",
			fontSize: 33,
			y: 1601,
			zIndex: 30
		});
		let e = this.packageLeaf.bounds;
		this.packageLeaf.x = this.cardWidth - 170 - e.width;
	}
	drawEffect() {
		this.effectLeaf || (this.effectLeaf = new t(), this.leafer.add(this.effectLeaf));
		let { effect: e } = this.style;
		this.effectLeaf.set({
			text: "【" + this.data.monsterType + "】",
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: e.lineHeight,
			letterSpacing: e.letterSpacing || 0,
			rtFontSize: e.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: e.rtTop,
			width: this.data.type === "monster" ? 710 : 1095,
			height: 70,
			x: 149 + (e.textIndent || 0),
			y: e.top,
			visible: this.showEffect,
			zIndex: 30
		});
	}
	drawDescription() {
		this.descriptionLeaf || (this.descriptionLeaf = new t(), this.leafer.add(this.descriptionLeaf));
		let { effect: e, description: n } = this.style, r = e.minHeight || 0;
		this.showEffect && (r = e.fontSize * e.lineHeight), this.descriptionLeaf.set({
			text: this.data.description,
			fontFamily: n.fontFamily,
			fontSize: n.fontSize,
			fontScale: this.data.descriptionZoom,
			textAlign: this.data.descriptionAlign ? "center" : "justify",
			firstLineCompress: this.data.firstLineCompress,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: n.lineHeight,
			letterSpacing: n.letterSpacing || 0,
			rtFontSize: n.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: n.rtTop,
			width: this.data.type === "monster" ? 710 : 1095,
			height: ["spell", "trap"].includes(this.data.type) ? 240 : 170,
			x: 149,
			y: e.top + r,
			zIndex: 30
		});
	}
	drawAtkDef() {
		if (!this.atkDefLeaf) {
			this.atkDefLeaf = new a();
			let e = new t(), n = new t();
			this.atkDefLeaf.add(e), this.atkDefLeaf.add(n), this.leafer.add(this.atkDefLeaf);
		}
		let e = this.atkDefLeaf.children[0], n = this.atkDefLeaf.children[1], r = "";
		this.data.atk >= 0 ? r = this.data.atk : this.data.atk === -1 ? r = "????" : this.data.atk === -2 && (r = "X000"), e.set({
			text: this.atkName + r,
			fontFamily: "ygo-jp",
			fontSize: 84,
			textAlign: "justify",
			textJustifyLast: !0,
			rtFontSize: 22,
			rtTop: -10,
			width: 288,
			x: 950,
			y: 1688
		});
		let i = "";
		this.data.def >= 0 ? i = this.data.def : this.data.def === -1 ? i = "????" : this.data.def === -2 && (i = "X000"), n.set({
			text: this.defName + i,
			fontFamily: "ygo-jp",
			fontSize: 84,
			textAlign: "justify",
			textJustifyLast: !0,
			rtFontSize: 22,
			rtTop: -10,
			width: 288,
			x: 950,
			y: 1795
		}), this.atkDefLeaf.set({
			visible: this.data.type === "monster",
			zIndex: 30
		});
	}
	drawPassword() {
		this.passwordLeaf || (this.passwordLeaf = new t(), this.leafer.add(this.passwordLeaf)), this.passwordLeaf.set({
			text: this.data.password,
			fontFamily: "ygo-tip",
			fontSize: 33,
			x: 66,
			y: 1940,
			zIndex: 30
		});
	}
	drawCopyright() {
		this.copyrightLeaf || (this.copyrightLeaf = new o(), this.leafer.add(this.copyrightLeaf));
		let e = this.data.copyright ? `${this.baseImage}/copyright-${this.data.copyright}-black.svg` : "";
		this.copyrightLeaf.set({
			url: e,
			x: this.cardWidth - 161,
			y: 1940,
			around: {
				type: "percent",
				x: 1,
				y: 0
			},
			visible: this.data.copyright,
			zIndex: 30
		});
	}
	drawLaser() {
		this.laserLeaf || (this.laserLeaf = new o(), this.leafer.add(this.laserLeaf));
		let e = this.data.laser ? `${this.baseImage}/${this.data.laser}.png` : "";
		this.laserLeaf.set({
			url: e,
			x: 1276,
			y: 1913,
			visible: this.data.laser,
			zIndex: 120
		});
	}
	get baseImage() {
		return `${this.resourcePath}/yugioh-series-2/image`;
	}
	get style() {
		let e = {};
		return this.data.font ? this.data.font === "custom1" ? e = r : this.data.font === "custom2" && (e = i) : this.data.language === "jp" && (e = n), e;
	}
	get cardUrl() {
		return this.data.type === "monster" ? `${this.baseImage}/card-${this.data.cardType}.png` : `${this.baseImage}/card-${this.data.type}.png`;
	}
	get autoNameColor() {
		let e = "black";
		return ["spell", "trap"].includes(this.data.type) && (e = "white"), e;
	}
	get showAttribute() {
		return this.data.type === "monster" ? !!this.data.attribute : !0;
	}
	get attributeUrl() {
		let e = "";
		return this.data.language === "jp" && (e = "-jp"), this.data.type === "monster" ? this.data.attribute ? `${this.baseImage}/attribute-${this.data.attribute}${e}.png` : "" : `${this.baseImage}/attribute-${this.data.type}${e}.png`;
	}
	get spellTrapName() {
		let e = "";
		return this.data.language === "jp" && (this.data.type === "spell" ? e = "[魔(ま)][法(ほう)]カード" : this.data.type === "trap" && (e = "[罠(トラップ)]カード")), e;
	}
	get showEffect() {
		return this.data.type === "monster" && this.data.monsterType;
	}
	get atkName() {
		let e = "";
		return this.data.language === "jp" && (e = "[攻(こう)]"), e;
	}
	get defName() {
		let e = "";
		return this.data.language === "jp" && (e = "[守(しゅ)]"), e;
	}
};
//#endregion
export { c as YugiohSeries2Card };
