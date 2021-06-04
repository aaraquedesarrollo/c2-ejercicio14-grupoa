/* global mapboxgl */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoicG9scmVpZ2JyIiwiYSI6ImNrcGk3dWVoejBjNDIydm9memF1NmZ0NzkifQ.fz_0GxsCNlEVAQxfzMBVWg"; // Mete aquí el Token de Mapbox
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

// Acceder a la api

const getPasosViaje = async (coordenadasOrigen, coordenadasDestino) => {
  const response = await fetch(
    `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=${coordenadasOrigen}&toPlace=${coordenadasDestino}`
  );

  const json = await response.json();
  return json.plan.itineraries[0].legs;
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
  elemento.classList.remove(`${clase}`);
  return elemento;
};

// Obtiene las coordenadas de nuestra posicion actual
const getUbicacionActual = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    coordenadas.desde.latitud = pos.coords.latitude;
    coordenadas.desde.longitud = pos.coords.longitude;
  });
};

const devolverHora = (tiempoUnix) => {
  const fecha = new Date(tiempoUnix);
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes();

  return `${horas}:${minutos}`;
};

const formatoHora = (time) => {
  // Hours, minutes and seconds
  const hrs = time / 3600;
  const mins = (time % 3600) / 60;
  const secs = time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";
  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? "0" : ""}`;
  }
  ret += `${mins}:${secs < 10 ? "0" : ""}`;
  ret += `${secs}`;
  return ret;
};

const comoIr = (coordenadasOrigen, coordenadasDestino) => {
  const elementoPaso = clonarElemento("paso-dummy");
  const elementoPadre = document.querySelector(".pasos");
  const pasos = getPasosViaje(coordenadasOrigen, coordenadasDestino);

  pasos.then((datos) => {
    for (const pasoIndex in datos) {
      elementoPaso.querySelector(".paso-encabezado .paso-numero").textContent =
        +pasoIndex + 1;

      elementoPaso.querySelector(".paso-from").textContent =
        datos[pasoIndex].from.name;

      elementoPaso.querySelector(".paso-to").textContent =
        datos[pasoIndex].to.name;

      elementoPaso.querySelector(".paso-hora .dato").textContent = devolverHora(
        datos[pasoIndex].startTime
      );

      elementoPaso.querySelector(
        ".paso-distancia .dato"
      ).textContent = `${Math.trunc(datos[pasoIndex].distance)} m`;

      elementoPaso.querySelector(".paso-duracion .dato").textContent =
        formatoHora(datos[pasoIndex].duration);

      coordenadas.desde.latitud = +datos[pasoIndex].from.lat;
      coordenadas.desde.longitud = +datos[pasoIndex].from.lon;

      coordenadas.hasta.latitud = +datos[pasoIndex].to.lat;
      coordenadas.hasta.longitud = +datos[pasoIndex].to.lon;

      generaMapa(
        [datos[pasoIndex].from.lat, datos[pasoIndex].from.lon],
        elementoPaso.querySelector(".mapa")
      );

      elementoPadre.append(elementoPaso.cloneNode(true));
    }
  });
};

comoIr("41.3755204,2.149887", "41.42252,2.187824");
