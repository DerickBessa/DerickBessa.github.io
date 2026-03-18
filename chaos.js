/* ============================================================
   CHAOS MODE — Modo Loucura Total
   Vermelho. Escuro. Quebrado. Inútil. Perfeito.
   ============================================================ */
const ChaosMode = (() => {
  let active = false;
  let intervals = [];
  let animFrames = [];
  let cursorEl = null;
  let trailEls = [];
  let addedElements = [];
  const GLITCH = '!<>-_\\/[]{}—=+*^?#░▒▓█|01ÆØÅ∑∂≈çµ†®©∞§';
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max)); }
  function pick(arr) { return arr[randInt(0, arr.length)]; }

  // ─── Salvar/restaurar inline styles do hero (fix do bug de opacity) ───
  let _heroSavedStyles = {};
  const HERO_SELECTORS = [
    '#hero h1',
    '#hero p:first-of-type',
    '#hero .hero-tagline',
    '#hero .cv-buttons',
    '#hero .cv-buttons-extra',
    '#hero .social-links',
  ];
  function saveHeroStyles() {
    _heroSavedStyles = {};
    HERO_SELECTORS.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) _heroSavedStyles[sel] = el.getAttribute('style') || '';
    });
  }
  function restoreHeroStyles() {
    HERO_SELECTORS.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const saved = _heroSavedStyles[sel];
      if (saved) {
        el.setAttribute('style', saved);
      } else {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0px)';
      }
    });
    _heroSavedStyles = {};
  }

  function injectCSS() {
    const s = document.createElement('style');
    s.id = 'chaos-style';
    s.textContent = `
      body.chaos-mode, body.chaos-mode * { cursor: none !important; }
      .chaos-cursor {
        position: fixed; pointer-events: none; z-index: 99999;
        width: 24px; height: 24px; border: 2px solid #ff003c;
        transform: translate(-50%,-50%) rotate(45deg);
        box-shadow: 0 0 12px #ff003c, 0 0 30px #ff003c88;
        mix-blend-mode: difference;
      }
      .chaos-cursor-trail {
        position: fixed; pointer-events: none; z-index: 99998;
        width: 6px; height: 6px; background: #ff003c; border-radius: 50%;
        transform: translate(-50%,-50%); mix-blend-mode: screen;
      }
      body.chaos-mode {
        background-color: #0a0000 !important;
        --white-background: #0a0000 !important;
        --font-color: #ff3333 !important;
        --hero-font-color: #ff0000 !important;
        --hero-cor-rosa: #ff0000 !important;
        --accent-color-font: #ff0000 !important;
        --accent-color-bg: #8b0000 !important;
        --fonte-mais-clara: #cc0000 !important;
        --background-nav-menu: #1a0000 !important;
        --background-branco-mais-escuro: #1a0000 !important;
        --cor-barra-horizontal-titulos: #3a0000 !important;
      }
      body.chaos-mode #hero {
        background-image: url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHg0bnVzeG1qdmU1YTMwM2I5cGMwNTJ2Zm5uMGRzOXRycHoyMDZxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/13HgwGsXF0aiGY/giphy.gif') !important;
        background-size: cover !important; background-position: center !important;
      }
      body.chaos-mode #hero:before { background: rgba(10,0,0,0.72) !important; }
      body.chaos-mode #header { background: #0a0000 !important; border-right-color: #3a0000 !important; }
      body.chaos-mode section, body.chaos-mode .about, body.chaos-mode .resume, body.chaos-mode .projects { background-color: #0a0000 !important; }
      body.chaos-mode .light-background { background-color: #110000 !important; }
      body.chaos-mode #footer { background: #0a0000 !important; --fonte-mais-clara: #cc0000 !important; }
      body.chaos-mode #hero h1 {
        position: relative; color: #ff0000 !important;
        text-shadow: 2px 0 #ff003c, -2px 0 #00ffcc;
        animation: h1-shake 0.08s infinite;
      }
      body.chaos-mode #hero h1::before {
        content: attr(data-text); position: absolute; top: 0; left: 0;
        color: #ff003c; clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
        animation: glitch-layer-1 1.8s infinite; text-shadow: none;
      }
      body.chaos-mode #hero h1::after {
        content: attr(data-text); position: absolute; top: 0; left: 0;
        color: #00ccff; clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
        animation: glitch-layer-2 2.2s infinite; text-shadow: none;
      }
      @keyframes h1-shake {
        0%,100% { transform: translate(0,0) skewX(0deg); }
        10% { transform: translate(-3px,2px) skewX(-2deg); }
        20% { transform: translate(3px,-1px) skewX(1deg); }
        40% { transform: translate(2px,-2px) skewX(-1deg); }
        70% { transform: translate(-3px,-1px) skewX(1.5deg); }
      }
      @keyframes glitch-layer-1 {
        0%,85%,100% { transform: translate(0); opacity: 0; }
        86%,88% { transform: translate(-6px,0); opacity: 0.9; }
        87% { transform: translate(6px,1px); opacity: 0.9; }
      }
      @keyframes glitch-layer-2 {
        0%,70%,100% { transform: translate(0); opacity: 0; }
        71%,73% { transform: translate(6px,0); opacity: 0.8; }
        72% { transform: translate(-6px,0); opacity: 0.8; }
      }
      body.chaos-mode img {
        animation: img-chaos 0.3s infinite;
        filter: hue-rotate(var(--chaos-hue, 0deg)) saturate(2) contrast(1.3) !important;
      }
      @keyframes img-chaos {
        0%  { transform: rotate(0deg) scale(1) translate(0,0); }
        15% { transform: rotate(-3deg) scale(1.04) translate(-4px,2px); }
        30% { transform: rotate(2deg) scale(0.97) translate(3px,-3px); }
        60% { transform: rotate(3deg) scale(1.05) translate(4px,-1px); }
        100%{ transform: rotate(0deg) scale(1) translate(0,0); }
      }
      body.chaos-mode p, body.chaos-mode li, body.chaos-mode em {
        animation: text-vibrate 0.12s infinite; color: #ff3333 !important;
      }
      @keyframes text-vibrate {
        0%,100% { transform: translate(0,0); }
        25% { transform: translate(1px,-1px); }
        50% { transform: translate(-1px,1px); }
        75% { transform: translate(1px,1px); }
      }
      body.chaos-mode .projects-item {
        animation: card-break 0.4s infinite !important;
        border: 1px solid #ff003c !important; background: #110000 !important;
        box-shadow: 0 0 30px #ff003c66, inset 0 0 20px #ff000022 !important;
        filter: hue-rotate(var(--chaos-hue, 0deg));
      }
      @keyframes card-break {
        0%,100% { transform: rotate(0deg) translate(0,0); }
        20% { transform: rotate(-1.5deg) translate(-2px,1px); }
        40% { transform: rotate(1deg) translate(2px,-2px); }
        80% { transform: rotate(2deg) translate(1px,-1px); }
      }
      body.chaos-mode .resume-item {
        animation: resume-tilt 0.5s infinite !important;
        border-left-color: #ff003c !important; transform-origin: left center;
      }
      @keyframes resume-tilt {
        0%,100% { transform: skewY(0deg); }
        30% { transform: skewY(-0.8deg) translateX(2px); }
        60% { transform: skewY(0.5deg) translateX(-1px); }
      }
      body.chaos-mode .nav-menu a {
        animation: nav-chaos 0.6s infinite !important;
        background: #1a0000 !important; color: #ff0000 !important;
      }
      @keyframes nav-chaos {
        0%,100% { letter-spacing: normal; transform: scale(1); }
        30% { letter-spacing: 3px; transform: scale(1.05) rotate(-2deg); }
        60% { letter-spacing: -1px; transform: scale(0.95) rotate(1deg); }
      }
      .chaos-scanlines {
        position: fixed; inset: 0; pointer-events: none; z-index: 9990;
        background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.04) 3px, rgba(255,0,0,0.04) 4px);
        animation: scan-drift 6s linear infinite;
      }
      @keyframes scan-drift { from { background-position: 0 0; } to { background-position: 0 300px; } }
      .chaos-vhs { position: fixed; inset: 0; pointer-events: none; z-index: 9991; overflow: hidden; }
      .chaos-vhs-bar {
        position: absolute; left: 0; right: 0; height: 3px;
        background: rgba(255,0,60,0.6); mix-blend-mode: screen;
        animation: vhs-bar 0.08s steps(1) infinite;
      }
      @keyframes vhs-bar {
        0%,100% { top: -10%; opacity: 0; } 10% { top: 15%; opacity: 1; }
        20% { top: 35%; opacity: 0.8; } 30% { top: 55%; opacity: 1; }
        40% { top: 72%; opacity: 0.6; } 60% { top: 23%; opacity: 0.7; }
        80% { top: 44%; opacity: 0.5; } 90% { top: 80%; opacity: 0.9; }
      }
      #chaos-noise { position: fixed; inset: 0; pointer-events: none; z-index: 9989; opacity: 0.07; }
      body.chaos-mode .btn-cv, body.chaos-mode .read-more, body.chaos-mode .btn-cv-dark {
        animation: btn-pulse-chaos 0.4s infinite !important;
        border-color: #ff003c !important; color: #ff003c !important;
      }
      @keyframes btn-pulse-chaos {
        0%,100% { box-shadow: 0 0 8px #ff003c; transform: scale(1); }
        50% { box-shadow: 0 0 24px #ff003c, 0 0 50px #ff003c44; transform: scale(1.04); }
      }
      .chaos-symbol {
        position: fixed; pointer-events: none; z-index: 9988;
        color: #ff003c; font-weight: bold; opacity: 0; font-family: monospace;
        text-shadow: 0 0 8px #ff003c; animation: symbol-float 3s ease-in-out infinite;
      }
      @keyframes symbol-float {
        0% { opacity: 0; transform: translateY(0) rotate(0deg); }
        20% { opacity: 0.8; } 80% { opacity: 0.6; }
        100% { opacity: 0; transform: translateY(-120px) rotate(360deg); }
      }
      .chaos-flash {
        position: fixed; inset: 0; z-index: 99990; background: #ff0000;
        animation: flash-red 0.5s ease-out forwards; pointer-events: none;
      }
      @keyframes flash-red { 0% { opacity: 1; } 100% { opacity: 0; } }
      #chaos-btn.chaos-active { border-color: #ff003c !important; color: #ff003c !important; animation: chaos-btn-pulse 0.8s infinite; }
      @keyframes chaos-btn-pulse {
        0%,100% { box-shadow: 0 0 6px #ff003c44; }
        50% { box-shadow: 0 0 22px #ff003c, 0 0 44px #ff003c66; }
      }
      #chaos-modal {
        position: fixed; inset: 0; z-index: 99995;
        background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.35s ease; backdrop-filter: blur(6px);
      }
      #chaos-modal.visible { opacity: 1; }
      .chaos-modal-box {
        background: #0d0000; border: 1px solid #ff003c55; border-radius: 16px;
        padding: 48px 40px 36px; max-width: 420px; width: 90%; text-align: center;
        transform: scale(0.85) translateY(20px);
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        box-shadow: 0 0 60px rgba(255,0,60,0.2), 0 20px 60px rgba(0,0,0,0.6);
        font-family: "Poppins", sans-serif;
      }
      #chaos-modal.visible .chaos-modal-box { transform: scale(1) translateY(0); }
      .chaos-modal-icon { font-size: 3rem; margin-bottom: 12px; animation: modal-bounce 0.7s cubic-bezier(0.34,1.56,0.64,1); }
      @keyframes modal-bounce { 0% { transform: scale(0) rotate(-30deg); } 100% { transform: scale(1) rotate(0deg); } }
      .chaos-modal-title { font-size: 1.8rem; font-weight: 800; color: #ff003c; letter-spacing: 0.1em; margin-bottom: 10px; font-family: "Raleway", sans-serif; }
      .chaos-modal-sub { color: #ccc; font-size: 0.95rem; margin-bottom: 6px; }
      .chaos-modal-sub strong { color: #fff; }
      .chaos-modal-warn { color: #ff6600; font-size: 0.82rem; margin-bottom: 28px; }
      .chaos-modal-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      .chaos-modal-btns button { padding: 10px 24px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: all 0.25s ease; font-family: "Poppins", sans-serif; border: 2px solid; }
      #chaos-cancel { background: transparent; color: #888; border-color: #333; }
      #chaos-cancel:hover { color: #ccc; border-color: #666; }
      #chaos-confirm { background: #ff003c; color: #fff; border-color: #ff003c; box-shadow: 0 4px 20px rgba(255,0,60,0.4); }
      #chaos-confirm:hover { background: #cc0030; transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 30px rgba(255,0,60,0.7); }
      .chaos-modal-footer { font-size: 0.72rem; color: #444; margin-top: 20px; margin-bottom: 0; }
    `;
    document.head.appendChild(s);
  }
  function setupCursor() {
    cursorEl = document.createElement('div');
    cursorEl.className = 'chaos-cursor';
    document.body.appendChild(cursorEl);
    addedElements.push(cursorEl);
    for (let i = 0; i < 10; i++) {
      const t = document.createElement('div');
      t.className = 'chaos-cursor-trail';
      document.body.appendChild(t);
      trailEls.push(t);
      addedElements.push(t);
    }
    let mx = 0, my = 0;
    const trailX = Array(10).fill(0), trailY = Array(10).fill(0);
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);
    const animT = () => {
      if (!active) return;
      cursorEl.style.left = mx + 'px'; cursorEl.style.top = my + 'px';
      cursorEl.style.transform = `translate(-50%,-50%) rotate(${45 + rand(-15,15)}deg) scale(${rand(0.9,1.1)})`;
      trailX[0] += (mx - trailX[0]) * 0.25; trailY[0] += (my - trailY[0]) * 0.25;
      for (let i = 1; i < 10; i++) {
        trailX[i] += (trailX[i-1] - trailX[i]) * 0.3; trailY[i] += (trailY[i-1] - trailY[i]) * 0.3;
        trailEls[i].style.left = (trailX[i] + rand(-3,3)) + 'px';
        trailEls[i].style.top = (trailY[i] + rand(-3,3)) + 'px';
        trailEls[i].style.opacity = (1 - i / 10) * 0.8;
        const sz = (10 - i) + 'px'; trailEls[i].style.width = sz; trailEls[i].style.height = sz;
        trailEls[i].style.background = i % 3 === 0 ? '#00ffcc' : '#ff003c';
      }
      animFrames.push(requestAnimationFrame(animT));
    };
    animFrames.push(requestAnimationFrame(animT));
  }
  function setupOverlays() {
    const scan = document.createElement('div'); scan.className = 'chaos-scanlines';
    document.body.appendChild(scan); addedElements.push(scan);
    const vhs = document.createElement('div'); vhs.className = 'chaos-vhs';
    for (let i = 0; i < 3; i++) {
      const bar = document.createElement('div'); bar.className = 'chaos-vhs-bar';
      bar.style.animationDelay = (i * 0.12) + 's'; vhs.appendChild(bar);
    }
    document.body.appendChild(vhs); addedElements.push(vhs);
    const canvas = document.createElement('canvas');
    canvas.id = 'chaos-noise'; canvas.width = 300; canvas.height = 300;
    document.body.appendChild(canvas); addedElements.push(canvas);
    const ctx = canvas.getContext('2d');
    const drawNoise = () => {
      if (!active) return;
      const img = ctx.createImageData(300, 300);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v; img.data[i+1] = 0; img.data[i+2] = 0; img.data[i+3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      animFrames.push(requestAnimationFrame(drawNoise));
    };
    drawNoise();
  }
  function startFloatingSymbols() {
    const symbols = ['⚡','💀','⚠️','🔥','❌','!!','01','>>','###','ERR','???','∞','†','☠'];
    const iv = setInterval(() => {
      if (!active) return;
      const el = document.createElement('div'); el.className = 'chaos-symbol';
      el.textContent = pick(symbols);
      el.style.left = rand(0,95) + 'vw'; el.style.top = rand(10,90) + 'vh';
      el.style.fontSize = rand(1,3) + 'rem'; el.style.animationDuration = rand(1.5,4) + 's';
      document.body.appendChild(el); addedElements.push(el);
      setTimeout(() => el.remove(), 4000);
    }, 400);
    intervals.push(iv);
  }
  function glitchText(el) {
    const original = el.getAttribute('data-original') || el.textContent;
    el.setAttribute('data-original', original);
    let frame = 0;
    const iv = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < frame / 20 * original.length) return original[i];
        return GLITCH[randInt(0, GLITCH.length)];
      }).join('');
      if (++frame > 20) { el.textContent = original; clearInterval(iv); }
    }, 30);
  }
  function startGlitchLoop() {
    const iv = setInterval(() => {
      if (!active) return;
      const els = [...document.querySelectorAll('h1,h2,h3,h4,.resume-title')];
      if (els.length) glitchText(pick(els));
    }, 600);
    intervals.push(iv);
  }
  function startHueLoop() {
    let hue = 0;
    const iv = setInterval(() => {
      if (!active) return;
      hue = (hue + 15) % 360;
      document.documentElement.style.setProperty('--chaos-hue', hue + 'deg');
    }, 80);
    intervals.push(iv);
  }
  function startBreaking() {
    const iv = setInterval(() => {
      if (!active) return;
      const victims = [...document.querySelectorAll('p,li,h4,h5,.resume-item,.projects-item')];
      const el = pick(victims); if (!el) return;
      const t = pick([
        `skewX(${rand(-8,8)}deg)`, `skewY(${rand(-5,5)}deg)`,
        `rotate(${rand(-5,5)}deg) scale(${rand(0.9,1.1)})`,
        `translateX(${rand(-8,8)}px)`, `translateY(${rand(-6,6)}px)`,
        `perspective(200px) rotateX(${rand(-10,10)}deg)`,
      ]);
      el.style.transform = t; el.style.transition = 'transform 0.1s';
      setTimeout(() => { if (el) el.style.transform = ''; }, rand(100,500));
    }, 150);
    intervals.push(iv);
  }
  function startScreenShake() {
    const main = document.querySelector('#main');
    const iv = setInterval(() => {
      if (!active || !main) return;
      if (Math.random() > 0.7) {
        main.style.transform = `translate(${rand(-4,4)}px,${rand(-4,4)}px)`;
        setTimeout(() => { if (main) main.style.transform = ''; }, 80);
      }
    }, 200);
    intervals.push(iv);
  }
  function startFlashes() {
    const iv = setInterval(() => {
      if (!active) return;
      if (Math.random() > 0.75) {
        const f = document.createElement('div');
        f.style.cssText = `position:fixed;inset:0;z-index:99980;background:rgba(255,0,0,${rand(0.05,0.2)});pointer-events:none;`;
        f.style.animation = 'flash-red 0.15s ease-out forwards';
        document.body.appendChild(f); addedElements.push(f);
        setTimeout(() => f.remove(), 200);
      }
    }, 800);
    intervals.push(iv);
  }
  function flashIn() {
    const f = document.createElement('div'); f.className = 'chaos-flash';
    document.body.appendChild(f); addedElements.push(f);
    setTimeout(() => f.remove(), 600);
  }
  function showModal(onConfirm) {
    const overlay = document.createElement('div'); overlay.id = 'chaos-modal';
    overlay.innerHTML = `
      <div class="chaos-modal-box">
        <div class="chaos-modal-icon">⚡</div>
        <h2 class="chaos-modal-title">TEM CERTEZA?</h2>
        <p class="chaos-modal-sub">Você está prestes a ativar o <strong>Modo Loucura</strong>.</p>
        <p class="chaos-modal-warn">⚠️ Pode causar glitches, tremores e crises existenciais.</p>
        <div class="chaos-modal-btns">
          <button id="chaos-cancel">Não, me salva</button>
          <button id="chaos-confirm">SIM, PODE VIR 🔥</button>
        </div>
        <p class="chaos-modal-footer">* nada nessa página vai fazer sentido. você foi avisado.</p>
      </div>`;
    document.body.appendChild(overlay); addedElements.push(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    document.getElementById('chaos-cancel').onclick = () => {
      overlay.classList.remove('visible'); setTimeout(() => overlay.remove(), 400);
    };
    document.getElementById('chaos-confirm').onclick = () => {
      overlay.classList.remove('visible'); setTimeout(() => { overlay.remove(); onConfirm(); }, 350);
    };
  }
  let _h1OriginalText = null;

  function deactivate() {
    active = false;
    document.body.classList.remove('chaos-mode');
    intervals.forEach(clearInterval); intervals = [];
    animFrames.forEach(cancelAnimationFrame); animFrames = [];
    addedElements.forEach(el => el && el.parentNode && el.remove()); addedElements = [];
    trailEls = []; cursorEl = null;
    document.documentElement.style.removeProperty('--chaos-hue');
    document.getElementById('chaos-style')?.remove();

    // Restaurar h1
    const h1 = document.querySelector('#hero h1');
    if (h1) {
      if (_h1OriginalText) h1.textContent = _h1OriginalText;
      h1.removeAttribute('data-text');
      h1.removeAttribute('data-original');
    }
    _h1OriginalText = null;

    // Restaurar textos glitchados fora do hero
    document.querySelectorAll('[data-original]').forEach(el => {
      el.textContent = el.getAttribute('data-original');
      el.removeAttribute('data-original');
    });

    // Limpar estilos inline apenas em elementos do #main (fora do hero)
    document.querySelectorAll(
      '#main p, #main li, #main h2, #main h3, #main h4, #main h5, #main em, .resume-item, .projects-item, .nav-menu a, #main img'
    ).forEach(el => el.removeAttribute('style'));

    // Restaurar transform do main
    const main = document.querySelector('#main');
    if (main) main.style.transform = '';

    // ── RESTAURAR HERO COM OS ESTILOS EXATOS QUE O GSAP HAVIA APLICADO ──
    restoreHeroStyles();

    const btn = document.getElementById('chaos-btn');
    if (btn) { btn.textContent = '⚡ Modo Loucura'; btn.classList.remove('chaos-active'); }
  }

  function activate() {
    active = true;
    injectCSS();
    saveHeroStyles(); // Fotografa o estado do GSAP ANTES de qualquer alteração
    flashIn();
    setTimeout(() => {
      document.body.classList.add('chaos-mode');
      // Salvar texto original do h1 ANTES de qualquer glitch
      const h1 = document.querySelector('#hero h1');
      if (h1) {
        _h1OriginalText = h1.textContent;
        h1.setAttribute('data-text', _h1OriginalText);
      }
      setupCursor(); setupOverlays(); startFloatingSymbols();
      startGlitchLoop(); startHueLoop(); startBreaking();
      startScreenShake(); startFlashes();
      const btn = document.getElementById('chaos-btn');
      if (btn) { btn.textContent = '✕ Sair do Caos'; btn.classList.add('chaos-active'); }
    }, 50);
  }

  function toggle() { if (active) deactivate(); else showModal(activate); }
  return { toggle, isActive: () => active };
})();
window.ChaosMode = ChaosMode;