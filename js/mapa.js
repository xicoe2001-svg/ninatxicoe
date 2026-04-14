// ===== MAPA =====
let map = null;
let mapMarkers = {}; // id -> leaflet marker

const TIPO_ICON = {
  ruta:        '🏔️',
  restaurante: '🍴',
  plan:        '🎯',
  viaje:       '✈️'
};

function initMap() {
  if (map) return;

  map = L.map('map', {
    center: [40.4168, -3.7038], // España centrado
    zoom: 5,
    zoomControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18
  }).addTo(map);

  // Zoom control top-right
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Load all pins
  listenMapPins();
}

function createPinIcon(tipo, completado) {
  const emoji = TIPO_ICON[tipo] || '📍';
  const cls = completado ? 'map-pin map-pin-completado' : 'map-pin';
  return L.divIcon({
    html: `<div class="${cls}">${emoji}</div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
}

function createViajeCompletadoIcon() {
  return L.divIcon({
    html: `<div class="map-pin map-pin-viaje-completado">✈️</div>`,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22]
  });
}

function listenMapPins() {
  // Lugares (rutas, restaurantes, planes)
  db.collection('lugares').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const id = change.doc.id;
      const d = change.doc.data();

      if (change.type === 'removed') {
        if (mapMarkers[id]) { map.removeLayer(mapMarkers[id]); delete mapMarkers[id]; }
        return;
      }
      if (!d.lat || !d.lng) return;

      if (mapMarkers[id]) map.removeLayer(mapMarkers[id]);

      const marker = L.marker([d.lat, d.lng], { icon: createPinIcon(d.tipo, d.completado) });

      let popupContent = `<div class="popup-title">${d.nombre}</div>`;
      if (d.ubicacion) popupContent += `<div class="popup-sub">${d.ubicacion}</div>`;
      if (d.maps_url) popupContent += `<a class="popup-link" href="${d.maps_url}" target="_blank">📍 Abrir en Maps</a>`;

      marker.bindPopup(popupContent, { maxWidth: 240 });
      marker.addTo(map);
      mapMarkers[id] = marker;
    });
  });

  // Viajes (solo los que tienen coordenadas)
  db.collection('viajes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const id = 'viaje_' + change.doc.id;
      const d = change.doc.data();

      if (change.type === 'removed') {
        if (mapMarkers[id]) { map.removeLayer(mapMarkers[id]); delete mapMarkers[id]; }
        return;
      }
      if (!d.lat || !d.lng) return;

      if (mapMarkers[id]) map.removeLayer(mapMarkers[id]);

      const icon = d.estado === 'completado' ? createViajeCompletadoIcon() : createPinIcon('viaje', false);
      const marker = L.marker([d.lat, d.lng], { icon });

      let popupContent = `<div class="popup-title">✈️ ${d.destino}</div>`;
      if (d.estado === 'completado') {
        popupContent += `<div class="popup-sub">Viaje completado</div>`;
        popupContent += `<a class="popup-link" href="#" onclick="event.preventDefault();abrirDiarioDesdeMapaId('${change.doc.id}')">📖 Ver diario</a>`;
      } else {
        const estadoLabel = d.estado === 'en_curso' ? '✈️ En curso' : '🗓️ Planeado';
        popupContent += `<div class="popup-sub">${estadoLabel}</div>`;
      }

      marker.bindPopup(popupContent, { maxWidth: 240 });
      marker.addTo(map);
      mapMarkers[id] = marker;
    });
  });
}

function abrirDiarioDesdeMapaId(viajeId) {
  // Cambiar a tab viajes y abrir el diario
  switchTab('viajes');
  setTimeout(() => openDiario(viajeId), 300);
}

function flyToPin(lat, lng) {
  if (!map) return;
  map.flyTo([lat, lng], 14, { duration: 1.5 });
}

function invalidateMapSize() {
  if (map) setTimeout(() => map.invalidateSize(), 100);
}
