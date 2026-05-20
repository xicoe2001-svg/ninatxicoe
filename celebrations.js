// ===== CELEBRATIONS =====

// ---- Shooting Stars ----
function launchShootingStar() {
  const container = document.getElementById('stars-bg');
  if (!container) return;
  const star = document.createElement('div');
  const angle = 20 + Math.random() * 25;
  const startY = Math.random() * 60;
  star.style.cssText = `
    position: absolute;
    top: ${startY}vh;
    left: -200px;
    width: ${120 + Math.random() * 100}px;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--accent) 60%, white 80%, transparent);
    border-radius: 50%;
    transform: rotate(${angle}deg);
    transform-origin: right center;
    animation: shootingStarAnim 1.1s cubic-bezier(0.4,0,1,1) forwards;
    pointer-events: none;
    z-index: 1;
  `;
  container.appendChild(star);
  setTimeout(() => star.remove(), 1300);
}

setInterval(() => {
  if (Math.random() > 0.35) launchShootingStar();
}, 6000);
setTimeout(launchShootingStar, 3000);

// ---- Confetti rain ----
function launchConfetti(container, count = 30, symbols = ['✦','✧','⋆','★','·','✩','♥']) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: absolute;
        left: ${5 + Math.random() * 90}%;
        top: -20px;
        font-size: ${10 + Math.random() * 14}px;
        color: ${['var(--accent)','var(--accent2)','var(--accent3)','var(--star-color)'][Math.floor(Math.random()*4)]};
        animation: confettiFall ${1.2 + Math.random() * 1.5}s ease-in forwards;
        pointer-events: none;
        z-index: 10;
        opacity: 0.9;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * 60);
  }
}

