// ===== CELEBRATIONS & EFFECTS =====

// ---- Shooting Stars ----
function launchShootingStar() {
  const star = document.createElement('div');
  const startY = 5 + Math.random() * 50;
  star.style.cssText = `
    position: fixed;
    top: ${startY}vh;
    left: -250px;
    width: ${160 + Math.random() * 100}px;
    height: 2.5px;
    background: linear-gradient(to right, transparent, #f0c040 50%, white 75%, transparent);
    border-radius: 50%;
    transform: rotate(${18 + Math.random() * 18}deg);
    animation: shootingStarAnim ${0.9 + Math.random() * 0.5}s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(star);
  setTimeout(() => { if (star.parentNode) star.remove(); }, 1600);
}

// Shoot every 7-12s
function scheduleShootingStar() {
  launchShootingStar();
  setTimeout(scheduleShootingStar, 7000 + Math.random() * 5000);
}
setTimeout(scheduleShootingStar, 4000);
setTimeout(launchShootingStar, 1500);

// ---- Confetti Rain ----
function launchConfetti(container, count, symbols) {
  symbols = symbols || ['✦','✧','⋆','★','·','✩','♥'];
  const colors = ['var(--accent)','var(--accent2)','var(--accent3)','var(--star-color)','#f0c040'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: -30px;
        font-size: ${9 + Math.random() * 13}px;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        animation: confettiFall ${1.4 + Math.random() * 1.8}s linear forwards;
        pointer-events: none;
        z-index: 10;
      `;
      if (container && container.parentNode) container.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 3500);
    }, i * 55);
  }
}

// ---- Celebration Card ----
function showCelebration(type, subtitle) {
  try {
    const existing = document.getElementById('celebration-overlay');
    if (existing) existing.remove();

    const configs = {
      plan: {
        emoji: '🎯',
        anim: 'dart',
        title: '¡Plan conseguido!',
        text: 'Un plan menos, mil recuerdos más'
      },
      restaurante: {
        emoji: '🍷',
        anim: 'clink',
        title: '¡Salud!',
        text: 'Una velada para recordar'
      },
      ruta: {
        emoji: '🏔️',
        anim: 'summit',
        title: '¡A la cima!',
        text: 'Juntos llegaréis a donde sea'
      },
      peli: {
        emoji: '🎬',
        anim: 'cinema',
        title: '¡Peliculón!',
        text: 'El público enloquece de emoción'
      }
    };

    const cfg = configs[type] || configs.plan;

    const overlay = document.createElement('div');
    overlay.id = 'celebration-overlay';
    overlay.innerHTML = `
      <div class="celeb-backdrop"></div>
      <div class="celeb-confetti-layer"></div>
      <div class="celeb-card celeb-anim-${cfg.anim}">
        <div class="celeb-big-emoji">${cfg.emoji}</div>
        <div class="celeb-anim-area" id="celeb-anim-area"></div>
        <div class="celeb-title">${cfg.title}</div>
        <div class="celeb-subtitle">${subtitle ? subtitle : cfg.text}</div>
        <div class="celeb-stars-row">✦ ✧ ✦ ✧ ✦</div>
      </div>
    `;

    document.body.appendChild(overlay);
    launchConfetti(overlay.querySelector('.celeb-confetti-layer'), 50);

    // Inject specific animation
    const animArea = overlay.querySelector('#celeb-anim-area');
    if (animArea) injectAnim(type, animArea);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.6s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 700);
    }, 3200);

    overlay.addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 400);
    });
  } catch(e) {
    console.warn('Celebration error:', e);
  }
}

function injectAnim(type, container) {
  const anims = {
    plan: `
      <div class="anim-diana">
        <div class="diana-ring r1"></div>
        <div class="diana-ring r2"></div>
        <div class="diana-ring r3"></div>
        <div class="diana-ring r4"></div>
        <div class="diana-center"></div>
        <div class="diana-dart">🎯</div>
      </div>`,
    restaurante: `
      <div class="anim-clink">
        <span class="copa copa-left">🍷</span>
        <span class="copa copa-right">🍷</span>
        <span class="clink-spark">✨</span>
      </div>`,
    ruta: `
      <div class="anim-summit">
        <div class="summit-mountain">⛰️</div>
        <div class="summit-figures">
          <span class="figure-boy">🧗</span>
          <span class="summit-flag">🚩</span>
          <span class="figure-girl">🧗‍♀️</span>
        </div>
      </div>`,
    peli: `
      <div class="anim-cinema">
        <div class="cinema-screen">🎬</div>
        <div class="cinema-audience">
          <span class="aud-person">👏</span>
          <span class="aud-person">👏</span>
          <span class="aud-person">👏</span>
          <span class="aud-person">👏</span>
          <span class="aud-person">👏</span>
        </div>
      </div>`
  };
  container.innerHTML = anims[type] || '';
}

// ---- Epic Viaje Animation ----
function showEpicViajeAnimation(destino) {
  try {
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

    const layer = overlay.querySelector('.epic-stars-layer');
    const epicSymbols = ['✦','✧','⋆','★','·','✩','♥','🌟','💫','⭐','✨'];
    launchConfetti(layer, 70, epicSymbols);
    setTimeout(() => launchConfetti(layer, 50, epicSymbols), 700);
    setTimeout(() => launchConfetti(layer, 40, epicSymbols), 1500);
    setTimeout(() => launchConfetti(layer, 30, epicSymbols), 2200);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.8s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 900);
    }, 4500);

    overlay.addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.4s ease';
      overlay.style.opacity = '0';
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 500);
    });
  } catch(e) {
    console.warn('Epic viaje error:', e);
  }
}
