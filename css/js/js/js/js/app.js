// ===== HELPERS =====
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
}

function handleModalOverlayClick(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ===== TABS =====
let currentTab = 'mapa';

function switchTab(tab) {
  // Deactivate old
  document.querySelector(`#tab-${currentTab}`)?.classList.remove('active');
  document.querySelector(`.nav-item[data-tab="${currentTab}"]`)?.classList.remove('active');

  // Activate new
  currentTab = tab;
  document.querySelector(`#tab-${tab}`)?.classList.add('active');
  document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');

  if (tab === 'mapa') invalidateMapSize();
}

// ===== THEME =====
function loadTheme() {
  const saved = localStorage.getItem('ninatxicoe_theme') || 'dark-romantic';
  const accent = localStorage.getItem('ninatxicoe_accent');
  applyTheme(saved, false);
  if (accent) applyCSSAccent(accent);
}

function setTheme(name) {
  applyTheme(name, true);
  localStorage.setItem('ninatxicoe_theme', name);
  // Update active swatch
  document.querySelectorAll('.theme-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === name);
  });
}

function applyTheme(name, save) {
  document.documentElement.setAttribute('data-theme', name === 'dark-romantic' ? '' : name);
  if (name === 'dark-romantic') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', name);
}

function setCustomAccent(val) {
  applyCSSAccent(val);
  document.getElementById('custom-accent-hex').textContent = val;
  localStorage.setItem('ninatxicoe_accent', val);
}

function applyCSSAccent(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-rgb', `${rgb.r},${rgb.g},${rgb.b}`);
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? { r: parseInt(r[1],16), g: parseInt(r[2],16), b: parseInt(r[3],16) } : null;
}

function openThemePanel() {
  document.getElementById('theme-panel').classList.remove('hidden');
  document.getElementById('panel-overlay').classList.remove('hidden');
}
function closeThemePanel() {
  document.getElementById('theme-panel').classList.add('hidden');
  document.getElementById('panel-overlay').classList.add('hidden');
}

// ===== LUGARES (rutas, restaurantes, planes) =====
let lugaresData = {};

const TIPO_CONFIG = {
  ruta:        { emoji: '🏔️', label: 'Ruta', listId: 'rutas-list' },
  restaurante: { emoji: '🍴', label: 'Restaurante', listId: 'restaurantes-list' },
  plan:        { emoji: '🎯', label: 'Plan', listId: 'planes-list' }
};

function listenLugares() {
  db.collection('lugares').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    lugaresData = {};
    snapshot.forEach(doc => { lugaresData[doc.id] = { id: doc.id, ...doc.data() }; });
    renderAllLugares();
  });
}

function renderAllLugares() {
  ['ruta','restaurante','plan'].forEach(tipo => {
    const items = Object.values(lugaresData).filter(l => l.tipo === tipo);
    renderLugarList(tipo, items);
  });
}

function renderLugarList(tipo, items) {
  const cfg = TIPO_CONFIG[tipo];
  const el = document.getElementById(cfg.listId);

  if (!items.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">${cfg.emoji}</div><p>Todavía no hay ${cfg.label.toLowerCase()}s</p></div>`;
    return;
  }

  el.innerHTML = items.map(l => {
    const completadoCls = l.completado ? 'completado' : '';
    const nombreCls = l.completado ? 'item-nombre tachado' : 'item-nombre';
    const checkCls = l.completado ? 'btn-check checked' : 'btn-check';
    const mapsLink = l.maps_url
      ? `<a class="maps-link" href="${escHtml(l.maps_url)}" target="_blank">📍 Abrir en Maps</a>`
      : '';
    const resenaBtn = l.completado
      ? `<button class="icon-btn ${l.resena ? 'active' : ''}" title="Reseña" onclick="openResenaModal('${l.id}')">📝</button>`
      : '';

    const resenaPreview = l.resena
      ? `<div class="item-resena-preview">"${escHtml(l.resena.substring(0,120))}${l.resena.length > 120 ? '…' : ''}"</div>`
      : '';
    const fotoPreview = l.foto_url
      ? `<div class="item-foto-preview"><img src="${escHtml(l.foto_url)}" loading="lazy" alt="foto"></div>`
      : '';

    return `
      <div class="item-card ${completadoCls}">
        <div class="item-card-top">
          <div class="item-card-info">
            <div class="${nombreCls}">${escHtml(l.nombre)}</div>
            ${l.ubicacion ? `<div class="item-sub">${escHtml(l.ubicacion)}</div>` : ''}
            ${mapsLink}
          </div>
          <div class="item-actions">
            <button class="${checkCls}" title="${l.completado ? 'Marcar pendiente' : 'Marcar completado'}" onclick="toggleCompletado('${l.id}',${!l.completado})">✓</button>
            ${resenaBtn}
            <button class="icon-btn" title="Editar" onclick="editLugar('${l.id}')">✏️</button>
            <button class="icon-btn danger" title="Eliminar" onclick="deleteLugar('${l.id}')">🗑️</button>
          </div>
        </div>
        ${resenaPreview}
        ${fotoPreview}
      </div>
    `;
  }).join('');
}

