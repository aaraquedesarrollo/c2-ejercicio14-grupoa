# Ejercicio TMB - Calculador de rutas

En este ejercicio vamos a ofrecerle al usuario una interfaz que le permita elegir dos ubicaciones, origen y destino, y la aplicación le mostrará los pasos para llegar de una a otra mediante transporte público.

Para ello consultaremos dos APIs:

- [API Planner de TMB](https://developer.tmb.cat/api-docs/v1/planner): le tenemos que pasar coordenadas de origen y coordenadas de destino, y nos da los pasos.
- [API Geocoding de Mapbox](https://docs.mapbox.com/api/search/geocoding/): le tenemos que pasar una dirección, y nos da las coordenadas (hay que registrarse y obtener un token)

Las especificaciones de la aplicación son las siguientes:

- Si el usuario elige "Usar mi ubicación", la aplicación debe obtener la ubicación del dispositivo y almacenar las coordenadas ([geolocalización en el navegador](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)).
- Si el usuario elige "Introducir dirección", debe aparecer el input debajo, para que introduzca una dirección. El funcionamiento de este input es el siguiente:
  · Cada vez que el usuario teclee, hay que esperar 500 ms. Con cada tecla hay que anular el timer, para que sólo se envíe una vez. Cuando el usuario haya tecleado y hayan pasado 500ms, hay que enviarle la dirección a la API de Geocoding de Mapbox, y guardar las coordenadas.
  · También debe aparecer en el input con clase `direccion-definitiva` la dirección que propone la API.
- Una vez obtenidas las dos coordenadas (origen y destino), cuando el usuario haga clic en "Cómo ir", se deben enviar las coordenadas a la API Planner de TMB, que nos devolverá los pasos.
- Cuando obtengamos los pasos de la API, hay que pintar un elemento con clase `paso` que sea un clon del actual `paso-dummy`.
- En cada elemento paso debe haber la siguiente información:
  - El elemento paso tiene que tener una clase `walk`, `bus` o `subway` dependiendo del medio de transporte/locomoción.
  - 
