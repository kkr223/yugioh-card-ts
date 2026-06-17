import { isBrowser as e, isNode as t, loadFontBrowser as n, loadFontNode as r } from "../utils/index.js";
import i from "../svg/loader.js";
import a from "../svg/image.js";
import { Image as o, ImageEvent as s, Leafer as c, Text as l, useCanvas as u } from "leafer-unified";
//#region packages/src/card/index.ts
var d = {
	YugiohCard: "/yugioh/font",
	YugiohSeries2Card: "/yugioh/font",
	RushDuelCard: "/rush-duel/font"
}, f = () => {
	l.changeAttr("lineHeight", {
		type: "percent",
		value: 1.15
	});
};
function p(e) {
	return (e ?? "").replace(/[\\/]+$/, "");
}
var m = class {
	leafer = null;
	imageStatusLeaf = null;
	cardWidth = 100;
	cardHeight = 100;
	data = {};
	view;
	resourcePath;
	skia;
	fontReady = Promise.resolve();
	renderReady = Promise.resolve();
	destroyed = !1;
	constructor(e = {}) {
		if (this.view = e.view, this.resourcePath = p(e.resourcePath), this.skia = e.skia, f(), t) {
			if (!this.skia) throw Error("skia-canvas is required in Node environment");
			u("skia", this.skia);
		}
		let i = d[this.tag];
		if (i) {
			let e = this.resourceUrl(i);
			t ? r(e, this.skia) : this.fontReady = n(e).then(() => {
				if (!this.destroyed) return this.draw();
			});
		}
	}
	get tag() {
		return "Card";
	}
	resourceUrl(e) {
		let t = e.replace(/^[\\/]+/, "");
		if (!this.resourcePath) return t;
		let n = this.resourcePath.includes("\\") && !this.resourcePath.includes("://") ? "\\" : "/";
		return `${this.resourcePath}${n}${t}`;
	}
	setData(e = {}) {
		Object.assign(this.data, e), this.draw();
	}
	initLeafer() {
		if (this.leafer) return this.leafer;
		let e = new c({
			view: this.view,
			width: this.cardWidth,
			height: this.cardHeight
		});
		return Object.defineProperty(this, "leafer", {
			configurable: !0,
			enumerable: !0,
			value: e,
			writable: !1
		}), e;
	}
	draw() {}
	listenImageStatus(e) {
		t || (e.on(s.LOAD, () => {
			this.drawImageStatus(e, s.LOAD);
		}), e.on(s.LOADED, () => {
			this.drawImageStatus(e, s.LOADED);
		}), e.on(s.ERROR, () => {
			this.drawImageStatus(e, s.ERROR);
		}));
	}
	drawImageStatus(e, t) {
		if (!this.leafer) return;
		let { url: n, width: r, height: c, x: l, y: u, zIndex: d } = e;
		this.imageStatusLeaf || (this.imageStatusLeaf = new o(), this.leafer.add(this.imageStatusLeaf));
		let f = "";
		t === s.LOAD ? f = i : t === s.ERROR && (f = a), this.imageStatusLeaf.set({
			url: f,
			width: 120,
			height: 120,
			around: "center",
			x: (l ?? 0) + (r ?? 0) / 2,
			y: (u ?? 0) + (c ?? 0) / 2,
			visible: [s.LOAD, s.ERROR].includes(t) && !!n,
			zIndex: (d ?? 0) + 1
		});
	}
	updateScale() {
		if (!this.leafer) return;
		let t = this.data.scale ?? 1, n = e ? devicePixelRatio : 1;
		this.leafer.pixelRatio = n, this.leafer.width = this.cardWidth * t / n, this.leafer.height = this.cardHeight * t / n, this.leafer.scaleX = t / n, this.leafer.scaleY = t / n;
	}
	async whenReady() {
		await this.fontReady, await this.renderReady, this.leafer && await new Promise((e) => {
			this.leafer.waitViewCompleted(e);
		});
	}
	async export(e, n) {
		if (await this.whenReady(), !this.leafer) throw Error("Card renderer is not initialized");
		let r = this.leafer;
		if (t && r.canvas?.view) return /\.[a-z0-9]+$/i.test(e) ? (await r.canvas.view.saveAs(e, n), { data: e }) : { data: await r.canvas.view.toDataURL(e, n) };
		let i = await this.leafer.export(e, n);
		if (i?.error) throw i.error;
		return i;
	}
	destroy() {
		this.destroyed || (this.destroyed = !0, this.leafer?.destroy());
	}
};
//#endregion
export { m as Card };