function openLugarModal(tipo) {
  document.getElementById('lugar-tipo-input').value = tipo;
  document.getElementById('lugar-edit-id').value = '';
  document.getElementById('lugar-modal-title').textContent = `Añadir ${TIPO_CONFIG[tipo].label}`;
  document.getElementById('lugar-nombre').value = '';
  document.getElementById('lugar-ubicacion').value = '';
  document.getElementById('lugar-maps-url').value = '';
  document.getElementById('lugar-notas').value = '';
  openModal('lugar-modal');
}

async function editLugar(id) {
  const l = lugaresData[id];
  if (!l) return;
  document.getElementById('lugar-tipo-input').value = l.tipo;
  document.getElementById('lugar-edit-id').value = id;
  document.getElementById('lugar-modal-title').textContent = `Editar ${TIPO_CONFIG[l.tipo].label}`;
  document.getElementById('lugar-nombre').value = l.nombre || '';
  document.getElementById('lugar-ubicacion').value = l.ubicacion || '';
  document.getElementById('lugar-maps-url').value = l.maps_url || '';
  document.getElementById('lugar-notas').value = l.notas || '';
  openModal('lugar-modal');
}

async function saveLugar() {
  const nombre    = document.getElementById('lugar-nombre').value.trim();
  const ubicacion = document.getElementById('lugar-ubicacion').value.trim();
  if (!nombre)    { alert('El nombre es obligatorio'); return; }
  if (!ubicacion) { alert('La ubicación es obligatoria'); return; }

  const tipo   = document.getElementById('lugar-tipo-input').value;
  const editId = document.getElementById('lugar-edit-id').value;

  const btn = document.querySelector('#lugar-modal .btn-primary');
  btn.disabled = true; btn.textContent = 'Guardando…';

  const coords = await geocode(ubicacion);

  const data = {
    nombre,
    tipo,
    ubicacion,
    maps_url:  document.getElementById('lugar-maps-url').value.trim(),
    notas:     document.getElementById('lugar-notas').value.trim(),
    lat:       coords ? coords.lat : null,
    lng:       coords ? coords.lng : null,
  };

  if (editId) {
    await db.collection('lugares').doc(editId).update(data);
  } else {
    data.completado  = false;
    data.resena      = '';
    data.foto_url    = '';
    data.createdAt   = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('lugares').add(data);
  }

  closeModal('lugar-modal');
  btn.disabled = false; btn.textContent = 'Guardar';
}

async function toggleCompletado(id, value) {
  await db.collection('lugares').doc(id).update({ completado: value });
}

async function deleteLugar(id) {
  if (!confirm('¿Eliminar este lugar?')) return;
  await db.collection('lugares').doc(id).delete();
}

// Reseña
function openResenaModal(id) {
  const l = lugaresData[id];
  if (!l) return;
  document.getElementById('resena-lugar-id').value = id;
  document.getElementById('resena-texto').value = l.resena || '';
  document.getElementById('resena-foto-url').value = l.foto_url || '';
  openModal('resena-modal');
}

async function saveResena() {
  const id = document.getElementById('resena-lugar-id').value;
  const texto = document.getElementById('resena-texto').value.trim();
  const foto  = document.getElementById('resena-foto-url').value.trim();

  const btn = document.querySelector('#resena-modal .btn-primary');
  btn.disabled = true; btn.textContent = 'Guardando…';

  await db.collection('lugares').doc(id).update({ resena: texto, foto_url: foto });

  closeModal('resena-modal');
  btn.disabled = false; btn.textContent = 'Guardar';
}

// ===== PELÍCULAS =====
let pelisData = {};

function listenPelis() {
  db.collection('pelis').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    pelisData = {};
    snapshot.forEach(doc => { pelisData[doc.id] = { id: doc.id, ...doc.data() }; });
    renderPelis();
  });
}

function renderPelis() {
  const vistas    = Object.values(pelisData).filter(p => p.vista);
  const pendientes= Object.values(pelisData).filter(p => !p.vista);

  renderPelisList('pelis-pendientes-list', pendientes, false);
  renderPelisList('pelis-vistas-list',     vistas,     true);

  document.getElementById('pelis-pendientes').style.display = pendientes.length ? '' : 'none';
  document.getElementById('pelis-vistas').style.display = vistas.length ? '' : 'none';
}

