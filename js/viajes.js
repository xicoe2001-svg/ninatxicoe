// ===== VIAJES =====
let currentViajeId = null;
let viajesData = {};
let currentDiaFotos = []; // fotos del día que se está editando

function listenViajes() {
  db.collection('viajes').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    viajesData = {};
    snapshot.forEach(doc => { viajesData[doc.id] = { id: doc.id, ...doc.data() }; });
    renderViajes();
  }, err => console.warn('Viajes error:', err));
}

function renderViajes() {
  const enCurso    = Object.values(viajesData).filter(v => v.estado === 'en_curso');
  const pendientes = Object.values(viajesData).filter(v => v.estado === 'pendiente');
  const completados= Object.values(viajesData).filter(v => v.estado === 'completado');

  renderViajesList('viajes-curso-list',       enCurso,      'en_curso');
  renderViajesList('viajes-pendientes-list',  pendientes,   'pendiente');
  renderViajesList('viajes-completados-list', completados,  'completado');

  document.getElementById('viajes-en-curso').style.display           = enCurso.length    ? '' : 'none';
  document.getElementById('viajes-pendientes-wrap').style.display    = pendientes.length ? '' : 'none';
  document.getElementById('viajes-completados-wrap').style.display   = completados.length? '' : 'none';
}

function renderViajesList(containerId, viajes, tipo) {
  const el = document.getElementById(containerId);
  if (!viajes.length) { el.innerHTML = ''; return; }

  el.innerHTML = viajes.map(v => {
    const fecha = v.fecha ? `<span class="item-sub">${v.fecha}</span>` : '';
    const badge = `<span class="viaje-badge ${v.estado}">${estadoLabel(v.estado)}</span>`;
    const btnEmpezar = v.estado === 'pendiente'
      ? `<button class="btn-empezar" onclick="event.stopPropagation();empezarViaje('${v.id}','${escHtml(v.destino)}')">¡Empezar viaje! ✈️</button>`
      : '';
    return `
      <div class="item-card viaje-card" onclick="openDiario('${v.id}')">
        <div class="item-card-top">
          <div class="item-card-info">
            <div class="item-nombre">${escHtml(v.destino)}</div>
            ${fecha}
            ${badge}
          </div>
          <div class="item-actions">
            <button class="icon-btn danger" title="Eliminar" onclick="event.stopPropagation();deleteViaje('${v.id}')">🗑️</button>
          </div>
        </div>
        ${btnEmpezar}
      </div>
    `;
  }).join('');
}

function estadoLabel(estado) {
  const labels = { pendiente: '🗓️ Planeado', en_curso: '✈️ En curso', completado: '✅ Completado' };
  return labels[estado] || estado;
}

function openViajeModal() {
  document.getElementById('viaje-destino').value = '';
  document.getElementById('viaje-fecha').value = '';
  document.getElementById('viaje-notas').value = '';
  openModal('viaje-modal');
}

