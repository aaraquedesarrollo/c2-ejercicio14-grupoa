/* global mapboxgl */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoicG9scmVpZ2JyIiwiYSI6ImNrcGk3dWVoejBjNDIydm9memF1NmZ0NzkifQ.fz_0GxsCNlEVAQxfzMBVWg&country=ES";
const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = ""; // Mete aquí el app_id de TMB
const appKey = ""; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

const nombreLugar = "hola adiós";

fetch(
  `${geocodingApi}${encodeURI(nombreLugar)}.json?access_token=${mapboxToken}`
)
  .then((response) => response.json())
  .then((datosMapbox) => extraerDatos(datosMapbox));

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
