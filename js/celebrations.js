// ===== CELEBRATIONS WITH LOTTIE =====

const ANIM_BASE = './animations/';

// ---- Shooting Star ----
function launchShootingStar() {
  const wrap = document.createElement('div');
  const startY = 5 + Math.random() * 45;
  const angle = 18 + Math.random() * 16;
  const duration = 900 + Math.random() * 400;
  wrap.style.cssText = `
    position:fixed;top:${startY}vh;left:0;width:100vw;height:3px;
    pointer-events:none;z-index:99999;
    transform:rotate(${angle}deg) translate3d(0,0,0);
    transform-origin:left center;overflow:visible;
  `;
  const star = document.createElement('div');
  star.style.cssText = `
    position:absolute;left:-260px;top:-3px;
    width:240px;height:6px;border-radius:50%;
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
        position:absolute;left:${Math.random()*100}%;top:-24px;
        font-size:${8+Math.random()*14}px;
        color:${colors[Math.floor(Math.random()*colors.length)]};
        animation:confettiFall ${1.3+Math.random()*2}s linear forwards;
        -webkit-animation:confettiFall ${1.3+Math.random()*2}s linear forwards;
        pointer-events:none;will-change:transform;
      `;
      container.appendChild(el);
      setTimeout(() => { if(el.parentNode) el.remove(); }, 3500);
    }, i * 50);
  }
}

// ---- Lottie helper ----
function playLottie(container, file, loop) {
  if (typeof lottie === 'undefined') return null;
  try {
    return lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: true,
      path: ANIM_BASE + file
    });
  } catch(e) {
    console.warn('Lottie error:', e);
    return null;
  }
}

// ---- Show Celebration ----
function showCelebration(type, subtitle) {
  try {
    const existing = document.getElementById('celebration-overlay');
    if (existing) existing.remove();

    const configs = {
      plan:        { file:'target.json',  title:'¡Plan conseguido!',  text:'Un plan menos, mil recuerdos más ✦',  loop:false },
      restaurante: { file:'date.json',    title:'¡Salud!',            text:'Una velada para no olvidar ✦',        loop:true  },
      ruta:        { file:'camping.json', title:'¡A la cima!',        text:'Juntos llegaréis a donde sea ✦',      loop:true  },
      peli:        { file:'movie.json',   title:'¡Peliculón!',        text:'El público enloquece ✦',              loop:true  }
    };
    const cfg = configs[type] || configs.plan;

    const overlay = document.createElement('div');
    overlay.id = 'celebration-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:999999;
      display:flex;align-items:center;justify-content:center;
      transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0);
    `;
    overlay.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)"></div>
      <div id="celeb-lottie-bg" style="position:absolute;inset:0;pointer-events:none;opacity:0.35"></div>
      <div id="celeb-confetti" style="position:absolute;inset:0;overflow:hidden;pointer-events:none"></div>
      <div class="celeb-card" style="position:relative;z-index:2">
        <div id="celeb-lottie-main" style="width:220px;height:200px;margin:0 auto 8px"></div>
        <div class="celeb-title">${cfg.title}</div>
        <div class="celeb-subtitle">${subtitle ? subtitle : cfg.text}</div>
        <div class="celeb-stars-row">✦ ✧ ✦ ✧ ✦</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Play main Lottie
    playLottie(overlay.querySelector('#celeb-lottie-main'), cfg.file, cfg.loop);
    // Play confetti Lottie in background
    playLottie(overlay.querySelector('#celeb-lottie-bg'), 'confeti.json', true);
    // Extra confetti
    launchConfetti(overlay.querySelector('#celeb-confetti'), 40);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.6s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 700);
    }, 3500);

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
      position:fixed;inset:0;z-index:999999;
      display:flex;align-items:center;justify-content:center;text-align:center;padding:32px;
      background:var(--bg,#fdf8f0);
      transform:translate3d(0,0,0);-webkit-transform:translate3d(0,0,0);
      animation:celebIn 0.5s ease;-webkit-animation:celebIn 0.5s ease;
    `;
    overlay.innerHTML = `
      <div id="epic-lottie-bg" style="position:absolute;inset:0;pointer-events:none;opacity:0.5"></div>
      <div id="epic-confetti" style="position:absolute;inset:0;overflow:hidden;pointer-events:none"></div>
      <div style="position:relative;z-index:2;width:100%;max-width:340px">
        <div id="epic-lottie-main" style="width:240px;height:200px;margin:0 auto"></div>
        <div style="font-size:0.95rem;color:var(--text-muted,#8a7060);margin-bottom:6px;animation:fadeUp 0.6s ease 0.3s both">¡Habéis empezado el viaje a</div>
        <div style="font-family:'Playfair Display',serif;font-size:clamp(1.8rem,7vw,2.8rem);font-style:italic;color:var(--accent,#e8927a);animation:fadeUp 0.8s cubic-bezier(0.34,1.3,0.64,1) 0.6s both;margin-bottom:12px;text-shadow:0 4px 20px rgba(232,146,122,0.3)">${destino}!</div>
        <div style="font-size:1.05rem;color:var(--text,#3d2e1e);animation:fadeUp 0.6s ease 0.9s both;margin-bottom:14px">¡Que sea increíble! 🌍</div>
        <div style="font-size:1rem;letter-spacing:8px;color:var(--star-color,#f0c040);animation:fadeUp 0.6s ease 1.2s both,twinkle 1.5s ease 1.2s infinite">✦ ✧ ✦ ✧ ✦ ✧ ✦</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Animations
    playLottie(overlay.querySelector('#epic-lottie-main'), 'camper.json', true);
    playLottie(overlay.querySelector('#epic-lottie-bg'), 'confeti.json', true);

    const sym = ['✦','✧','⋆','★','·','✩','♥','🌟','💫','⭐','✨'];
    const layer = overlay.querySelector('#epic-confetti');
    launchConfetti(layer, 70, sym);
    setTimeout(() => launchConfetti(layer, 50, sym), 700);
    setTimeout(() => launchConfetti(layer, 40, sym), 1400);
    setTimeout(() => launchConfetti(layer, 30, sym), 2200);

    setTimeout(() => {
      if (!overlay.parentNode) return;
      overlay.style.transition = 'opacity 0.8s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 900);
    }, 5000);

    overlay.addEventListener('click', () => {
      overlay.style.transition = 'opacity 0.4s';
      overlay.style.opacity = '0';
      setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 500);
    });
  } catch(e) { console.warn('Epic viaje error:', e); }
}
