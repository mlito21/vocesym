// Configuración central · Voces y Melodías Lojanas
//
// El portal público consulta únicamente la API pública de solo lectura.
// La vista institucional de investigación se administra por separado en Apps Script.

(function () {
  const defaultMode = "public";
  const PUBLIC_API_URL = "https://script.google.com/macros/s/AKfycbxtej3ChqCRJ4Q4NXeVBXBCwXnDAE4AxYYhxOOWkjTwPPcv9X0fCQNiXNwz6x0-MdqBbw/exec";

  window.VML_CONFIG = {
    PUBLIC_API_URL,
    API_URL: PUBLIC_API_URL,
    API_MODE: defaultMode,
    DEFAULT_MODE: defaultMode,
    IS_PREVIEW: false,
    IS_PUBLIC: true,
    JSONP_TIMEOUT_MS: 15000
  };
})();
