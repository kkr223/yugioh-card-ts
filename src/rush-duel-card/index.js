import { Card as e } from "../card/index.js";
import { CompressText as t } from "../compress-text/compress-text.js";
import n from "./style/sc-style.js";
import r from "./style/jp-style.js";
import { Group as i, Image as a, Rect as o, Text as s } from "leafer-unified";
//#region packages/src/rush-duel-card/index.js
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
	maximumAtkLeaf = null;
	atkDefLeaf = null;
	legendLeaf = null;
	laserLeaf = null;
	rareLeaf = null;
	cardWidth = 1394;
	cardHeight = 2031;
	data = {
		language: "sc",
		name: "",
		color: "",
		type: "monster",
		attribute: "dark",
		icon: "",
		image: "",
		cardType: "normal",
		level: 0,
		monsterType: "",
		maximumAtk: 0,
		atk: 0,
		def: 0,
		description: "",
		firstLineCompress: !1,
		descriptionAlign: !1,
		descriptionZoom: 1,
		descriptionWeight: 0,
		package: "",
		password: "",
		legend: !1,
		laser: "",
		rare: "",
		radius: !0,
		scale: 1
	};
	constructor(e = {}) {
		super(e), this.initLeafer(), this.setData(e.data);
	}
	get tag() {
		return "RushDuelCard";
	}
	draw() {
		this.drawCard(), this.drawName(), this.drawAttribute(), this.drawLevel(), this.drawSpellTrap(), this.drawImage(), this.drawMask(), this.drawPackage(), this.drawEffect(), this.drawDescription(), this.drawMaximumAtk(), this.drawAtkDef(), this.drawLegend(), this.drawLaser(), this.drawRare(), this.updateScale();
	}
	drawCard() {
		this.cardLeaf || (this.cardLeaf = new a(), this.leafer.add(this.cardLeaf)), this.cardLeaf.set({
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
			color: this.data.color || "black",
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			width: this.showAttribute ? 1025 : 1248,
			height: 200,
			x: 71,
			y: e.top,
			zIndex: 10
		});
	}
	drawAttribute() {
		this.attributeLeaf || (this.attributeLeaf = new a(), this.leafer.add(this.attributeLeaf)), this.attributeLeaf.set({
			url: this.attributeUrl,
			x: 1138,
			y: 68,
			visible: this.showAttribute,
			zIndex: 30
		});
	}
	drawLevel() {
		if (!this.levelLeaf) {
			this.levelLeaf = new i();
			let e = new a(), t = new s();
			this.levelLeaf.add(e), this.levelLeaf.add(t), this.leafer.add(this.levelLeaf);
		}
		let e = this.levelLeaf.children[0], t = this.levelLeaf.children[1], n = `${this.baseImage}/level.png`;
		e.set({
			url: n,
			x: 80,
			y: 1216
		}), t.set({
			text: this.data.level,
			fontFamily: "rd-atk-def",
			fontSize: 116,
			fill: "white",
			stroke: "#D3100D",
			strokeWidth: 10,
			x: 191,
			y: 1291,
			around: {
				type: "percent",
				x: .5,
				y: 0
			}
		}), this.levelLeaf.set({
			visible: this.data.type === "monster",
			zIndex: 40
		});
	}
	drawSpellTrap() {
		if (!this.spellTrapLeaf) {
			this.spellTrapLeaf = new i();
			let e = new t(), n = new a(), r = new t();
			this.spellTrapLeaf.add(e), this.spellTrapLeaf.add(n), this.spellTrapLeaf.add(r), this.leafer.add(this.spellTrapLeaf);
		}
		let { spellTrap: e } = this.style, { icon: n } = e, r = this.data.icon ? `${this.baseImage}/icon-${this.data.icon}.png` : "", o = this.data.icon ? 60 : 0, s = e.letterSpacing || 0, c = this.spellTrapLeaf.children[0], l = this.spellTrapLeaf.children[1], u = this.spellTrapLeaf.children[2];
		c.set({
			text: "【" + this.spellTrapName,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			fontWeight: e.fontWeight,
			letterSpacing: s,
			rtFontSize: e.rtFontSize,
			rtTop: e.rtTop,
			x: 99,
			y: e.top
		});
		let d = c.bounds;
		l.set({
			url: r,
			x: c.x + (this.data.icon && n.marginLeft || 0) + d.width,
			y: e.top + (n.marginTop || 0)
		}), u.set({
			text: "】",
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			fontWeight: e.fontWeight,
			letterSpacing: s,
			x: l.x + (this.data.icon && n.marginRight || 0) + o,
			y: e.top
		}), this.spellTrapLeaf.set({
			visible: ["spell", "trap"].includes(this.data.type),
			zIndex: 10
		});
	}
	drawImage() {
		this.imageLeaf || (this.imageLeaf = new o(), this.listenImageStatus(this.imageLeaf), this.leafer.add(this.imageLeaf)), this.imageLeaf.set({
			width: 1254,
			height: 1258,
			x: 70,
			y: 200,
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
		this.maskLeaf || (this.maskLeaf = new a(), this.leafer.add(this.maskLeaf)), this.maskLeaf.set({
			url: this.maskUrl,
			x: 70,
			y: 197,
			zIndex: 20
		});
	}
	drawPackage() {
		this.packageLeaf || (this.packageLeaf = new t(), this.leafer.add(this.packageLeaf)), this.packageLeaf.set({
			text: this.data.package,
			fontFamily: "rd-tip",
			fontSize: 33,
			color: "white",
			textAlign: "right",
			scaleX: .9,
			y: 1914,
			zIndex: 30
		});
		let e = this.packageLeaf.bounds;
		this.packageLeaf.x = this.cardWidth - 130 - e.width;
	}
	drawEffect() {
		this.effectLeaf || (this.effectLeaf = new t(), this.leafer.add(this.effectLeaf));
		let { effect: e } = this.style;
		this.effectLeaf.set({
			text: "【" + this.data.monsterType + "】",
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			fontWeight: e.fontWeight,
			strokeWidth: this.data.descriptionWeight,
			letterSpacing: e.letterSpacing || 0,
			rtFontSize: e.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: e.rtTop,
			width: 1e3,
			height: 80,
			x: 99 + (e.textIndent || 0),
			y: e.top,
			visible: this.data.type === "monster" && this.data.monsterType,
			zIndex: 30
		});
	}
	drawDescription() {
		this.descriptionLeaf || (this.descriptionLeaf = new t(), this.leafer.add(this.descriptionLeaf));
		let { description: e } = this.style;
		this.descriptionLeaf.set({
			text: this.data.description,
			fontFamily: e.fontFamily,
			fontSize: e.fontSize,
			fontScale: this.data.descriptionZoom,
			textAlign: this.data.descriptionAlign ? "center" : "justify",
			firstLineCompress: this.data.firstLineCompress,
			strokeWidth: this.data.descriptionWeight,
			lineHeight: e.lineHeight,
			letterSpacing: e.letterSpacing || 0,
			rtFontSize: e.rtFontSize,
			rtStrokeWidth: this.data.descriptionWeight,
			rtTop: e.rtTop,
			width: 1196,
			height: 350,
			x: 99,
			y: e.top,
			zIndex: 30
		});
	}
	drawMaximumAtk() {
		if (!this.maximumAtkLeaf) {
			this.maximumAtkLeaf = new i();
			let e = new a(), t = new s();
			this.maximumAtkLeaf.add(e), this.maximumAtkLeaf.add(t), this.leafer.add(this.maximumAtkLeaf);
		}
		let e = this.maximumAtkLeaf.children[0], t = this.maximumAtkLeaf.children[1], n = `${this.baseImage}/maximum-atk.png`;
		e.set({
			url: n,
			x: 191,
			y: 1253
		}), t.set({
			text: this.data.maximumAtk,
			fontFamily: "rd-atk-def",
			fontSize: 97,
			fill: "white",
			stroke: "black",
			strokeWidth: 3,
			letterSpacing: -6,
			x: this.cardWidth - 229,
			y: 1247,
			around: {
				type: "percent",
				x: 1,
				y: 0
			}
		}), this.maximumAtkLeaf.set({
			visible: this.data.type === "monster" && this.data.maximumAtk,
			zIndex: 30
		});
	}
	drawAtkDef() {
		if (!this.atkDefLeaf) {
			this.atkDefLeaf = new i();
			let e = new a(), t = new s(), n = new s();
			this.atkDefLeaf.add(e), this.atkDefLeaf.add(t), this.atkDefLeaf.add(n), this.leafer.add(this.atkDefLeaf);
		}
		let e = this.atkDefLeaf.children[0], t = this.atkDefLeaf.children[1], n = this.atkDefLeaf.children[2], r = `${this.baseImage}/atk-def.png`;
		e.set({
			url: r,
			x: 186,
			y: 1355
		}), t.set({
			text: this.data.atk >= 0 ? this.data.atk : "?",
			fontFamily: "rd-atk-def",
			fontSize: 97,
			fill: "white",
			stroke: "black",
			strokeWidth: 3,
			letterSpacing: -6,
			x: this.cardWidth - 656,
			y: 1349,
			around: {
				type: "percent",
				x: 1,
				y: 0
			}
		}), n.set({
			text: this.data.def >= 0 ? this.data.def : "?",
			fontFamily: "rd-atk-def",
			fontSize: 97,
			fill: "white",
			stroke: "black",
			strokeWidth: 3,
			letterSpacing: -6,
			x: this.cardWidth - 229,
			y: 1349,
			around: {
				type: "percent",
				x: 1,
				y: 0
			}
		}), this.atkDefLeaf.set({
			visible: this.data.type === "monster",
			zIndex: 30
		});
	}
	drawLegend() {
		this.legendLeaf || (this.legendLeaf = new a(), this.leafer.add(this.legendLeaf));
		let e = this.data.legend ? `${this.baseImage}/legend.png` : "";
		this.legendLeaf.set({
			url: e,
			x: 84,
			y: 210,
			visible: this.data.legend,
			zIndex: 30
		});
	}
	drawLaser() {
		this.laserLeaf || (this.laserLeaf = new a(), this.leafer.add(this.laserLeaf));
		let e = this.data.laser ? `${this.baseImage}/${this.data.laser}.png` : "";
		this.laserLeaf.set({
			url: e,
			x: 1276,
			y: 1913,
			visible: this.data.laser,
			zIndex: 120
		});
	}
	drawRare() {
		this.rareLeaf || (this.rareLeaf = new a(), this.leafer.add(this.rareLeaf));
		let e = this.data.rare ? `${this.baseImage}/rare-${this.data.rare}.png` : "";
		this.rareLeaf.set({
			url: e,
			cornerRadius: this.data.radius ? 24 : 0,
			visible: this.data.rare,
			zIndex: 100
		});
	}
	get baseImage() {
		return `${this.resourcePath}/rush-duel/image`;
	}
	get style() {
		let e = {};
		return this.data.language === "sc" ? e = n : this.data.language === "jp" && (e = r), e;
	}
	get cardUrl() {
		return this.data.type === "monster" ? `${this.baseImage}/card-${this.data.cardType}.png` : `${this.baseImage}/card-${this.data.type}.png`;
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
		return this.data.language === "sc" ? (this.data.type === "spell" ? e = "魔法卡" : this.data.type === "trap" && (e = "陷阱卡"), this.data.icon === "equip" ? e += "/装备" : this.data.icon === "field" ? e += "/场地" : this.data.icon === "quick-play" ? e += "/速攻" : this.data.icon === "ritual" ? e += "/仪式" : this.data.icon === "continuous" ? e += "/永续" : this.data.icon === "counter" && (e += "/反击")) : this.data.language === "jp" && (this.data.type === "spell" ? e = "[魔(ま)][法(ほう)]カード" : this.data.type === "trap" && (e = "[罠(トラップ)]カード"), this.data.icon === "equip" ? e += "／[装(そう)][備(び)]" : this.data.icon === "field" ? e += "／フィールド" : this.data.icon === "quick-play" ? e += "／[速(そっ)][攻(こう)]" : this.data.icon === "ritual" ? e += "／[儀(ぎ)][式(しき)]" : this.data.icon === "continuous" ? e += "／[永(えい)][続(ぞく)]" : this.data.icon === "counter" && (e += "／カウンター")), e;
	}
	get maskUrl() {
		return this.data.type === "monster" ? `${this.baseImage}/card-mask-${this.data.cardType}.png` : `${this.baseImage}/card-mask-${this.data.type}.png`;
	}
};
//#endregion
export { c as RushDuelCard };