async function saveViaje() {
  const destino = document.getElementById('viaje-destino').value.trim();
  if (!destino) { alert('El destino es obligatorio'); return; }

  const btn = document.querySelector('#viaje-modal .btn-primary');
  btn.disabled = true; btn.textContent = 'Guardando…';

  const data = {
    destino,
    fecha:    document.getElementById('viaje-fecha').value || '',
    notas:    document.getElementById('viaje-notas').value.trim(),
    estado:   'pendiente',
    lat:      null,
    lng:      null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('viajes').add(data);
  closeModal('viaje-modal');
  btn.disabled = false; btn.textContent = 'Guardar';

  geocode(destino).then(coords => {
    if (coords) docRef.update({ lat: coords.lat, lng: coords.lng });
  });
}

async function deleteViaje(id) {
  if (!confirm('¿Eliminar este viaje y todo su diario?')) return;
  const dias = await db.collection('viajes').doc(id).collection('dias').get();
  const batch = db.batch();
  dias.forEach(d => batch.delete(d.ref));
  batch.delete(db.collection('viajes').doc(id));
  await batch.commit();
}

async function empezarViaje(id, destino) {
  showViajeStartAnimation(destino);
  await db.collection('viajes').doc(id).update({
    estado: 'en_curso',
    fechaInicio: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function showViajeStartAnimation(destino) {
  showEpicViajeAnimation(destino);
}

// ===== DIARIO =====
let diasListener = null;

function openDiario(viajeId) {
  currentViajeId = viajeId;
  const viaje = viajesData[viajeId];
  if (!viaje) return;

  document.getElementById('diario-destino-title').textContent = viaje.destino;
  const badge = document.getElementById('diario-estado-badge');
  badge.textContent = estadoLabel(viaje.estado);
  badge.className = `viaje-badge ${viaje.estado}`;

  const actions = document.getElementById('diario-actions');
  viaje.estado === 'en_curso' ? actions.classList.remove('hidden') : actions.classList.add('hidden');

  document.getElementById('viajes-main-view').classList.add('hidden');
  document.getElementById('viaje-diario-view').classList.remove('hidden');

  if (diasListener) diasListener();
  diasListener = db.collection('viajes').doc(viajeId).collection('dias')
    .orderBy('num', 'asc')
    .onSnapshot(snapshot => {
      const dias = [];
      snapshot.forEach(doc => dias.push({ id: doc.id, ...doc.data() }));
      renderDias(dias);
    });
}

function closeDiario() {
  if (diasListener) { diasListener(); diasListener = null; }
  currentViajeId = null;
  document.getElementById('viaje-diario-view').classList.add('hidden');
  document.getElementById('viajes-main-view').classList.remove('hidden');
}

function renderDias(dias) {
  const el = document.getElementById('diario-days-list');
  if (!dias.length) {
    const viaje = viajesData[currentViajeId];
    const esEnCurso = viaje && viaje.estado === 'en_curso';
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📖</div><p>${esEnCurso ? 'El diario está esperando vuestras aventuras…' : 'Este diario está vacío.'}</p></div>`;
    return;
  }

  el.innerHTML = dias.map(dia => {
    const fotos = (dia.fotos || []).filter(f => f && f.trim());
    const fotosHtml = fotos.length
      ? `<div class="dia-fotos-grid">${fotos.map(f => `<div class="dia-foto"><img src="${escHtml(f)}" loading="lazy" alt="foto"></div>`).join('')}</div>`
      : '';

    const viaje = viajesData[currentViajeId];
    const esEnCurso = viaje && viaje.estado === 'en_curso';
    const editBtn = esEnCurso ? `<button class="icon-btn" onclick="editDia('${dia.id}',${dia.num})">✏️</button>` : '';

    return `
      <div class="dia-card">
        <div class="dia-card-header">
          <div>
            <div class="dia-num-label">Día ${dia.num}</div>
            <div class="dia-titulo">${escHtml(dia.titulo || 'Sin título')}</div>
          </div>
          ${editBtn}
        </div>
        ${(dia.notas || fotosHtml) ? `
        <div class="dia-body">
          ${dia.notas ? `<div class="dia-notas">${escHtml(dia.notas)}</div>` : ''}
          ${fotosHtml}
        </div>` : ''}
      </div>
    `;
  }).join('');
}

function openDiaModal(editId = null, editNum = null) {
  if (!currentViajeId) return;
  document.getElementById('dia-viaje-id').value = currentViajeId;
  document.getElementById('dia-edit-id').value = editId || '';
  document.getElementById('dia-foto-input').value = '';
  document.getElementById('dia-foto-preview').style.display = 'none';
  document.getElementById('dia-foto-preview-img').src = '';
  currentDiaFotos = [];
  renderDiaFotosExistentes();

  if (editId) {
    document.getElementById('dia-modal-title').textContent = `Editar Día ${editNum}`;
  } else {
    const count = document.getElementById('diario-days-list').querySelectorAll('.dia-card').length;
    const nextNum = count + 1;
    document.getElementById('dia-num-input').value = nextNum;
    document.getElementById('dia-modal-title').textContent = `Día ${nextNum}`;
    document.getElementById('dia-titulo').value = '';
    document.getElementById('dia-notas').value = '';
  }
  openModal('dia-modal');
}

async function editDia(diaId, num) {
  const doc = await db.collection('viajes').doc(currentViajeId).collection('dias').doc(diaId).get();
  if (!doc.exists) return;
  const d = doc.data();
  currentDiaFotos = [...(d.fotos || [])];
  document.getElementById('dia-edit-id').value = diaId;
  document.getElementById('dia-viaje-id').value = currentViajeId;
  document.getElementById('dia-num-input').value = num;
  document.getElementById('dia-modal-title').textContent = `Editar Día ${num}`;
  document.getElementById('dia-titulo').value = d.titulo || '';
  document.getElementById('dia-notas').value = d.notas || '';
  document.getElementById('dia-foto-input').value = '';
  document.getElementById('dia-foto-preview').style.display = 'none';
  renderDiaFotosExistentes();
  openModal('dia-modal');
}

function renderDiaFotosExistentes() {
  const container = document.getElementById('dia-fotos-existentes');
  if (!container) return;
  if (!currentDiaFotos.length) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';
  container.innerHTML = currentDiaFotos.map((url, i) => `
    <div style="position:relative;display:inline-block;margin:4px;border-radius:10px;overflow:hidden;width:calc(50% - 8px);vertical-align:top">
      <img src="${escHtml(url)}" style="width:100%;height:90px;object-fit:cover;display:block;border-radius:10px">
      <button onclick="eliminarFotoDia(${i})" style="
        position:absolute;top:4px;right:4px;
        width:24px;height:24px;
        background:rgba(0,0,0,0.6);
        border:none;border-radius:50%;
        color:white;font-size:13px;
        cursor:pointer;display:flex;align-items:center;justify-content:center;
        line-height:1;
      ">✕</button>
    </div>
  `).join('');
}

function eliminarFotoDia(index) {
  currentDiaFotos.splice(index, 1);
  renderDiaFotosExistentes();
}

async function saveDia() {
  const viajeId = document.getElementById('dia-viaje-id').value;
  const editId  = document.getElementById('dia-edit-id').value;
  const num     = parseInt(document.getElementById('dia-num-input').value) || 1;
  const titulo  = document.getElementById('dia-titulo').value.trim();
  const notas   = document.getElementById('dia-notas').value.trim();
  const fileInput = document.getElementById('dia-foto-input');

  const btn = document.querySelector('#dia-modal .btn-primary');
  btn.disabled = true; btn.textContent = 'Guardando…';

  // Start with current edited photos (respects deletions)
  let fotos = [...currentDiaFotos];

  if (fileInput.files && fileInput.files[0]) {
    try {
      btn.textContent = 'Subiendo foto…';
      const url = await uploadFoto(fileInput.files[0]);
      fotos.push(url);
    } catch(e) {
      alert('Error subiendo la foto');
      btn.disabled = false; btn.textContent = 'Guardar';
      return;
    }
  }

  const data = { num, titulo, notas, fotos, updatedAt: firebase.firestore.FieldValue.serverTimestamp() };

  if (editId) {
    await db.collection('viajes').doc(viajeId).collection('dias').doc(editId).update(data);
  } else {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('viajes').doc(viajeId).collection('dias').add(data);
  }

  closeModal('dia-modal');
  btn.disabled = false; btn.textContent = 'Guardar';
}

async function finalizarViaje() {
  if (!currentViajeId) return;
  if (!confirm('¿Finalizar el viaje? Ya no podréis añadir más días.')) return;
  await db.collection('viajes').doc(currentViajeId).update({
    estado: 'completado',
    fechaFin: firebase.firestore.FieldValue.serverTimestamp()
  });
  viajesData[currentViajeId].estado = 'completado';
  const badge = document.getElementById('diario-estado-badge');
  badge.textContent = estadoLabel('completado');
  badge.className = 'viaje-badge completado';
  document.getElementById('diario-actions').classList.add('hidden');
}
