/* Partytown 0.8.0 - MIT builder.io */
((e) => {
  const [t, s, n, r, i, a, o, d, u] = e.g; delete e.g; const c = Symbol(); const h = Symbol(); const f = Symbol(); const p = Symbol(); const g = Symbol(); const l = Symbol(); const m = []; const v = (e, t, s) => e[t] = S(t, s); const S = (e, t) => Object.defineProperty(t, 'name', { value: e }); const b = (e, t) => { const r = { getContext: { value(e, t) { return this[c] || (this[c] = (e.includes('webgl') ? g : p)(this, e, t)), this[c]; } } }; const h = v(t, 'CanvasGradient', class extends e {addColorStop(...e) { n(this, ['addColorStop'], e, 2); }}); const f = v(t, 'CanvasPattern', class extends e {setTransform(...e) { n(this, ['setTransform'], e, 2); }}); const p = (e, t, r) => { const i = e[o]; const c = a(); const f = { [o]: i, [d]: c, [u]: [] }; const p = n(e, ['getContext'], [t, r], 1, c); const g = 'getContextAttributes,getImageData,getLineDash,getTransform,isPointInPath,isPointInStroke,measureText'.split(','); const l = { get: (e, t) => (typeof t === 'string' && t in p ? typeof p[t] === 'function' ? (...e) => { if (t.startsWith('create')) { const r = a(); return n(f, [t], e, 2, r), t === 'createImageData' || t === 'createPattern' ? (s = `${t}()`, console.warn(`${s} not implemented`), { setTransform: () => {} }) : new h(i, r); } let s; const r = g.includes(t) ? 1 : 2; return n(f, [t], e, r); } : p[t] : e[t]), set: (e, t, n) => (typeof t === 'string' && t in p ? (p[t] !== n && typeof n !== 'function' && s(f, [t], n), p[t] = n) : e[t] = n, !0) }; return new Proxy(p, l); }; const g = (e, t, r) => { const i = e[o]; const c = a(); const h = { [o]: i, [d]: c, [u]: [] }; const f = n(e, ['getContext'], [t, r], 1, c); const p = { get: (e, t) => (typeof t === 'string' ? typeof f[t] !== 'function' ? f[t] : (...e) => n(h, [t], e, m(t)) : e[t]), set: (e, t, n) => (typeof t === 'string' && t in f ? (f[t] !== n && typeof n !== 'function' && s(h, [t], n), f[t] = n) : e[t] = n, !0) }; return new Proxy(f, p); }; const l = 'checkFramebufferStatus,makeXRCompatible'.split(','); const m = (e) => (e.startsWith('create') || e.startsWith('get') || e.startsWith('is') || l.includes(e) ? 1 : 2); v(t, 'CanvasGradient', h), v(t, 'CanvasPattern', f), i(t.HTMLCanvasElement, r); }; const y = (e, u, c, b) => {
    let y; let T; b.Audio = S('HTMLAudioElement', class {constructor(e) { const t = c.k('audio', a()); return t.src = e, t; }}); const w = class extends e {
      get enabled() { return t(this, ['enabled']); }

      set enabled(e) { s(this, ['enabled'], e); }

      get id() { return t(this, ['id']); }

      get kind() { return t(this, ['kind']); }

      get label() { return t(this, ['label']); }

      get language() { return t(this, ['language']); }

      get sourceBuffer() { return new x(this); }
    }; const E = class {
      constructor(e) {
        const s = 'audioTracks'; const r = e[o]; const i = e[d]; return new Proxy({
          addEventListener(...t) { n(e, [s, 'addEventListener'], t, 3); }, getTrackById: (...t) => n(e, [s, 'getTrackById'], t), get length() { return t(e, [s, 'length']); }, removeEventListener(...t) { n(e, [s, 'removeEventListener'], t, 3); },
        }, { get: (e, t) => (typeof t === 'number' ? new w(r, i, [s, t]) : e[t]) });
      }
    }; const k = v(b, 'SourceBufferList', class extends Array {
      constructor(e) { super(), this[h] = e; }

      addEventListener(...e) { n(this[h], ['sourceBuffers', 'addEventListener'], e, 3); }

      removeEventListener(...e) { n(this[h], ['sourceBuffers', 'removeEventListener'], e, 3); }
    }); const x = v(b, 'SourceBuffer', (T = class extends u {
      constructor(e) { super(e[o], e[d], ['sourceBuffers']), this[y] = [], this[h] = e; }

      abort() { const e = R(this); n(this, [e, 'appendWindowStart'], m, 1); }

      addEventListener(...e) { const t = R(this); n(this, [t, 'addEventListener'], e, 3); }

      appendBuffer(e) { this[g].push(['appendBuffer', [e], e]), M(this); }

      get appendWindowStart() { const e = R(this); return t(this, [e, 'appendWindowStart']); }

      set appendWindowStart(e) { const t = R(this); s(this, [t, 'appendWindowStart'], e); }

      get appendWindowEnd() { const e = R(this); return t(this, [e, 'appendWindowEnd']); }

      set appendWindowEnd(e) { const t = R(this); s(this, [t, 'appendWindowEnd'], e); }

      get buffered() { const e = this[h]; const t = R(this); return new B(e[o], e[d], ['sourceBuffers', t, 'buffered']); }

      changeType(e) { const t = R(this); n(this, [t, 'changeType'], [e], 2); }

      get mode() { const e = R(this); return t(this, [e, 'mode']); }

      set mode(e) { const t = R(this); s(this, [t, 'mode'], e); }

      remove(e, t) { this[g].push(['remove', [e, t]]), M(this); }

      removeEventListener(...e) { const t = R(this); n(this, [t, 'removeEventListener'], e, 3); }

      get timestampOffset() { const e = R(this); return t(this, [e, 'timestampOffset']); }

      set timestampOffset(e) { const t = R(this); s(this, [t, 'timestampOffset'], e); }

      get updating() { const e = R(this); return t(this, [e, 'updating']); }
    }, y = g, T)); const B = v(b, 'TimeRanges', class extends e {
      start(...e) { return n(this, ['start'], e); }

      end(...e) { return n(this, ['end'], e); }

      get length() { return t(this, ['length']); }
    }); const R = (e) => (e ? e[h][p].indexOf(e) : -1); const M = (e) => { if (e[g].length) { if (!e.updating) { const t = e[g].shift(); if (t) { const s = R(e); n(e, [s, t[0]], t[1], 3, void 0, t[2]); } }setTimeout((() => M(e)), 50); } }; const W = { buffered: { get() { return this[l] || (this[l] = new B(this[o], this[d], ['buffered']), setTimeout((() => { this[l] = void 0; }), 5e3)), this[l]; } }, readyState: { get() { return this[f] === 4 ? 4 : (typeof this[f] !== 'number' && (this[f] = t(this, ['readyState']), setTimeout((() => { this[f] = void 0; }), 1e3)), this[f]); } } }; v(b, 'MediaSource', class extends u {
      constructor() { super(c.V), this[p] = new k(this), r(this, 'MediaSource', m); }

      get activeSourceBuffers() { return []; }

      addSourceBuffer(e) { const t = new x(this); return this[p].push(t), n(this, ['addSourceBuffer'], [e]), t; }

      clearLiveSeekableRange() { n(this, ['clearLiveSeekableRange'], m, 2); }

      get duration() { return t(this, ['duration']); }

      set duration(e) { s(this, ['duration'], e); }

      endOfStream(e) { n(this, ['endOfStream'], [e], 3); }

      get readyState() { return t(this, ['readyState']); }

      removeSourceBuffer(e) { const t = R(e); t > -1 && (this[p].splice(t, 1), n(this, ['removeSourceBuffer'], [t], 1)); }

      setLiveSeekableRange(e, t) { n(this, ['setLiveSeekableRange'], [e, t], 2); }

      get sourceBuffers() { return this[p]; }

      static isTypeSupported(e) { if (!L.has(e)) { const t = n(b, ['MediaSource', 'isTypeSupported'], [e]); L.set(e, t); } return L.get(e); }
    }); const C = b.URL = S('URL', class extends URL {}); 'audioTracks' in b.HTMLMediaElement.prototype && (v(b, 'AudioTrackList', E), v(b, 'AudioTrack', w), W.audioTracks = { get() { return new E(this); } }), i(b.HTMLMediaElement, W), C.createObjectURL = (e) => n(b, ['URL', 'createObjectURL'], [e]), C.revokeObjectURL = (e) => n(b, ['URL', 'revokeObjectURL'], [e]);
  }; const L = new Map(); e.f = (e, t, s, n, r) => { r.map(((e) => { delete n[e]; })), b(e, n), y(e, t, s, n); };
})(self);
