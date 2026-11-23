/* Odred izviđača „Mihajlovac“ – animacije i interakcije (bez React-a) */
(function () {
  "use strict";
  var React = { createRef: function () { return { current: null }; } };
  class DCLogic {
    constructor() { this.props = {}; }
    setState(u, cb) { var v = typeof u === "function" ? u(this.state || {}) : u; this.state = Object.assign({}, this.state, v); if (cb) cb(); }
  }
class Component extends DCLogic {
  setupStatFx() {
    if (typeof window === "undefined") return;
    const cards = Array.prototype.slice.call(document.querySelectorAll(".a-stat"));
    const st = cards.map((el, i) => ({ el, i, spot: el.querySelector("[data-spot]"), bg0: el.style.background, sh0: el.style.boxShadow, hov: false, rx: 0, ry: 0, trx: 0, try_: 0, lift: 0, ready: false, since: 0 }));
    const handlers = [];
    st.forEach((s) => {
      const a = () => { s.hov = true; if (s.spot) s.spot.style.opacity = "1"; s.el.style.boxShadow = "0 24px 46px rgba(20,38,27,0.22), inset 0 1px 0 rgba(255,255,255,0.75)"; s.el.style.background = "rgba(255,255,255,0.55)"; };
      const b = () => { s.hov = false; s.trx = 0; s.try_ = 0; if (s.spot) s.spot.style.opacity = "0"; s.el.style.boxShadow = s.sh0; s.el.style.background = s.bg0; };
      const c = (e) => {
        const r = s.el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        s.trx = (0.5 - py) * 10; s.try_ = (px - 0.5) * 14;
        s.el.style.setProperty("--mx", (px * 100).toFixed(1) + "%"); s.el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      };
      s.el.addEventListener("mouseenter", a); s.el.addEventListener("mouseleave", b); s.el.addEventListener("mousemove", c);
      handlers.push([s.el, a, b, c]);
    });
    let raf = 0, last = 0;
    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      for (const s of st) {
        if (!s.ready) {
          if (s.el.dataset.shown) { if (!s.since) s.since = t; if (t - s.since > 1500) { s.ready = true; s.el.style.transition = "box-shadow 300ms ease, background 300ms ease"; s.el.style.clipPath = "none"; } }
          continue;
        }
        const k = Math.min(1, dt * 8);
        s.rx += (s.trx - s.rx) * k; s.ry += (s.try_ - s.ry) * k; s.lift += ((s.hov ? 1 : 0) - s.lift) * k;
        const fl = Math.sin(t / 1000 * 1.1 + s.i * 1.4) * 4 * (1 - s.lift);
        s.el.style.transform = "translateY(" + (fl - s.lift * 8).toFixed(2) + "px) rotateX(" + s.rx.toFixed(2) + "deg) rotateY(" + s.ry.toFixed(2) + "deg) scale(" + (1 + s.lift * 0.03).toFixed(3) + ")";
      }
    };
    raf = requestAnimationFrame(frame);
    this.statFxStop = () => { cancelAnimationFrame(raf); handlers.forEach((h) => { h[0].removeEventListener("mouseenter", h[1]); h[0].removeEventListener("mouseleave", h[2]); h[0].removeEventListener("mousemove", h[3]); }); };
  }
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
  componentDidMount() { this.setupMotion(); this.setupStatFx(); this.leafTimer = setTimeout(() => this.startLeafBgs(), 220); this.attnTimer = setTimeout(() => this.startAttention(), 500); }
  componentWillUnmount() { this.teardownMotion(); if (this.statFxStop) this.statFxStop(); clearTimeout(this.leafTimer); (this.leafStops || []).forEach((f) => f()); clearTimeout(this.attnTimer); if (this.attnStop) this.attnStop(); }
  setupMotion() {
    if (typeof window === "undefined") return;
    const ease = "cubic-bezier(.22,.61,.36,1)";
    const reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    const kinds = {};
    reveals.forEach((el, i) => {
      const kind = el.getAttribute("data-reveal") || "";
      kinds[kind] = (kinds[kind] || 0) + 1;
      const n = kinds[kind] - 1;
      if (kind === "wipe") {
        el.style.opacity = "0";
        el.style.transform = "translateY(34px)";
        el.style.clipPath = "inset(0 0 100% 0)";
        el.style.transition = "opacity 700ms ease, transform 1000ms " + ease + ", clip-path 1000ms " + ease;
      } else if (kind === "soft") {
        el.style.opacity = "0";
        el.style.transform = "translateY(14px)";
        el.style.transition = "opacity 800ms ease 260ms, transform 900ms " + ease + " 260ms";
      } else if (kind === "card") {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px) scale(0.965)";
        el.style.transition = "opacity 620ms ease " + (420 + n * 130) + "ms, transform 820ms " + ease + " " + (420 + n * 130) + "ms";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity 620ms ease " + ((i % 4) * 80) + "ms, transform 720ms " + ease + " " + ((i % 4) * 80) + "ms";
      }
    });
    const counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

    const show = (el) => {
      if (el.dataset.shown) return;
      el.dataset.shown = "1";
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "inset(0 0 0 0)";
      const bar = el.querySelector("[data-bar]");
      if (bar) setTimeout(() => { bar.style.width = "100%"; }, 220);
    };
    const runCount = (el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = el.getAttribute("data-count");
      const to = parseInt(target, 10);
      const from = parseInt(el.getAttribute("data-from") || "0", 10);
      const dur = 1150;
      const idx = counters.indexOf(el);
      const delay = 260 + Math.max(0, idx) * 150;
      el.style.display = "inline-block";
      el.style.willChange = "transform, filter";
      el.style.opacity = "0";
      el.style.filter = "blur(7px)";
      el.style.transform = "translateY(16px) scale(1.22)";
      el.style.transition = "opacity 260ms ease, filter 420ms ease, transform 620ms cubic-bezier(.2,.9,.3,1.15)";
      const card = el.closest("[data-reveal='card']") || el.parentElement;
      const sweepEl = card && card.querySelector("[data-sweep]");
      const start = setTimeout(() => {
        el.style.opacity = "1";
        el.style.filter = "blur(0px)";
        el.style.transform = "translateY(0) scale(1)";
        if (sweepEl) {
          sweepEl.style.transition = "left 780ms cubic-bezier(.3,.7,.3,1), opacity 200ms ease";
          sweepEl.style.opacity = "1";
          sweepEl.style.left = "115%";
          (this.motionTimers = this.motionTimers || []).push(setTimeout(() => { sweepEl.style.opacity = "0"; }, 720));
        }
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(from + (to - from) * e));
          if (p < 1) requestAnimationFrame(tick);
          else {
            el.textContent = target;
            el.style.transition = "transform 130ms cubic-bezier(.2,.9,.3,1.4)";
            el.style.transform = "scale(1.12)";
            (this.motionTimers = this.motionTimers || []).push(setTimeout(() => { el.style.transform = "scale(1)"; }, 140));
          }
        };
        requestAnimationFrame(tick);
      }, delay);
      (this.motionTimers = this.motionTimers || []).push(start);
    };
    const inView = (el, margin) => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || 800;
      return r.top < h - margin && r.bottom > 0;
    };
    this.checkMotion = () => {
      reveals.forEach((el) => { if (inView(el, 60)) show(el); });
      counters.forEach((el) => { if (inView(el, 80)) runCount(el); });
    };
    this.checkMotion();
    setTimeout(this.checkMotion, 50);
    window.addEventListener("scroll", this.checkMotion, { passive: true });
    window.addEventListener("resize", this.checkMotion);
    (this.motionTimers = this.motionTimers || []).push(
      setTimeout(this.checkMotion, 300),
      setTimeout(this.checkMotion, 900),
      setTimeout(() => { reveals.forEach(show); counters.forEach(runCount); }, 2500)
    );
  }
}
  var c = new Component();
  c.componentDidMount();
})();
