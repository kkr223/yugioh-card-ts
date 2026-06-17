import { CompressText as e } from "../compress-text/compress-text.js";
import { YUGIOH_LAYER_SLOTS as t, createYugiohCardDocument as n, legacyDataToYugiohCardDocument as r, parseYugiohCardDocument as i, yugiohCardDocumentToLegacyData as a } from "./document.js";
import { LegacyYugiohCardRenderer as o } from "./legacy-renderer.js";
import { Group as s, Image as c, Rect as l } from "leafer-unified";
//#region packages/src/yugioh-card/index.ts
var u = class extends Error {
	revision;
	cause;
	constructor(e, t) {
		super(`Failed to render YugiohCard revision ${e}`), this.name = "YugiohCardRenderError", this.revision = e, this.cause = t;
	}
}, d = {
	"before-frame": -100,
	"after-artwork": 25,
	"before-text": 29,
	"after-text": 90,
	top: 1e3
}, f = {
	ur: {
		color: "#f3cc63",
		gradient: !0,
		gradientColor1: "#8a5d17",
		gradientColor2: "#f8e6a2"
	},
	gr: {
		color: "#d8dde6",
		gradient: !0,
		gradientColor1: "#6d7683",
		gradientColor2: "#f4f7fb"
	},
	hr: {
		color: "#eef2f8",
		gradient: !0,
		gradientColor1: "#8e99a9",
		gradientColor2: "#ffffff"
	},
	ser: {
		color: "#edf2f8",
		gradient: !0,
		gradientColor1: "#8b95a4",
		gradientColor2: "#ffffff"
	},
	gser: {
		color: "#f1d377",
		gradient: !0,
		gradientColor1: "#8a6422",
		gradientColor2: "#fff1be"
	},
	pser: {
		color: "#f5d6ef",
		gradient: !0,
		gradientColor1: "#855f86",
		gradientColor2: "#fff5fd"
	}
}, p = {
	nameBlock: {
		url: "/yugioh/image/name-block.png",
		x: 76,
		y: 82,
		width: 1242,
		height: 157
	},
	effectBox: {
		defaultUrl: "/yugioh/image/eblock-border.png",
		coloredUrl: "/yugioh/image/eblock-border-o.png"
	},
	mark25th: {
		url: "/yugioh/image/mark25th.png",
		x: 503,
		y: 1496,
		width: 388,
		height: 430
	}
}, m = {
	normal: {
		url: "/yugioh/image/card-mask.png",
		x: 117,
		y: 322,
		width: 1162,
		height: 1162
	},
	pendulum: {
		url: "/yugioh/image/card-mask-pendulum.png",
		x: 68,
		y: 342,
		width: 1257,
		height: 1595
	},
	pendulumArt: {
		url: "/yugioh/image/card-mask-pendulum-art.png",
		x: 68,
		y: 342,
		width: 1257,
		height: 914
	},
	pendulumEffect: {
		url: "/yugioh/image/card-mask-pendulum-effect.png",
		x: 68,
		y: 1256,
		width: 1257,
		height: 681
	}
};
function h(e) {
	let t = i(e);
	return Object.freeze(t.frame.arrows), Object.freeze(t.frame), Object.freeze(t.title.fill), Object.freeze(t.title.shadow), Object.freeze(t.title), Object.freeze(t.artwork), Object.freeze(t.foreground), Object.freeze(t.effectBox), Object.freeze(t.text), Object.freeze(t.footer), Object.freeze(t.render), Object.freeze(t);
}
function g(e) {
	return typeof e == "object" && !!e && "then" in e && typeof e.then == "function";
}
var _ = class extends o {
	documentValue;
	revisionValue = 0;
	completedRevision = 0;
	renderQueued = !1;
	rendering = !1;
	waiters = [];
	extensions = /* @__PURE__ */ new Map();
	slotGroups = /* @__PURE__ */ new Map();
	nameBlockLeaf = null;
	titleShadowLeaf = null;
	foregroundLeaf = null;
	pendulumEffectMaskLeaf = null;
	effectBoxFillLeaf = null;
	effectBoxBorderLeaf = null;
	mark25thLeaf = null;
	constructor(e = {}) {
		super(e), this.documentValue = e.document ? i(e.document) : r(e.data), this.data = a(this.documentValue), this.initializeSlotGroups();
		for (let t of e.extensions ?? []) this.registerExtension(t);
		this.scheduleRender();
	}
	get tag() {
		return "YugiohCard";
	}
	get revision() {
		return this.revisionValue;
	}
	setData(e = {}) {
		if (!this.documentValue) {
			super.setData(e);
			return;
		}
		this.documentValue = r(e, this.documentValue), this.data = a(this.documentValue), this.scheduleRender();
	}
	async setDocument(e) {
		this.assertActive(), this.documentValue = i(e), this.data = a(this.documentValue), await this.scheduleRender();
	}
	async updateDocument(e) {
		await this.setDocument(e(this.getDocument()));
	}
	getDocument() {
		return h(this.documentValue ?? n());
	}
	registerExtension(e) {
		if (this.assertActive(), !t.includes(e.slot)) throw Error(`Unknown YugiohCard layer slot: ${String(e.slot)}`);
		if (this.extensions.has(e.id)) throw Error(`Duplicate YugiohCard extension id: ${e.id}`);
		let n = this.slotGroups.get(e.slot);
		if (!n) throw Error(`Layer slot is not initialized: ${e.slot}`);
		let r = new s();
		n.add(r), this.extensions.set(e.id, {
			extension: e,
			group: r
		}), this.scheduleRender();
	}
	async unregisterExtension(e) {
		let t = this.extensions.get(e);
		return t ? (this.extensions.delete(e), await t.extension.destroy?.({
			group: t.group,
			resourceUrl: (e) => this.resourceUrl(e),
			invalidate: () => {
				this.scheduleRender();
			}
		}), t.group.destroy(), !0) : !1;
	}
	draw() {
		if (!this.documentValue) {
			super.draw();
			return;
		}
		this.scheduleRender();
	}
	async whenReady() {
		await super.whenReady(), this.completedRevision < this.revisionValue && await this.waitForRevision(this.revisionValue);
	}
	async export(e, t) {
		return await this.whenReady(), super.export(e, t);
	}
	destroy() {
		if (this.destroyed) return;
		let e = /* @__PURE__ */ Error("YugiohCard was destroyed");
		for (let t of this.waiters.splice(0)) t.reject(e);
		for (let e of [...this.extensions.keys()]) this.unregisterExtension(e);
		this.nameBlockLeaf = null, this.titleShadowLeaf = null, this.foregroundLeaf = null, this.pendulumEffectMaskLeaf = null, this.effectBoxFillLeaf = null, this.effectBoxBorderLeaf = null, this.mark25thLeaf = null, super.destroy();
	}
	assertActive() {
		if (this.destroyed) throw Error("YugiohCard was destroyed");
	}
	initializeSlotGroups() {
		if (!this.leafer) throw Error("YugiohCard renderer is not initialized");
		for (let e of t) {
			let t = new s({ zIndex: d[e] });
			this.leafer.add(t), this.slotGroups.set(e, t);
		}
	}
	scheduleRender() {
		this.assertActive();
		let e = ++this.revisionValue, t = this.waitForRevision(e);
		return this.renderReady = t, !this.renderQueued && !this.rendering && (this.renderQueued = !0, queueMicrotask(() => {
			this.flushRenderQueue();
		})), t;
	}
	waitForRevision(e) {
		return this.completedRevision >= e ? Promise.resolve() : new Promise((t, n) => {
			this.waiters.push({
				revision: e,
				resolve: t,
				reject: n
			});
		});
	}
	async flushRenderQueue() {
		if (!(this.rendering || this.destroyed)) {
			this.renderQueued = !1, this.rendering = !0;
			try {
				for (; !this.destroyed && this.completedRevision < this.revisionValue;) {
					let e = this.revisionValue;
					try {
						await this.renderRevision(e), this.completedRevision = e, this.resolveWaiters(e);
					} catch (t) {
						let n = new u(e, t);
						this.completedRevision = e, this.rejectWaiters(e, n);
					}
				}
			} finally {
				this.rendering = !1, !this.destroyed && this.completedRevision < this.revisionValue && (this.renderQueued = !0, queueMicrotask(() => {
					this.flushRenderQueue();
				}));
			}
		}
	}
	async renderRevision(e) {
		let t = i(this.documentValue), n = a(t);
		this.applyRarityTitlePreset(n), this.data = n, super.draw(), this.applyArtworkFit(t), this.drawPendulumSplitMask(t), this.drawNameBlock(t), this.drawTitleShadow(t), this.drawForeground(t), this.applyForegroundLevelPolicy(t), this.drawEffectBox(t), this.drawMark25th(t);
		let r = h(t);
		for (let { extension: t, group: n } of this.extensions.values()) {
			let i = t.update({
				group: n,
				document: r,
				resourceUrl: (e) => this.resourceUrl(e),
				invalidate: () => {
					this.scheduleRender();
				}
			});
			if (g(i) && await i, e !== this.revisionValue) return;
		}
	}
	applyRarityTitlePreset(e) {
		if (!e.useRarityPreset || e.color || e.gradient) return;
		let t = f[e.rare.trim().toLowerCase()];
		t && Object.assign(e, t);
	}
	applyArtworkFit(e) {
		let t = this;
		if (!t.imageLeaf) return;
		let n = e.artwork.fit === "contain" ? "fit" : e.artwork.fit;
		t.imageLeaf.set({ fill: {
			type: "image",
			url: e.artwork.source,
			mode: n,
			align: "top"
		} });
	}
	foregroundVisible(e) {
		let t = e.foreground;
		return t.enabled && !!t.source && t.width > 0 && t.height > 0 && t.scale > 0;
	}
	drawPendulumSplitMask(e) {
		if (!this.leafer) return;
		let t = this.maskLeaf;
		if (t) {
			if (this.pendulumEffectMaskLeaf || (this.pendulumEffectMaskLeaf = new c(), this.leafer.add(this.pendulumEffectMaskLeaf)), !(e.frame.type === "pendulum" && this.foregroundVisible(e))) {
				let n = e.frame.type === "pendulum" ? m.pendulum : m.normal;
				t.set({
					url: this.resourceUrl(n.url),
					x: n.x,
					y: n.y,
					width: n.width,
					height: n.height,
					visible: !0,
					zIndex: 20
				}), this.pendulumEffectMaskLeaf.set({ visible: !1 });
				return;
			}
			t.set({
				url: this.resourceUrl(m.pendulumArt.url),
				x: m.pendulumArt.x,
				y: m.pendulumArt.y,
				width: m.pendulumArt.width,
				height: m.pendulumArt.height,
				visible: !0,
				zIndex: 20
			}), this.pendulumEffectMaskLeaf.set({
				url: this.resourceUrl(m.pendulumEffect.url),
				x: m.pendulumEffect.x,
				y: m.pendulumEffect.y,
				width: m.pendulumEffect.width,
				height: m.pendulumEffect.height,
				visible: !0,
				zIndex: 22
			});
		}
	}
	drawTitleShadow(t) {
		let n = this.nameLeaf;
		if (!n || !this.leafer) return;
		this.titleShadowLeaf || (this.titleShadowLeaf = new e(), this.leafer.add(this.titleShadowLeaf));
		let r = t.title.shadow;
		if (!r.enabled) {
			this.titleShadowLeaf.set({ visible: !1 });
			return;
		}
		this.titleShadowLeaf.set({
			text: n.text,
			fontFamily: n.fontFamily,
			fontSize: n.fontSize,
			letterSpacing: n.letterSpacing,
			wordSpacing: n.wordSpacing,
			textAlign: n.textAlign,
			rtFontSize: n.rtFontSize,
			rtTop: n.rtTop,
			rtColor: r.gradient ? r.gradientColor1 : r.color,
			width: n.width,
			height: n.height,
			x: (n.x ?? 0) + r.offsetX,
			y: (n.y ?? 0) + r.offsetY,
			zIndex: 9,
			visible: n.visible !== !1,
			opacity: r.opacity,
			scaleX: n.scaleX,
			scaleY: n.scaleY,
			strokeWidth: n.strokeWidth,
			color: r.color,
			gradient: r.gradient,
			gradientColor1: r.gradientColor1,
			gradientColor2: r.gradientColor2
		});
	}
	drawNameBlock(e) {
		if (!this.leafer) return;
		this.nameBlockLeaf || (this.nameBlockLeaf = new c(), this.leafer.add(this.nameBlockLeaf));
		let t = p.nameBlock;
		this.nameBlockLeaf.set({
			url: this.resourceUrl(t.url),
			x: t.x,
			y: t.y,
			width: t.width,
			height: t.height,
			visible: e.frame.nameBlock,
			zIndex: 9
		});
	}
	drawForeground(e) {
		if (!this.leafer) return;
		this.foregroundLeaf || (this.foregroundLeaf = new c(), this.leafer.add(this.foregroundLeaf));
		let t = e.foreground, n = this.foregroundVisible(e);
		this.foregroundLeaf.set({
			url: t.source,
			width: t.width,
			height: t.height,
			x: t.x,
			y: t.y,
			scaleX: t.scale,
			scaleY: t.scale,
			rotation: t.rotation,
			around: {
				type: "percent",
				x: .5,
				y: .5
			},
			visible: n,
			zIndex: 21
		});
	}
	applyForegroundLevelPolicy(e) {
		let t = this, n = e.foreground.coverLevel ? 10 : 22;
		t.levelLeaf?.set({ zIndex: n }), t.rankLeaf?.set({ zIndex: n });
		let r = this.foregroundVisible(e) ? e.foreground.coverLevel ? 20.5 : 22 : 120;
		t.linkArrowLeaf?.set({ zIndex: r });
	}
	drawEffectBox(e) {
		if (!this.leafer) return;
		this.effectBoxFillLeaf || (this.effectBoxFillLeaf = new l(), this.leafer.add(this.effectBoxFillLeaf)), this.effectBoxBorderLeaf || (this.effectBoxBorderLeaf = new c(), this.leafer.add(this.effectBoxBorderLeaf));
		let t = e.effectBox, n = t.enabled && t.width > 0 && t.height > 0 && t.opacity > 0, r = t.borderStyle !== "none" && t.width > 0 && t.height > 0, i = Math.min(16, t.width / 2), a = Math.min(16, t.height / 2), o = Math.min(20, t.height / 2);
		this.effectBoxFillLeaf.set({
			x: t.x + i,
			y: t.y + a,
			width: Math.max(0, t.width - i * 2),
			height: Math.max(0, t.height - a - o),
			fill: t.color,
			opacity: t.opacity,
			visible: n,
			zIndex: 28
		});
		let s = t.borderStyle === "colored" ? p.effectBox.coloredUrl : p.effectBox.defaultUrl;
		this.effectBoxBorderLeaf.set({
			url: this.resourceUrl(s),
			x: t.x,
			y: t.y,
			width: t.width,
			height: t.height,
			visible: r,
			zIndex: 29
		});
	}
	drawMark25th(e) {
		if (!this.leafer) return;
		this.mark25thLeaf || (this.mark25thLeaf = new c(), this.leafer.add(this.mark25thLeaf));
		let t = p.mark25th;
		this.mark25thLeaf.set({
			url: this.resourceUrl(t.url),
			x: t.x,
			y: t.y,
			width: t.width,
			height: t.height,
			visible: e.footer.mark25th,
			zIndex: 10
		});
	}
	resolveWaiters(e) {
		let t = [];
		for (let n of this.waiters) n.revision <= e ? n.resolve() : t.push(n);
		this.waiters = t;
	}
	rejectWaiters(e, t) {
		let n = [];
		for (let r of this.waiters) r.revision <= e ? r.reject(t) : n.push(r);
		this.waiters = n;
	}
};
//#endregion
export { _ as YugiohCard, u as YugiohCardRenderError };