function renderPelisList(containerId, pelis, vistas) {
  const el = document.getElementById(containerId);
  if (!pelis.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🎬</div><p>${vistas ? 'Nada visto aún' : 'Lista vacía'}</p></div>`;
    return;
  }

  el.innerHTML = pelis.map(p => {
    const stars = p.puntuacion
      ? `<div class="peli-card-puntuacion"><div class="stars-display">${starsHtml(p.puntuacion)}</div></div>`
      : '';
    const resena = p.resena
      ? `<div class="item-resena-preview">"${escHtml(p.resena.substring(0,120))}${p.resena.length > 120 ? '…' : ''}"</div>`
      : '';
    const toggleLabel = p.vista ? '↩️' : '✓';
    const toggleTitle = p.vista ? 'Marcar por ver' : 'Marcar como vista';

    return `
      <div class="item-card ${p.vista ? 'completado' : ''}">
        <div class="item-card-top">
          <div class="item-card-info">
            <div class="item-nombre ${p.vista ? 'tachado' : ''}">${escHtml(p.titulo)}</div>
            ${stars}
          </div>
          <div class="item-actions">
            <button class="btn-check ${p.vista ? 'checked' : ''}" title="${toggleTitle}" onclick="togglePeliVista('${p.id}',${!p.vista})">${toggleLabel}</button>
            <button class="icon-btn ${p.resena ? 'active' : ''}" title="Reseña" onclick="editPeli('${p.id}')">✏️</button>
            <button class="icon-btn danger" title="Eliminar" onclick="deletePeli('${p.id}')">🗑️</button>
          </div>
        </div>
        ${resena}
      </div>
    `;
  }).join('');
}

function starsHtml(n) {
  let h = '';
  for (let i = 1; i <= 5; i++) {
    h += `<span class="${i <= n ? 'star-filled' : 'star-empty'}">★</span>`;
  }
  return h;
}

function openPeliModal(editId = null) {
  document.getElementById('peli-edit-id').value = editId || '';
  document.getElementById('peli-modal-title').textContent = editId ? 'Editar Película' : 'Añadir Película';
  document.getElementById('peli-titulo').value = '';
  document.getElementById('peli-vista-toggle').checked = false;
  document.getElementById('peli-puntuacion').value = '0';
  document.getElementById('peli-resena').value = '';
  document.getElementById('peli-vista-fields').classList.add('hidden');
  resetStars();
  openModal('peli-modal');
}

async function editPeli(id) {
  const p = pelisData[id];
  if (!p) return;
  document.getElementById('peli-edit-id').value = id;
  document.getElementById('peli-modal-title').textContent = 'Editar Película';
  document.getElementById('peli-titulo').value = p.titulo || '';
  document.getElementById('peli-vista-toggle').checked = !!p.vista;
  document.getElementById('peli-puntuacion').value = p.puntuacion || 0;
  document.getElementById('peli-resena').value = p.resena || '';
  document.getElementById('peli-vista-fields').classList.toggle('hidden', !p.vista);
  setStars(p.puntuacion || 0);
  openModal('peli-modal');
}

function togglePeliVistaModal() {
  const checked = document.getElementById('peli-vista-toggle').checked;
  document.getElementById('peli-vista-fields').classList.toggle('hidden', !checked);
}

async function togglePeliVista(id, value) {
  await db.collection('pelis').doc(id).update({ vista: value });
}

async function savePeli() {
  const titulo = document.getElementById('peli-titulo').value.trim();
  if (!titulo) { alert('El título es obligatorio'); return; }

  const editId = document.getElementById('peli-edit-id').value;
  const vista  = document.getElementById('peli-vista-toggle').checked;
  const punt   = parseInt(document.getElementById('peli-puntuacion').value) || 0;
  const resena = document.getElementById('peli-resena').value.trim();

  const btn = document.querySelector('#peli-modal .btn-primary');
  btn.disabled = true; btn.textContent = 'Guardando…';

  const data = { titulo, vista, puntuacion: punt, resena };
  if (editId) {
    await db.collection('pelis').doc(editId).update(data);
  } else {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('pelis').add(data);
  }

  closeModal('peli-modal');
  btn.disabled = false; btn.textContent = 'Guardar';
}

async function deletePeli(id) {
  if (!confirm('¿Eliminar esta película?')) return;
  await db.collection('pelis').doc(id).delete();
}

// Stars interaction
function initStars() {
  const stars = document.querySelectorAll('#stars-input .star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val);
      document.getElementById('peli-puntuacion').value = val;
      setStars(val);
    });
    star.addEventListener('mouseenter', () => hoverStars(parseInt(star.dataset.val)));
    star.addEventListener('mouseleave', () => setStars(parseInt(document.getElementById('peli-puntuacion').value)));
  });
}

function setStars(n) {
  document.querySelectorAll('#stars-input .star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= n);
  });
}

function hoverStars(n) {
  document.querySelectorAll('#stars-input .star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= n);
  });
}

function resetStars() { setStars(0); }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  loadTheme();

  // Init map
  initMap();

  // Listeners
  listenLugares();
  listenPelis();
  listenViajes();

  // Stars
  initStars();

  // Vista toggle modal binding
  document.getElementById('peli-vista-toggle').addEventListener('change', togglePeliVistaModal);

  // Hide loading screen
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    ls.classList.add('fade-out');
    setTimeout(() => ls.style.display = 'none', 700);
  }, 1200);
});
