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

VML.isYes = function (value) {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() === "si";
};

VML.isCreatorPublished = function (creator) {
  if (!VML.isPublic()) return true;
  const explicitStatus = String(creator?.publishable || "").trim();
  if (explicitStatus) return VML.isYes(explicitStatus);

  // Compatibilidad con implementaciones anteriores de Apps Script: la vista
  // WEB solo entrega estos campos cuando PUBLICABLE_WEB está en Sí.
  return Boolean(creator?.bio || creator?.birth || creator?.place || creator?.source);
};

VML.publicQuestions = [
  {
    id: "PG-003",
    type: "Disciplina",
    question: "¿Cómo está clasificada Matilde Hidalgo Navarro dentro del archivo?",
    options: ["Poeta", "Compositora", "Arreglista", "Intérprete"],
    answer: "Poeta",
    feedback: "Matilde Hidalgo Navarro está incluida en la categoría de poetas del corpus Voces y Melodías Lojanas.",
    creatorId: "CR-001",
    workId: "",
    difficulty: "Básica",
    source: "01_Creadoras · CR-001",
    destination: "creadora.html?id=CR-001"
  }
];

VML.isProductionQuestion = function (question) {
  const identifiers = [question?.id, question?.creatorId, question?.workId]
    .map(value => String(value || "").trim());
  return !identifiers.some(value => /(?:^|-)TEST(?:-|$)/i.test(value));
};

