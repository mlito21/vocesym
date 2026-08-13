(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const requestedId = new URLSearchParams(location.search).get("id") || "RE-001";

  const LABS = {
    "RE-001": { creatorId: "CR-001", discipline: "Poesía", nav: "Laboratorio de lectura y memoria", title: "Leer, interpretar y contrastar la memoria escrita.", lead: "Cinco estaciones para contextualizar, examinar, interpretar, verificar y crear a partir de los registros documentados de la creadora.", tabs: ["Contexto", "Lee / Examina", "Interpreta", "Contrasta", "Crea"], kind: "poetry" },
    "RE-047": { creatorId: "CR-047", discipline: "Composición", nav: "Laboratorio de escucha y composición", title: "Escuchar el patrimonio musical de Loja.", lead: "Cinco estaciones para contextualizar, examinar, reconocer, comparar y crear a partir de las obras documentadas de la compositora.", tabs: ["Contexto", "Escucha / Examina", "Interpreta", "Contrasta", "Crea"], kind: "composition" },
    "RE-052": { creatorId: "CR-052", discipline: "Adaptación didáctica", nav: "Laboratorio de adaptación para piano", title: "Adaptar una obra para aprender piano.", lead: "Cinco estaciones para examinar una obra documentada y justificar decisiones de adaptación según un nivel de aprendizaje.", tabs: ["Contexto", "Examina", "Decide", "Contrasta", "Justifica"], kind: "piano" },
    "RE-058": { creatorId: "CR-058", discipline: "Arreglo coral", nav: "Laboratorio del arreglo coral", title: "Transformar una obra para nuevas voces.", lead: "Cinco estaciones para comparar registros, identificar transformaciones y sustentar una propuesta vinculada con la arreglista.", tabs: ["Contexto", "Compara", "Interpreta", "Contrasta", "Diseña"], kind: "choral" }
  };

  const lab = LABS[requestedId];
  if (!lab) {
    $("#lab-title").textContent = "Recurso no disponible";
    $("#lab-status").innerHTML = `El identificador <strong>${VML.safe(requestedId)}</strong> no corresponde a un laboratorio publicado. <a href="recursos.html">Ver recursos</a>.`;
    return;
  }

  const station = (number, title, body) => `<section class="station${number === 1 ? " active" : ""}" data-panel="${number}" aria-hidden="${number !== 1}"><div class="station-card"><div class="eyebrow">Estación ${number} · ${title}</div>${body}</div></section>`;
  const next = number => number < 5 ? `<button class="btn btn-brand rounded-pill mt-4 next-station" data-next="${number + 1}">Continuar</button>` : "";

  function buildExperience() {
    return station(1, lab.tabs[0], `
      <h2 class="section-title fs-1">¿Qué sabemos y qué permanece en investigación?</h2>
      <div class="row g-4"><div class="col-lg-7"><div id="context-bio" class="fs-5 text-secondary"><p>Consultando el catálogo…</p></div></div><div class="col-lg-5"><div class="source-box"><strong>Obras vinculadas</strong><div id="context-works" class="mt-2"><p>Consultando registros…</p></div></div></div></div>
      <div id="context-quiz" class="mt-4" aria-live="polite"><p class="text-secondary mb-0">Consultando la actividad de esta creadora…</p></div>${next(1)}`) +
    station(2, lab.tabs[1], `
      <h2 id="evidence-title" class="section-title fs-1">Examina una evidencia vinculada</h2>
      <p id="evidence-intro" class="fs-5 text-secondary">Consultando las obras y materiales de esta creadora…</p>
      <div id="evidence-records" class="row g-3 mt-1"></div><div id="media-records" class="mt-4"></div>
      <div class="source-box mt-4"><strong id="evidence-question">Actividad de observación</strong><p id="evidence-guidance" class="mb-3 mt-2"></p><textarea class="form-control lab-textarea" data-save="evidence-observation" aria-label="Respuesta de observación"></textarea></div>${next(2)}`) +
    station(3, lab.tabs[2], `
      <h2 id="interpretation-title" class="section-title fs-1">Construye una interpretación situada</h2>
      <p id="interpretation-prompt" class="fs-5">La consigna se completará con los datos de la creadora y su obra.</p><div id="interpretation-support" class="source-box mb-4"></div>
      <textarea class="form-control lab-textarea" data-save="interpretation" aria-label="Interpretación argumentada"></textarea>${next(3)}`) +
    station(4, lab.tabs[3], `
      <h2 id="contrast-title" class="section-title fs-1">Contrasta las fuentes del registro</h2><p id="contrast-intro" class="fs-5">Compara lo que sostiene cada fuente antes de formular una conclusión.</p>
      <div id="source-records" class="row g-3 mt-1"></div><div class="source-box mt-4"><strong id="contrast-question">Pregunta de contraste</strong><p id="contrast-guidance" class="mb-3 mt-2"></p><textarea class="form-control lab-textarea" data-save="source-reflection" aria-label="Contraste de fuentes"></textarea></div>${next(4)}`) +
    station(5, lab.tabs[4], `
      <div class="row g-4"><div class="col-lg-8"><h2 id="final-title" class="section-title fs-1">Producto final</h2><p id="final-prompt"></p><textarea id="final-product" class="form-control lab-textarea" data-save="final-product" placeholder="Desarrolla aquí tu propuesta…"></textarea><div id="word-count" class="source-note mt-2" aria-live="polite"></div></div><div class="col-lg-4"><div class="evidence-card"><div class="eyebrow text-white-50">Criterios</div><ul id="final-criteria" class="text-white-50 mt-3"></ul><button class="btn btn-light rounded-pill" id="complete-lab">Marcar como completado</button><div id="completion-message" class="mt-3" aria-live="polite"></div></div></div></div>`);
  }

  document.title = `${lab.nav} · Voces y Melodías Lojanas`;
  $("#lab-nav-title").textContent = lab.nav;
  $("#lab-eyebrow").textContent = `Recurso educativo interactivo · ${lab.discipline}`;
  $("#lab-title").textContent = lab.title;
  $("#lab-lead").textContent = lab.lead;
  $("#station-tabs").innerHTML = lab.tabs.map((label, index) => `<button class="btn station-btn${index === 0 ? " active" : ""}" data-station="${index + 1}" role="tab" aria-selected="${index === 0}">${index + 1}. ${label}</button>`).join("");
  $("#laboratory-content").innerHTML = buildExperience();

  const key = `vml-lab-${requestedId}-`;
  function showStation(number, move = true) {
    $$(".station").forEach(panel => { const active = Number(panel.dataset.panel) === number; panel.classList.toggle("active", active); panel.setAttribute("aria-hidden", String(!active)); });
    $$(".station-btn").forEach(button => { const active = Number(button.dataset.station) === number; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
    const percent = number * 20;
    $("#progress-label").textContent = `Estación ${number} de 5`; $("#progress-percent").textContent = `${percent}%`; $("#progress-bar").style.width = `${percent}%`; $(".lab-progress").setAttribute("aria-valuenow", String(percent));
    localStorage.setItem(key + "station", String(number));
    if (move) $(".station-nav").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $$(".station-btn").forEach(button => button.addEventListener("click", () => showStation(Number(button.dataset.station))));
  $$(".next-station").forEach(button => button.addEventListener("click", () => showStation(Number(button.dataset.next))));
  $$('[data-save]').forEach(input => { const saved = localStorage.getItem(key + input.dataset.save); if (saved !== null) input.value = saved; input.addEventListener("input", () => { localStorage.setItem(key + input.dataset.save, input.value); updateWords(); }); });
  function updateWords() { const field = $("#final-product"); const output = $("#word-count"); if (!field || !output) return; const count = field.value.trim() ? field.value.trim().split(/\s+/).length : 0; output.textContent = `${count} palabras`; }
  $("#complete-lab").addEventListener("click", () => { localStorage.setItem(key + "complete", "1"); $("#completion-message").innerHTML = '<div class="alert alert-light">Completado en este navegador. Puedes revisar o copiar tus respuestas.</div>'; });
  showStation(Math.min(5, Math.max(1, Number(localStorage.getItem(key + "station") || 1))), false); updateWords();

  const clean = value => VML.clean(value || "");
  const safe = value => VML.safe(clean(value));
  const unique = values => [...new Set(values.map(clean).filter(Boolean))];
  const link = url => /^https?:\/\//i.test(String(url || "")) ? `<a href="${VML.safe(url)}" target="_blank" rel="noopener">Abrir material documentado</a>` : "";
  const workCard = (work, featured) => `<article class="col-lg-6"><div class="source-box h-100"><div class="eyebrow">${featured ? "Obra de referencia" : "Obra vinculada"}</div><h3 class="h4 mt-2">${safe(work.title) || "Obra sin título normalizado"}</h3><p class="mb-2">${safe([work.type, work.genre, work.year].filter(Boolean).join(" · ") || "Registro de obra")}</p>${work.role ? `<p class="mb-2"><strong>Rol:</strong> ${safe(work.role)}</p>` : ""}${work.source ? `<p class="source-note mb-2"><strong>Fuente:</strong> ${safe(work.source)}</p>` : ""}${work.digitalFile ? `<p class="mb-0">${link(work.digitalFile) || safe(work.digitalFile)}</p>` : ""}</div></article>`;
  const mediaCard = media => `<div class="source-box"><div class="eyebrow">Material vinculado</div><h3 class="h5 mt-2">${safe(media.title || media.type || "Recurso multimedia")}</h3>${media.type ? `<p class="mb-2">${safe(media.type)}</p>` : ""}${media.source ? `<p class="source-note mb-2"><strong>Fuente:</strong> ${safe(media.source)}</p>` : ""}${media.url ? `<p class="mb-0">${link(media.url) || safe(media.url)}</p>` : ""}</div>`;

  function renderCreator(data) {
    const creator = (data.creators || []).find(item => item.id === lab.creatorId);
    const resource = (data.resources || []).find(item => item.id === requestedId) || VML.publicResources.find(item => item.id === requestedId);
    const profile = creator || { name: "Creadora del catálogo", discipline: lab.discipline, works: [], media: [], questions: [] };
    const works = profile.works || [];
    const primaryWork = works.find(work => resource?.workBase && (work.id === resource.workBase || clean(work.title) === clean(resource.workBase))) || works[0] || null;
    const workName = clean(primaryWork?.title) || "la obra vinculada";
    const creatorName = clean(profile.name) || "la creadora";

    $("#context-bio").innerHTML = `<p><strong>${safe(creatorName)}</strong> · ${safe(profile.discipline || profile.category || lab.discipline)}.</p><p>${safe(profile.bio || "La ficha pública identifica el registro; la ampliación biográfica permanece sujeta a revisión documental y editorial.")}</p>${profile.source ? `<p class="source-note"><strong>Fuente:</strong> ${safe(profile.source)}</p>` : ""}`;
    $("#context-works").innerHTML = works.length ? works.slice(0, 6).map(work => `<div class="border-bottom py-2"><strong>${safe(work.title)}</strong><br><small>${safe(work.genre || work.type || "Registro preliminar")}</small></div>`).join("") : `<p>${safe(resource?.objective || "Las obras se incorporarán cuando hayan sido verificadas y autorizadas.")}</p>`;
    const creatorQuestions = (profile.questions || []).filter(question => String(question.creatorId || "").trim() === lab.creatorId);
    const quiz = $("#context-quiz");
    if (creatorQuestions.length) VML.mountQuiz(quiz, creatorQuestions, { count: 1, eyebrow: "Comprueba tu comprensión", title: `¿Qué descubriste sobre ${creatorName}?` });
    else quiz.innerHTML = `<div class="source-box"><strong>Actividad en preparación</strong><p class="mb-0 mt-2">Todavía no hay una pregunta publicada y vinculada con ${safe(creatorName)}. No se mostrará una pregunta general ni perteneciente a otra creadora.</p></div>`;

    const evidenceTitles = { poetry: "Lee y examina el registro de una obra", composition: "Escucha o examina una obra documentada", piano: "Examina la obra antes de adaptarla", choral: "Compara la obra de origen y el arreglo documentado" };
    $("#evidence-title").textContent = evidenceTitles[lab.kind];
    $("#evidence-intro").textContent = primaryWork ? `Trabaja con “${workName}”, vinculada en la base de datos con ${creatorName}. Distingue lo que consta en el registro de aquello que todavía requiere evidencia.` : `Todavía no existe una obra pública vinculada con ${creatorName}. La actividad se limita a identificar ese vacío documental; no se presenta contenido ficticio como si fuera suyo.`;
    $("#evidence-records").innerHTML = works.length ? works.slice(0, 2).map((work, index) => workCard(work, index === 0)).join("") : `<div class="col-12"><div class="source-box"><strong>Sin obra pública vinculada</strong><p class="mb-0 mt-2">Para habilitar esta estación debe publicarse al menos una obra con el mismo ID de creadora.</p></div></div>`;
    $("#media-records").innerHTML = (profile.media || []).length ? (profile.media || []).slice(0, 2).map(mediaCard).join("") : `<div class="source-box"><strong>Audio, partitura o texto no disponible</strong><p class="mb-0 mt-2">No se simula una obra de ${safe(creatorName)}. Cuando exista un archivo autorizado, aparecerá aquí con su fuente y condiciones de uso.</p></div>`;
    $("#evidence-question").textContent = primaryWork ? `¿Qué permite afirmar el registro de “${workName}”?` : `¿Qué falta para estudiar una obra de ${creatorName}?`;
    $("#evidence-guidance").textContent = primaryWork ? `Anota el título, el rol atribuido a ${creatorName}, la fuente disponible y un dato que aún no debería darse por confirmado.` : "Identifica los datos, la fuente y el material que deberían incorporarse antes de proponer una interpretación.";

    $("#interpretation-title").textContent = lab.kind === "composition" ? "Construye una escucha argumentada" : lab.kind === "choral" ? "Interpreta una transformación documentada" : lab.kind === "piano" ? "Formula una decisión de adaptación" : "Construye una lectura argumentada";
    $("#interpretation-prompt").textContent = primaryWork ? `Formula una interpretación provisional sobre “${workName}” en relación con la trayectoria de ${creatorName}. Explica qué dato del registro utilizas y qué evidencia adicional necesitarías para sostenerla.` : `Explica por qué no sería responsable interpretar la producción de ${creatorName} sin una obra y una fuente vinculadas. Propón una ruta concreta para completar el registro.`;
    $("#interpretation-support").innerHTML = `<strong>Objetivo de aprendizaje</strong><p class="mb-0 mt-2">${safe(resource?.objective || `Relacionar la obra documentada con la trayectoria de ${creatorName} mediante evidencia verificable.`)}</p>`;

    const sources = unique([profile.source, ...works.map(work => work.source)]);
    $("#contrast-title").textContent = `Contrasta las fuentes sobre ${creatorName}`;
    $("#contrast-intro").textContent = primaryWork ? `Compara la fuente biográfica de ${creatorName} con la fuente asociada a “${workName}”. Una biografía general no demuestra por sí sola la autoría, fecha o características de una obra.` : `Examina qué fuente documenta a ${creatorName} y qué fuente específica faltaría para estudiar una obra.`;
    $("#source-records").innerHTML = sources.length ? sources.slice(0, 4).map((source, index) => `<article class="col-lg-6"><div class="source-box h-100"><div class="eyebrow">Fuente ${index + 1}</div><p class="mt-2 mb-0">${safe(source)}</p></div></article>`).join("") : `<div class="col-12"><div class="source-box"><strong>Sin fuente pública suficiente</strong><p class="mb-0 mt-2">El contraste no puede completarse hasta incorporar procedencia verificable.</p></div></div>`;
    $("#contrast-question").textContent = primaryWork ? `¿Qué afirma cada fuente sobre ${creatorName} y “${workName}”?` : `¿Qué fuente falta para pasar del registro biográfico al estudio de una obra?`;
    $("#contrast-guidance").textContent = "Separa coincidencias, vacíos y posibles contradicciones. No conviertas una inferencia en un hecho confirmado.";

    const finalPrompts = {
      poetry: `Redacta una nota curatorial sobre ${creatorName} y “${workName}”. Distingue los datos verificados, tu interpretación y aquello que permanece en investigación.`,
      composition: `Diseña una ficha de escucha sobre ${creatorName} y “${workName}” que conecte contexto, rasgos musicales observables, fuente y una pregunta de interpretación.`,
      piano: `Propón una adaptación didáctica de “${workName}” vinculada con ${creatorName}. Indica qué conservarías, qué modificarías, para qué nivel y con qué evidencia evaluarías el aprendizaje.`,
      choral: `Diseña un comentario técnico sobre el trabajo de ${creatorName} en “${workName}”: identifica la obra de origen, la transformación propuesta y la evidencia que permitiría comprobarla.`
    };
    $("#final-title").textContent = `${lab.tabs[4]} con ${creatorName}`;
    $("#final-prompt").textContent = finalPrompts[lab.kind];
    $("#final-criteria").innerHTML = ["Nombra a la creadora y la obra estudiada", "Distingue evidencia e interpretación", "Cita al menos una fuente del registro", "No atribuye contenidos ficticios o no verificados"].map(item => `<li>${VML.safe(item)}</li>`).join("");
    $("#lab-status").textContent = `${VML.modeLabel()} · actividad vinculada con ${creatorName}`;
    $("#lab-status").classList.add("is-ready");
  }

  VML.load().then(renderCreator).catch(error => { $("#lab-status").textContent = `Laboratorio disponible · catálogo temporalmente no accesible (${error.message})`; renderCreator({ creators: [], resources: VML.publicResources }); });
})();
