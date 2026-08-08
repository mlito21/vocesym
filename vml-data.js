window.VML = window.VML || {};

VML.jsonp = function (baseUrl, params = {}, timeout) {
  const wait = timeout || window.VML_CONFIG?.JSONP_TIMEOUT_MS || 15000;

  return new Promise((resolve, reject) => {
    const cb = "__vml_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const query = new URLSearchParams({ ...params, callback: cb });
    script.src = baseUrl + (baseUrl.includes("?") ? "&" : "?") + query.toString();

    let done = false;
    const timer = setTimeout(() => {
      clean();
      reject(new Error("Tiempo de espera agotado"));
    }, wait);

    const clean = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (script.parentNode) script.remove();
      try { delete window[cb]; } catch (_) { window[cb] = undefined; }
    };

    window[cb] = data => {
      clean();
      resolve(data);
    };

    script.onerror = () => {
      clean();
      reject(new Error("No se pudo cargar la API"));
    };

    document.head.appendChild(script);
  });
};

VML.mode = () => window.VML_CONFIG?.API_MODE || "preview";
VML.isPreview = () => VML.mode() === "preview";
VML.isPublic = () => VML.mode() === "public";
VML.modeLabel = () => VML.isPreview() ? "PREVIEW · corpus en investigación" : "WEB · contenido publicado";

VML.load = () => VML.jsonp(
  window.VML_CONFIG.API_URL,
  { mode: VML.mode() },
  window.VML_CONFIG.JSONP_TIMEOUT_MS
);

VML.clean = s => String(s || "").replace(/^["']|["']$/g, "").replace(/\.$/, "").trim();
VML.safe = s => String(s || "").replace(/[&<>"']/g, m => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[m]));

VML.applyEnvironment = function () {
  document.documentElement.dataset.vmlMode = VML.mode();

  document.querySelectorAll("[data-vml-mode-label]").forEach(el => {
    el.textContent = VML.modeLabel();
  });
};

document.addEventListener("DOMContentLoaded", VML.applyEnvironment);