VML.resourceHref = function (resourceOrId) {
  const resource = typeof resourceOrId === "string" ? { id: resourceOrId } : resourceOrId;
  const id = resource?.id;
  if (!id) return VML.withMode("recursos.html");
  const hasEmbed = /^https:\/\//i.test(String(resource?.embedUrl || "").trim());
  return VML.withMode(`${hasEmbed ? "recurso" : "laboratorio"}.html?id=${encodeURIComponent(id)}`);
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

VML.pick = function (row, ...keys) {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
};

VML.loadPublicAction = async function (action) {
  const params = { action };
  try {
    return await VML.fetchJson(window.VML_CONFIG.API_URL, params, window.VML_CONFIG.JSONP_TIMEOUT_MS);
  } catch (fetchError) {
    try {
      return await VML.jsonp(window.VML_CONFIG.API_URL, params, window.VML_CONFIG.JSONP_TIMEOUT_MS);
    } catch (jsonpError) {
      throw new Error(`No se pudo cargar ${action} (${fetchError.message}; ${jsonpError.message})`);
    }
  }
};

VML.load = async function () {
  VML.showLoading();
  try {
    let data;
    if (VML.isPublic()) {
      // Apps Script y el navegador limitan las conexiones simultáneas al mismo
      // origen. Dos tandas evitan que la última vista expire en la cola.
      const [creatorResponse, workResponse, mediaResponse, resourceResponse] =
        await Promise.all(["creators", "works", "media", "resources"].map(action => VML.loadPublicAction(action)));
      const [relationResponse, locationResponse, mediationResponse, questionResponse] =
        await Promise.all(["relations", "locations", "mediations", "questions"].map(action => VML.loadPublicAction(action)));

      const rows = response => Array.isArray(response?.items) ? response.items : [];
      const creators = rows(creatorResponse).map(item => {
        const name = VML.pick(item, "NOMBRE_COMPLETO", "name");
        return {
          id: VML.pick(item, "ID_CREADORA", "id"),
          name,
          category: VML.pick(item, "CATEGORÍA", "category"),
          discipline: VML.pick(item, "DISCIPLINA", "discipline"),
          birth: VML.pick(item, "AÑO_NACIMIENTO", "birth"),
          place: VML.pick(item, "LUGAR_NACIMIENTO", "place"),
          bio: VML.pick(item, "BIOGRAFÍA_VALIDADA", "bio"),
          source: VML.pick(item, "FUENTE_PRINCIPAL", "source"),
          photoSource: VML.pick(item, "FUENTE_FOTOGRAFÍA", "photoSource"),
          publishable: VML.pick(item, "PUBLICABLE_WEB", "publishable"),
          initials: name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase(),
          works: [],
          media: [],
          resources: [],
          mediations: [],
          questions: []
        };
      }).filter(creator => creator.id && creator.name);

      const works = rows(workResponse).map(item => ({
        id: VML.pick(item, "ID_OBRA", "id"),
        creatorId: VML.pick(item, "ID_CREADORA", "creatorId"),
        creator: VML.pick(item, "CREADORA", "creator"),
        title: VML.pick(item, "OBRA_NORMALIZADA", "title"),
        type: VML.pick(item, "TIPO", "type"),
        role: VML.pick(item, "ROL_CREADORA", "role"),
        year: VML.pick(item, "AÑO_OBRA", "year"),
        genre: VML.pick(item, "GÉNERO", "genre"),
        source: VML.pick(item, "FUENTE", "source"),
        digitalFile: VML.pick(item, "ARCHIVO_DIGITAL", "digitalFile")
      }));

      const media = rows(mediaResponse).map(item => ({
        id: VML.pick(item, "ID_MEDIA", "id"),
        creatorId: VML.pick(item, "ID_CREADORA", "creatorId"),
        workId: VML.pick(item, "ID_OBRA", "workId"),
        resourceId: VML.pick(item, "ID_RECURSO", "resourceId"),
        creator: VML.pick(item, "CREADORA", "creator"),
        type: VML.pick(item, "TIPO_RECURSO", "type"),
        title: VML.pick(item, "TÍTULO_DESCRIPCIÓN", "title"),
        url: VML.pick(item, "URL_O_ARCHIVO", "url"),
        source: VML.pick(item, "FUENTE", "source"),
        alt: VML.pick(item, "TEXTO_ALTERNATIVO", "alt")
      }));

      const resources = rows(resourceResponse).map(item => ({
        id: VML.pick(item, "ID_RECURSO", "id"),
        creatorId: VML.pick(item, "ID_CREADORA", "creatorId"),
        creator: VML.pick(item, "CREADORA", "creator"),
        title: VML.pick(item, "TIPO_RECURSO", "title"),
        sequence: VML.pick(item, "SECUENCIA_PEDAGÓGICA", "sequence"),
        areas: VML.pick(item, "ÁREAS_SUGERIDAS", "areas"),
        level: VML.pick(item, "NIVEL_EDUCATIVO", "level"),
        workBase: VML.pick(item, "OBRA_BASE", "workBase"),
        objective: VML.pick(item, "OBJETIVO_APRENDIZAJE", "objective"),
        activity: VML.pick(item, "ACTIVIDAD_INTERACTIVA", "activity"),
        evidence: VML.pick(item, "EVIDENCIA", "evidence"),
        assessment: VML.pick(item, "INSTRUMENTO_EVALUACIÓN", "assessment"),
        accessibility: VML.pick(item, "ACCESIBILIDAD", "accessibility"),
        technology: VML.pick(item, "TECNOLOGÍA", "technology"),
        projectObjective: VML.pick(item, "OBJETIVO_PROYECTO", "projectObjective"),
        embedUrl: VML.pick(item, "EMBED_URL", "embedUrl"),
        embedFormat: VML.pick(item, "EMBED_FORMATO", "embedFormat"),
        embedHeight: VML.pick(item, "EMBED_ALTURA", "embedHeight")
      }));

      const mediations = rows(mediationResponse).map(item => ({
        id: VML.pick(item, "ID_MEDIACION", "id"),
        creatorId: VML.pick(item, "ID_CREADORA", "creatorId"),
        creator: VML.pick(item, "CREADORA", "creator"),
        title: VML.pick(item, "TITULO_PUBLICO", "title"),
        hook: VML.pick(item, "GANCHO", "hook"),
        guideQuestion: VML.pick(item, "PREGUNTA_GUIA", "guideQuestion"),
        biography: VML.pick(item, "SINTESIS_BIOGRAFICA", "biography"),
        contribution: VML.pick(item, "APORTE_PATRIMONIAL", "contribution"),
        featuredWorks: VML.pick(item, "OBRAS_DESTACADAS", "featuredWorks"),
        experience1: VML.pick(item, "EXPERIENCIA_1", "experience1"),
        experience2: VML.pick(item, "EXPERIENCIA_2", "experience2"),
        experience3: VML.pick(item, "EXPERIENCIA_3", "experience3"),
        multimedia: VML.pick(item, "MULTIMEDIA", "multimedia"),
        legacy: VML.pick(item, "LEGADO", "legacy"),
        audience: VML.pick(item, "PUBLICO", "audience"),
        accessibility: VML.pick(item, "ACCESIBILIDAD", "accessibility"),
        verificationStatus: VML.pick(item, "ESTADO_VERIFICACIÓN", "verificationStatus"),
        publishable: VML.pick(item, "PUBLICABLE_WEB", "publishable")
      }));

      const liveQuestions = rows(questionResponse).map(item => ({
        id: VML.pick(item, "ID_PREGUNTA", "id"),
        type: VML.pick(item, "TIPO", "type"),
        question: VML.pick(item, "PREGUNTA", "question"),
        options: ["OPCION_A", "OPCION_B", "OPCION_C", "OPCION_D"].map(key => VML.pick(item, key)).filter(Boolean),
        answer: VML.pick(item, "RESPUESTA_CORRECTA", "answer"),
        feedback: VML.pick(item, "RETROALIMENTACION", "feedback"),
        creatorId: VML.pick(item, "ID_CREADORA", "creatorId"),
        workId: VML.pick(item, "ID_OBRA", "workId"),
        difficulty: VML.pick(item, "DIFICULTAD", "difficulty"),
        source: VML.pick(item, "FUENTE", "source"),
        destination: VML.pick(item, "ENLACE_DESTINO", "destination")
      })).filter(item =>
        item.question &&
        item.answer &&
        item.options.length >= 2 &&
        VML.isProductionQuestion(item)
      );

      // La implementación pública anterior de Apps Script no expone todavía
      // action=questions. Mientras se publica la versión corregida, el portal
      // conserva una copia controlada de la pregunta real y verificada de la
      // Base Maestra. Las preguntas ficticias de prueba nunca se muestran.
      const questions = (liveQuestions.length ? liveQuestions : VML.publicQuestions)
        .map(item => ({ ...item, options: [...item.options] }));

      const group = (items, key) => items.reduce((acc, item) => {
        const id = item[key];
        if (!id) return acc;
        (acc[id] ||= []).push(item);
        return acc;
      }, {});

      const worksByCreator = group(works, "creatorId");
      const mediaByCreator = group(media, "creatorId");
      const resourcesByCreator = group(resources, "creatorId");
      const mediationsByCreator = group(mediations, "creatorId");
      const questionsByCreator = group(questions, "creatorId");

      creators.forEach(creator => {
        creator.works = worksByCreator[creator.id] || [];
        creator.media = mediaByCreator[creator.id] || [];
        creator.resources = resourcesByCreator[creator.id] || [];
        creator.mediations = mediationsByCreator[creator.id] || [];
        creator.mediation = creator.mediations[0] || null;
        creator.questions = questionsByCreator[creator.id] || [];
        creator.learning = creator.resources[0] || null;
      });

      data = {
        mode: "public",
        generatedAt: new Date().toISOString(),
        creators,
        works,
        media,
        resources,
        relations: rows(relationResponse),
        locations: rows(locationResponse),
        mediations,
        questions
      };
    } else {
      data = await VML.jsonp(window.VML_CONFIG.API_URL, { mode: VML.mode() }, window.VML_CONFIG.JSONP_TIMEOUT_MS);
    }

    VML.hideLoading("Información actualizada");
    return data;
  } catch (error) {
    VML.hideLoading(VML.isPublic() ? "No fue posible actualizar el catálogo" : "No fue posible consultar la vista institucional");
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
