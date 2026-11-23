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
    const list = Array.prototype.slice.call(document.querySelectorAll("canvas[data-leaves]"));
    list.forEach((c) => { this.leafStops.push(this.leafBg(c.parentElement, c)); });
    if (this.leafWatch) clearInterval(this.leafWatch);
    this.leafWatch = setInterval(() => {
      const now = document.querySelectorAll("canvas[data-leaves]");
      if (now.length !== list.length || list.some((c) => !c.isConnected)) { clearInterval(this.leafWatch); this.leafWatch = null; this.startLeafBgs(); }
    }, 2000);
  }
  state = { w: typeof window !== "undefined" ? window.innerWidth : 1440 };
  componentDidMount() {
    this.onResize = () => this.setState({ w: window.innerWidth });
    window.addEventListener("resize", this.onResize);
    this.setupMotion();
    this.setupStatFx();
    this.startOrbit();
    this.startBook();
    this.leafTimer = setTimeout(() => this.startLeafBgs(), 220);
    this.attnTimer = setTimeout(() => this.startAttention(), 500);
  }
  startBook() {
    if (typeof window === "undefined") return;
    let stage = null, book = null, shadow = null, gloss = null, shades = {};
    let rotY = -26, rotX = -6, vel = 0, target = null, dragging = false, moved = 0, lastX = 0, lastY = 0, lastT = 0, idleAt = 0, raf = 0, lastMoveT = 0;
    const AUTO = 9; // stepeni u sekundi kad niko ne dira
    const rad = (d) => d * Math.PI / 180;
    const down = (e) => {
      dragging = true; moved = 0; vel = 0; target = null;
      lastX = e.clientX; lastY = e.clientY; if (stage) stage.style.cursor = "grabbing";
      if (stage && stage.setPointerCapture && e.pointerId != null) { try { stage.setPointerCapture(e.pointerId); } catch (err) {} }
    };
    // Ako se stranica osveži novom verzijom dok je otvorena, elementi se zamene: tada se ponovo povežemo
    const bind = () => {
      if (stage) stage.removeEventListener("pointerdown", down);
      stage = document.querySelector("[data-book-stage]");
      book = stage ? stage.querySelector("[data-book]") : null;
      shadow = stage ? stage.querySelector("[data-book-shadow]") : null;
      gloss = stage ? stage.querySelector("[data-gloss]") : null;
      shades = {};
      if (stage) {
        Array.prototype.forEach.call(stage.querySelectorAll("[data-shade]"), (el) => { shades[el.getAttribute("data-shade")] = el; });
        stage.addEventListener("pointerdown", down);
      }
    };
    const render = () => {
      book.style.transform = "rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)";
      const light = -35;
      const faces = { front: 0, spine: -90, back: 180, pages: 90 };
      for (const k in faces) {
        const el = shades[k]; if (!el) continue;
        const b = Math.cos(rad(rotY + faces[k] - light));
        el.style.opacity = (0.06 + 0.5 * (1 - Math.max(0, b))).toFixed(3);
      }
      if (gloss) { const g = ((rotY % 360) + 360) % 360; const off = (g > 180 ? g - 360 : g); gloss.style.transform = "translateX(" + (off * 1.6).toFixed(1) + "%)"; }
      if (shadow) {
        const c = Math.abs(Math.cos(rad(rotY))), sn = Math.abs(Math.sin(rad(rotY)));
        const w = 0.98 * c + 0.16 * sn + 0.12;
        shadow.style.transform = "scaleX(" + w.toFixed(3) + ")";
      }
    };
    const step = (t) => {
      raf = requestAnimationFrame(step);
      if (!book || !book.isConnected) { dragging = false; bind(); if (!book) return; }
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016; lastT = t;
      if (!dragging) {
        if (target !== null) {
          const d = target - rotY; rotY += d * Math.min(1, dt * 7);
          if (Math.abs(d) < 0.15) { rotY = target; target = null; idleAt = t + 2500; }
        } else if (Math.abs(vel) > 2) {
          rotY += vel * dt; vel *= Math.pow(0.12, dt);
          if (Math.abs(vel) <= 2) idleAt = t + 2500;
        } else if (t > idleAt) {
          rotY += AUTO * dt;
        }
        rotX += (-6 - rotX) * Math.min(1, dt * 4);
      }
      render();
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      const now = performance.now(); const mdt = Math.max(8, now - (lastMoveT || now - 16)); lastMoveT = now;
      rotY += dx * 0.55;
      rotX = Math.max(-28, Math.min(22, rotX - dy * 0.3));
      vel = (dx * 0.55) / (mdt / 1000);
      vel = Math.max(-900, Math.min(900, vel));
    };
    const up = () => {
      if (!dragging) return;
      dragging = false; if (stage) stage.style.cursor = "grab";
      if (moved < 6) {
        vel = 0;
        target = (Math.round(rotY / 180) + 1) * 180 - 18;
      }
      idleAt = performance.now() + 2500;
    };
    bind();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(step);
    this.bookCleanup = () => {
      cancelAnimationFrame(raf);
      if (stage) stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }
  startOrbit() {
    if (typeof window === "undefined") return;
    const PERIOD = 40000;
    let angle = 0, last = null;
    const step = (t) => {
      if (last !== null && !this.orbitPaused) angle = (angle + (t - last) * 360 / PERIOD) % 360;
      last = t;
      const ring = document.querySelector(".law-ring");
      if (ring) {
        ring.style.transform = "rotate(" + angle + "deg)";
        const ups = ring.querySelectorAll(".law-upright");
        for (let k = 0; k < ups.length; k++) ups[k].style.transform = "rotate(" + (-angle) + "deg)";
      }
      this.orbitRaf = requestAnimationFrame(step);
    };
    this.orbitRaf = requestAnimationFrame(step);
  }
  setupStatFx() {
    if (typeof window === "undefined") return;
    if (this.statFxStop) this.statFxStop();
    const cards = Array.prototype.slice.call(document.querySelectorAll(".o-stat"));
    if (!cards.length) return;
    const intro = !this.statIntroDone;
    const ease = "cubic-bezier(.22,.61,.36,1)";
    const timers = [];
    const st = cards.map((el, i) => ({
      el, i, spot: el.querySelector("[data-spot]"), sweep: el.querySelector("[data-sweep]"), bar: el.querySelector("[data-bar]"), num: el.querySelector("[data-ocount]"),
      bg0: el.style.background, sh0: el.style.boxShadow, hov: false, rx: 0, ry: 0, trx: 0, try_: 0, lift: 0, ready: !intro, since: 0
    }));
    st.forEach((s) => {
      if (intro) {
        s.el.style.opacity = "0";
        s.el.style.transform = "translateY(40px) scale(0.965)";
        s.el.style.transition = "opacity 620ms ease " + (420 + s.i * 130) + "ms, transform 820ms " + ease + " " + (420 + s.i * 130) + "ms";
      } else {
        s.el.style.transition = "box-shadow 300ms ease, background 300ms ease";
        if (s.bar) s.bar.style.width = "100%";
      }
    });
    const countUp = (s) => {
      const el = s.num;
      if (!el) return;
      const target = el.getAttribute("data-ocount");
      const to = parseInt(target, 10), from = parseInt(el.getAttribute("data-from") || "0", 10);
      const dur = 1150;
      el.textContent = String(from);
      el.style.opacity = "0"; el.style.filter = "blur(7px)"; el.style.transform = "translateY(16px) scale(1.22)";
      el.style.transition = "opacity 260ms ease, filter 420ms ease, transform 620ms cubic-bezier(.2,.9,.3,1.15)";
      timers.push(setTimeout(() => {
        el.style.opacity = "1"; el.style.filter = "blur(0px)"; el.style.transform = "translateY(0) scale(1)";
        if (s.sweep) {
          s.sweep.style.transition = "left 780ms cubic-bezier(.3,.7,.3,1), opacity 200ms ease";
          s.sweep.style.opacity = "1"; s.sweep.style.left = "115%";
          timers.push(setTimeout(() => { s.sweep.style.opacity = "0"; }, 720));
        }
        const t0 = performance.now();
        const tick = (now) => {
          if (!el.isConnected) return;
          const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(from + (to - from) * e));
          if (p < 1) requestAnimationFrame(tick);
          else {
            el.textContent = target;
            el.style.transition = "transform 130ms cubic-bezier(.2,.9,.3,1.4)";
            el.style.transform = "scale(1.12)";
            timers.push(setTimeout(() => { el.style.transform = "scale(1)"; }, 140));
          }
        };
        requestAnimationFrame(tick);
      }, 560 + s.i * 150));
    };
    const showAll = () => {
      if (this.statIntroDone) return;
      this.statIntroDone = true;
      st.forEach((s) => {
        s.el.style.opacity = "1";
        s.el.style.transform = "none";
        if (s.bar) timers.push(setTimeout(() => { s.bar.style.width = "100%"; }, 640 + s.i * 130));
        countUp(s);
      });
    };
    const check = () => {
      const r = cards[0].getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) - 40 && r.bottom > 0) showAll();
    };
    if (intro) {
      window.addEventListener("scroll", check, { passive: true });
      timers.push(setTimeout(check, 150), setTimeout(showAll, 3000));
    }
    const handlers = [];
    st.forEach((s) => {
      const a = () => { s.hov = true; if (s.spot) s.spot.style.opacity = "1"; s.el.style.boxShadow = "0 24px 46px rgba(20,38,27,0.24), inset 0 1px 0 rgba(255,255,255,0.75)"; s.el.style.background = "rgba(255,255,255,0.6)"; };
      const b = () => { s.hov = false; s.trx = 0; s.try_ = 0; if (s.spot) s.spot.style.opacity = "0"; s.el.style.boxShadow = s.sh0; s.el.style.background = s.bg0; };
      const c = (e) => {
        const rc = s.el.getBoundingClientRect();
        const px = (e.clientX - rc.left) / rc.width, py = (e.clientY - rc.top) / rc.height;
        s.trx = (0.5 - py) * 10; s.try_ = (px - 0.5) * 14;
        s.el.style.setProperty("--mx", (px * 100).toFixed(1) + "%"); s.el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      };
      s.el.addEventListener("mouseenter", a); s.el.addEventListener("mouseleave", b); s.el.addEventListener("mousemove", c);
      handlers.push([s.el, a, b, c]);
    });
    let raf = 0, last = 0, rebind = 0;
    const frame = (t) => {
      if (!cards[0].isConnected) { raf = 0; rebind = setTimeout(() => this.setupStatFx(), 60); return; }
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      for (const s of st) {
        if (!s.ready) {
          if (this.statIntroDone) {
            if (!s.since) s.since = t;
            if (t - s.since > 1700 + s.i * 130) { s.ready = true; s.el.style.transition = "box-shadow 300ms ease, background 300ms ease"; }
          }
          continue;
        }
        const k = Math.min(1, dt * 8);
        s.rx += (s.trx - s.rx) * k; s.ry += (s.try_ - s.ry) * k; s.lift += ((s.hov ? 1 : 0) - s.lift) * k;
        const fl = Math.sin(t / 1000 * 1.1 + s.i * 1.4) * 4 * (1 - s.lift);
        s.el.style.transform = "translateY(" + (fl - s.lift * 8).toFixed(2) + "px) rotateX(" + s.rx.toFixed(2) + "deg) rotateY(" + s.ry.toFixed(2) + "deg) scale(" + (1 + s.lift * 0.03).toFixed(3) + ")";
      }
    };
    raf = requestAnimationFrame(frame);
    this.statFxStop = () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(rebind);
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", check);
      handlers.forEach((h) => { h[0].removeEventListener("mouseenter", h[1]); h[0].removeEventListener("mouseleave", h[2]); h[0].removeEventListener("mousemove", h[3]); });
    };
  }
  setupMotion() {
    if (typeof window === "undefined") return;
    const EASE = "cubic-bezier(.16,.84,.44,1)";
    const reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

    // stagger by position among its own siblings, so grids cascade instead of firing as one block
    reveals.forEach((el) => {
      const kind = el.getAttribute("data-reveal") || "";
      const sibs = el.parentElement ? Array.prototype.slice.call(el.parentElement.children).filter((c) => c.hasAttribute && c.hasAttribute("data-reveal")) : [el];
      const idx = Math.max(0, sibs.indexOf(el));
      const delay = Math.min(idx * 60, 360);
      const dist = kind === "soft" ? 10 : 18;
      const dx = parseFloat(el.getAttribute("data-dx") || "0") || 0;
      el.style.opacity = "0";
      el.style.transform = kind === "law"
        ? "translate3d(" + dx + "px,22px,0) scale(0.97)"
        : "translate3d(0," + dist + "px,0)";
      el.style.willChange = "opacity, transform";
      el.style.transition = "opacity 520ms " + EASE + " " + delay + "ms, transform 620ms " + EASE + " " + delay + "ms";
    });

    const grows = Array.prototype.slice.call(document.querySelectorAll("[data-grow]"));
    grows.forEach((el, i) => {
      el.style.transition = "width 700ms " + EASE + " " + Math.min(i * 40, 320) + "ms";
      el.dataset.growTo = el.parentElement && el.parentElement.style.position === "relative" ? "100%" : "28px";
    });
    const counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    const show = (el) => {
      if (el.dataset.shown) return;
      el.dataset.shown = "1";
      el.style.opacity = "1";
      el.style.transform = "translate3d(0,0,0) scale(1)";
      setTimeout(() => { el.style.willChange = "auto"; }, 1000);
    };
    const runCount = (el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = el.getAttribute("data-count");
      const to = parseInt(target, 10);
      const from = parseInt(el.getAttribute("data-from") || "0", 10);
      const dur = 900;
      let t0 = null;
      const step = (t) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? String(Math.round(from + (to - from) * e)) : target;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      (this.motionTimers = this.motionTimers || []).push(setTimeout(() => { el.textContent = target; }, dur + 400));
    };

    const inView = (el, margin) => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || 800;
      return r.top < h - margin && r.bottom > 0;
    };
    let queued = false;
    const run = () => {
      queued = false;
      for (let i = reveals.length - 1; i >= 0; i--) {
        if (inView(reveals[i], 70)) { show(reveals[i]); reveals.splice(i, 1); }
      }
      for (let i = counters.length - 1; i >= 0; i--) {
        if (inView(counters[i], 90)) { runCount(counters[i]); counters.splice(i, 1); }
      }
    };
    this.growAll = () => grows.forEach((el) => { el.style.width = el.dataset.growTo || "28px"; });
    this.checkMotion = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
    setTimeout(this.growAll, 200);
    this.checkMotion();
    window.addEventListener("scroll", this.checkMotion, { passive: true });
    window.addEventListener("resize", this.checkMotion);
    (this.motionTimers = this.motionTimers || []).push(
      setTimeout(this.checkMotion, 120),
      setTimeout(this.checkMotion, 600),
      setTimeout(() => { reveals.slice().forEach(show); counters.slice().forEach(runCount); }, 3000)
    );
  }
}
  var c = new Component();
  c.statIntroDone = true;
  c.componentDidMount();

  // law flowers: states captured from the original render
  (function () {
    var L = {"base":{"18":{"transform":"scale(1)"},"19":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"47":{"transform":"scale(1)"},"48":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"76":{"transform":"scale(1)"},"77":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"105":{"transform":"scale(1)"},"106":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"134":{"transform":"scale(1)"},"135":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"163":{"transform":"scale(1)"},"164":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"192":{"transform":"scale(1)"},"193":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"221":{"transform":"scale(1)"},"222":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"250":{"transform":"scale(1)"},"251":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"279":{"transform":"scale(1)"},"280":{"transform":"rotate(0deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.12) 0px 3px 5px)"},"307":{"opacity":"1","transform":"scale(1)","@aria-hidden":"false"},"309":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"310":{"opacity":"0","transition-delay":"0s"},"312":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"319":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"320":{"opacity":"0","transition-delay":"0s"},"322":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"329":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"330":{"opacity":"0","transition-delay":"0s"},"332":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"339":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"340":{"opacity":"0","transition-delay":"0s"},"342":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"349":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"350":{"opacity":"0","transition-delay":"0s"},"352":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"359":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"360":{"opacity":"0","transition-delay":"0s"},"362":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"369":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"370":{"opacity":"0","transition-delay":"0s"},"372":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"379":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"380":{"opacity":"0","transition-delay":"0s"},"382":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"389":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"390":{"opacity":"0","transition-delay":"0s"},"392":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"},"399":{"width":"84px","height":"84px","border-top-left-radius":"42px","border-top-right-radius":"42px","border-bottom-right-radius":"42px","border-bottom-left-radius":"42px","opacity":"0","@aria-hidden":"true"},"400":{"opacity":"0","transition-delay":"0s"},"402":{"opacity":"0","transform":"translateX(-18px)","transition-delay":"0s, 0s"}},"states":[{"18":{"transform":"scale(1.5)"},"19":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"309":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"310":{"opacity":"1","transition-delay":"300ms"},"312":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"47":{"transform":"scale(1.5)"},"48":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"319":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"320":{"opacity":"1","transition-delay":"300ms"},"322":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"76":{"transform":"scale(1.5)"},"77":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"329":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"330":{"opacity":"1","transition-delay":"300ms"},"332":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"105":{"transform":"scale(1.5)"},"106":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"339":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"340":{"opacity":"1","transition-delay":"300ms"},"342":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"134":{"transform":"scale(1.5)"},"135":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"349":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"350":{"opacity":"1","transition-delay":"300ms"},"352":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"163":{"transform":"scale(1.5)"},"164":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"359":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"360":{"opacity":"1","transition-delay":"300ms"},"362":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"192":{"transform":"scale(1.5)"},"193":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"369":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"370":{"opacity":"1","transition-delay":"300ms"},"372":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"221":{"transform":"scale(1.5)"},"222":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"379":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"380":{"opacity":"1","transition-delay":"300ms"},"382":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"250":{"transform":"scale(1.5)"},"251":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"389":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"390":{"opacity":"1","transition-delay":"300ms"},"392":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}},{"279":{"transform":"scale(1.5)"},"280":{"transform":"rotate(60deg)","filter":"drop-shadow(rgba(20, 38, 27, 0.28) 0px 10px 14px)"},"307":{"opacity":"0","transform":"scale(0.92)","@aria-hidden":"true"},"399":{"width":"100%","height":"100%","border-top-left-radius":"22px","border-top-right-radius":"22px","border-bottom-right-radius":"22px","border-bottom-left-radius":"22px","opacity":"1","@aria-hidden":"false"},"400":{"opacity":"1","transition-delay":"300ms"},"402":{"opacity":"1","transform":"translateX(0px)","transition-delay":"300ms, 300ms"}}]};
    var els = {};
    document.querySelectorAll("[data-lp]").forEach(function (e) { els[e.getAttribute("data-lp")] = e; });
    var cur = -1;
    var put = function (el, p, v) {
      if (p.charAt(0) === "@") { if (v === "") el.removeAttribute(p.slice(1)); else el.setAttribute(p.slice(1), v); return; }
      if (v === "") { el.style.removeProperty(p); return; }
      var imp = / !important$/.test(v);
      el.style.setProperty(p, v.replace(/ !important$/, ""), imp ? "important" : "");
    };
    var setLaw = function (s) {
      if (s === cur) return;
      cur = s;
      var d = s >= 0 ? L.states[s] : {};
      Object.keys(L.base).forEach(function (k) {
        var el = els[k]; if (!el) return;
        var b = L.base[k], o = d[k] || {};
        Object.keys(b).forEach(function (p) { put(el, p, Object.prototype.hasOwnProperty.call(o, p) ? o[p] : b[p]); });
      });
    };
    var orbit = document.querySelector(".law-orbit");
    if (!orbit) return;
    var box = orbit.parentElement;
    orbit.addEventListener("mouseenter", function () { c.orbitPaused = true; });
    orbit.addEventListener("mouseleave", function () { c.orbitPaused = false; });
    box.addEventListener("mouseleave", function () { c.orbitPaused = false; setLaw(-1); });
    document.querySelectorAll(".law-ring button").forEach(function (btn, i) {
      ["mouseenter", "focus", "click"].forEach(function (ev) { btn.addEventListener(ev, function () { setLaw(i); }); });
    });
  })();
})();
