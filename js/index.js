/* global mapboxgl */

// Datos para las APIs
const geocodingApi = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapboxToken =
  "pk.eyJ1IjoicG9scmVpZ2JyIiwiYSI6ImNrcGk3dWVoejBjNDIydm9memF1NmZ0NzkifQ.fz_0GxsCNlEVAQxfzMBVWg&country=ES";

const tmbApi = "https://api.tmb.cat/v1/planner/plan";
const appId = "e447e93a"; // Mete aquí el app_id de TMB
const appKey = "f32d9fd5d43be11e6061bd0c483f3cf6"; // Mete aquí el app_key de TMB
mapboxgl.accessToken = mapboxToken;

const extraerDatos = (elementoNombreLugar, indice, nombreLugar) => {
  const response = fetch(
    `${geocodingApi}${encodeURI(nombreLugar)}.json?access_token=${mapboxToken}`
  )
    .then((response) => response.json())
    .then((datosJson) => {
      elementoNombreLugar.textContent = datosJson.features[0].place_name;
      if (indice === 0) {
        [coordenadas.desde.longitud, coordenadas.desde.latitud] =
          datosJson.features[0].center;
      } else if (indice === 1) {
        [coordenadas.hasta.longitud, coordenadas.hasta.latitud] =
          datosJson.features[0].center;
      }
    });
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
  elemento.classList.remove(`${clase}`);
  return elemento;
};

// Obtiene las coordenadas de nuestra posicion actual
const getUbicacion = (callback) => {
  navigator.geolocation.getCurrentPosition(callback);
};

const getUbicacionOrigen = (pos) => {
  coordenadas.desde.latitud = pos.coords.latitude;
  coordenadas.desde.longitud = pos.coords.longitude;
};

const getUbicacionDestino = (pos) => {
  coordenadas.hasta.latitud = pos.coords.latitude;
  coordenadas.hasta.longitud = pos.coords.longitude;
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

  const response = fetch(
    `${tmbApi}?app_id=${appId}&app_key=${appKey}&fromPlace=${coordenadasOrigen}&toPlace=${coordenadasDestino}`
  )
    .then((response) => response.json())
    .then((datos) => {
      const pasos = datos.plan.itineraries[0].legs;
      
  const removeAllChild = (parent) => {
    while (parent.childElementCount > 1) {
      parent.removeChild(parent.lastChild);
    }
  };
  removeAllChild(elementoPadre);

      for (const pasoIndex in pasos) {
        elementoPaso.querySelector(
          ".paso-encabezado .paso-numero"
        ).textContent = +pasoIndex + 1;

        elementoPaso.querySelector(".paso-from").textContent =
          pasos[pasoIndex].from.name;

        elementoPaso.querySelector(".paso-to").textContent =
          pasos[pasoIndex].to.name;

        elementoPaso.querySelector(".paso-hora .dato").textContent =
          devolverHora(pasos[pasoIndex].startTime);

        elementoPaso.querySelector(
          ".paso-distancia .dato"
        ).textContent = `${Math.trunc(pasos[pasoIndex].distance)} m`;

        elementoPaso.querySelector(".paso-duracion .dato").textContent =
          formatoHora(pasos[pasoIndex].duration);

        coordenadas.desde.latitud = +pasos[pasoIndex].from.lat;
        coordenadas.desde.longitud = +pasos[pasoIndex].from.lon;

        coordenadas.hasta.latitud = +pasos[pasoIndex].to.lat;
        coordenadas.hasta.longitud = +pasos[pasoIndex].to.lon;

        elementoPaso.querySelector(
          ".paso-mapa"
        ).href = `http://maps.google.com/maps?z=19&t=m&q=loc:${coordenadas.hasta.latitud}+${coordenadas.hasta.longitud}`;

        generaMapa(
          [coordenadas.hasta.latitud, coordenadas.hasta.longitud],
          elementoPaso.querySelector(".mapa")
        );
        elementoPadre.append(elementoPaso.cloneNode(true));
      }
    });
};

/* Eventos para ocultar o mostrar el input text, obtener las coordenadas en caso de que este marcada
la opcion de usar mi ubicacion y en caso contrario solo buscar la direccion cuando el usuario no haya escrito durante 500ms */
const displayTextInput = () => {
  const grupoRadioElementos = document.querySelectorAll(".coordenadas");
  const indicarUbicacionElementos = document.querySelectorAll(
    ".introducir-ubicacion input"
  );
  const usarUbicacionElementos = document.querySelectorAll(".usar-ubi");
  const inputTextElementos = document.querySelectorAll(".direccion-definitiva");
  const nombreLugarElementos = document.querySelectorAll(".nombre-lugar");

  grupoRadioElementos.forEach((elemento, indice) => {
    let timer;
    inputTextElementos[indice].addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(
        () =>
          extraerDatos(
            nombreLugarElementos[indice],
            indice,
            inputTextElementos[indice].value
          ),
        500
      );
    });

    elemento.addEventListener("change", () => {
      if (indicarUbicacionElementos[indice].checked) {
        inputTextElementos[indice].classList.add("on");
      } else {
        inputTextElementos[indice].classList.remove("on");
      }
      if (usarUbicacionElementos[indice].checked) {
        if (indice === 0) {
          navigator.geolocation.getCurrentPosition(getUbicacionOrigen);
        }
        if (indice === 1) {
          navigator.geolocation.getCurrentPosition(getUbicacionDestino);
        }
      }
    });
  });
};

const indicarUbicacionEvento = () => {
  const indicarUbicacionElementos = document.querySelectorAll(
    ".introducir-ubicacion input"
  );
};

const comoIrEvento = () => {
  const boton = document.querySelector(".enviar");

  boton.addEventListener("click", (evento) => {
    evento.preventDefault();
    comoIr(
      `${coordenadas.desde.latitud},${coordenadas.desde.longitud}`,
      `${coordenadas.hasta.latitud},${coordenadas.hasta.longitud}`
    );
  });
};

const anyadirEventos = () => {
  displayTextInput();
  comoIrEvento();
};

const main = () => {
  getUbicacion(getUbicacionOrigen);
  getUbicacion(getUbicacionDestino);
  anyadirEventos();
};

main();
