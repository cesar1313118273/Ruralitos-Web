/*
 * El HTML entregado usa google.script.run, que solo existe dentro de Apps Script.
 * Hasta conectar el backend acordado, fallamos sin transmitir ni guardar datos.
 * Conservamos la firma de callbacks para que la interfaz original muestre el error.
 */
(function () {
  "use strict";

  function runner(success, failure) {
    return new Proxy({}, {
      get: function (_, operation) {
        if (operation === "withSuccessHandler") {
          return function (callback) { return runner(callback, failure); };
        }
        if (operation === "withFailureHandler") {
          return function (callback) { return runner(success, callback); };
        }
        return function () {
          queueMicrotask(function () {
            if (typeof failure === "function") {
              failure(new Error("Consulta externa aún no está conectada al servicio de datos. No se guardó información."));
            }
          });
        };
      }
    });
  }

  window.google = { script: { run: runner(null, null) } };
})();
