/* Odred izviđača „Mihajlovac“ – animacije i interakcije (bez React-a) */
(function () {
  "use strict";
  var React = { createRef: function () { return { current: null }; } };
  class DCLogic {
    constructor() { this.props = {}; }
    setState(u, cb) { var v = typeof u === "function" ? u(this.state || {}) : u; this.state = Object.assign({}, this.state, v); if (cb) cb(); }
  }
class Component extends DCLogic {
  startAttention() {
    if (typeof window === "undefined" || !Element.prototype.animate) return;
    const anims = [];
    const blues = ["rgb(28, 91, 150)", "rgb(158, 203, 240)"];
    const oranges = ["rgb(194, 84, 13)", "rgb(224, 101, 26)"];
    let si = 0, pi = 0;
    // Presijavanje plavih natpisa (01 · O nama, 02 · ...) na svakih 10 s
    const shine = (el) => {
      el.setAttribute("data-shine", "");
      const c = getComputedStyle(el).color;
      const onDark = c === blues[1];
      const mid = onDark ? "#d9eeff" : "#3d9bf0";
      const hi = onDark ? "#ffffff" : "#b9dcff";
      el.style.backgroundImage = "linear-gradient(100deg, " + c + " 0%, " + c + " 40%, " + mid + " 46%, " + hi + " 50%, " + mid + " 54%, " + c + " 60%, " + c + " 100%)";
      el.style.backgroundSize = "250% 100%";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "100% 0";
      el.style.webkitBackgroundClip = "text";
      el.style.backgroundClip = "text";
      el.style.webkitTextFillColor = "transparent";
      anims.push(el.animate([
        { backgroundPosition: "100% 0", offset: 0, easing: "cubic-bezier(.45,0,.25,1)" },
        { backgroundPosition: "0% 0", offset: 0.34 },
        { backgroundPosition: "0% 0", offset: 1 }
      ], { duration: 10000, iterations: Infinity, delay: 1200 + (si++ % 6) * 200 }));
    };
    // Narandžasta dugmad: sjaj iza dugmeta + blago povećanje na ~5 s
    const pulse = (el) => {
      el.setAttribute("data-attn", "");
      anims.push(el.animate([
        { scale: "1", filter: "drop-shadow(0 0 3px rgba(240,120,40,0.25))", offset: 0, easing: "ease-in-out" },
        { scale: "1.05", filter: "drop-shadow(0 0 18px rgba(240,120,40,0.75))", offset: 0.5, easing: "ease-in-out" },
        { scale: "1", filter: "drop-shadow(0 0 3px rgba(240,120,40,0.25))", offset: 1 }
      ], { duration: 2400, iterations: Infinity, delay: (pi % 5) * 300 }));
      anims.push(el.animate([
        { outline: "2px solid rgba(240,151,63,0.6)", outlineOffset: "0px", offset: 0, easing: "ease-out" },
        { outline: "2px solid rgba(240,151,63,0)", outlineOffset: "16px", offset: 1 }
      ], { duration: 2400, iterations: Infinity, delay: (pi++ % 5) * 300 + 1200 }));
    };
    const scan = () => {
      const els = document.querySelectorAll("div, span, a, button");
      for (let k = 0; k < els.length; k++) {
        const el = els[k];
        if (el.hasAttribute("data-shine") || el.hasAttribute("data-attn")) continue;
        const cs = getComputedStyle(el);
        if ((el.tagName === "A" || el.tagName === "BUTTON") && oranges.indexOf(cs.backgroundColor) !== -1) { pulse(el); continue; }
        if (el.children.length === 0 && cs.textTransform === "uppercase" && blues.indexOf(cs.color) !== -1 &&
            cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.backgroundImage === "none" && (el.textContent || "").trim().length > 2) shine(el);
      }
    };
    scan();
    const iv = setInterval(scan, 3000);
    this.attnStop = () => { clearInterval(iv); anims.forEach((a) => { try { a.cancel(); } catch (e) {} }); };
  }
  leafBg(sec, canvas) {
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    if (!sec || !ctx || typeof Path2D === "undefined") return () => {};
    const P = (d) => new Path2D(d);
    const fern = () => {
      let d = "M0 -18 L0 20";
      for (let y = -13, k = 0; y <= 9; y += 3.6, k++) { const L = 4 + k * 1.25; d += " M0 " + y.toFixed(1) + " q" + (L * 0.6).toFixed(1) + " -1 " + L.toFixed(1) + " -" + (L * 0.55).toFixed(1) + " M0 " + y.toFixed(1) + " q-" + (L * 0.6).toFixed(1) + " -1 -" + L.toFixed(1) + " -" + (L * 0.55).toFixed(1); }
      return d;
    };
    const serrated = () => {
      const pts = []; const N = 9;
      for (let i = 0; i <= N; i++) { const t = i / N, y = -18 + t * 33, w = Math.sin(Math.PI * Math.min(1, t * 1.08)) * 10.5; pts.push([w + (i % 2 ? 1.6 : 0), y]); }
      let d = "M0 -18";
      for (const q of pts) d += " L" + q[0].toFixed(1) + " " + q[1].toFixed(1);
      for (let i = pts.length - 1; i >= 0; i--) d += " L" + (-pts[i][0]).toFixed(1) + " " + pts[i][1].toFixed(1);
      d += " Z M0 -16 L0 20";
      for (let y = -10; y <= 8; y += 4.5) d += " M0 " + y + " L" + (6 + y * 0.1).toFixed(1) + " " + (y - 3) + " M0 " + y + " L" + (-6 - y * 0.1).toFixed(1) + " " + (y - 3);
      return d;
    };
    const sprig = () => {
      let d = "M0 -14 L0 20 M0 -14 m-2.2 -3.6 a2.2 3.6 0 1 0 4.4 0 a2.2 3.6 0 1 0 -4.4 0";
      for (const y of [-9, -2, 5]) { d += " M0 " + y + " q4 -1 7.5 -4.5 q-4.2 -0.8 -7.5 4.5 M0 " + y + " q-4 -1 -7.5 -4.5 q4.2 -0.8 7.5 4.5"; }
      return d;
    };
    const LEAVES = [
      "M0 -18 C8 -10 16 -2 13 8 C11 14 4 14 0 11 C-4 14 -11 14 -13 8 C-16 -2 -8 -10 0 -18 Z M0 -16 L0 20 M0 -8 L6.5 -4 M0 -8 L-6.5 -4 M0 -1 L9 3 M0 -1 L-9 3 M0 6 L8.5 9 M0 6 L-8.5 9",
      fern(),
      sprig(),
      "M0 -18 C4.5 -8 4.5 7 0 15 C-4.5 7 -4.5 -8 0 -18 Z M0 -15 L0 20 M0 -6 L2.6 -9 M0 -6 L-2.6 -9 M0 1 L3 -2 M0 1 L-3 -2 M0 8 L2.6 5 M0 8 L-2.6 5",
      "M0 -18 C10 -8 10 8 0 16 C-10 8 -10 -8 0 -18 Z M0 -16 L0 20 M0 -10 L4.5 -13 M0 -10 L-4.5 -13 M0 -4 L6.5 -8 M0 -4 L-6.5 -8 M0 2 L7 -2 M0 2 L-7 -2 M0 8 L5.5 5 M0 8 L-5.5 5",
      "M0 -18 Q5 -18 5 -13 Q10 -13 9 -8 Q5 -6 9 -3 Q13 0 10 4 Q6 5 8 9 Q6 14 1 13 L0 15 L-1 13 Q-6 14 -8 9 Q-6 5 -10 4 Q-13 0 -9 -3 Q-5 -6 -9 -8 Q-10 -13 -5 -13 Q-5 -18 0 -18 Z M0 -15 L0 20 M0 -8 L5 -10 M0 -1 L7 -3 M0 6 L5 4 M0 -4 L-6 -6 M0 3 L-6 1",
      "M0 -20 C3.6 -10 3.6 9 0 16 C-3.6 9 -3.6 -10 0 -20 Z M0 -17 L0 20 M0 -11 L2 -13.5 M0 -11 L-2 -13.5 M0 -5 L2.6 -8 M0 -5 L-2.6 -8 M0 1 L2.6 -2 M0 1 L-2.6 -2 M0 7 L2.2 4.5 M0 7 L-2.2 4.5",
      serrated()
    ].map(P);
    const inks = ["20,38,27", "45,90,58", "45,90,58", "28,91,150", "164,67,10"];
    const dotCols = ["45,90,58", "224,101,26", "28,91,150"];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const off = rnd(0, 100);
    let W = 0, H = 0, dpr = 1, leaves = [], dots = [], visible = false, raf = 0, last = 0;
    const seed = () => {
      const m = Math.round(Math.min(70, Math.max(18, (W * H) / 15000)));
      leaves = [];
      for (let k = 0; k < m; k++) {
        leaves.push({ x: rnd(-20, W + 20), y: rnd(-20, H + 20), vy: rnd(9, 22), vx: rnd(-3, 5), amp: rnd(14, 42), ph: rnd(0, 6.28), sp: rnd(0.35, 0.8),
          rot: rnd(-0.9, 0.9), spin: rnd(-0.35, 0.35), wob: rnd(0.25, 0.6), s: rnd(0.34, 0.62), shape: k % LEAVES.length,
          a: rnd(0.15, 0.32), c: inks[k % inks.length], flip: Math.random() < 0.5 ? -1 : 1 });
      }
      dots = [];
      const nd = W < 760 ? 8 : 14;
      for (let k = 0; k < nd; k++) dots.push({ x: rnd(0, W), y: rnd(0, H), vy: rnd(5, 12), amp: rnd(8, 22), ph: rnd(0, 6.28), sp: rnd(0.25, 0.6), r: rnd(1.2, 2.4), a: rnd(0.1, 0.2), c: dotCols[k % dotCols.length] });
    };
    const size = () => {
      const r = sec.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const nw = Math.round(r.width), nh = Math.round(r.height);
      if (!nw || !nh || (nw === W && nh === H)) return;
      const grew = W && nw === W;
      W = nw; H = nh;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      if (!grew || !leaves.length) seed();
    };
    size();
    let io = null, ro = null;
    if ("IntersectionObserver" in window) { io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: "120px" }); io.observe(sec); } else visible = true;
    if ("ResizeObserver" in window) { ro = new ResizeObserver(() => size()); ro.observe(sec); }
    const onR = () => size();
    window.addEventListener("resize", onR);
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      if (!visible || !W) return;
      const t = now / 1000 + off;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const M = Math.max(W, H);
      const blobs = [
        [0.2 + 0.08 * Math.sin(t * 0.06), 0.3 + 0.12 * Math.cos(t * 0.05), 0.4, "45,90,58", 0.05],
        [0.8 + 0.08 * Math.cos(t * 0.045), 0.7 + 0.1 * Math.sin(t * 0.07), 0.35, "224,101,26", 0.04]
      ];
      for (const b of blobs) {
        const x = b[0] * W, y = b[1] * H, r = b[2] * M;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + b[3] + "," + b[4] + ")");
        g.addColorStop(1, "rgba(" + b[3] + ",0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      for (const p of dots) {
        p.y -= p.vy * dt;
        if (p.y < -12) { p.y = H + 12; p.x = rnd(0, W); }
        ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
        ctx.beginPath(); ctx.arc(p.x + Math.sin(t * p.sp + p.ph) * p.amp, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const L of leaves) {
        L.y += L.vy * dt; L.x += L.vx * dt; L.rot += L.spin * dt;
        if (L.y > H + 24) { L.y = -24; L.x = rnd(-20, W + 20); }
        if (L.x > W + 40) L.x = -30; else if (L.x < -40) L.x = W + 30;
        const sw = Math.sin(t * L.sp + L.ph);
        ctx.save();
        ctx.translate(L.x + sw * L.amp, L.y);
        ctx.rotate(L.rot + sw * L.wob);
        ctx.scale(L.s * L.flip * (0.82 + 0.18 * Math.cos(t * L.sp * 1.3 + L.ph)), L.s);
        ctx.lineWidth = 1.25 / L.s;
        ctx.strokeStyle = "rgba(" + L.c + "," + L.a + ")";
        ctx.stroke(LEAVES[L.shape]);
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); if (io) io.disconnect(); if (ro) ro.disconnect(); };
  }
  startLeafBgs() {
    if (typeof window === "undefined") return;
    (this.leafStops || []).forEach((f) => f());
    this.leafStops = [];
    Array.prototype.forEach.call(document.querySelectorAll("canvas[data-leaves]"), (c) => { this.leafStops.push(this.leafBg(c.parentElement, c)); });
  }
  state = { sent: false, sending: false, error: "", isMobile: false, menuOpen: false, staffIndex: 0 };


  componentDidMount() {
    this.syncViewport();
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const root = document.documentElement;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      let tries = 0;
      const jump = () => {
        const el = document.getElementById(id);
        if (el) {
          window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - 70);
          if (++tries > 6) { root.style.scrollBehavior = prevBehavior; return; }
        } else if (++tries > 20) { root.style.scrollBehavior = prevBehavior; return; }
        this.hashTimer = setTimeout(jump, 60);
      };
      jump();
    }
    this.onResize = () => this.syncViewport();
    window.addEventListener("resize", this.onResize);
    this.revealTimer = setTimeout(() => this.setupReveal(), 120);
    this.countTimer = setTimeout(() => this.setupCounters(), 140);
    this.faqTimer = setTimeout(() => this.setupFaqHover(), 160);
    this.aboutTimer = setTimeout(() => this.startAbout(), 180);
    this.leafTimer = setTimeout(() => this.startLeafBgs(), 220);
    this.attnTimer = setTimeout(() => this.startAttention(), 500);
  }
  startAbout() {
    if (typeof window === "undefined") return;
    const sec = document.getElementById("o-nama");
    if (!sec) return;
    const canvas = sec.querySelector("[data-onama-bg]");
    const emblem = sec.querySelector("[data-float]");
    const shadow = sec.querySelector("[data-float-shadow]");
    const glow = sec.querySelector("[data-float-glow]");
    const hand = sec.querySelector("[data-clock-hand]");
    const flag = sec.querySelector("[data-flag]");
    const rays = sec.querySelector("[data-sun-rays]");
    const pulse = sec.querySelector("[data-pulse]");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    let W = 0, H = 0, dpr = 1, parts = [], visible = true, raf = 0;
    const cols = ["45,90,58", "45,90,58", "224,101,26", "28,91,150"];
    const rnd = (a, b) => a + Math.random() * (b - a);
    // Ručno nacrtani listići (linijski crtež), jedinica: list visok ~40, peteljka dole
    const P = (d) => (typeof Path2D !== "undefined" ? new Path2D(d) : null);
    const fern = () => {
      let d = "M0 -18 L0 20";
      for (let y = -13, k = 0; y <= 9; y += 3.6, k++) { const L = 4 + k * 1.25; d += " M0 " + y.toFixed(1) + " q" + (L * 0.6).toFixed(1) + " -1 " + L.toFixed(1) + " -" + (L * 0.55).toFixed(1) + " M0 " + y.toFixed(1) + " q-" + (L * 0.6).toFixed(1) + " -1 -" + L.toFixed(1) + " -" + (L * 0.55).toFixed(1); }
      return d;
    };
    const serrated = () => {
      const pts = []; const N = 9;
      for (let i = 0; i <= N; i++) { const t = i / N, y = -18 + t * 33, w = Math.sin(Math.PI * Math.min(1, t * 1.08)) * 10.5; pts.push([w + (i % 2 ? 1.6 : 0), y]); }
      let d = "M0 -18";
      for (const q of pts) d += " L" + q[0].toFixed(1) + " " + q[1].toFixed(1);
      for (let i = pts.length - 1; i >= 0; i--) d += " L" + (-pts[i][0]).toFixed(1) + " " + pts[i][1].toFixed(1);
      d += " Z M0 -16 L0 20";
      for (let y = -10; y <= 8; y += 4.5) d += " M0 " + y + " L" + (6 + y * 0.1).toFixed(1) + " " + (y - 3) + " M0 " + y + " L" + (-6 - y * 0.1).toFixed(1) + " " + (y - 3);
      return d;
    };
    const sprig = () => {
      let d = "M0 -14 L0 20 M0 -14 m-2.2 -3.6 a2.2 3.6 0 1 0 4.4 0 a2.2 3.6 0 1 0 -4.4 0";
      for (const y of [-9, -2, 5]) { d += " M0 " + y + " q4 -1 7.5 -4.5 q-4.2 -0.8 -7.5 4.5 M0 " + y + " q-4 -1 -7.5 -4.5 q4.2 -0.8 7.5 4.5"; }
      return d;
    };
    const LEAVES = [
      "M0 -18 C8 -10 16 -2 13 8 C11 14 4 14 0 11 C-4 14 -11 14 -13 8 C-16 -2 -8 -10 0 -18 Z M0 -16 L0 20 M0 -8 L6.5 -4 M0 -8 L-6.5 -4 M0 -1 L9 3 M0 -1 L-9 3 M0 6 L8.5 9 M0 6 L-8.5 9",
      fern(),
      sprig(),
      "M0 -18 C4.5 -8 4.5 7 0 15 C-4.5 7 -4.5 -8 0 -18 Z M0 -15 L0 20 M0 -6 L2.6 -9 M0 -6 L-2.6 -9 M0 1 L3 -2 M0 1 L-3 -2 M0 8 L2.6 5 M0 8 L-2.6 5",
      "M0 -18 C10 -8 10 8 0 16 C-10 8 -10 -8 0 -18 Z M0 -16 L0 20 M0 -10 L4.5 -13 M0 -10 L-4.5 -13 M0 -4 L6.5 -8 M0 -4 L-6.5 -8 M0 2 L7 -2 M0 2 L-7 -2 M0 8 L5.5 5 M0 8 L-5.5 5",
      "M0 -18 Q5 -18 5 -13 Q10 -13 9 -8 Q5 -6 9 -3 Q13 0 10 4 Q6 5 8 9 Q6 14 1 13 L0 15 L-1 13 Q-6 14 -8 9 Q-6 5 -10 4 Q-13 0 -9 -3 Q-5 -6 -9 -8 Q-10 -13 -5 -13 Q-5 -18 0 -18 Z M0 -15 L0 20 M0 -8 L5 -10 M0 -1 L7 -3 M0 6 L5 4 M0 -4 L-6 -6 M0 3 L-6 1",
      "M0 -20 C3.6 -10 3.6 9 0 16 C-3.6 9 -3.6 -10 0 -20 Z M0 -17 L0 20 M0 -11 L2 -13.5 M0 -11 L-2 -13.5 M0 -5 L2.6 -8 M0 -5 L-2.6 -8 M0 1 L2.6 -2 M0 1 L-2.6 -2 M0 7 L2.2 4.5 M0 7 L-2.2 4.5",
      serrated()
    ].map(P);
    const inks = ["20,38,27", "45,90,58", "45,90,58", "28,91,150", "164,67,10"];
    let leaves = [];
    const seed = () => {
      const n = W < 760 ? 10 : 18;
      parts = [];
      for (let k = 0; k < n; k++) {
        parts.push({ x: rnd(0, W), y: rnd(0, H), vy: rnd(5, 14), amp: rnd(8, 26), ph: rnd(0, 6.28), sp: rnd(0.25, 0.6),
          leaf: false, r: rnd(1.2, 2.6), rot: 0, vr: 0, a: rnd(0.1, 0.22), c: cols[k % cols.length] });
      }
      const m = Math.round(Math.min(70, Math.max(22, (W * H) / 15000)));
      leaves = [];
      for (let k = 0; k < m; k++) {
        leaves.push({ x: rnd(-20, W + 20), y: rnd(-20, H + 20), vy: rnd(9, 22), vx: rnd(-3, 5), amp: rnd(14, 42), ph: rnd(0, 6.28), sp: rnd(0.35, 0.8),
          rot: rnd(-0.9, 0.9), spin: rnd(-0.35, 0.35), wob: rnd(0.25, 0.6), s: rnd(0.34, 0.62), shape: k % LEAVES.length,
          a: rnd(0.16, 0.34), c: inks[k % inks.length], flip: Math.random() < 0.5 ? -1 : 1 });
      }
    };
    const size = () => {
      if (!canvas) return;
      const r = sec.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const nw = Math.round(r.width), nh = Math.round(r.height);
      if (nw === W && nh === H) return;
      W = nw; H = nh;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      seed();
    };
    size();
    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: "120px" });
      io.observe(sec);
    }
    const onR = () => size();
    window.addEventListener("resize", onR);
    const t0 = performance.now();
    let last = t0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!visible) return;
      const t = (now - t0) / 1000;
      if (emblem) {
        const y = Math.sin(t * 0.9) * 7, rot = Math.sin(t * 0.55) * 1.6;
        emblem.style.transform = "translate3d(0," + y.toFixed(2) + "px,0) rotate(" + rot.toFixed(2) + "deg)";
        if (shadow) { const k = (y + 7) / 14; shadow.style.transform = "scale(" + (1.08 - k * 0.16).toFixed(3) + ")"; shadow.style.opacity = (0.95 - k * 0.35).toFixed(3); }
        if (glow) glow.style.transform = "scale(" + (1 + Math.sin(t * 0.7) * 0.04).toFixed(3) + ")";
      }
      if (hand) hand.setAttribute("transform", "rotate(" + ((t * 30) % 360).toFixed(1) + " 12 12)");
      if (flag) { const s = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(t * 3.2)); flag.setAttribute("transform", "translate(9.5 0) scale(" + s.toFixed(3) + " 1) translate(-9.5 0)"); }
      if (rays) rays.setAttribute("transform", "rotate(" + ((t * 18) % 360).toFixed(1) + " 17 6.5)");
      if (pulse) { const q = 0.5 + 0.5 * Math.sin(t * 2.4); pulse.style.opacity = (0.45 + 0.55 * q).toFixed(3); }
      if (!ctx || !W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const blobs = [
        [0.18 + 0.07 * Math.sin(t * 0.06), 0.35 + 0.12 * Math.cos(t * 0.05), 0.42, "45,90,58", 0.07],
        [0.78 + 0.08 * Math.cos(t * 0.045), 0.25 + 0.1 * Math.sin(t * 0.07), 0.36, "28,91,150", 0.05],
        [0.6 + 0.1 * Math.sin(t * 0.05 + 1.3), 0.85 + 0.08 * Math.cos(t * 0.06), 0.38, "224,101,26", 0.055]
      ];
      const M = Math.max(W, H);
      for (const b of blobs) {
        const x = b[0] * W, y = b[1] * H, r = b[2] * M;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(" + b[3] + "," + b[4] + ")");
        g.addColorStop(1, "rgba(" + b[3] + ",0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      for (const p of parts) {
        p.y -= p.vy * dt;
        if (p.y < -12) { p.y = H + 12; p.x = rnd(0, W); }
        const x = p.x + Math.sin(t * p.sp + p.ph) * p.amp;
        ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (const L of leaves) {
        L.y += L.vy * dt; L.x += L.vx * dt; L.rot += L.spin * dt;
        if (L.y > H + 24) { L.y = -24; L.x = rnd(-20, W + 20); }
        if (L.x > W + 40) L.x = -30; else if (L.x < -40) L.x = W + 30;
        const sw = Math.sin(t * L.sp + L.ph);
        const path = LEAVES[L.shape];
        if (!path) continue;
        ctx.save();
        ctx.translate(L.x + sw * L.amp, L.y);
        ctx.rotate(L.rot + sw * L.wob);
        ctx.scale(L.s * L.flip * (0.82 + 0.18 * Math.cos(t * L.sp * 1.3 + L.ph)), L.s);
        ctx.lineWidth = 1.25 / L.s;
        ctx.strokeStyle = "rgba(" + L.c + "," + L.a + ")";
        ctx.stroke(path);
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);
    this.aboutStop = () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); if (io) io.disconnect(); };
  }
  setupFaqHover() {
    const rows = Array.prototype.slice.call(document.querySelectorAll("[data-faq]"));
    rows.forEach((row) => {
      if (row.__faqBound) return;
      row.__faqBound = true;
      const num = row.children[0];
      if (num) num.__c0 = num.style.color;
      const body = row.children[1];
      const q = body && body.children[0];
      const a = body && body.children[1];
      [num, q, a].forEach((el) => {
        if (el) el.style.transition = "transform 380ms cubic-bezier(.22,.61,.36,1), color 300ms ease, letter-spacing 380ms ease";
      });
      row.addEventListener("mouseenter", () => {
        if (num) { num.style.transform = "scale(1.12)"; num.style.color = "#e0651a"; }
        if (q) { q.style.transform = "translateX(8px)"; q.style.color = "#a4430a"; q.style.letterSpacing = "0.01em"; }
        if (a) { a.style.transform = "translateX(8px)"; a.style.color = "rgba(20,38,27,0.85)"; }
      });
      row.addEventListener("mouseleave", () => {
        if (num) { num.style.transform = "none"; num.style.color = num.__c0; }
        if (q) { q.style.transform = "none"; q.style.color = ""; q.style.letterSpacing = ""; }
        if (a) { a.style.transform = "none"; a.style.color = "rgba(20,38,27,0.68)"; }
      });
    });
  }
  setupCounters() {
    const els = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!els.length) return;
    els.forEach((el, i) => {
      const label = el.nextElementSibling;
      el.style.opacity = "0";
      el.style.filter = "blur(4px)";
      el.style.transform = "translateY(52px)";
      el.style.willChange = "transform, opacity";
      el.style.transition = "opacity 800ms ease, filter 800ms ease, transform 1200ms cubic-bezier(.16,.84,.24,1)";
      if (label) {
        label.style.opacity = "0";
        label.style.transform = "translateY(20px)";
        label.style.transition = "opacity 700ms ease 320ms, transform 700ms cubic-bezier(.16,.84,.24,1) 320ms";
      }
    });
    const enter = (el) => {
      const label = el.nextElementSibling;
      void el.offsetHeight;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.transform = "none";
        if (label) { label.style.opacity = "1"; label.style.transform = "none"; }
      }));
    };
    const run = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      enter(el);
      if (!target) return;
      const dur = 2800;
      let t0 = performance.now();
      el.textContent = "0";
      const step = (t) => {
        if (t < t0) { requestAnimationFrame(step); return; }
        const p = Math.min(1, (t - t0) / dur);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      };
      requestAnimationFrame(step);
    };
    if (!window.IntersectionObserver) { els.forEach(run); return; }
    this.cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        els.forEach(run);
        this.cio.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    this.cio.observe(els[0]);
  }
  setupReveal() {
    const root = this.host || document;
    const targets = [];
    root.querySelectorAll("section").forEach((sec) => { if (sec.classList.contains("m-hero")) return;
      Array.prototype.forEach.call(sec.children, (el) => targets.push(el));
    });
    if (!targets.length || !window.IntersectionObserver) return;
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(26px)";
      el.style.transition = "opacity 760ms cubic-bezier(.22,.61,.36,1), transform 760ms cubic-bezier(.22,.61,.36,1)";
    });
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = targets.indexOf(e.target);
        e.target.style.transitionDelay = (i % 3) * 90 + "ms";
        e.target.style.opacity = "1";
        e.target.style.transform = "none";
        this.io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    targets.forEach((el) => this.io.observe(el));
  }
  animateMenu(open) {
    if (typeof window === "undefined") return;
    const wrap = document.querySelector("[data-mnav]");
    if (!wrap) return;
    const isOpen = wrap.getAttribute("data-open") === "1";
    if (open === isOpen) return;
    const btn = document.querySelector("[data-mnav-btn]");
    const ease = "cubic-bezier(.22,.61,.36,1)";
    (this.menuAnims || []).forEach((a) => { try { a.cancel(); } catch (e) {} });
    this.menuAnims = [];
    const from = wrap.getBoundingClientRect().height;
    wrap.style.visibility = "visible";
    wrap.style.height = "auto";
    const full = wrap.getBoundingClientRect().height;
    const to = open ? full : 0;
    wrap.style.height = open ? "auto" : "0px";
    wrap.setAttribute("data-open", open ? "1" : "0");
    wrap.setAttribute("aria-hidden", open ? "false" : "true");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    const run = (el, frames, opts) => { if (el && el.animate) this.menuAnims.push(el.animate(frames, opts)); };
    if (wrap.animate) {
      const a = wrap.animate([{ height: from + "px" }, { height: to + "px" }], { duration: open ? 460 : 320, easing: open ? "cubic-bezier(.2,.85,.25,1)" : ease });
      a.onfinish = () => { if (wrap.getAttribute("data-open") !== "1") wrap.style.visibility = "hidden"; };
      this.menuAnims.push(a);
    } else if (!open) wrap.style.visibility = "hidden";
    const nav = wrap.firstElementChild;
    if (open) {
      run(nav, [{ opacity: 0, transform: "translateY(-16px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: ease, fill: "both" });
      wrap.querySelectorAll("a").forEach((el, i) => run(el, [{ opacity: 0, transform: "translateY(-12px)" }, { opacity: 1, transform: "none" }], { duration: 360, delay: 90 + i * 65, easing: ease, fill: "backwards" }));
    } else {
      run(nav, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-10px)" }], { duration: 260, easing: ease, fill: "both" });
    }
    if (btn) {
      const bars = btn.querySelectorAll("span");
      const X = [
        ["translateY(7px) rotate(45deg)", 1],
        ["scaleX(0.2)", 0],
        ["translateY(-7px) rotate(-45deg)", 1]
      ];
      bars.forEach((b, i) => {
        const on = { transform: X[i][0], opacity: X[i][1] };
        const off = { transform: "none", opacity: 1 };
        run(b, open ? [off, on] : [on, off], { duration: 320, easing: ease, fill: "forwards" });
      });
    }
  }
  syncViewport() {
    const isMobile = window.innerWidth <= 760;
    if (isMobile !== this.state.isMobile) this.setState({ isMobile, menuOpen: false });
  }
  refIme = React.createRef();
  refGodine = React.createRef();
  refGrupa = React.createRef();
  refKontakt = React.createRef();
  refNapomena = React.createRef();
}
  var c = new Component();
  c.componentDidMount();

  // mobile menu
  var mbtn = document.querySelector("[data-mnav-btn]");
  if (mbtn) mbtn.addEventListener("click", function () { var w = document.querySelector("[data-mnav]"); c.animateMenu(!(w && w.getAttribute("data-open") === "1")); });
  document.querySelectorAll("[data-mnav] a").forEach(function (a) { a.addEventListener("click", function () { c.animateMenu(false); }); });

  // staff carousel
  (function () {
    var track = document.querySelector("[data-staff-track]");
    if (!track) return;
    var view = document.querySelector("[data-staff-viewport]");
    var cards = [].slice.call(track.querySelectorAll("[data-staff-card]"));
    var prev = document.querySelector('button[aria-label="Prethodni članovi"]');
    var next = document.querySelector('button[aria-label="Sledeći članovi"]');
    var idx = 0;
    var per = function () { return window.innerWidth <= 1000 ? 2 : 4; };
    var gap = function () { return window.innerWidth <= 640 ? 12 : 20; };
    var render = function () {
      var p = per(), g = gap();
      idx = Math.min(idx, Math.max(0, cards.length - p));
      var w = "((100% - " + (p - 1) * g + "px) / " + p + ")";
      track.style.gap = g + "px";
      track.style.transform = "translateX(calc((" + w + " + " + g + "px) * " + (-idx) + "))";
      cards.forEach(function (el, i) {
        var vis = i >= idx && i < idx + p;
        el.style.flex = "0 0 calc" + w;
        el.style.opacity = vis ? "1" : "0";
        el.style.transform = vis ? "none" : (i < idx ? "translateX(-18px) scale(0.94)" : "translateX(18px) scale(0.94)");
        el.setAttribute("aria-hidden", vis ? "false" : "true");
      });
    };
    if (view) view.style.overflow = "hidden";
    if (prev) prev.addEventListener("click", function () { idx = Math.max(0, idx - 1); render(); });
    if (next) next.addEventListener("click", function () { idx = Math.min(Math.max(0, cards.length - per()), idx + 1); render(); });
    window.addEventListener("resize", render);
    render();
  })();

  // enrollment form (works without JS as a normal POST; with JS it stays on the page)
  (function () {
    var form = document.querySelector("[data-enroll]");
    if (!form || !window.fetch) return;
    form.noValidate = true;
    var btn = form.querySelector("[data-enroll-btn]");
    var label = btn && btn.firstElementChild;
    var ok = form.querySelector("[data-enroll-ok]");
    var err = form.querySelector("[data-enroll-err]");
    var age = form.querySelector('input[type="number"]');
    var sending = false;
    var field = function (n) { var e = form.elements[n]; return e && e.value ? e.value.trim() : ""; };
    var setLabel = function (t) { if (label) label.textContent = t; };
    var showErr = function (t) { err.textContent = t; err.hidden = !t; };
    if (age) {
      age.addEventListener("keydown", function (e) { if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") e.preventDefault(); });
      age.addEventListener("input", function (e) { var v = e.target.value.replace(/[^0-9]/g, ""); if (v !== "") v = String(Math.min(99, parseInt(v, 10))); if (e.target.value !== v) e.target.value = v; });
      age.addEventListener("blur", function (e) { var v = e.target.value.replace(/[^0-9]/g, ""); if (v !== "" && parseInt(v, 10) < 6) e.target.value = "6"; });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;
      var ime = field("Ime i prezime"), kontakt = field("Kontakt");
      ok.hidden = true;
      if (!ime || !kontakt) { showErr("Unesite ime i kontakt."); return; }
      showErr(""); sending = true; setLabel("Šaljemo…");
      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ _subject: "Prijava deteta: " + ime, "Ime i prezime": ime, "Godine": field("Godine") || "nije uneto", "Kontakt": kontakt, "Napomena": field("Napomena") || "nije uneto" })
      }).then(function (res) {
        if (!res.ok) throw new Error("status " + res.status);
        ["Ime i prezime", "Godine", "Kontakt", "Napomena"].forEach(function (n) { if (form.elements[n]) form.elements[n].value = ""; });
        sending = false; setLabel("Prijava poslata ✓"); ok.hidden = false;
      }).catch(function () {
        sending = false; setLabel("Pošalji prijavu");
        showErr("Slanje nije uspelo. Pišite nam na odredizvidjacamihajlovac@gmail.com.");
      });
    });
  })();
})();
