/* global mapboxgl */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken = ""; // Mete aquí el Token de Mapbox
const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "e447e93a"; // Mete aquí el app_id de TMB
const appKey = "f32d9fd5d43be11e6061bd0c483f3cf6"; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

// LLama a esta función para generar el pequeño mapa que sale en cada paso
// Le tienes que pasar un array con las dos coordenadas y el elemento HTML donde tiene que generar el mapa
const generaMapa = (coordenadas, mapa) => {
  const mapbox = new mapboxgl.Map({
    container: mapa,
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordenadas,
    zoom: 14,
  });
};

// Coordenadas que se mandarán a la API de TMB. Tienes que alimentar este objeto a partir de las coordenadas que te dé la API de Mapbox
const coordenadas = {
  desde: {
    latitud: 0,
    longitud: 0,
  },
  hasta: {
    latitud: 0,
    longitud: 0,
  },
};

// Clona el elemento dummy y le quita la clase
const clonarElemento = (clase) => {
  const elemento = document.querySelector(`.${clase}`).cloneNode(true);
  elemento.classList.remove(`.${clase}`);
  return elemento;
};