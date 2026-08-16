/**
 * JDW Apex — emoji particle grid + mouse spotlight (K9 / Feline only)
 * data-apex-bg="k9" → dogs + tennis ball | data-apex-bg="feline" → yarn
 * Smooth path: pre-render emoji sprites once, drawImage each frame.
 * pointer-events:none · z-index:0 · never blocks clicks/checkout
 */
(function () {
  "use strict";

  if (window.__apexEmojiGrid) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var script = document.currentScript;
  var mode = (
    (script && script.getAttribute("data-apex-bg")) ||
    (document.body && document.body.getAttribute("data-apex-bg")) ||
    "k9"
  ).toLowerCase();

  var isFeline =
    mode.indexOf("fel") >= 0 || mode.indexOf("cat") >= 0 || mode.indexOf("yarn") >= 0;

  var DOGS = ["🐕", "🐶", "🦮", "🐕‍🦺", "🐩", "🎾"];
  var YARN = ["🧶", "🧶", "🧵", "🧶"];
  var EMOJIS = isFeline ? YARN : DOGS;

  window.__apexEmojiGrid = true;

  var isMobile =
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

  var GAP = isMobile ? 56 : 56;
  var RADIUS = isMobile ? 0 : 120;
  var RADIUS_SQ = RADIUS * RADIUS;
  var STRENGTH = 16;
  var EASE = 0.14;
  var FONT_SIZE = isMobile ? 16 : 20;
  var BASE_ALPHA = 0.06;
  var NEAR_ALPHA = 0.92;
  var SPOT_ALPHA = 0.12;
  var MAX_PARTICLES = isMobile ? 90 : 280;
  var DPR_CAP = 1.25;

  function makeSprite(emoji, size) {
    var pad = 2;
    var s = document.createElement("canvas");
    s.width = size + pad * 2;
    s.height = size + pad * 2;
    var c = s.getContext("2d");
    if (!c) return null;
    c.font = size + "px system-ui, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.clearRect(0, 0, s.width, s.height);
    c.fillText(emoji, s.width / 2, s.height / 2);
    return s;
  }

  var spriteCache = {};
  function getSprite(emoji) {
    if (!spriteCache[emoji]) spriteCache[emoji] = makeSprite(emoji, FONT_SIZE);
    return spriteCache[emoji];
  }

  if (isMobile) {
    var cM = document.createElement("canvas");
    cM.id = "apex-emoji-grid";
    cM.setAttribute("aria-hidden", "true");
    cM.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;";
    document.body.appendChild(cM);
    function paintStatic() {
      var dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      var w = window.innerWidth;
      var h = window.innerHeight;
      cM.width = Math.floor(w * dpr);
      cM.height = Math.floor(h * dpr);
      cM.style.width = w + "px";
      cM.style.height = h + "px";
      var ctx = cM.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var cols = Math.ceil(w / GAP) + 1;
      var rows = Math.ceil(h / GAP) + 1;
      var n = 0;
      for (var r = 0; r < rows && n < MAX_PARTICLES; r++) {
        for (var col = 0; col < cols && n < MAX_PARTICLES; col++) {
          var emoji = EMOJIS[n % EMOJIS.length];
          var sp = getSprite(emoji);
          if (sp) {
            ctx.globalAlpha = BASE_ALPHA;
            ctx.drawImage(sp, col * GAP - FONT_SIZE / 2, r * GAP - FONT_SIZE / 2);
          }
          n++;
        }
      }
      ctx.globalAlpha = 1;
    }
    paintStatic();
    window.addEventListener("resize", paintStatic, { passive: true });
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.id = "apex-emoji-grid";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d", { alpha: true });

  var particles = [];
  var mouse = { x: -9999, y: -9999, active: false };

  function rebuild() {
    var dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = [];
    var cols = Math.ceil(w / GAP) + 1;
    var rows = Math.ceil(h / GAP) + 1;
    var n = 0;
    for (var r = 0; r < rows && n < MAX_PARTICLES; r++) {
      for (var col = 0; col < cols && n < MAX_PARTICLES; col++) {
        particles.push({
          bx: col * GAP,
          by: r * GAP,
          x: col * GAP,
          y: r * GAP,
          emoji: EMOJIS[n % EMOJIS.length]
        });
        n++;
      }
    }
  }

  function onMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }
  function onLeave() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", onLeave, { passive: true });
  window.addEventListener("resize", rebuild, { passive: true });
  rebuild();

  function frame() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    if (mouse.active && RADIUS > 0) {
      var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS);
      g.addColorStop(0, "rgba(52,211,153," + SPOT_ALPHA + ")");
      g.addColorStop(0.55, "rgba(168,85,247," + SPOT_ALPHA * 0.35 + ")");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(mouse.x - RADIUS, mouse.y - RADIUS, RADIUS * 2, RADIUS * 2);
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var tx = p.bx;
      var ty = p.by;
      var alpha = BASE_ALPHA;
      if (mouse.active) {
        var dx = p.bx - mouse.x;
        var dy = p.by - mouse.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < RADIUS_SQ && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var f = (1 - d / RADIUS) * STRENGTH;
          tx = p.bx + (dx / d) * f;
          ty = p.by + (dy / d) * f;
          alpha = BASE_ALPHA + (NEAR_ALPHA - BASE_ALPHA) * (1 - d / RADIUS);
        }
      }
      p.x += (tx - p.x) * EASE;
      p.y += (ty - p.y) * EASE;
      var sp = getSprite(p.emoji);
      if (sp) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(sp, p.x - FONT_SIZE / 2, p.y - FONT_SIZE / 2);
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
