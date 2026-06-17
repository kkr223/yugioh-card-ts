import { isBrowser as e } from "../utils/index.js";
import { splitBreakWordWithBracket as t } from "./split-break-word.js";
import { Group as n, Text as r } from "leafer-unified";
//#region packages/src/compress-text/legacy-compress-text.js
var i = /(\[[^\[\]()]*\([^\[\]()]*\)])/g, a = /^\[([^\[\]()]+)\(([^\[\]()]*)\)]$/, o = 1.15, s = "●①②③④⑤⑥⑦⑧⑨⑩", c = .5, l = .01, u = .7, d = .9, f = .6, p = 5, m = [
	0,
	.4,
	.55,
	.6,
	.75
], h = "rgba(0, 0, 0, 0.6)", g = .025, _ = .015, v = .025, y = class extends n {
	constructor(t = {}) {
		super(), this.parseList = [], this.flatItemList = [], this.newlineList = [], this.rubyList = [], this.rubyLineMap = /* @__PURE__ */ new Map(), this.currentX = 0, this.currentY = 0, this.currentLine = 0, this.textScale = 1, this.firstLineTextScale = 1, this.isSmallSize = !1, this.group = null, this.needCompressTwice = !1, this.bounds = {}, this.defaultData = {
			text: "",
			fontFamily: "ygo-sc",
			fontSize: 24,
			fontWeight: "normal",
			lineHeight: o,
			letterSpacing: 0,
			wordSpacing: 0,
			firstLineCompress: !1,
			textAlign: "justify",
			textJustifyLast: !1,
			color: "black",
			strokeWidth: 0,
			gradient: !1,
			gradientColor1: "#999999",
			gradientColor2: "#ffffff",
			rtFontFamily: "ygo-tip",
			rtFontSize: 13,
			rtFontWeight: "bold",
			rtLineHeight: o,
			rtLetterSpacing: 0,
			rtTop: -9,
			rtColor: "black",
			rtStrokeWidth: 0,
			rtFontScaleX: 1,
			fontScale: 1,
			autoSmallSize: !1,
			smallFontSize: 18,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
			zIndex: 0
		}, this.initData(t), e && document.fonts.ready.then(() => {
			setTimeout(() => {
				this.compressText();
			}, 250);
		});
	}
	set(e = {}) {
		let t = !1;
		Object.keys(e).forEach((n) => {
			let r = e[n] ?? this.defaultData[n];
			Object.is(this[n], r) || (this[n] = r, t = !0);
		}), t && this.compressText();
	}
	initData(e = {}) {
		this.set(Object.assign({}, this.defaultData, e));
	}
	getParseList() {
		let e = [], n = !1;
		return String(this.text).trimEnd().split(RegExp(`(<b>|</b>|\n|[${s}])`)).filter((e) => e).forEach((r) => {
			if (r === "<b>") {
				n = !0;
				return;
			}
			if (r === "</b>") {
				n = !1;
				return;
			}
			t(r).forEach((t) => {
				let r = [];
				t.split(i).filter((e) => e).forEach((e) => {
					let t = e, i = "", o = e.match(a);
					o && (t = o[1], i = o[2]);
					let s = this.createTextItem(t, i, n);
					r.push(s);
				}), e.push(r);
			});
		}), e;
	}
	getNewlineList() {
		let e = [[]], t = 0;
		return this.parseList.forEach((n) => {
			let r = n.some((e) => e.ruby.text === "\n");
			e[t].push(n), r && (t++, e[t] = []);
		}), e;
	}
	getCurrentFontSize() {
		return this.isSmallSize ? this.smallFontSize : this.fontSize;
	}
	getPaddingWidth(e) {
		return (e.paddingLeft || 0) + (e.paddingRight || 0);
	}
	isSplittablePlainTextItem(e) {
		return !e.rt.text && e.ruby.text !== "\n" && Array.from(e.ruby.text).length > 1;
	}
	resetCompressionState() {
		this.textScale = 1, this.firstLineTextScale = 1, this.isSmallSize = !1, this.needCompressTwice = !1;
	}
	rebuildParseCache() {
		this.parseList = this.getParseList(), this.newlineList = this.getNewlineList(), this.updateLayoutCache();
	}
	resetGroup() {
		this.group && this.group.destroy(), this.group = new n();
	}
	createTextItem(e, t = "", n = !1) {
		return {
			ruby: {
				text: e,
				bold: n
			},
			rt: { text: t }
		};
	}
	createPlainTextItem(e, t = !1) {
		return this.createTextItem(e, "", t);
	}
	getTextCharList(e) {
		return Array.from(e);
	}
	getTextCharLength(e) {
		return this.getTextCharList(e).length;
	}
	createMeasuredPlainTextItem(e, t = !1) {
		let n = this.createPlainTextItem(e, t);
		return this.createRubyLeaf(n.ruby), n;
	}
	destroyRubyLeaf(e) {
		e?.rubyLeaf && e.rubyLeaf.destroy();
	}
	getRubyTextStyle(e) {
		return {
			text: e.text,
			fontFamily: this.fontFamily,
			fontSize: this.fontSize * this.fontScale,
			fontWeight: e.bold ? "bold" : this.fontWeight,
			lineHeight: this.fontSize * this.lineHeight * this.fontScale,
			fill: this.color,
			stroke: this.strokeWidth ? this.color : null,
			strokeWidth: this.strokeWidth,
			strokeAlign: "center",
			letterSpacing: this.letterSpacing
		};
	}
	getRtTextStyle(e) {
		return {
			text: e.text,
			fontFamily: this.rtFontFamily,
			fontSize: this.rtFontSize * this.fontScale,
			fontWeight: this.rtFontWeight,
			lineHeight: this.rtFontSize * this.rtLineHeight * this.fontScale,
			fill: this.rtColor,
			stroke: this.rtStrokeWidth ? this.color : null,
			strokeWidth: this.rtStrokeWidth,
			strokeAlign: "center",
			letterSpacing: this.rtLetterSpacing
		};
	}
	createRubyLeaf(e) {
		let t = new r(this.getRubyTextStyle(e)), n = t.getBounds("content", "inner"), i = e.text === " " ? this.wordSpacing : 0;
		return e.rubyLeaf = t, e.originalWidth = n.width + i, e.originalHeight = n.height, e.width = e.originalWidth, e.height = e.originalHeight, t;
	}
	createRtLeaf(e) {
		let t = new r(this.getRtTextStyle(e)), n = t.getBounds("content", "inner");
		return e.rtLeaf = t, e.originalWidth = n.width, e.originalHeight = n.height, e.width = n.width, e.height = n.height, t;
	}
	relayoutAfterRtCompression() {
		this.updateTextScale(), this.compressRuby(), this.alignRuby(), this.flatItemList.forEach((e) => {
			this.positionRt(e);
		});
	}
	updateLayoutCache() {
		this.flatItemList = this.parseList.flat(), this.rubyList = this.flatItemList.map((e) => e.ruby);
	}
	updateRubyLineMap() {
		let e = /* @__PURE__ */ new Map();
		this.rubyList.forEach((t) => {
			t.line < 0 || (e.has(t.line) || e.set(t.line, []), e.get(t.line).push(t));
		}), this.rubyLineMap = e;
	}
	compressText() {
		this.resetCompressionState(), this.rebuildParseCache(), this.resetGroup(), this.createRuby(), this.compressRuby(), this.alignRuby(), this.createRt(), this.createGradient(), this.createBounds(), this.add(this.group);
	}
	createRuby() {
		this.rubyList.forEach((e) => {
			this.createRubyLeaf(e);
		}), this.applyOverflowFallback(), this.rubyList.forEach((e) => {
			this.group.add(e.rubyLeaf);
		}), this.updateTextScale();
	}
	findLargestFittingTextSegment(e, t, n) {
		let r = t, i = e.length, a = null;
		for (; r < i;) {
			let o = Math.ceil((r + i) / 2), s = this.createMeasuredPlainTextItem(e.slice(t, o).join(""), n);
			s.ruby.width <= this.width ? (this.destroyRubyLeaf(a?.ruby), a = s, r = o) : (this.destroyRubyLeaf(s.ruby), i = o - 1);
		}
		return a ?? this.createMeasuredPlainTextItem(e[t], n);
	}
	splitPlainTextItemIntoFittingSegments(e) {
		let t = this.getTextCharList(e.ruby.text), n = [], r = 0;
		for (; r < t.length;) {
			let i = this.findLargestFittingTextSegment(t, r, e.ruby.bold);
			n.push([i]), r += this.getTextCharLength(i.ruby.text);
		}
		return n;
	}
	expandItemForOverflowFallback(e) {
		return this.isSplittablePlainTextItem(e) ? (this.destroyRubyLeaf(e.ruby), this.splitPlainTextItemIntoFittingSegments(e)) : [[e]];
	}
	splitOversizedItemList(e) {
		return e.flatMap((e) => this.expandItemForOverflowFallback(e));
	}
	applyOverflowFallbackToItemList(e) {
		let t = this.getItemWidth(e), n = e.some((e) => this.isSplittablePlainTextItem(e));
		return t <= this.width || !n ? [e] : this.splitOversizedItemList(e);
	}
	applyOverflowFallback() {
		if (!this.width) return;
		let e = this.newlineList.map((e) => e.flatMap((e) => this.applyOverflowFallbackToItemList(e)));
		this.newlineList = e, this.parseList = e.flat(), this.updateLayoutCache();
	}
	getFirstLineScale() {
		let e = this.newlineList[0].map((e) => e.map((e) => e.ruby)).flat(), t = 0, n = this.width;
		return e.forEach((e) => {
			t += e.originalWidth, n -= this.getPaddingWidth(e);
		}), t ? Math.min(Math.floor(n / t * 1e3) / 1e3, 1) : 1;
	}
	doesOverflowHeight(e) {
		return this.height && e && this.currentY + e.height > this.height;
	}
	reachedSingleLineHeightLimit(e) {
		return !!(this.height && e && this.currentLine === 0 && e.height > this.height);
	}
	compressRuby() {
		this.firstLineCompress && this.width && (this.firstLineTextScale = this.getFirstLineScale(), this.updateTextScale());
		let e = this.rubyList[this.rubyList.length - 1];
		if (this.doesOverflowHeight(e)) {
			if (this.reachedSingleLineHeightLimit(e)) return;
			let t = c, n = 0, r = this.textScale;
			for (; t > 0 && (t = (n + r) / 2, this.textScale = t, this.updateTextScale(), !this.reachedSingleLineHeightLimit(e));) {
				let i = this.doesOverflowHeight(e);
				if (i ? r = t : n = t, !i && r - n <= l) if (this.autoSmallSize && t < u && this.fontScale <= 1 && !this.isSmallSize) this.isSmallSize = !0, this.updateFontSize(), t = c, n = 0, r = 1;
				else break;
			}
		}
	}
	getAlignLineCount() {
		return this.textScale < 1 || ["center", "right"].includes(this.textAlign) || this.textJustifyLast ? this.currentLine + 1 : this.currentLine;
	}
	getLineRemainWidth(e) {
		let t = e[e.length - 1], n = t.rubyLeaf, r = t.paddingRight || 0;
		return this.width - n.x - t.width - r;
	}
	offsetRubyLine(e, t) {
		e.forEach((e, n) => {
			e.rubyLeaf.x += t(n);
		});
	}
	alignCenterLine(e, t) {
		this.offsetRubyLine(e, () => t / 2);
	}
	alignRightLine(e, t) {
		this.offsetRubyLine(e, () => t);
	}
	alignJustifyLine(e, t) {
		if (e.length <= 1 || e[e.length - 1].text === "\n") return;
		let n = t / (e.length - 1);
		this.offsetRubyLine(e, (e) => e * n);
	}
	alignRubyLine(e, t) {
		this.textAlign === "center" ? this.alignCenterLine(e, t) : this.textAlign === "right" ? this.alignRightLine(e, t) : this.textAlign === "justify" && this.alignJustifyLine(e, t);
	}
	alignRuby() {
		let e = this.getAlignLineCount();
		for (let t = 0; t < e; t++) {
			let e = this.rubyLineMap.get(t);
			if (!e?.length) continue;
			let n = this.getLineRemainWidth(e);
			n > 0 && this.alignRubyLine(e, n);
		}
	}
	createRt() {
		this.flatItemList.forEach((e) => {
			let t = e.rt;
			if (t.text) {
				let n = this.createRtLeaf(t);
				this.positionRt(e), this.group.add(n);
			}
		}), this.needCompressTwice && this.relayoutAfterRtCompression();
	}
	updateRubyScale(e, t) {
		let n = e.rubyLeaf;
		n.scaleX = t, e.width = e.originalWidth * t;
	}
	getItemWidth(e) {
		let t = 0;
		return e.forEach((e) => {
			let n = e.ruby;
			t += n.width + this.getPaddingWidth(n);
		}), t;
	}
	updateItemRubyScale(e, t, n) {
		e.forEach((e) => {
			let r = e.ruby;
			this.firstLineCompress && t === 0 ? this.updateRubyScale(r, this.firstLineTextScale) : !s.includes(r.text) && n ? this.updateRubyScale(r, this.textScale) : this.updateRubyScale(r, 1);
		});
	}
	resetLayoutPosition() {
		this.currentX = 0, this.currentY = 0, this.currentLine = 0;
	}
	shouldWrapItemList(e, t) {
		let n = e.some((e) => e.ruby.text === "\n"), r = this.width && this.currentX && this.currentX + t > this.width;
		return n || r;
	}
	positionItemListRuby(e) {
		e.forEach((e) => {
			this.positionRuby(e.ruby);
		});
	}
	layoutItemList(e, t, n) {
		this.updateItemRubyScale(e, t, n);
		let r = this.getItemWidth(e);
		this.shouldWrapItemList(e, r) && this.addLine(), this.positionItemListRuby(e);
	}
	layoutNewlineItems(e, t) {
		let n = t === this.newlineList.length - 1;
		e.forEach((e) => {
			this.layoutItemList(e, t, n);
		});
	}
	updateTextScale() {
		this.resetLayoutPosition(), this.newlineList.forEach((e, t) => {
			this.layoutNewlineItems(e, t);
		}), this.updateRubyLineMap();
	}
	updateFontSize() {
		this.textScale = 1;
		let e = this.getCurrentFontSize(), t = e / this.fontSize;
		this.rubyList.forEach((n) => {
			let r = n.rubyLeaf;
			r.fontSize = e * this.fontScale, r.lineHeight = e * this.lineHeight * this.fontScale, n.originalWidth *= t, n.originalHeight *= t, n.width *= t, n.height *= t;
		}), this.updateTextScale();
	}
	positionRuby(e) {
		let t = e.paddingLeft || 0, n = e.paddingRight || 0, r = e.rubyLeaf;
		r.x = this.currentX + t, r.y = this.currentY, this.currentX += e.width + t + n, e.line = e.text === "\n" ? this.currentLine - 1 : this.currentLine;
	}
	addLine() {
		this.removeLineLastSpace(this.currentLine);
		let e = this.getCurrentFontSize();
		this.currentX = 0, this.currentY += e * this.lineHeight * this.fontScale, this.currentLine++;
	}
	removeLineLastSpace(e) {
		for (let t = this.rubyList.length - 1; t >= 0; t--) {
			let n = this.rubyList[t];
			if (n.line !== e) continue;
			if (n.text !== " ") break;
			let r = n.rubyLeaf, i = n.paddingLeft || 0, a = n.paddingRight || 0;
			this.currentX -= n.width + i + a, r.destroy(), n.line = -1;
		}
	}
	getRtLayoutContext(e) {
		let t = e.ruby, n = e.rt, r = t.rubyLeaf, i = n.rtLeaf, a = t.paddingLeft || 0, o = t.paddingRight || 0;
		return {
			ruby: t,
			rt: n,
			rubyLeaf: r,
			rtLeaf: i,
			paddingLeft: a,
			paddingRight: o,
			rubyWidth: t.width + a + o
		};
	}
	positionRtBase(e) {
		let { rubyLeaf: t, rtLeaf: n, paddingLeft: r, rubyWidth: i } = e;
		n.around = {
			type: "percent",
			x: .5,
			y: 0
		}, n.x = t.x + i / 2 - r, n.y = t.y + this.rtTop * this.fontScale;
	}
	applyRtScaleXOverride(e) {
		e.rtLeaf.scaleX = this.rtFontScaleX;
	}
	stretchRtLetterSpacing(e) {
		let { ruby: t, rt: n, rtLeaf: r, rubyWidth: i } = e, a = this.fontSize - this.rtFontSize / 2, o = (i * d - n.width) / (n.text.length - 1);
		r.letterSpacing = Math.min(o, a), r.x += r.letterSpacing / 2;
	}
	compressRtToRubyWidth(e) {
		let { ruby: t, rt: n, rtLeaf: r, rubyWidth: i } = e;
		if (i / n.width < f) {
			let e = f * n.width - i;
			r.scaleX = f, t.paddingLeft = Math.min(e / 2, p), t.paddingRight = Math.min(e / 2, p), this.needCompressTwice = !0;
		} else r.scaleX = i / n.width;
	}
	applyRtWidthStrategy(e) {
		let { ruby: t, rt: n } = e;
		this.rtFontScaleX === 1 ? n.width / e.rubyWidth < d && t.text.length > 1 ? this.stretchRtLetterSpacing(e) : n.width > e.rubyWidth && this.compressRtToRubyWidth(e) : this.applyRtScaleXOverride(e);
	}
	positionRt(e) {
		let t = this.getRtLayoutContext(e);
		t.rtLeaf && (this.positionRtBase(t), this.applyRtWidthStrategy(t));
	}
	createGradient() {
		if (this.gradient) {
			let e = this.getCurrentFontSize();
			this.rubyList.forEach((t) => {
				t.rubyLeaf.set({
					fill: {
						type: "linear",
						stops: [
							{
								offset: m[0],
								color: this.gradientColor1
							},
							{
								offset: m[1],
								color: this.gradientColor2
							},
							{
								offset: m[2],
								color: this.gradientColor2
							},
							{
								offset: m[3],
								color: this.gradientColor1
							},
							{
								offset: m[4],
								color: this.gradientColor2
							}
						]
					},
					stroke: h,
					strokeWidth: e * g * this.fontScale,
					strokeAlign: "outside",
					shadow: {
						blur: e * _ * this.fontScale,
						x: 0,
						y: e * v * this.fontScale,
						color: h
					}
				});
			});
		}
	}
	createBounds() {
		this.bounds = {
			width: 0,
			height: 0
		}, this.rubyLineMap.forEach((e) => {
			let t = e[e.length - 1], n = t.rubyLeaf, r = t.paddingRight || 0;
			this.bounds.width = Math.max(this.bounds.width, n.x + t.width + r) * this.scaleX, this.bounds.height = Math.max(this.bounds.height, n.y + t.height) * this.scaleY;
		});
	}
};
//#endregion
export { y as LegacyCompressText };
