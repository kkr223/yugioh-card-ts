//#region packages/src/yugioh-card/document.ts
var e = "yugioh-card", t = 1, n = [
	"sc",
	"tc",
	"jp",
	"kr",
	"en",
	"astral",
	"custom1",
	"custom2"
], r = [
	"monster",
	"spell",
	"trap",
	"pendulum"
], i = [
	"normal",
	"effect",
	"ritual",
	"fusion",
	"synchro",
	"xyz",
	"link",
	"token"
], a = [
	"normal-pendulum",
	"effect-pendulum",
	"ritual-pendulum",
	"fusion-pendulum",
	"synchro-pendulum",
	"xyz-pendulum",
	"link-pendulum"
], o = [
	"left",
	"center",
	"right"
], s = [
	"cover",
	"contain",
	"stretch"
], c = [
	"none",
	"default",
	"colored"
], l = [
	"before-frame",
	"after-artwork",
	"before-text",
	"after-text",
	"top"
], u = class extends Error {
	path;
	constructor(e, t = "") {
		super(t ? `${t}: ${e}` : e), this.name = "YugiohCardDocumentError", this.path = t;
	}
}, d = {
	kind: e,
	version: 1,
	frame: {
		language: "sc",
		font: "",
		type: "monster",
		attribute: "dark",
		icon: "",
		cardType: "normal",
		pendulumType: "normal-pendulum",
		level: 0,
		rank: 0,
		pendulumScale: 0,
		arrows: [],
		nameBlock: !1
	},
	title: {
		text: "",
		align: "left",
		fill: {
			color: "",
			gradient: !1,
			gradientColor1: "#999999",
			gradientColor2: "#ffffff"
		},
		shadow: {
			enabled: !1,
			color: "",
			gradient: !1,
			gradientColor1: "#1f2937",
			gradientColor2: "#0f172a",
			offsetX: 7,
			offsetY: 7,
			opacity: .92
		},
		useRarityPreset: !1
	},
	artwork: {
		source: "",
		fit: "cover"
	},
	foreground: {
		enabled: !1,
		source: "",
		width: 0,
		height: 0,
		x: 697,
		y: 1015.5,
		scale: 1,
		rotation: 0,
		coverLevel: !0
	},
	effectBox: {
		enabled: !1,
		x: 77,
		y: 1501,
		width: 1239,
		height: 427,
		color: "#f6f2e8",
		opacity: .78,
		borderStyle: "none"
	},
	text: {
		pendulumDescription: "",
		monsterType: "",
		description: "",
		firstLineCompress: !1,
		descriptionAlign: !1,
		descriptionZoom: 1,
		descriptionWeight: 0,
		showAtkBar: !0,
		atk: 0,
		def: 0
	},
	footer: {
		package: "",
		password: "",
		copyright: "",
		laser: "",
		rare: "",
		twentieth: !1,
		mark25th: !1
	},
	render: {
		radius: !0,
		scale: 1
	}
};
function f(e) {
	return {
		...e,
		frame: {
			...e.frame,
			arrows: [...e.frame.arrows]
		},
		title: {
			...e.title,
			fill: { ...e.title.fill },
			shadow: { ...e.title.shadow }
		},
		artwork: { ...e.artwork },
		foreground: { ...e.foreground },
		effectBox: { ...e.effectBox },
		text: { ...e.text },
		footer: { ...e.footer },
		render: { ...e.render }
	};
}
function p(t = {}) {
	let n = f(d);
	return {
		...n,
		...t,
		kind: e,
		version: 1,
		frame: {
			...n.frame,
			...t.frame,
			arrows: [...t.frame?.arrows ?? n.frame.arrows]
		},
		title: {
			...n.title,
			...t.title,
			fill: {
				...n.title.fill,
				...t.title?.fill
			},
			shadow: {
				...n.title.shadow,
				...t.title?.shadow
			}
		},
		artwork: {
			...n.artwork,
			...t.artwork
		},
		foreground: {
			...n.foreground,
			...t.foreground
		},
		effectBox: {
			...n.effectBox,
			...t.effectBox
		},
		text: {
			...n.text,
			...t.text
		},
		footer: {
			...n.footer,
			...t.footer
		},
		render: {
			...n.render,
			...t.render
		}
	};
}
function m(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function h(e, t) {
	let n = e[t];
	if (!m(n)) throw new u("expected an object", t);
	return n;
}
function g(e, t, n) {
	if (typeof e != "string" || !t.includes(e)) throw new u(`expected one of ${t.join(", ")}`, n);
	return e;
}
function _(e, t) {
	if (typeof e != "string") throw new u("expected a string", t);
	return e;
}
function v(e, t) {
	if (typeof e != "number" || !Number.isFinite(e)) throw new u("expected a finite number", t);
	return e;
}
function y(e, t) {
	if (typeof e != "boolean") throw new u("expected a boolean", t);
	return e;
}
function b(e, t, n, r) {
	return e === void 0 ? n : g(e, t, r);
}
function x(e, t, n) {
	return e === void 0 ? t : y(e, n);
}
function S(t) {
	if (!m(t)) throw new u("expected an object");
	if (t.kind !== "yugioh-card") throw new u(`expected ${e}`, "kind");
	if (t.version !== 1) throw new u(`unsupported version ${String(t.version)}`, "version");
	let l = h(t, "frame"), d = h(t, "title"), f = h(d, "fill"), p = h(d, "shadow"), S = h(t, "artwork"), C = h(t, "foreground"), w = h(t, "effectBox"), T = h(t, "text"), E = h(t, "footer"), D = h(t, "render"), O = l.arrows;
	if (!Array.isArray(O) || O.some((e) => !Number.isInteger(e) || e < 1 || e > 8)) throw new u("expected integers from 1 to 8", "frame.arrows");
	return {
		kind: e,
		version: 1,
		frame: {
			language: g(l.language, n, "frame.language"),
			font: g(l.font, [
				"",
				"custom1",
				"custom2"
			], "frame.font"),
			type: g(l.type, r, "frame.type"),
			attribute: _(l.attribute, "frame.attribute"),
			icon: _(l.icon, "frame.icon"),
			cardType: g(l.cardType, i, "frame.cardType"),
			pendulumType: g(l.pendulumType, a, "frame.pendulumType"),
			level: v(l.level, "frame.level"),
			rank: v(l.rank, "frame.rank"),
			pendulumScale: v(l.pendulumScale, "frame.pendulumScale"),
			arrows: [...O],
			nameBlock: x(l.nameBlock, !1, "frame.nameBlock")
		},
		title: {
			text: _(d.text, "title.text"),
			align: g(d.align, o, "title.align"),
			fill: {
				color: _(f.color, "title.fill.color"),
				gradient: y(f.gradient, "title.fill.gradient"),
				gradientColor1: _(f.gradientColor1, "title.fill.gradientColor1"),
				gradientColor2: _(f.gradientColor2, "title.fill.gradientColor2")
			},
			shadow: {
				enabled: y(p.enabled, "title.shadow.enabled"),
				color: _(p.color, "title.shadow.color"),
				gradient: y(p.gradient, "title.shadow.gradient"),
				gradientColor1: _(p.gradientColor1, "title.shadow.gradientColor1"),
				gradientColor2: _(p.gradientColor2, "title.shadow.gradientColor2"),
				offsetX: v(p.offsetX, "title.shadow.offsetX"),
				offsetY: v(p.offsetY, "title.shadow.offsetY"),
				opacity: v(p.opacity, "title.shadow.opacity")
			},
			useRarityPreset: y(d.useRarityPreset, "title.useRarityPreset")
		},
		artwork: {
			source: _(S.source, "artwork.source"),
			fit: g(S.fit, s, "artwork.fit")
		},
		foreground: {
			enabled: y(C.enabled, "foreground.enabled"),
			source: _(C.source, "foreground.source"),
			width: v(C.width, "foreground.width"),
			height: v(C.height, "foreground.height"),
			x: v(C.x, "foreground.x"),
			y: v(C.y, "foreground.y"),
			scale: v(C.scale, "foreground.scale"),
			rotation: v(C.rotation, "foreground.rotation"),
			coverLevel: x(C.coverLevel, !0, "foreground.coverLevel")
		},
		effectBox: {
			enabled: y(w.enabled, "effectBox.enabled"),
			x: v(w.x, "effectBox.x"),
			y: v(w.y, "effectBox.y"),
			width: v(w.width, "effectBox.width"),
			height: v(w.height, "effectBox.height"),
			color: _(w.color, "effectBox.color"),
			opacity: v(w.opacity, "effectBox.opacity"),
			borderStyle: b(w.borderStyle, c, "none", "effectBox.borderStyle")
		},
		text: {
			pendulumDescription: _(T.pendulumDescription, "text.pendulumDescription"),
			monsterType: _(T.monsterType, "text.monsterType"),
			description: _(T.description, "text.description"),
			firstLineCompress: y(T.firstLineCompress, "text.firstLineCompress"),
			descriptionAlign: y(T.descriptionAlign, "text.descriptionAlign"),
			descriptionZoom: v(T.descriptionZoom, "text.descriptionZoom"),
			descriptionWeight: v(T.descriptionWeight, "text.descriptionWeight"),
			showAtkBar: y(T.showAtkBar, "text.showAtkBar"),
			atk: v(T.atk, "text.atk"),
			def: v(T.def, "text.def")
		},
		footer: {
			package: _(E.package, "footer.package"),
			password: _(E.password, "footer.password"),
			copyright: _(E.copyright, "footer.copyright"),
			laser: _(E.laser, "footer.laser"),
			rare: _(E.rare, "footer.rare"),
			twentieth: y(E.twentieth, "footer.twentieth"),
			mark25th: x(E.mark25th, !1, "footer.mark25th")
		},
		render: {
			radius: y(D.radius, "render.radius"),
			scale: v(D.scale, "render.scale")
		}
	};
}
function C(e, t) {
	return typeof e == "string" ? e : t;
}
function w(e, t) {
	return typeof e == "number" && Number.isFinite(e) ? e : t;
}
function T(e, t) {
	return typeof e == "boolean" ? e : t;
}
function E(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function D(e, t) {
	return typeof e.effectBlockBorderStyle == "string" ? e.effectBlockBorderStyle === "o" || e.effectBlockBorderStyle === "alternate" ? "colored" : E(e.effectBlockBorderStyle, c, t) : typeof e.effectBlockBorder == "boolean" ? e.effectBlockBorder ? "default" : "none" : t;
}
function O(e = {}, t = p()) {
	let c = C(e.nameShadowColor, t.title.shadow.color), l = C(e.foregroundImage, t.foreground.source), u = Array.isArray(e.arrowList) ? e.arrowList.filter((e) => Number.isInteger(e) && e >= 1 && e <= 8) : t.frame.arrows;
	return p({
		frame: {
			language: E(e.language, n, t.frame.language),
			font: E(e.font, [
				"",
				"custom1",
				"custom2"
			], t.frame.font),
			type: E(e.type, r, t.frame.type),
			attribute: C(e.attribute, t.frame.attribute),
			icon: C(e.icon, t.frame.icon),
			cardType: E(e.cardType, i, t.frame.cardType),
			pendulumType: E(e.pendulumType, a, t.frame.pendulumType),
			level: w(e.level, t.frame.level),
			rank: w(e.rank, t.frame.rank),
			pendulumScale: w(e.pendulumScale, t.frame.pendulumScale),
			arrows: u,
			nameBlock: T(e.nameBlock ?? e.outFrameNameBlock ?? e.outFrameNameBlockEnabled, t.frame.nameBlock)
		},
		title: {
			text: C(e.name, t.title.text),
			align: E(e.align, o, t.title.align),
			fill: {
				color: C(e.color, t.title.fill.color),
				gradient: T(e.gradient, t.title.fill.gradient),
				gradientColor1: C(e.gradientColor1, t.title.fill.gradientColor1),
				gradientColor2: C(e.gradientColor2, t.title.fill.gradientColor2)
			},
			shadow: {
				enabled: !!(c || e.nameShadowGradient || t.title.shadow.enabled),
				color: c,
				gradient: T(e.nameShadowGradient, t.title.shadow.gradient),
				gradientColor1: C(e.nameShadowGradientColor1, t.title.shadow.gradientColor1),
				gradientColor2: C(e.nameShadowGradientColor2, t.title.shadow.gradientColor2),
				offsetX: w(e.nameShadowOffsetX, t.title.shadow.offsetX),
				offsetY: w(e.nameShadowOffsetY, t.title.shadow.offsetY),
				opacity: w(e.nameShadowOpacity, t.title.shadow.opacity)
			},
			useRarityPreset: T(e.useRarityPreset, t.title.useRarityPreset)
		},
		artwork: {
			source: C(e.image, t.artwork.source),
			fit: E(e.artworkFit, s, t.artwork.fit)
		},
		foreground: {
			enabled: !!l,
			source: l,
			width: w(e.foregroundWidth, t.foreground.width),
			height: w(e.foregroundHeight, t.foreground.height),
			x: w(e.foregroundX, t.foreground.x),
			y: w(e.foregroundY, t.foreground.y),
			scale: w(e.foregroundScale, t.foreground.scale),
			rotation: w(e.foregroundRotation, t.foreground.rotation),
			coverLevel: T(e.foregroundCoverLevel, t.foreground.coverLevel)
		},
		effectBox: {
			enabled: T(e.effectBlockEnabled, t.effectBox.enabled),
			x: w(e.effectBlockX, t.effectBox.x),
			y: w(e.effectBlockY, t.effectBox.y),
			width: w(e.effectBlockWidth, t.effectBox.width),
			height: w(e.effectBlockHeight, t.effectBox.height),
			color: C(e.effectBlockColor, t.effectBox.color),
			opacity: w(e.effectBlockOpacity, t.effectBox.opacity),
			borderStyle: D(e, t.effectBox.borderStyle)
		},
		text: {
			pendulumDescription: C(e.pendulumDescription, t.text.pendulumDescription),
			monsterType: C(e.monsterType, t.text.monsterType),
			description: C(e.description, t.text.description),
			firstLineCompress: T(e.firstLineCompress, t.text.firstLineCompress),
			descriptionAlign: T(e.descriptionAlign, t.text.descriptionAlign),
			descriptionZoom: w(e.descriptionZoom, t.text.descriptionZoom),
			descriptionWeight: w(e.descriptionWeight, t.text.descriptionWeight),
			showAtkBar: T(e.atkBar, t.text.showAtkBar),
			atk: w(e.atk, t.text.atk),
			def: w(e.def, t.text.def)
		},
		footer: {
			package: C(e.package, t.footer.package),
			password: C(e.password, t.footer.password),
			copyright: C(e.copyright, t.footer.copyright),
			laser: C(e.laser, t.footer.laser),
			rare: C(e.rare, t.footer.rare),
			twentieth: T(e.twentieth, t.footer.twentieth),
			mark25th: T(e.mark25th ?? e.twentyFifth, t.footer.mark25th)
		},
		render: {
			radius: T(e.radius, t.render.radius),
			scale: w(e.scale, t.render.scale)
		}
	});
}
function k(e) {
	let t = S(e);
	return {
		language: t.frame.language,
		font: t.frame.font,
		name: t.title.text,
		color: t.title.fill.color,
		align: t.title.align,
		gradient: t.title.fill.gradient,
		gradientColor1: t.title.fill.gradientColor1,
		gradientColor2: t.title.fill.gradientColor2,
		nameShadowColor: t.title.shadow.color,
		nameShadowGradient: t.title.shadow.gradient,
		nameShadowGradientColor1: t.title.shadow.gradientColor1,
		nameShadowGradientColor2: t.title.shadow.gradientColor2,
		nameShadowOffsetX: t.title.shadow.offsetX,
		nameShadowOffsetY: t.title.shadow.offsetY,
		nameShadowOpacity: t.title.shadow.opacity,
		useRarityPreset: t.title.useRarityPreset,
		type: t.frame.type,
		attribute: t.frame.attribute,
		icon: t.frame.icon,
		image: t.artwork.source,
		artworkFit: t.artwork.fit,
		cardType: t.frame.cardType,
		pendulumType: t.frame.pendulumType,
		level: t.frame.level,
		rank: t.frame.rank,
		pendulumScale: t.frame.pendulumScale,
		nameBlock: t.frame.nameBlock,
		outFrameNameBlock: t.frame.nameBlock,
		outFrameNameBlockEnabled: t.frame.nameBlock,
		pendulumDescription: t.text.pendulumDescription,
		monsterType: t.text.monsterType,
		atkBar: t.text.showAtkBar,
		atk: t.text.atk,
		def: t.text.def,
		arrowList: [...t.frame.arrows],
		description: t.text.description,
		firstLineCompress: t.text.firstLineCompress,
		descriptionAlign: t.text.descriptionAlign,
		descriptionZoom: t.text.descriptionZoom,
		descriptionWeight: t.text.descriptionWeight,
		package: t.footer.package,
		password: t.footer.password,
		copyright: t.footer.copyright,
		laser: t.footer.laser,
		rare: t.footer.rare,
		twentieth: t.footer.twentieth,
		mark25th: t.footer.mark25th,
		twentyFifth: t.footer.mark25th,
		radius: t.render.radius,
		scale: t.render.scale,
		foregroundImage: t.foreground.source,
		foregroundWidth: t.foreground.width,
		foregroundHeight: t.foreground.height,
		foregroundX: t.foreground.x,
		foregroundY: t.foreground.y,
		foregroundScale: t.foreground.scale,
		foregroundRotation: t.foreground.rotation,
		foregroundCoverLevel: t.foreground.coverLevel,
		effectBlockEnabled: t.effectBox.enabled,
		effectBlockX: t.effectBox.x,
		effectBlockY: t.effectBox.y,
		effectBlockWidth: t.effectBox.width,
		effectBlockHeight: t.effectBox.height,
		effectBlockColor: t.effectBox.color,
		effectBlockOpacity: t.effectBox.opacity,
		effectBlockBorder: t.effectBox.borderStyle !== "none",
		effectBlockBorderStyle: t.effectBox.borderStyle
	};
}
//#endregion
export { s as YUGIOH_ARTWORK_FITS, e as YUGIOH_CARD_DOCUMENT_KIND, t as YUGIOH_CARD_DOCUMENT_VERSION, n as YUGIOH_CARD_LANGUAGES, r as YUGIOH_CARD_TYPES, c as YUGIOH_EFFECT_BOX_BORDER_STYLES, l as YUGIOH_LAYER_SLOTS, i as YUGIOH_MONSTER_CARD_TYPES, a as YUGIOH_PENDULUM_CARD_TYPES, o as YUGIOH_TITLE_ALIGNS, u as YugiohCardDocumentError, p as createYugiohCardDocument, O as legacyDataToYugiohCardDocument, S as parseYugiohCardDocument, k as yugiohCardDocumentToLegacyData };
