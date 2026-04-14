// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpQoeJHKAQaBdFhzXKsgNhUkyX4oC_4rY",
  authDomain: "ninatxicoe.firebaseapp.com",
  projectId: "ninatxicoe",
  storageBucket: "ninatxicoe.firebasestorage.app",
  messagingSenderId: "998657947207",
  appId: "1:998657947207:web:b00ee5237c9fffedeba362",
  measurementId: "G-T5C3NYB8DV"
};

firebase.initializeApp(firebaseConfig);

// Apuntar a la base de datos eur3
const db = firebase.firestore();
db.settings({ databaseId: 'eur3' });

// Caché offline
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  console.warn('Persistencia no disponible:', err.code);
});

// Geocoding via Nominatim (OpenStreetMap)
async function geocode(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=es`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Ninatxicoe/1.0' } });
    const data = await resp.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display: data[0].display_name
      };
    }
    return null;
  } catch (e) {
    console.warn('Geocoding failed:', e);
    return null;
  }
}
