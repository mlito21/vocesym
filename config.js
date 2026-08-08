// Configuración central · Voces y Melodías Lojanas
//
// PREVIEW: corpus en investigación. Puede contener registros preliminares.
// PUBLIC: solo vistas WEB con registros verificados y autorizados.
//
// Mientras la Base Maestra no tenga registros publicables, el modo por defecto
// permanece en PREVIEW. Para comprobar las vistas públicas sin cambiar el código:
//   ?mode=public
// Para volver al entorno de investigación:
//   ?mode=preview

(function () {
  const params = new URLSearchParams(window.location.search);
  const requestedMode = String(params.get("mode") || "").toLowerCase();
  const defaultMode = "preview";
  const apiMode = requestedMode === "public" ? "public" : defaultMode;

  window.VML_CONFIG = {
    API_URL: "https://script.google.com/a/macros/unl.edu.ec/s/AKfycbzYV_dguLGDQRfFvxtPJkRX7Kzd-40CAtsQ514Jm7uNFxkpmmovheA_LWsweMNx4vH8Rg/exec",
    API_MODE: apiMode,
    DEFAULT_MODE: defaultMode,
    IS_PREVIEW: apiMode === "preview",
    IS_PUBLIC: apiMode === "public",
    DEMO_URL: "data/demo.json",
    JSONP_TIMEOUT_MS: 15000
  };
})();
