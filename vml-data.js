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

VML.withMode = function (url) {
  if (!url || /^(https?:|mailto:|tel:|#)/i.test(url)) return url;
  const parts = String(url).split("#");
  const baseAndQuery = parts[0];
  const hash = parts[1] ? "#" + parts[1] : "";
  const separator = baseAndQuery.includes("?") ? "&" : "?";
  return `${baseAndQuery}${separator}mode=${encodeURIComponent(VML.mode())}${hash}`;
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
