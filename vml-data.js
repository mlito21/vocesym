window.VML = window.VML || {};

VML.jsonp = function (baseUrl, params = {}, timeout) {
  const wait = timeout || window.VML_CONFIG?.JSONP_TIMEOUT_MS || 15000;

  return new Promise((resolve, reject) => {
    const cb = "__vml_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const query = new URLSearchParams({ ...params, callback: cb });
    script.src = baseUrl + (baseUrl.includes("?") ? "&" : "?") + query.toString();

    let done = false;
    const clean = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (script.parentNode) script.remove();
      try { delete window[cb]; } catch (_) { window[cb] = undefined; }
    };

    const timer = setTimeout(() => {
      clean();
      reject(new Error("Tiempo de espera agotado"));
    }, wait);

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

VML.fetchJson = async function (baseUrl, params = {}, timeout) {
  const wait = timeout || window.VML_CONFIG?.JSONP_TIMEOUT_MS || 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), wait);
  const query = new URLSearchParams(params);
  const url = baseUrl + (baseUrl.includes("?") ? "&" : "?") + query.toString();

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

VML.mode = () => window.VML_CONFIG?.API_MODE || "public";
VML.isPreview = () => VML.mode() === "preview";
VML.isPublic = () => VML.mode() === "public";
VML.modeLabel = () => VML.isPreview() ? "PREVIEW · corpus en investigación" : "Versión pública preliminar";

VML.publicResources = [
  {id:"RE-001",creatorId:"CR-001",title:"Laboratorio de lectura y memoria",areas:"Lengua y Literatura · patrimonio cultural",level:"Bachillerato y educación superior",objective:"Analizar cómo la documentación y el contexto sostienen una lectura patrimonial responsable.",prototype:true},
  {id:"RE-047",creatorId:"CR-047",title:"Laboratorio de escucha y composición",areas:"Educación Musical · patrimonio cultural",level:"Bachillerato y educación superior",objective:"Reconocer decisiones compositivas mediante escucha guiada y análisis contextual.",prototype:true},
  {id:"RE-052",creatorId:"CR-052",title:"Laboratorio de adaptación didáctica para piano",areas:"Educación Musical · didáctica instrumental",level:"Formación musical inicial y superior",objective:"Distinguir arreglo, adaptación y transcripción para diseñar una mediación pianística.",prototype:true},
  {id:"RE-058",creatorId:"CR-058",title:"Laboratorio del arreglo coral",areas:"Educación Musical · producción musical",level:"Bachillerato y educación superior",objective:"Identificar y justificar transformaciones de una obra para un nuevo conjunto vocal.",prototype:true}
];

VML.publicQuestions = [
  {question:"¿Qué diferencia un catálogo preliminar de una ficha patrimonial completa?",options:["El catálogo identifica el registro; la ficha incorpora información verificada y fuentes","El catálogo contiene necesariamente todas las obras","No existe ninguna diferencia"],answer:"El catálogo identifica el registro; la ficha incorpora información verificada y fuentes",feedback:"El índice público permite localizar creadoras sin presentar como concluidos datos que aún están en revisión.",destination:"archivo.html"},
  {question:"¿Por qué el archivo distingue composición y arreglo?",options:["Porque son roles creativos diferentes y deben conservar su atribución","Porque el arreglo elimina la autoría de origen","Solo por motivos de diseño"],answer:"Porque son roles creativos diferentes y deben conservar su atribución",feedback:"La trazabilidad de autorías y transformaciones forma parte del rigor patrimonial.",destination:"conexiones.html"},
  {question:"¿Qué debe acompañar a un audio, una imagen o una partitura antes de publicarse?",options:["Fuente y condiciones de uso","Únicamente un título atractivo","Ninguna información adicional"],answer:"Fuente y condiciones de uso",feedback:"La publicación responsable exige procedencia, atribución y derechos o licencias claros.",destination:"proyecto.html"}
];

VML.prototypeResourceIds = new Set(VML.publicResources.map(resource => resource.id));
VML.resourceHref = function (resourceOrId) {
  const id = typeof resourceOrId === "string" ? resourceOrId : resourceOrId?.id;
  if (!id) return VML.withMode("recursos.html");
  return VML.prototypeResourceIds.has(id)
    ? VML.withMode(`laboratorio.html?id=${encodeURIComponent(id)}`)
    : VML.withMode(`recurso.html?id=${encodeURIComponent(id)}`);
};

VML.ensureLoadingUI = function () {
  if (document.querySelector("#vml-loading-layer")) return;
  const style = document.createElement("style");
  style.textContent = `
    .vml-loading-layer{position:fixed;inset:0;z-index:2000;background:rgba(246,243,236,.94);backdrop-filter:blur(7px);display:grid;place-items:center;transition:opacity .25s}
    .vml-loading-layer[hidden]{display:none}.vml-loading-card{width:min(520px,calc(100vw - 36px));background:#fff;border:1px solid #dce5e0;border-radius:26px;padding:28px;box-shadow:0 24px 70px rgba(23,54,47,.18)}
    .vml-loading-brand{display:flex;align-items:center;gap:14px}.vml-loading-seal{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#006b5e;color:#fff;font-weight:850}
    .vml-loading-title{font:700 1.35rem Georgia,serif;color:#17362f}.vml-loading-copy{color:#65766f;font-size:.92rem;margin-top:3px}
    .vml-loading-track{height:10px;background:#e8f1ee;border-radius:99px;overflow:hidden;margin-top:22px}.vml-loading-bar{height:100%;width:8%;background:linear-gradient(90deg,#006b5e,#55a98d);border-radius:inherit;transition:width .35s ease}
    .vml-loading-meta{display:flex;justify-content:space-between;gap:12px;margin-top:10px;font-size:.78rem;color:#65766f}
  `;
  document.head.appendChild(style);
  const layer = document.createElement("div");
  layer.id = "vml-loading-layer";
  layer.className = "vml-loading-layer";
  layer.setAttribute("role", "status");
  layer.setAttribute("aria-live", "polite");
  layer.innerHTML = `<div class="vml-loading-card"><div class="vml-loading-brand"><span class="vml-loading-seal">VM</span><div><div class="vml-loading-title">Cargando el archivo cultural</div><div class="vml-loading-copy" data-loading-copy>Conectando con la Base Maestra…</div></div></div><div class="vml-loading-track"><div class="vml-loading-bar" data-loading-bar></div></div><div class="vml-loading-meta"><span data-loading-step>Preparando consulta</span><strong data-loading-percent>8%</strong></div></div>`;
  document.body.appendChild(layer);
};

VML.showLoading = function () {
  VML.ensureLoadingUI();
  const layer = document.querySelector("#vml-loading-layer");
  const bar = layer.querySelector("[data-loading-bar]");
  const percent = layer.querySelector("[data-loading-percent]");
  const step = layer.querySelector("[data-loading-step]");
  const copy = layer.querySelector("[data-loading-copy]");
  layer.hidden = false;
  layer.style.opacity = "1";
  copy.textContent = "Conectando con la hoja de cálculo del proyecto…";
  const stages = [[12,"Preparando consulta"],[38,"Leyendo creadoras y obras"],[67,"Relacionando fuentes y recursos"],[86,"Construyendo la vista"]];
  let i = 0;
  const apply = () => { const [value,label] = stages[Math.min(i,stages.length-1)]; bar.style.width=value+"%";percent.textContent=value+"%";step.textContent=label;i++; };
  apply();
  clearInterval(VML._loadingTimer);
  VML._loadingTimer = setInterval(apply, 520);
};

VML.hideLoading = function (message) {
  const layer = document.querySelector("#vml-loading-layer");
  if (!layer) return;
  clearInterval(VML._loadingTimer);
  layer.querySelector("[data-loading-bar]").style.width = "100%";
  layer.querySelector("[data-loading-percent]").textContent = "100%";
  layer.querySelector("[data-loading-step]").textContent = message || "Archivo listo";
  setTimeout(() => { layer.style.opacity = "0"; setTimeout(() => { layer.hidden = true; }, 260); }, 350);
};

VML.load = async function () {
  VML.showLoading();
  try {
    const params = VML.isPublic() ? { action: "creators" } : { mode: VML.mode() };
    let response;
    if (VML.isPublic()) {
      try {
        response = await VML.fetchJson(window.VML_CONFIG.API_URL, params, window.VML_CONFIG.JSONP_TIMEOUT_MS);
      } catch (fetchError) {
        try {
          response = await VML.jsonp(window.VML_CONFIG.API_URL, params, window.VML_CONFIG.JSONP_TIMEOUT_MS);
        } catch (jsonpError) {
          throw new Error(`No se pudo consultar la API pública (${fetchError.message}; ${jsonpError.message})`);
        }
      }
    } else {
      response = await VML.jsonp(window.VML_CONFIG.API_URL, params, window.VML_CONFIG.JSONP_TIMEOUT_MS);
    }
    const data = VML.isPublic() && Array.isArray(response?.items)
      ? {
          mode: "public",
          generatedAt: new Date().toISOString(),
          resources: VML.publicResources,
          questions: VML.publicQuestions,
          relations: [],
          locations: [],
          mediations: [],
          creators: response.items.map(item => {
            const name = String(item.NOMBRE_COMPLETO || "").trim();
            return {
              id: String(item.ID_CREADORA || "").trim(),
              name,
              category: String(item["CATEGORÍA"] || "").trim(),
              discipline: String(item.DISCIPLINA || "").trim(),
              initials: name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("")
            };
          }).filter(creator => creator.id && creator.name)
        }
      : response;
    VML.hideLoading("Información actualizada");
    return data;
  } catch (error) {
    if (VML.isPublic()) {
      VML.hideLoading("No fue posible actualizar el catálogo");
      throw error;
    }
    VML.hideLoading("No fue posible consultar la vista institucional");
    throw error;
  }
};

VML.clean = s => String(s || "").replace(/^["']|["']$/g, "").replace(/\.$/, "").trim();
VML.safe = s => String(s || "").replace(/[&<>"']/g, m => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[m]));

VML.withMode = function (url) {
  return url;
};

VML.applyEnvironment = function () {
  document.documentElement.dataset.vmlMode = VML.mode();

  document.querySelectorAll("[data-vml-mode-label]").forEach(el => {
    el.textContent = VML.modeLabel();
  });

  document.querySelectorAll("a[data-vml-preserve-mode]").forEach(link => {
    const href = link.getAttribute("href");
    if (href) link.setAttribute("href", VML.withMode(href));
  });
};

VML.shuffle = function (items) {
  const copy = [...(items || [])];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

VML.ensureQuizStyles = function () {
  if (document.querySelector("#vml-quiz-styles")) return;
  const style = document.createElement("style");
  style.id = "vml-quiz-styles";
  style.textContent = `
    .vml-quiz{background:#fff;border:1px solid var(--line);border-radius:26px;padding:28px;box-shadow:var(--shadow)}
    .vml-quiz-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:22px}
    .vml-quiz-title{font:700 clamp(1.8rem,3vw,2.7rem) Georgia,serif;color:var(--brand-dark);margin:3px 0 0}
    .vml-quiz-meta{font-size:.78rem;color:var(--muted);white-space:nowrap}
    .vml-quiz-question{font:700 1.35rem/1.35 Georgia,serif;margin:0 0 18px;color:var(--brand-dark)}
    .vml-quiz-options{display:grid;gap:10px}
    .vml-quiz-option{width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:15px;padding:13px 15px;color:var(--ink);transition:.15s}
    .vml-quiz-option:hover:not(:disabled){border-color:var(--brand);background:var(--soft)}
    .vml-quiz-option.correct{border-color:#2f7c68;background:#e8f4ef}
    .vml-quiz-option.incorrect{border-color:#a85e58;background:#fbefed}
    .vml-quiz-option:disabled{cursor:default}
    .vml-quiz-feedback{margin-top:18px;border-radius:16px;padding:16px;background:#f4f1e8;line-height:1.55}
    .vml-quiz-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
    .vml-quiz-progress{height:8px;background:#e5ebe8;border-radius:99px;overflow:hidden;margin-bottom:22px}
    .vml-quiz-progress > span{display:block;height:100%;background:var(--brand);transition:width .2s}
    .vml-quiz-score{font:700 3rem Georgia,serif;color:var(--brand);line-height:1}
    @media(max-width:575px){.vml-quiz{padding:20px}.vml-quiz-head{display:block}.vml-quiz-meta{margin-top:8px;white-space:normal}}
  `;
  document.head.appendChild(style);
};

VML.mountQuiz = function (target, questions, options = {}) {
  const container = typeof target === "string" ? document.querySelector(target) : target;
  if (!container) return null;
  VML.ensureQuizStyles();

  const pool = (questions || []).filter(q => q && q.question && Array.isArray(q.options) && q.options.length >= 2 && q.answer);
  const count = Math.max(1, Math.min(Number(options.count || 1), pool.length || 1));
  const selected = VML.shuffle(pool).slice(0, count);
  const title = options.title || "¿Cuánto conoces a las creadoras lojanas?";
  const eyebrow = options.eyebrow || "Descubre jugando";

  if (!selected.length) {
    container.innerHTML = VML.isPublic()
      ? ""
      : `<div class="vml-quiz"><div class="eyebrow">${VML.safe(eyebrow)}</div><h2 class="vml-quiz-title">${VML.safe(title)}</h2><p class="text-secondary mt-3 mb-0">Todavía no hay preguntas disponibles en esta vista.</p></div>`;
    return null;
  }

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const q = selected[current];
    answered = false;
    const progress = Math.round(((current + 1) / selected.length) * 100);
    container.innerHTML = `
      <div class="vml-quiz" role="region" aria-label="Pregunta interactiva">
        <div class="vml-quiz-head">
          <div><div class="eyebrow">${VML.safe(eyebrow)}</div><h2 class="vml-quiz-title">${VML.safe(title)}</h2></div>
          <div class="vml-quiz-meta">Pregunta ${current + 1} de ${selected.length}${q.difficulty ? ` · ${VML.safe(q.difficulty)}` : ""}</div>
        </div>
        ${selected.length > 1 ? `<div class="vml-quiz-progress"><span style="width:${progress}%"></span></div>` : ""}
        <p class="vml-quiz-question">${VML.safe(q.question)}</p>
        <div class="vml-quiz-options">
          ${VML.shuffle(q.options).map(option => `<button type="button" class="vml-quiz-option" data-answer="${VML.safe(option)}">${VML.safe(option)}</button>`).join("")}
        </div>
        <div class="vml-quiz-feedback" hidden></div>
        <div class="vml-quiz-actions" hidden></div>
      </div>`;

    container.querySelectorAll(".vml-quiz-option").forEach(button => {
      button.addEventListener("click", () => answer(button, q));
    });
  }

  function answer(button, q) {
    if (answered) return;
    answered = true;
    const chosen = button.dataset.answer;
    const correct = chosen === q.answer;
    if (correct) score++;

    container.querySelectorAll(".vml-quiz-option").forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === q.answer) btn.classList.add("correct");
      else if (btn === button && !correct) btn.classList.add("incorrect");
    });

    const feedback = container.querySelector(".vml-quiz-feedback");
    feedback.hidden = false;
    feedback.innerHTML = `<strong>${correct ? "¡Correcto!" : "Sigue explorando."}</strong><div class="mt-1">${VML.safe(q.feedback || "Consulta el archivo para ampliar esta información.")}</div>`;

    const actions = container.querySelector(".vml-quiz-actions");
    actions.hidden = false;
    const nextLabel = current < selected.length - 1 ? "Siguiente pregunta" : "Ver resultado";
    actions.innerHTML = `<button type="button" class="btn btn-brand rounded-pill" data-next>${nextLabel}</button>${q.destination ? `<a class="btn btn-outline-brand rounded-pill" href="${VML.withMode(q.destination)}">Seguir descubriendo</a>` : ""}`;
    actions.querySelector("[data-next]").addEventListener("click", next);
  }

  function next() {
    if (current < selected.length - 1) {
      current++;
      renderQuestion();
      return;
    }
    renderResult();
  }

  function renderResult() {
    const pct = Math.round((score / selected.length) * 100);
    container.innerHTML = `
      <div class="vml-quiz">
        <div class="eyebrow">Resultado</div>
        <div class="vml-quiz-score mt-2">${score} / ${selected.length}</div>
        <h2 class="vml-quiz-title mt-3">${pct >= 80 ? "Muy buen recorrido" : pct >= 50 ? "Vas descubriendo el archivo" : "Hay mucho por explorar"}</h2>
        <p class="text-secondary mt-3">Las preguntas sirven como puerta de entrada al patrimonio, no como evaluación formal.</p>
        <div class="vml-quiz-actions"><button type="button" class="btn btn-brand rounded-pill" data-restart>Intentar nuevamente</button><a class="btn btn-outline-brand rounded-pill" href="${VML.withMode("archivo.html")}">Explorar creadoras</a></div>
      </div>`;
    container.querySelector("[data-restart]").addEventListener("click", () => VML.mountQuiz(container, pool, options));
  }

  renderQuestion();
  return { selected };
};

document.addEventListener("DOMContentLoaded", VML.applyEnvironment);