// ---- Main celebration overlay ----
function showCelebration(type, subtitle = '') {
  // Remove existing
  const existing = document.getElementById('celebration-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'celebration-overlay';

  const config = CELEBRATIONS[type] || CELEBRATIONS.plan;
  const { svg, title, text, colors } = config();

  overlay.innerHTML = `
    <div class="celeb-backdrop"></div>
    <div class="celeb-confetti-layer"></div>
    <div class="celeb-card">
      <div class="celeb-svg-wrap">${svg}</div>
      <div class="celeb-title">${title}</div>
      <div class="celeb-subtitle">${subtitle || text}</div>
      <div class="celeb-stars-row">✦ ✧ ✦ ✧ ✦</div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Confetti
  const confettiLayer = overlay.querySelector('.celeb-confetti-layer');
  launchConfetti(confettiLayer, 40);

  // Auto dismiss
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.6s ease';
    setTimeout(() => overlay.remove(), 700);
  }, 3200);

  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => overlay.remove(), 500);
  });
}

// ---- Celebration definitions ----
const CELEBRATIONS = {

  plan: () => ({
    title: '¡Plan conseguido!',
    text: '✦ Un plan menos, mil recuerdos más ✦',
    svg: `
      <svg viewBox="0 0 220 200" width="220" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- Diana -->
        <circle cx="110" cy="100" r="88" fill="#e8927a" opacity="0.9"/>
        <circle cx="110" cy="100" r="68" fill="white"/>
        <circle cx="110" cy="100" r="50" fill="#e8927a" opacity="0.8"/>
        <circle cx="110" cy="100" r="32" fill="white"/>
        <circle cx="110" cy="100" r="16" fill="#c0392b"/>
        <circle cx="110" cy="100" r="7" fill="#8b0000"/>
        <!-- Dart -->
        <g style="animation: dartFly 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.3s both; transform-origin: 0 100px;">
          <!-- Shaft -->
          <rect x="10" y="97.5" width="90" height="5" rx="2.5" fill="#5a3e28"/>
          <!-- Tip -->
          <polygon points="100,100 115,96 115,104" fill="#c9a84c"/>
          <!-- Flights -->
          <polygon points="10,97.5 25,88 25,97.5" fill="#e8927a"/>
          <polygon points="10,102.5 25,112 25,102.5" fill="#e8927a"/>
          <polygon points="10,97.5 20,93 20,97.5" fill="#c0392b"/>
        </g>
        <!-- Impact sparkles -->
        <g style="animation: sparkleExplode 0.5s ease 0.9s both; transform-origin: 110px 100px;">
          <text x="90" y="72" font-size="16" style="animation: starPop 0.4s ease 1s both">✦</text>
          <text x="130" y="80" font-size="12" style="animation: starPop 0.4s ease 1.1s both">✧</text>
          <text x="85" y="130" font-size="14" style="animation: starPop 0.4s ease 1.05s both">⋆</text>
          <text x="128" y="128" font-size="16" style="animation: starPop 0.4s ease 1.15s both">✦</text>
        </g>
      </svg>
    `
  }),

  restaurante: () => ({
    title: '¡Salud!',
    text: '✦ Una velada para recordar ✦',
    svg: `
      <svg viewBox="0 0 220 200" width="220" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- Left glass -->
        <g style="animation: copaClink 0.5s cubic-bezier(0.34,1.5,0.64,1) 0.5s both; transform-origin: 85px 140px;">
          <path d="M65 40 Q65 100 75 130 L95 130 Q105 100 105 40 Z" fill="#c4d4e8" opacity="0.85"/>
          <path d="M65 40 Q65 100 75 130 L95 130 Q105 100 105 40 Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/>
          <rect x="78" y="130" width="14" height="30" rx="3" fill="#a0b4c8"/>
          <rect x="66" y="158" width="38" height="5" rx="2.5" fill="#a0b4c8"/>
          <!-- wine -->
          <path d="M68 80 Q65 100 75 130 L95 130 Q105 100 102 80 Z" fill="#c0392b" opacity="0.7"/>
          <!-- bubbles -->
          <circle cx="78" cy="100" r="2.5" fill="white" opacity="0.6" style="animation: bubble 1.5s ease 0.8s infinite"/>
          <circle cx="88" cy="115" r="2" fill="white" opacity="0.5" style="animation: bubble 1.8s ease 1s infinite"/>
        </g>
        <!-- Right glass -->
        <g style="animation: copaClink 0.5s cubic-bezier(0.34,1.5,0.64,1) 0.5s both; transform-origin: 135px 140px; transform: scaleX(-1) translateX(-270px);">
          <path d="M65 40 Q65 100 75 130 L95 130 Q105 100 105 40 Z" fill="#c4d4e8" opacity="0.85"/>
          <path d="M65 40 Q65 100 75 130 L95 130 Q105 100 105 40 Z" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/>
          <rect x="78" y="130" width="14" height="30" rx="3" fill="#a0b4c8"/>
          <rect x="66" y="158" width="38" height="5" rx="2.5" fill="#a0b4c8"/>
          <path d="M68 80 Q65 100 75 130 L95 130 Q105 100 102 80 Z" fill="#c0392b" opacity="0.7"/>
          <circle cx="78" cy="105" r="2.5" fill="white" opacity="0.6" style="animation: bubble 1.6s ease 0.9s infinite"/>
        </g>
        <!-- Sparkles at clink point -->
        <g style="animation: sparkleExplode 0.6s ease 0.9s both; transform-origin: 110px 55px;">
          <text x="98" y="40" font-size="18" fill="#f0c040">✦</text>
          <text x="80" y="30" font-size="12" fill="#f0c040">✧</text>
          <text x="118" y="28" font-size="14" fill="#f0c040">⋆</text>
          <text x="108" y="60" font-size="10" fill="#f0c040">·</text>
          <text x="88" y="55" font-size="10" fill="#f0c040">·</text>
        </g>
      </svg>
    `
  }),

  ruta: () => ({
    title: '¡A la cima!',
    text: '✦ Juntos llegaréis a donde sea ✦',
    svg: `
      <svg viewBox="0 0 260 210" width="260" height="210" xmlns="http://www.w3.org/2000/svg">
        <!-- Sky -->
        <rect width="260" height="210" fill="none"/>
        <!-- Mountain -->
        <polygon points="130,20 30,180 230,180" fill="#b8c8a0" opacity="0.8"/>
        <polygon points="130,20 80,180 180,180" fill="#a0b890" opacity="0.9"/>
        <!-- Snow cap -->
        <polygon points="130,20 108,80 152,80" fill="white" opacity="0.95"/>
        <!-- Ground -->
        <rect x="20" y="178" width="220" height="10" rx="5" fill="#8aaa78" opacity="0.6"/>

        <!-- Flag at top -->
        <g style="animation: flagAppear 0.5s cubic-bezier(0.34,1.4,0.64,1) 1.2s both; transform-origin: 130px 20px;">
          <line x1="130" y1="20" x2="130" y2="5" stroke="#5a3e28" stroke-width="2.5"/>
          <polygon points="130,5 155,12 130,19" fill="#e8927a"/>
        </g>

        <!-- Figure 1 - chico (left) -->
        <g style="animation: climbUp 1s cubic-bezier(0.34,1.2,0.64,1) 0.2s both; transform-origin: 105px 180px;">
          <!-- body -->
          <circle cx="105" cy="155" r="8" fill="#5a7a9a"/>
          <rect x="101" y="163" width="8" height="16" rx="3" fill="#3d5a7a"/>
          <!-- arms up -->
          <line x1="105" y1="165" x2="88" y2="150" stroke="#5a7a9a" stroke-width="3" stroke-linecap="round" style="animation: armRaise 0.4s ease 1.1s both; transform-origin: 105px 165px;"/>
          <line x1="105" y1="165" x2="122" y2="150" stroke="#5a7a9a" stroke-width="3" stroke-linecap="round" style="animation: armRaise 0.4s ease 1.1s both; transform-origin: 105px 165px;"/>
          <!-- legs -->
          <line x1="103" y1="179" x2="98" y2="192" stroke="#3d5a7a" stroke-width="3" stroke-linecap="round"/>
          <line x1="107" y1="179" x2="112" y2="192" stroke="#3d5a7a" stroke-width="3" stroke-linecap="round"/>
        </g>

        <!-- Figure 2 - chica (right) -->
        <g style="animation: climbUp 1s cubic-bezier(0.34,1.2,0.64,1) 0.4s both; transform-origin: 155px 180px;">
          <!-- body + skirt -->
          <circle cx="155" cy="155" r="8" fill="#e8927a"/>
          <rect x="151" y="163" width="8" height="12" rx="2" fill="#c0392b"/>
          <!-- skirt -->
          <path d="M148 172 Q155 185 162 172 Z" fill="#e8d4b0"/>
          <!-- hair -->
          <path d="M148 150 Q155 145 162 150" fill="none" stroke="#5a3e28" stroke-width="3"/>
          <!-- arms up -->
          <line x1="155" y1="165" x2="138" y2="150" stroke="#e8927a" stroke-width="3" stroke-linecap="round" style="animation: armRaise 0.4s ease 1.2s both; transform-origin: 155px 165px;"/>
          <line x1="155" y1="165" x2="172" y2="150" stroke="#e8927a" stroke-width="3" stroke-linecap="round" style="animation: armRaise 0.4s ease 1.2s both; transform-origin: 155px 165px;"/>
          <!-- legs -->
          <line x1="153" y1="185" x2="148" y2="198" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
          <line x1="157" y1="185" x2="162" y2="198" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
        </g>

        <!-- Stars around -->
        <text x="50" y="50" font-size="14" fill="#f0c040" style="animation: starPop 0.4s ease 1.3s both">✦</text>
        <text x="200" y="60" font-size="12" fill="#f0c040" style="animation: starPop 0.4s ease 1.4s both">✧</text>
        <text x="220" y="30" font-size="16" fill="#e8927a" style="animation: starPop 0.4s ease 1.5s both">⋆</text>
        <text x="35" y="80" font-size="10" fill="#f0c040" style="animation: starPop 0.4s ease 1.6s both">✦</text>
      </svg>
    `
  }),

  peli: () => ({
    title: '¡Peliculón!',
    text: '✦ El público enloquece ✦',
    svg: `
      <svg viewBox="0 0 260 200" width="260" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- Cinema screen -->
        <rect x="20" y="10" width="220" height="90" rx="8" fill="#1a1628" opacity="0.95"/>
        <rect x="28" y="18" width="204" height="74" rx="4" fill="#2e2845"/>
        <!-- Film icon on screen -->
        <circle cx="130" cy="55" r="28" fill="none" stroke="#c4a8e8" stroke-width="3" style="animation: spinSlow 3s linear infinite"/>
        <circle cx="130" cy="55" r="18" fill="#c4a8e8" opacity="0.2"/>
        <polygon points="120,45 120,65 148,55" fill="#f0e8ff"/>
        <!-- Film reel dots -->
        <circle cx="130" cy="28" r="3.5" fill="#c4a8e8"/>
        <circle cx="130" cy="82" r="3.5" fill="#c4a8e8"/>
        <circle cx="103" cy="55" r="3.5" fill="#c4a8e8"/>
        <circle cx="157" cy="55" r="3.5" fill="#c4a8e8"/>

        <!-- Stars on screen -->
        <text x="42" y="38" font-size="12" fill="#f0c040" style="animation: starPop 0.5s ease 0.5s both">✦</text>
        <text x="208" y="38" font-size="12" fill="#f0c040" style="animation: starPop 0.5s ease 0.6s both">✦</text>
        <text x="42" y="90" font-size="10" fill="#f0c040" style="animation: starPop 0.5s ease 0.7s both">✧</text>
        <text x="210" y="90" font-size="10" fill="#f0c040" style="animation: starPop 0.5s ease 0.8s both">✧</text>

        <!-- Audience seats -->
        <g opacity="0.85">
          <!-- Row 3 (back) -->
          <rect x="30" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="58" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="86" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="114" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="142" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="170" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="198" y="112" width="20" height="16" rx="5" fill="#3a3258"/>
          <!-- Row 2 -->
          <rect x="44" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="72" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="100" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="128" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="156" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="184" y="136" width="20" height="16" rx="5" fill="#3a3258"/>
          <!-- Row 1 (front) -->
          <rect x="55" y="162" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="85" y="162" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="115" y="162" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="145" y="162" width="20" height="16" rx="5" fill="#3a3258"/>
          <rect x="175" y="162" width="20" height="16" rx="5" fill="#3a3258"/>
        </g>

        <!-- Heads -->
        <circle cx="40" cy="110" r="7" fill="#5a7a9a"/>
        <circle cx="68" cy="110" r="7" fill="#e8927a"/>
        <circle cx="96" cy="110" r="7" fill="#7aba8a"/>
        <circle cx="124" cy="110" r="7" fill="#c4a8e8"/>
        <circle cx="152" cy="110" r="7" fill="#5a7a9a"/>
        <circle cx="180" cy="110" r="7" fill="#e8927a"/>
        <circle cx="208" cy="110" r="7" fill="#7aba8a"/>

        <!-- Applauding hands -->
        <g style="animation: clap 0.4s ease infinite alternate">
          <text x="24" y="108" font-size="13">👏</text>
          <text x="52" y="108" font-size="13">👏</text>
          <text x="80" y="108" font-size="13">👏</text>
          <text x="108" y="108" font-size="13">👏</text>
          <text x="136" y="108" font-size="13">👏</text>
          <text x="164" y="108" font-size="13">👏</text>
          <text x="192" y="108" font-size="13">👏</text>
        </g>
      </svg>
    `
  }),
};

// ---- Epic viaje animation (replaces the old one) ----
function showEpicViajeAnimation(destino) {
  const existing = document.getElementById('viaje-epic-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'viaje-epic-overlay';
  overlay.innerHTML = `
    <div class="epic-stars-layer"></div>
    <div class="epic-content">
      <div class="epic-plane">✈️</div>
      <div class="epic-label">¡Habéis empezado el viaje a</div>
      <h1 class="epic-destino">${destino}!</h1>
      <div class="epic-sub">¡Que sea increíble! 🌍</div>
      <div class="epic-stars-row">✦ ✧ ✦ ✧ ✦ ✧ ✦</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Massive confetti
  const layer = overlay.querySelector('.epic-stars-layer');
  launchConfetti(layer, 80, ['✦','✧','⋆','★','·','✩','♥','🌟','💫','⭐']);

  // Extra waves
  setTimeout(() => launchConfetti(layer, 50, ['✦','✧','💫','⭐','🌟']), 800);
  setTimeout(() => launchConfetti(layer, 40, ['✦','✧','⋆','♥']), 1500);

  // Auto dismiss
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.8s ease';
    setTimeout(() => overlay.remove(), 900);
  }, 4500);

  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => overlay.remove(), 500);
  });
}
