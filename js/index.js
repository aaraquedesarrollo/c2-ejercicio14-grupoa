/* global mapboxgl */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoicG9scmVpZ2JyIiwiYSI6ImNrcGk3dWVoejBjNDIydm9memF1NmZ0NzkifQ.fz_0GxsCNlEVAQxfzMBVWg&country=ES";
const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "e447e93a"; // Mete aquí el app_id de TMB
const appKey = "f32d9fd5d43be11e6061bd0c483f3cf6"; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

const nombreLugar = "arc de triomf";

fetch(
  `${geocodingApi}${encodeURI(nombreLugar)}.json?access_token=${mapboxToken}`
)
  .then((response) => response.json())
  .then((datosMapbox) => extraerDatos(datosMapbox));

const extraerDatos = (datos) => {
  const coordenadas = datos.features[0].center;
  return coordenadas;
};

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

// Obtiene las coordenadas de nuestra posicion actual
const getUbicacionActual = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    coordenadas.desde.latitud = pos.coords.latitude;
    coordenadas.desde.longitud = pos.coords.longitude;
  });
};

// Muestra o oculta el input de texto en funcion de si Indicar ubicacion esta marcado o no
const displayTextInput = () => {
  const grupoRadioElementos = document.querySelectorAll(".coordenadas");
  const indicarUbicacionElementos = document.querySelectorAll(
    ".introducir-ubicacion input"
  );
  const inputTextElementos = document.querySelectorAll(".direccion-definitiva");

  grupoRadioElementos.forEach((elemento, indice) => {
    elemento.addEventListener("change", () => {
      if (indicarUbicacionElementos[indice].checked) {
        inputTextElementos[indice].classList.add("on");
      } else {
        inputTextElementos[indice].classList.remove("on");
      }
    });
  });
};
