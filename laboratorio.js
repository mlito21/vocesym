(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const requestedId = new URLSearchParams(location.search).get("id");
  const clean = value => VML.clean(value || "");
  const safe = value => VML.safe(clean(value));
  const normalize = value => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const validUrl = value => /^https:\/\//i.test(String(value || "").trim());
  const station = (number, title, body) => `<section class="station${number === 1 ? " active" : ""}" data-panel="${number}" aria-hidden="${number !== 1}"><div class="station-card"><div class="eyebrow">Estación ${number} · ${safe(title)}</div>${body}</div></section>`;
  const next = number => number < 5 ? `<button class="btn btn-brand rounded-pill mt-4 next-station" data-next="${number + 1}">Continuar</button>` : "";

  function fail(message) {
    $("#lab-title").textContent = "Laboratorio no disponible";
    $("#lab-lead").textContent = "La experiencia solicitada no forma parte de los recursos publicados en la Base Maestra.";
    $("#lab-status").innerHTML = `${safe(message)} <a href="recursos.html">Consultar recursos publicados</a>.`;
    $("#station-tabs").innerHTML = "";
    $("#laboratory-content").innerHTML = "";
  }

  function splitSequence(value) {
    const steps = clean(value).split(/→|>|;/).map(item => item.trim()).filter(Boolean).slice(0, 5);
    const defaults = ["Contextualiza", "Explora", "Analiza", "Produce", "Evalúa"];
    return defaults.map((fallback, index) => steps[index] || fallback);
  }

  function workCard(work) {
    const href = validUrl(work.digitalFile) ? `<a href="${safe(work.digitalFile)}" target="_blank" rel="noopener">Abrir obra documentada</a>` : "";
    return `<article class="source-box h-100"><div class="eyebrow">Obra base vinculada</div><h3 class="h4 mt-2">${safe(work.title)}</h3><p class="mb-2">${safe([work.type, work.genre, work.year].filter(Boolean).join(" · ") || "Registro de obra")}</p>${work.role ? `<p class="mb-2"><strong>Rol:</strong> ${safe(work.role)}</p>` : ""}${work.source ? `<p class="source-note"><strong>Fuente:</strong> ${safe(work.source)}</p>` : ""}${href}</article>`;
  }

  function mediaCard(media) {
    const href = validUrl(media.url) ? `<a href="${safe(media.url)}" target="_blank" rel="noopener">Abrir material</a>` : "";
    return `<article class="source-box"><div class="eyebrow">Material relacionado con la obra</div><h3 class="h5 mt-2">${safe(media.title || media.type || "Material multimedia")}</h3>${media.source ? `<p class="source-note"><strong>Fuente:</strong> ${safe(media.source)}</p>` : ""}${href}</article>`;
  }

  function build(resource, creator, work, media, tabs) {
    const creatorName = clean(creator?.name || resource.creator || "Creadora");
    const workName = clean(work?.title || resource.workBase);
    const activity = clean(resource.activity);
    const evidence = clean(resource.evidence);
    const assessment = clean(resource.assessment);

    return station(1, tabs[0], `
      <h2 class="section-title fs-1">Conoce el propósito de la experiencia</h2>
      <div class="row g-4"><div class="col-lg-7"><p class="fs-5"><strong>${safe(creatorName)}</strong>${creator?.discipline ? ` · ${safe(creator.discipline)}` : ""}</p><p>${safe(creator?.bio || "Consulta la ficha de la creadora para conocer su trayectoria y los datos documentados disponibles.")}</p><a class="btn btn-outline-brand rounded-pill" href="${VML.withMode(`creadora.html?id=${encodeURIComponent(resource.creatorId)}`)}">Abrir ficha de la creadora</a></div><div class="col-lg-5"><div class="source-box"><strong>Objetivo de aprendizaje</strong><p class="mb-0 mt-2">${safe(resource.objective || "Objetivo pendiente de completar en la Base Maestra.")}</p></div></div></div>
      <div id="context-quiz" class="mt-4"></div>${next(1)}`) +
    station(2, tabs[1], `
      <h2 class="section-title fs-1">Explora la obra y sus materiales</h2>
      ${work ? workCard(work) : `<div class="alert alert-warning"><strong>Obra base no vinculada.</strong> El recurso indica “${safe(resource.workBase || "sin obra base")}”, pero no existe una coincidencia pública exacta. No se seleccionará otra obra automáticamente.</div>`}
      <div class="mt-4">${media.length ? media.map(mediaCard).join("") : `<div class="source-box"><strong>Sin material vinculado mediante ID_OBRA o ID_RECURSO</strong><p class="mb-0 mt-2">No se mostrarán audios, textos o partituras asociados solamente a la creadora, porque podrían pertenecer a otra obra.</p></div>`}</div>
      <label class="form-label fw-bold mt-4" for="exploration-response">Registra lo que la evidencia disponible permite observar</label><textarea id="exploration-response" class="form-control lab-textarea" data-save="exploration" placeholder="Describe datos observables y señala los límites de la evidencia disponible…"></textarea>${next(2)}`) +
    station(3, tabs[2], `
      <h2 class="section-title fs-1">Desarrolla la actividad</h2><div class="source-box"><strong>Consigna registrada en la Base Maestra</strong><p class="mb-0 mt-2">${safe(activity || "La actividad debe completarse en la Base Maestra antes de utilizar este laboratorio.")}</p></div>
      <label class="form-label fw-bold mt-4" for="activity-response">Tu desarrollo</label><textarea id="activity-response" class="form-control lab-textarea" data-save="activity" placeholder="Responde a la consigna con base en la creadora, la obra y los materiales disponibles…"></textarea>${next(3)}`) +
    station(4, tabs[3], `
      <h2 class="section-title fs-1">Construye la evidencia de aprendizaje</h2><div class="row g-4"><div class="col-lg-6"><div class="source-box h-100"><strong>Evidencia esperada</strong><p class="mb-0 mt-2">${safe(evidence || "Evidencia pendiente de definir en la Base Maestra.")}</p></div></div><div class="col-lg-6"><div class="source-box h-100"><strong>Evaluación prevista</strong><p class="mb-0 mt-2">${safe(assessment || "Instrumento pendiente de definir en la Base Maestra.")}</p></div></div></div>
      <label class="form-label fw-bold mt-4" for="evidence-response">Planifica tu producto y explica cómo responderá al objetivo</label><textarea id="evidence-response" class="form-control lab-textarea" data-save="evidence" placeholder="Relaciona objetivo, actividad, producto y criterios de evaluación…"></textarea>${next(4)}`) +
    station(5, tabs[4], `
      <div class="row g-4"><div class="col-lg-8"><h2 class="section-title fs-1">Entrega tu producto</h2><p><strong>${safe(evidence || "Desarrolla el producto solicitado en la experiencia.")}</strong></p><textarea id="final-product" class="form-control lab-textarea" data-save="final-product" placeholder="Integra aquí tu producto o la justificación que lo acompaña…"></textarea><div id="word-count" class="source-note mt-2" aria-live="polite"></div></div><div class="col-lg-4"><div class="evidence-card"><div class="eyebrow text-white-50">Antes de finalizar</div><ul class="text-white-50 mt-3"><li>Responde al objetivo de aprendizaje.</li><li>Se fundamenta en la creadora y la obra realmente vinculadas.</li><li>Distingue evidencia, interpretación y creación.</li><li>Atiende la evaluación registrada.</li></ul><button class="btn btn-light rounded-pill" id="complete-lab">Validar recorrido</button><div id="completion-message" class="mt-3" aria-live="polite"></div></div></div></div>`);
  }

  function activate(resource) {
    const key = `vml-lab-${resource.id}-`;
    const updateWords = () => {
      const field = $("#final-product");
      if (!field) return;
      $("#word-count").textContent = `${field.value.trim() ? field.value.trim().split(/\s+/).length : 0} palabras`;
    };
    const showStation = (number, move = true) => {
      $$(".station").forEach(panel => { const active = Number(panel.dataset.panel) === number; panel.classList.toggle("active", active); panel.setAttribute("aria-hidden", String(!active)); });
      $$(".station-btn").forEach(button => { const active = Number(button.dataset.station) === number; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
      const percent = number * 20;
      $("#progress-label").textContent = `Recorrido ${number} de 5`;
      $("#progress-percent").textContent = `${percent}%`;
      $("#progress-bar").style.width = `${percent}%`;
      $(".lab-progress").setAttribute("aria-valuenow", String(percent));
      localStorage.setItem(key + "station", String(number));
      if (move) $(".station-nav").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $$(".station-btn").forEach(button => button.addEventListener("click", () => showStation(Number(button.dataset.station))));
    $$(".next-station").forEach(button => button.addEventListener("click", () => showStation(Number(button.dataset.next))));
    $$('[data-save]').forEach(input => {
      const saved = localStorage.getItem(key + input.dataset.save);
      if (saved !== null) input.value = saved;
      input.addEventListener("input", () => { localStorage.setItem(key + input.dataset.save, input.value); updateWords(); });
    });
    $("#complete-lab").addEventListener("click", () => {
      const missing = ["exploration-response", "activity-response", "evidence-response", "final-product"].filter(id => !$("#" + id).value.trim());
      if (missing.length) {
        $("#completion-message").innerHTML = '<div class="alert alert-warning">Completa las respuestas de las estaciones 2, 3, 4 y 5 antes de finalizar.</div>';
        return;
      }
      localStorage.setItem(key + "complete", "1");
      $("#completion-message").innerHTML = '<div class="alert alert-light">Recorrido completado en este navegador. Revisa y conserva tus respuestas.</div>';
    });
    showStation(Math.min(5, Math.max(1, Number(localStorage.getItem(key + "station") || 1))), false);
    updateWords();
  }

  async function init() {
    if (!requestedId) { fail("Falta el identificador del recurso."); return; }
    try {
      const data = await VML.load();
      const resource = (data.resources || []).find(item => item.id === requestedId);
      if (!resource) { fail(`El recurso ${requestedId} no está publicado.`); return; }
      if (validUrl(resource.embedUrl)) { location.replace(VML.resourceHref(resource)); return; }

      const creator = (data.creators || []).find(item => item.id === resource.creatorId);
      if (!creator) { fail(`El recurso ${requestedId} no tiene una creadora pública vinculada.`); return; }
      const works = creator.works || [];
      const target = normalize(resource.workBase);
      const work = target ? works.find(item => normalize(item.id) === target || normalize(item.title) === target) : null;
      const media = (creator.media || []).filter(item => item.resourceId === resource.id || (work && item.workId === work.id));
      const tabs = splitSequence(resource.sequence);

      document.title = `${resource.title || "Laboratorio"} · Voces y Melodías Lojanas`;
      $("#lab-nav-title").textContent = resource.title || "Laboratorio educativo";
      $("#lab-eyebrow").textContent = `Recurso educativo · ${resource.areas || creator.discipline || "Patrimonio cultural"}`;
      $("#lab-title").textContent = resource.title || "Laboratorio educativo";
      $("#lab-lead").textContent = resource.objective || "Experiencia vinculada con una creadora del archivo.";
      $("#station-tabs").innerHTML = tabs.map((label, index) => `<button class="btn station-btn${index === 0 ? " active" : ""}" data-station="${index + 1}" role="tab" aria-selected="${index === 0}">${index + 1}. ${safe(label)}</button>`).join("");
      $("#laboratory-content").innerHTML = build(resource, creator, work, media, tabs);
      const questions = (creator.questions || []).filter(question => clean(question.creatorId) === creator.id);
      if (questions.length) VML.mountQuiz("#context-quiz", questions, { count: 1, eyebrow: "Comprueba tu comprensión", title: `Una pregunta sobre ${creator.name}` });
      else $("#context-quiz").innerHTML = `<div class="source-box"><strong>Sin pregunta publicada</strong><p class="mb-0 mt-2">El laboratorio no sustituirá este vacío con preguntas generales o pertenecientes a otra creadora.</p></div>`;
      $("#lab-status").textContent = `${VML.modeLabel()} · ${creator.name} · ${resource.level || "nivel por definir"}`;
      $("#lab-status").classList.add("is-ready");
      activate(resource);
    } catch (error) {
      fail(`No fue posible consultar la Base Maestra: ${error.message}.`);
    }
  }

  init();
})();
