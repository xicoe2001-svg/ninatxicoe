// ===== CELEBRATIONS =====

// ---- Shooting Star (bright flash streak) ----
function launchShootingStar() {
  const wrap = document.createElement('div');
  const startY = 5 + Math.random() * 45;
  const angle = 18 + Math.random() * 16;
  const duration = 900 + Math.random() * 400;
  wrap.style.cssText = `
    position:fixed;
    top:${startY}vh;
    left:0;
    width:100vw;
    height:3px;
    pointer-events:none;
    z-index:99999;
    transform:rotate(${angle}deg) translate3d(0,0,0);
    transform-origin:left center;
    overflow:visible;
  `;
  // Glowing head + fading tail
  const star = document.createElement('div');
  star.style.cssText = `
    position:absolute;
    left:-260px;
    top:-3px;
    width:240px;
    height:6px;
    border-radius:50%;
    background:linear-gradient(to right,transparent,rgba(255,240,120,0.3),rgba(255,240,180,0.85),white,white);
    box-shadow:0 0 8px 3px rgba(255,240,120,0.7),0 0 20px 6px rgba(255,200,80,0.4);
    animation:streakMove ${duration}ms cubic-bezier(0.4,0,0.6,1) forwards;
    -webkit-animation:streakMove ${duration}ms cubic-bezier(0.4,0,0.6,1) forwards;
  `;
  wrap.appendChild(star);
  document.body.appendChild(wrap);
  setTimeout(() => { if(wrap.parentNode) wrap.remove(); }, duration + 200);
}

function scheduleShootingStar() {
  launchShootingStar();
  setTimeout(scheduleShootingStar, 6000 + Math.random() * 7000);
}
setTimeout(() => { launchShootingStar(); scheduleShootingStar(); }, 3000);

