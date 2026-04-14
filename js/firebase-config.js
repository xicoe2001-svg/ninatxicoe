// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABW7sXsOm8p5SyEMg5invEBCuePkp80WM",
  authDomain: "ninaatxicoee.firebaseapp.com",
  projectId: "ninaatxicoee",
  storageBucket: "ninaatxicoee.firebasestorage.app",
  messagingSenderId: "183447594894",
  appId: "1:183447594894:web:087c927e1823721a5926df"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
