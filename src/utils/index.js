//#region packages/src/utils/index.ts
var e = globalThis.process, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new Set(), i = null, a = typeof window < "u" && window.document !== void 0, o = !!e?.versions?.node, s = () => {
	if (!o) throw Error("fs is not available in browser builds");
	if (i ||= e?.getBuiltinModule?.("node:fs") ?? e?.getBuiltinModule?.("fs") ?? null, !i) throw Error("fs is not available in the current Node.js runtime");
	return i;
}, c = (e) => {
	let n = t.get(e);
	if (n) return n;
	let r = fetch(`${e}/font-list.json`).then(async (t) => {
		if (!t.ok) throw Error(`Failed to load font manifest: ${t.status}`);
		let n = await t.json();
		if (!Array.isArray(n) || n.some((e) => typeof e != "string")) throw Error("Invalid font manifest");
		let r = n.map((t) => {
			let n = new FontFace(t, `url(${e}/${t}.woff2) format('woff2')`, { display: "swap" });
			return document.fonts.add(n), n;
		}), i = (await Promise.allSettled(r.map((e) => e.load()))).find((e) => e.status === "rejected");
		if (i?.status === "rejected") throw Error("Failed to load one or more card fonts", { cause: i.reason });
	}).catch((n) => {
		throw t.delete(e), n;
	});
	return t.set(e, r), r;
}, l = (e, t) => {
	let i = t ? n.get(t) ?? /* @__PURE__ */ new Set() : r;
	if (i.has(e)) return;
	let a = s().readFileSync(`${e}/font-list.json`, "utf-8"), o = JSON.parse(a);
	if (!Array.isArray(o) || o.some((e) => typeof e != "string")) throw Error(`Invalid font manifest: ${e}/font-list.json`);
	for (let n of o) t?.FontLibrary.use(n, [`${e}/${n}.woff2`]);
	i.add(e), t && n.set(t, i);
}, u = (e) => String(e).replace(/\d/g, (e) => String.fromCharCode(e.charCodeAt(0) + 65248));
function d(e) {
	if (typeof e != "object" || !e) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
var f = (e, t = {}) => {
	let n = e;
	return [
		"fontFamily",
		"fontSize",
		"fontStyle",
		"fontWeight",
		"lineHeight",
		"letterSpacing",
		"wordSpacing"
	].forEach((r) => {
		!Object.hasOwn(e, r) && Object.hasOwn(t, r) && (n[r] = t[r]);
	}), Object.keys(n).forEach((e) => {
		d(n[e]) && f(n[e], n);
	}), e;
};
//#endregion
export { f as inheritProp, a as isBrowser, o as isNode, c as loadFontBrowser, l as loadFontNode, u as numberToFull };
