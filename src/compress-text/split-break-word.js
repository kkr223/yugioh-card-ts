import { LineBreaker as e, fromCodePoint as t, toCodePoints as n } from "css-line-break";
//#region packages/src/compress-text/split-break-word.js
var r = new Set([
	32,
	160,
	4961,
	65792,
	65793,
	4153,
	4241
]), i = /\[[^\[\]()]*\([^\[\]()]*\)]/g, a = /__RB\d+__/g, o = /(?<=__RB\d+__)(?=__RB\d+__)/g, s = (i) => {
	let a = e(i, {
		lineBreak: "strict",
		wordBreak: "normal"
	}), o = [], s;
	for (; !(s = a.next()).done;) if (s.value) {
		let e = n(s.value.slice()), i = "";
		e.forEach((e) => {
			r.has(e) ? (i.length && o.push(i), o.push(t(e)), i = "") : i += t(e);
		}), i.length && o.push(i);
	}
	return o;
}, c = (e) => {
	if (!Array.from(e.matchAll(i)).length) return s(e);
	let t = /* @__PURE__ */ new Map();
	return s(e.replace(i, (e) => {
		let n = `__RB${t.size}__`;
		return t.set(n, e), n;
	}).replace(o, "​")).map((e) => e.replace(/\u200B/g, "").replace(a, (e) => t.get(e) ?? e));
};
//#endregion
export { s as splitBreakWord, c as splitBreakWordWithBracket };
