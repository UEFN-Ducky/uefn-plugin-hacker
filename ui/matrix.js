/** Matrix rain for #ducky-fx-root (appearance.effects). */
(function () {
  var mount = window.__duckyAppearanceFxMount;
  var root = (mount && mount.root) || document.getElementById("ducky-fx-root");
  var key = (mount && mount.key) || "hacker::matrix";
  if (!root) return;

  var GLYPHS =
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF<>{}[]|/\\";

  var reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    root.replaceChildren();
    window.__duckyAppearanceFxCleanups = window.__duckyAppearanceFxCleanups || {};
    window.__duckyAppearanceFxCleanups[key] = function () {
      root.replaceChildren();
    };
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.className = "ducky-fx-canvas ducky-fx-canvas--matrix";
  canvas.setAttribute("aria-hidden", "true");
  root.replaceChildren(canvas);
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var fontSize = 14;
  var columns = 0;
  var drops = [];
  var raf = 0;
  var last = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.max(1, Math.floor(w / fontSize));
    drops = Array.from({ length: columns }, function () {
      return Math.random() * (h / fontSize);
    });
  }

  function draw(ts) {
    raf = window.requestAnimationFrame(draw);
    if (ts - last < 33) return;
    last = ts;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSize + "px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
    for (var i = 0; i < drops.length; i++) {
      var ch = GLYPHS[(Math.random() * GLYPHS.length) | 0] || "0";
      var x = i * fontSize;
      var y = drops[i] * fontSize;
      ctx.fillStyle = i % 7 === 0 ? "rgba(180, 255, 200, 0.55)" : "rgba(0, 220, 70, 0.35)";
      ctx.fillText(ch, x, y);
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 1;
    }
  }

  resize();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  raf = window.requestAnimationFrame(draw);
  window.addEventListener("resize", resize);

  window.__duckyAppearanceFxCleanups = window.__duckyAppearanceFxCleanups || {};
  window.__duckyAppearanceFxCleanups[key] = function () {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    root.replaceChildren();
  };
})();