// ---- Confetti ----
function launchConfetti(container, count, symbols) {
  if (!container) return;
  symbols = symbols || ['✦','✧','⋆','★','·','✩','♥'];
  const colors = ['#e8927a','#c4a8d4','#7aba8a','#f0c040','#a0c8e0','#e8b4c4'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!container.parentNode) return;
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position:absolute;
        left:${Math.random()*100}%;
        top:-24px;
        font-size:${8+Math.random()*14}px;
        color:${colors[Math.floor(Math.random()*colors.length)]};
        animation:confettiFall ${1.3+Math.random()*2}s linear forwards;
        -webkit-animation:confettiFall ${1.3+Math.random()*2}s linear forwards;
        pointer-events:none;
        will-change:transform;
      `;
      container.appendChild(el);
      setTimeout(() => { if(el.parentNode) el.remove(); }, 3500);
    }, i * 50);
  }
}

// ---- SVG Illustrations ----
const SVG_DIANA = `
<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
  <style>
    .dr1{animation:drPop 0.3s ease 0.1s both}
    .dr2{animation:drPop 0.3s ease 0.2s both}
    .dr3{animation:drPop 0.3s ease 0.3s both}
    .dr4{animation:drPop 0.3s ease 0.4s both}
    .dc {animation:drPop 0.3s ease 0.5s both}
    .drt{animation:drtFly 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.6s both}
    .dsp{animation:dspPop 0.4s ease 1s both}
    @keyframes drPop{from{transform:scale(0);opacity:0;transform-origin:80px 80px}to{transform:scale(1);opacity:1;transform-origin:80px 80px}}
    @keyframes drtFly{from{transform:translateX(-130px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes dspPop{from{transform:scale(0);opacity:0;transform-origin:80px 80px}to{transform:scale(1);opacity:1;transform-origin:80px 80px}}
  </style>
  <circle class="dr1" cx="80" cy="80" r="76" fill="#e8927a"/>
  <circle class="dr2" cx="80" cy="80" r="58" fill="#fff8f0"/>
  <circle class="dr3" cx="80" cy="80" r="42" fill="#e8927a" opacity="0.85"/>
  <circle class="dr4" cx="80" cy="80" r="26" fill="#fff8f0"/>
  <circle class="dc"  cx="80" cy="80" r="12" fill="#c0392b"/>
  <circle cx="80" cy="80" r="5" fill="#7a0000"/>
  <!-- Dart -->
  <g class="drt">
    <rect x="12" y="77" width="62" height="6" rx="3" fill="#5a3e28"/>
    <polygon points="74,80 88,75 88,85" fill="#c9a84c"/>
    <polygon points="12,77 26,68 26,77" fill="#e8927a"/>
    <polygon points="12,83 26,92 26,83" fill="#e8927a"/>
  </g>
  <!-- Sparkles -->
  <g class="dsp">
    <text x="94" y="52" font-size="14" fill="#f0c040" font-family="serif">✦</text>
    <text x="60" y="46" font-size="10" fill="#f0c040" font-family="serif">✧</text>
    <text x="98" y="112" font-size="12" fill="#e8927a" font-family="serif">⋆</text>
    <text x="52" y="116" font-size="14" fill="#f0c040" font-family="serif">✦</text>
  </g>
</svg>`;

const SVG_COPAS = `
<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" width="160" height="130">
  <style>
    .cgl{animation:copaL 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.3s both}
    .cgr{animation:copaR 0.5s cubic-bezier(0.34,1.4,0.64,1) 0.3s both}
    .csp{animation:cspPop 0.5s cubic-bezier(0.34,1.6,0.64,1) 0.75s both}
    .bub{animation:bubbleRise 2s ease infinite}
    @keyframes copaL{from{transform:translate(-50px,10px) rotate(-25deg);opacity:0}to{transform:translate(0,0) rotate(-10deg);opacity:1}}
    @keyframes copaR{from{transform:translate(50px,10px) rotate(25deg);opacity:0}to{transform:translate(0,0) rotate(10deg);opacity:1}}
    @keyframes cspPop{from{transform:scale(0) translateY(10px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
    @keyframes bubbleRise{0%{opacity:0.7;transform:translateY(0)}100%{opacity:0;transform:translateY(-40px) scale(0.3)}}
  </style>
  <!-- Left glass -->
  <g class="cgl">
    <path d="M45 15 Q38 55 42 75 L68 75 Q72 55 65 15 Z" fill="#d4e8f4" opacity="0.9"/>
    <path d="M45 15 Q38 55 42 75 L68 75 Q72 55 65 15 Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
    <!-- wine -->
    <path d="M48 50 Q42 65 44 75 L66 75 Q68 65 62 50 Z" fill="#9b2335" opacity="0.75"/>
    <rect x="52" y="75" width="10" height="22" rx="3" fill="#b8ccda"/>
    <ellipse cx="57" cy="97" rx="14" ry="4" fill="#b8ccda"/>
    <!-- bubbles -->
    <circle cx="52" cy="68" r="2" fill="white" opacity="0.7" style="animation-delay:0s"/>
    <circle cx="60" cy="60" r="1.5" fill="white" opacity="0.6" class="bub" style="animation-delay:0.5s"/>
    <circle cx="55" cy="55" r="1.5" fill="white" opacity="0.5" class="bub" style="animation-delay:1s"/>
  </g>
  <!-- Right glass -->
  <g class="cgr">
    <path d="M135 15 Q128 55 132 75 L158 75 Q162 55 155 15 Z" fill="#d4e8f4" opacity="0.9"/>
    <path d="M135 15 Q128 55 132 75 L158 75 Q162 55 155 15 Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
    <path d="M138 50 Q132 65 134 75 L156 75 Q158 65 152 50 Z" fill="#9b2335" opacity="0.75"/>
    <rect x="142" y="75" width="10" height="22" rx="3" fill="#b8ccda"/>
    <ellipse cx="147" cy="97" rx="14" ry="4" fill="#b8ccda"/>
    <circle cx="142" cy="65" r="2" fill="white" opacity="0.7" class="bub" style="animation-delay:0.3s"/>
    <circle cx="150" cy="58" r="1.5" fill="white" opacity="0.6" class="bub" style="animation-delay:0.8s"/>
  </g>
  <!-- Clink sparkles -->
  <g class="csp">
    <text x="88"  y="22" font-size="18" fill="#f0c040" font-family="serif">✦</text>
    <text x="72"  y="38" font-size="12" fill="#f0c040" font-family="serif">✧</text>
    <text x="106" y="40" font-size="14" fill="#f0c040" font-family="serif">⋆</text>
    <text x="95"  y="55" font-size="10" fill="#f0c040" font-family="serif">·</text>
    <text x="80"  y="50" font-size="10" fill="#e8927a" font-family="serif">·</text>
  </g>
</svg>`;

const SVG_CIMA = `
<svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" width="200" height="170">
  <style>
    .mt {animation:mtPop 0.6s cubic-bezier(0.34,1.2,0.64,1) 0.1s both;transform-origin:120px 180px}
    .fb {animation:figUp 0.7s cubic-bezier(0.34,1.3,0.64,1) 0.6s both;transform-origin:90px 180px}
    .fg {animation:figUp 0.7s cubic-bezier(0.34,1.3,0.64,1) 0.75s both;transform-origin:150px 180px}
    .fl {animation:flagPop 0.5s cubic-bezier(0.34,1.5,0.64,1) 1.2s both;transform-origin:120px 22px}
    .sk {animation:sparkPop 0.4s ease 1.4s both;transform-origin:120px 22px}
    @keyframes mtPop{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}
    @keyframes figUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes flagPop{from{transform:scale(0) rotate(-30deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
    @keyframes sparkPop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  </style>
  <!-- Sky bg -->
  <rect width="240" height="190" fill="none"/>
  <!-- Mountain -->
  <g class="mt">
    <polygon points="120,22 18,180 222,180" fill="#8aaa78" opacity="0.85"/>
    <polygon points="120,22 70,180 170,180" fill="#6a8a58" opacity="0.9"/>
    <!-- Snow -->
    <polygon points="120,22 96,76 144,76" fill="white" opacity="0.95"/>
  </g>
  <!-- Ground -->
  <rect x="10" y="178" width="220" height="8" rx="4" fill="#7a9a68" opacity="0.7"/>
  <!-- Flag -->
  <g class="fl">
    <line x1="120" y1="22" x2="120" y2="6" stroke="#5a3e28" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="120,6 148,13 120,20" fill="#e8927a"/>
  </g>
  <!-- Boy figure -->
  <g class="fb">
    <circle cx="90" cy="98" r="9" fill="#5a7a9a"/>
    <rect x="85" y="107" width="10" height="18" rx="4" fill="#3d5a7a"/>
    <!-- arms raised -->
    <line x1="90" y1="110" x2="72" y2="94" stroke="#5a7a9a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="90" y1="110" x2="108" y2="94" stroke="#5a7a9a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="87" y1="125" x2="82" y2="140" stroke="#3d5a7a" stroke-width="3" stroke-linecap="round"/>
    <line x1="93" y1="125" x2="98" y2="140" stroke="#3d5a7a" stroke-width="3" stroke-linecap="round"/>
  </g>
  <!-- Girl figure -->
  <g class="fg">
    <circle cx="150" cy="98" r="9" fill="#e8927a"/>
    <!-- hair -->
    <path d="M142,94 Q150,87 158,94" fill="#5a3e28" stroke="#5a3e28" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <rect x="145" y="107" width="10" height="14" rx="4" fill="#c0392b"/>
    <!-- skirt -->
    <path d="M142,120 Q150,134 158,120 Z" fill="#f5d5a0"/>
    <!-- arms raised -->
    <line x1="150" y1="110" x2="132" y2="94" stroke="#e8927a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="150" y1="110" x2="168" y2="94" stroke="#e8927a" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="147" y1="134" x2="142" y2="148" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="153" y1="134" x2="158" y2="148" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
  </g>
  <!-- Stars -->
  <g class="sk">
    <text x="42"  y="54" font-size="14" fill="#f0c040" font-family="serif">✦</text>
    <text x="192" y="60" font-size="12" fill="#f0c040" font-family="serif">✧</text>
    <text x="210" y="36" font-size="16" fill="#e8927a" font-family="serif">⋆</text>
    <text x="28"  y="82" font-size="10" fill="#f0c040" font-family="serif">✦</text>
    <text x="200" y="88" font-size="10" fill="#f0c040" font-family="serif">·</text>
  </g>
</svg>`;

const SVG_CINE = `
<svg viewBox="0 0 260 190" xmlns="http://www.w3.org/2000/svg" width="220" height="165">
  <style>
    .scr{animation:scrOn 0.6s ease 0.2s both}
    .ap1{animation:apUp 0.5s ease 0.7s both}
    .ap2{animation:apUp 0.5s ease 0.8s both}
    .ap3{animation:apUp 0.5s ease 0.75s both}
    .ap4{animation:apUp 0.5s ease 0.85s both}
    .ap5{animation:apUp 0.5s ease 0.78s both}
    .ap6{animation:apUp 0.5s ease 0.82s both}
    .ap7{animation:apUp 0.5s ease 0.72s both}
    .hd{animation:hdPop 0.4s ease 0.6s both}
    .filmstar{animation:starPop2 0.4s ease 1s both}
    @keyframes scrOn{from{transform:scaleX(0);opacity:0;transform-origin:130px 55px}to{transform:scaleX(1);opacity:1;transform-origin:130px 55px}}
    @keyframes apUp{0%{transform:translateY(0)}50%{transform:translateY(-9px)}100%{transform:translateY(0)};animation-iteration-count:infinite;animation-duration:0.6s}
    @keyframes hdPop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes starPop2{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  </style>
  <!-- Screen -->
  <g class="scr">
    <rect x="14" y="8" width="232" height="95" rx="8" fill="#1a1628"/>
    <rect x="22" y="16" width="216" height="79" rx="5" fill="#2e2845"/>
    <!-- Film reel -->
    <circle cx="130" cy="56" r="30" fill="none" stroke="#c4a8e8" stroke-width="2.5"/>
    <circle cx="130" cy="56" r="20" fill="#c4a8e8" opacity="0.15"/>
    <circle cx="130" cy="56" r="6"  fill="#c4a8e8" opacity="0.6"/>
    <!-- Play triangle -->
    <polygon points="122,44 122,68 150,56" fill="#f0e8ff" opacity="0.9"/>
    <!-- Screen stars -->
    <text x="34" y="36" font-size="11" fill="#f0c040">✦</text>
    <text x="218" y="36" font-size="11" fill="#f0c040">✦</text>
    <text x="34" y="92" font-size="9"  fill="#f0c040">✧</text>
    <text x="220" y="92" font-size="9"  fill="#f0c040">✧</text>
  </g>
  <!-- Curtains -->
  <rect x="14" y="8" width="18" height="95" rx="4" fill="#9b2335" opacity="0.7"/>
  <rect x="228" y="8" width="18" height="95" rx="4" fill="#9b2335" opacity="0.7"/>
  <!-- Heads row 1 -->
  <g class="hd">
    <circle cx="30"  cy="113" r="8" fill="#5a7a9a"/>
    <circle cx="62"  cy="113" r="8" fill="#e8927a"/>
    <circle cx="94"  cy="113" r="8" fill="#7aba8a"/>
    <circle cx="126" cy="113" r="8" fill="#c4a8e8"/>
    <circle cx="158" cy="113" r="8" fill="#5a7a9a"/>
    <circle cx="190" cy="113" r="8" fill="#e8927a"/>
    <circle cx="222" cy="113" r="8" fill="#7aba8a"/>
  </g>
  <!-- Seats row 1 -->
  <rect x="18"  y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="50"  y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="82"  y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="114" y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="146" y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="178" y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <rect x="210" y="120" width="22" height="14" rx="5" fill="#2e2845" opacity="0.8"/>
  <!-- Applause hands -->
  <g>
    <text x="18"  y="114" font-size="14" class="ap1">👏</text>
    <text x="50"  y="114" font-size="14" class="ap2">👏</text>
    <text x="82"  y="114" font-size="14" class="ap3">👏</text>
    <text x="114" y="114" font-size="14" class="ap4">👏</text>
    <text x="146" y="114" font-size="14" class="ap5">👏</text>
    <text x="178" y="114" font-size="14" class="ap6">👏</text>
    <text x="210" y="114" font-size="14" class="ap7">👏</text>
  </g>
  <!-- Heads row 2 -->
  <circle cx="46"  cy="150" r="7" fill="#c4a8e8"/>
  <circle cx="78"  cy="150" r="7" fill="#5a7a9a"/>
  <circle cx="110" cy="150" r="7" fill="#e8927a"/>
  <circle cx="142" cy="150" r="7" fill="#7aba8a"/>
  <circle cx="174" cy="150" r="7" fill="#c4a8e8"/>
  <circle cx="206" cy="150" r="7" fill="#5a7a9a"/>
  <!-- Stars film -->
  <g class="filmstar">
    <text x="108" y="190" font-size="11" fill="#f0c040">✦ ✧ ✦ ✧ ✦ ✧ ✦</text>
  </g>
</svg>`;

const SVGS = { plan: SVG_DIANA, restaurante: SVG_COPAS, ruta: SVG_CIMA, peli: SVG_CINE };

// ---- Show Celebration ----
function showCelebration(type, subtitle) {
  try {
    const existing = document.getElementById('celebration-overlay');
    if (existing) existing.remove();

    const configs = {
      plan:        { title:'¡Plan conseguido!',  text:'Un plan menos, mil recuerdos más ✦' },
      restaurante: { title:'¡Salud!',             text:'Una velada para no olvidar ✦'       },
      ruta:        { title:'¡A la cima!',         text:'Juntos llegaréis a donde sea ✦'    },
      peli:        { title:'¡Peliculón!',         text:'El público enloquece ✦'             }
    };
    const cfg = configs[type] || configs.plan;
    const svg = SVGS[type] || SVG_DIANA;

    const overlay = document.createElement('div');
    overlay.id = 'celebration-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;
      z-index:999999;
      display:flex;align-items:center;justify-content:center;
      transform:translate3d(0,0,0);
      -webkit-transform:translate3d(0,0,0);
    `;
    overlay.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)"></div>
      <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none" id="celeb-confetti"></div>
      <div class="celeb-card" style="position:relative;z-index:2">
        <div class="celeb-svg-wrap">${svg}</div>
        <div class="celeb-title">${cfg.title}</div>
        <div class="celeb-subtitle">${subtitle ? subtitle : cfg.text}</div>
        <div class="celeb-stars-row">✦ ✧ ✦ ✧ ✦</div>
      </div>
    `;
    document.body.appendChild(overlay);
    launchConfetti(overlay.querySelector('#celeb-confetti'), 45);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.6s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 700);
    }, 3200);
    overlay.addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.3s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 400);
    });
  } catch(e) { console.warn('Celebration error:', e); }
}

// ---- Epic Viaje ----
function showEpicViajeAnimation(destino) {
  try {
    const existing = document.getElementById('viaje-epic-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'viaje-epic-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;
      z-index:999999;
      display:flex;align-items:center;justify-content:center;text-align:center;
      padding:32px;
      background:radial-gradient(ellipse at center, rgba(232,146,122,0.18) 0%, var(--bg,#fdf8f0) 70%);
      transform:translate3d(0,0,0);
      -webkit-transform:translate3d(0,0,0);
      animation:celebIn 0.5s ease;
      -webkit-animation:celebIn 0.5s ease;
    `;
    overlay.innerHTML = `
      <div style="position:absolute;inset:0;overflow:hidden;pointer-events:none" id="epic-confetti"></div>
      <div style="position:relative;z-index:2">
        <div style="font-size:72px;display:block;margin-bottom:20px;animation:flyIn 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards;-webkit-animation:flyIn 0.8s cubic-bezier(0.34,1.4,0.64,1) forwards;filter:drop-shadow(0 8px 20px rgba(232,146,122,0.5))">✈️</div>
        <div style="font-size:1rem;color:var(--text-muted,#8a7060);margin-bottom:8px;animation:fadeUp 0.6s ease 0.4s both;-webkit-animation:fadeUp 0.6s ease 0.4s both">¡Habéis empezado el viaje a</div>
        <div style="font-family:'Playfair Display',serif;font-size:clamp(1.8rem,7vw,2.8rem);font-style:italic;color:var(--accent,#e8927a);animation:fadeUp 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.7s both;-webkit-animation:fadeUp 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.7s both;margin-bottom:14px;text-shadow:0 4px 20px rgba(232,146,122,0.3)">${destino}!</div>
        <div style="font-size:1.1rem;color:var(--text,#3d2e1e);animation:fadeUp 0.6s ease 1s both;-webkit-animation:fadeUp 0.6s ease 1s both;margin-bottom:16px">¡Que sea increíble! 🌍</div>
        <div style="font-size:1rem;letter-spacing:8px;color:var(--star-color,#f0c040);animation:fadeUp 0.6s ease 1.3s both,twinkle 1.5s ease 1.3s infinite;-webkit-animation:fadeUp 0.6s ease 1.3s both">✦ ✧ ✦ ✧ ✦ ✧ ✦</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const layer = overlay.querySelector('#epic-confetti');
    const sym = ['✦','✧','⋆','★','·','✩','♥','🌟','💫','⭐','✨'];
    launchConfetti(layer, 70, sym);
    setTimeout(() => launchConfetti(layer, 50, sym), 700);
    setTimeout(() => launchConfetti(layer, 40, sym), 1400);
    setTimeout(() => launchConfetti(layer, 30, sym), 2200);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.8s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 900);
    }, 4500);
    overlay.addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.4s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 500);
    });
  } catch(e) { console.warn('Epic viaje error:', e); }
}
