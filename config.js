// Configuración central · Voces y Melodías Lojanas
//
// PREVIEW: corpus en investigación. Puede contener registros preliminares.
// PUBLIC: solo vistas WEB con registros verificados y autorizados.
//
// El archivo de creadoras abre el catálogo público por defecto. El resto del
// portal conserva PREVIEW mientras se preparan sus vistas WEB.

(function () {
  const params = new URLSearchParams(window.location.search);
  const requestedMode = String(params.get("mode") || "").toLowerCase();
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const isArchivePage = pageName === "archivo.html";
  const defaultMode = isArchivePage ? "public" : "preview";
  const apiMode = requestedMode === "public" || requestedMode === "preview"
    ? requestedMode
    : defaultMode;
  const PUBLIC_API_URL = "https://script.google.com/macros/s/AKfycbxtej3ChqCRJ4Q4NXeVBXBCwXnDAE4AxYYhxOOWkjTwPPcv9X0fCQNiXNwz6x0-MdqBbw/exec";
  const PREVIEW_API_URL = "https://script.google.com/a/macros/unl.edu.ec/s/AKfycbzYV_dguLGDQRfFvxtPJkRX7Kzd-40CAtsQ514Jm7uNFxkpmmovheA_LWsweMNx4vH8Rg/exec";

  window.VML_CONFIG = {
    PUBLIC_API_URL,
    PREVIEW_API_URL,
    API_URL: apiMode === "public" ? PUBLIC_API_URL : PREVIEW_API_URL,
    API_MODE: apiMode,
    DEFAULT_MODE: defaultMode,
    IS_PREVIEW: apiMode === "preview",
    IS_PUBLIC: apiMode === "public",
    DEMO_URL: "data/demo.json",
    JSONP_TIMEOUT_MS: 15000
  };
})();
