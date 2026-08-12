(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const requestedId = new URLSearchParams(location.search).get("id") || "RE-001";

  const LABS = {
    "RE-001": {
      creatorId: "CR-001", discipline: "Poesía",
      nav: "Laboratorio de lectura y memoria",
      title: "Leer, interpretar y contrastar la memoria escrita.",
      lead: "Cinco estaciones para contextualizar, examinar, interpretar, verificar y crear sin confundir lectura literaria con afirmaciones no documentadas.",
      tabs: ["Contexto", "Lee / Examina", "Interpreta", "Contrasta", "Crea"], kind: "poetry"
    },
    "RE-047": {
      creatorId: "CR-047", discipline: "Composición",
      nav: "Laboratorio de escucha y composición",
      title: "Escuchar el patrimonio musical de Loja.",
      lead: "Cinco estaciones para contextualizar, escuchar, reconocer, comparar y crear a partir de una obra musical.",
      tabs: ["Contexto", "Escucha", "Descubre", "Compara", "Crea"], kind: "composition"
    },
    "RE-052": {
      creatorId: "CR-052", discipline: "Adaptación didáctica",
      nav: "Laboratorio de adaptación para piano",
      title: "Adaptar una obra para aprender piano.",
      lead: "Cinco estaciones para distinguir operaciones musicales y diseñar una adaptación coherente con el nivel de aprendizaje.",
      tabs: ["Contexto", "Distingue", "Decide", "Diseña", "Justifica"], kind: "piano"
    },
    "RE-058": {
      creatorId: "CR-058", discipline: "Arreglo coral",
      nav: "Laboratorio del arreglo coral",
      title: "Transformar una obra para nuevas voces.",
      lead: "Cinco estaciones para comparar versiones, identificar transformaciones y sustentar una propuesta de arreglo.",
      tabs: ["Contextualiza", "Compara", "Identifica", "Justifica", "Diseña"], kind: "choral"
    }
  };

  const lab = LABS[requestedId];
  if (!lab) {
    $("#lab-title").textContent = "Recurso no disponible";
    $("#lab-status").innerHTML = `El identificador <strong>${VML.safe(requestedId)}</strong> no corresponde a un laboratorio publicado. <a href="recursos.html">Ver recursos</a>.`;
    return;
  }

  const station = (number, title, body) => `<section class="station${number === 1 ? " active" : ""}" data-panel="${number}" aria-hidden="${number !== 1}"><div class="station-card"><div class="eyebrow">Estación ${number} · ${title}</div>${body}</div></section>`;
  const next = number => number < 5 ? `<button class="btn btn-brand rounded-pill mt-4 next-station" data-next="${number + 1}">Continuar</button>` : "";
  const check = (question, correct, options) => `<div class="check-activity mt-4" data-check-activity data-correct="${correct}"><h3 class="h4">Comprueba tu comprensión</h3><p>${question}</p><div class="check-options">${options.map((option, index) => `<button class="check-option" data-option="${String.fromCharCode(65 + index)}">${option}</button>`).join("")}</div><div class="check-feedback" data-check-feedback hidden></div></div>`;
  const finalCard = (prompt, criteria) => `<div class="row g-4"><div class="col-lg-8"><h2 class="section-title fs-1">Producto final</h2><p>${prompt}</p><textarea id="final-product" class="form-control lab-textarea" data-save="final-product" placeholder="Desarrolla aquí tu propuesta…"></textarea><div id="word-count" class="source-note mt-2" aria-live="polite"></div></div><div class="col-lg-4"><div class="evidence-card"><div class="eyebrow text-white-50">Criterios</div><ul class="text-white-50 mt-3">${criteria.map(x => `<li>${x}</li>`).join("")}</ul><button class="btn btn-light rounded-pill" id="complete-lab">Marcar como completado</button><div id="completion-message" class="mt-3" aria-live="polite"></div></div></div></div>`;

  const context = () => station(1, lab.tabs[0], `<h2 class="section-title fs-1">¿Qué sabemos y qué permanece en investigación?</h2><div class="row g-4"><div class="col-lg-7"><div id="context-bio" class="fs-5 text-secondary"><p>Consultando el catálogo…</p></div></div><div class="col-lg-5"><div class="source-box"><strong>Obras vinculadas</strong><div id="context-works" class="mt-2"><p>Consultando registros…</p></div></div></div></div>${check("¿Cómo debe presentarse un dato que todavía no tiene una fuente verificable?", "C", ["Como hecho confirmado", "Se oculta sin explicación", "Como dato pendiente de verificación"])}${next(1)}`);

  const templates = {
    poetry: () => context() +
      station(2, "Lee / Examina", `<h2 class="section-title fs-1">Lee con contexto</h2><div class="text-placeholder"><span class="prototype-label">Texto simulado</span><blockquote class="fs-3 mt-3">“La ciudad guarda voces en sus patios; cada nombre regresa convertido en memoria.”</blockquote><p>Fragmento ficticio para probar la experiencia. No se atribuye a una obra histórica.</p></div>${check("¿Qué debe acompañar a un texto definitivo?", "B", ["Solo el diseño", "Autoría, fuente y condiciones de uso", "Una interpretación sin referencia"])}${next(2)}`) +
      station(3, "Interpreta", `<h2 class="section-title fs-1">Construye una lectura argumentada</h2><p>Formula una interpretación provisional y explica qué evidencia textual necesitarías.</p><textarea class="form-control lab-textarea" data-save="interpretation"></textarea>${next(3)}`) +
      station(4, "Contrasta", `<h2 class="section-title fs-1">Evalúa la trazabilidad</h2><div class="decision-grid">${["Autor o institución responsable", "Fecha o edición", "Procedencia rastreable", "Contraste independiente"].map((x,i)=>`<button class="choice-btn" data-choice="source-${i}" aria-pressed="false">${x}</button>`).join("")}</div><textarea class="form-control lab-textarea mt-4" data-save="source-reflection" placeholder="Identifica un vacío documental y una ruta de búsqueda…"></textarea>${next(4)}`) +
      station(5, "Crea", finalCard("Redacta un comentario curatorial, un microtexto propio o una pregunta de investigación. Diferencia claramente evidencia, interpretación y creación.", ["Contextualización", "Uso crítico de fuentes", "Evidencia e inferencia", "Claridad de la propuesta"])),
    composition: () => context() +
      station(2, "Escucha", `<h2 class="section-title fs-1">Escucha y examina</h2><div data-prototype-media data-title="Muestra de obra musical" data-kind="audio y partitura"></div>${check("Para reconocer un contorno melódico, ¿qué observas?", "C", ["El diseño de la página", "Solo el volumen", "La dirección y los intervalos de la melodía"])}${next(2)}`) +
      station(3, "Descubre", `<h2 class="section-title fs-1">Reconoce decisiones compositivas</h2><p>Selecciona los elementos que conviene documentar durante una escucha.</p><div class="decision-grid">${["Ritmo", "Melodía", "Forma", "Textura"].map((x,i)=>`<button class="choice-btn" data-choice="element-${i}" aria-pressed="false">${x}</button>`).join("")}</div><textarea class="form-control lab-textarea mt-4" data-save="listening" placeholder="Describe una observación y la evidencia sonora que la sostendría…"></textarea>${next(3)}`) +
      station(4, "Compara", `<h2 class="section-title fs-1">Composición y arreglo</h2><div class="compare-grid"><div class="compare-box"><span class="creator-badge">Composición</span><p class="mt-3">Concibe y organiza la obra de partida.</p></div><div class="compare-box"><span class="creator-badge">Arreglo</span><p class="mt-3">Transforma una obra existente sin borrar su autoría.</p></div></div>${check("¿Qué debe conservar un arreglo responsable?", "A", ["La atribución de la obra de origen", "Solo el título", "Ninguna relación documental"])}${next(4)}`) +
      station(5, "Crea", finalCard("Diseña una ficha de escucha que conecte contexto, rasgos musicales, evidencia observable y una pregunta de interpretación.", ["Escucha atenta", "Vocabulario musical", "Contexto patrimonial", "Evidencia observable"])),
    piano: () => context() +
      station(2, "Distingue", `<h2 class="section-title fs-1">Tres operaciones distintas</h2><div class="concept-grid"><article class="concept-card"><h3>Arreglo</h3><p>Reconfigura una obra para otro conjunto o textura.</p></article><article class="concept-card"><h3>Adaptación didáctica</h3><p>Ajusta dificultad y conserva rasgos reconocibles.</p></article><article class="concept-card"><h3>Transcripción</h3><p>Traslada procurando conservar la estructura.</p></article></div>${check("Se simplifica el acompañamiento para nivel inicial. ¿Qué operación es?", "B", ["Arreglo sin finalidad pedagógica", "Adaptación didáctica", "Transcripción literal"])}${next(2)}`) +
      station(3, "Decide", `<h2 class="section-title fs-1">Define a quién adaptarás</h2><div class="row g-3"><div class="col-md-6"><label class="form-label">Nivel</label><select class="form-select" data-save="level"><option>Iniciación</option><option>Básico con lectura</option><option>Intermedio</option></select></div><div class="col-md-6"><label class="form-label">Género de práctica</label><select class="form-select" data-save="genre"><option>Albazo</option><option>Tonada</option><option>Pasillo</option></select></div></div>${check("¿Qué decisión es coherente con iniciación?", "A", ["Conservar melodía y simplificar acompañamiento", "Añadir grandes saltos", "Cambiar el género para evitar el ritmo"])}${next(3)}`) +
      station(4, "Diseña", `<h2 class="section-title fs-1">Construye tu ficha</h2><div class="row g-3"><div class="col-md-6"><textarea class="form-control lab-textarea" data-save="preserve" placeholder="Qué preservar…"></textarea></div><div class="col-md-6"><textarea class="form-control lab-textarea" data-save="modify" placeholder="Qué modificar…"></textarea></div><div class="col-md-6"><textarea class="form-control lab-textarea" data-save="sequence" placeholder="Secuencia de práctica…"></textarea></div><div class="col-md-6"><textarea class="form-control lab-textarea" data-save="assessment" placeholder="Evidencia de aprendizaje…"></textarea></div></div>${next(4)}`) +
      station(5, "Justifica", finalCard("Explica la relación entre nivel, decisiones pianísticas, preservación patrimonial y evidencia de aprendizaje.", ["Distinción conceptual", "Adecuación al nivel", "Coherencia musical", "Cuidado patrimonial"])),
    choral: () => context() +
      station(2, "Compara", `<h2 class="section-title fs-1">Obra de origen y versión coral</h2><div class="compare-grid"><div class="compare-box"><span class="creator-badge">Obra de origen</span><div data-prototype-media data-title="Obra de origen" data-kind="audio y partitura"></div></div><div class="compare-box"><span class="creator-badge">Versión coral</span><div data-prototype-media data-title="Versión coral" data-kind="audio y partitura"></div></div></div>${check("¿Qué evidencia muestra un cambio de textura?", "C", ["El título", "La fecha de nacimiento", "La redistribución de melodía entre voces"])}${next(2)}`) +
      station(3, "Identifica", `<h2 class="section-title fs-1">Reconoce las transformaciones</h2><div class="decision-grid">${["Registro vocal", "Distribución y textura", "Armonización", "Timbre"].map((x,i)=>`<button class="choice-btn" data-choice="transform-${i}" aria-pressed="false">${x}</button>`).join("")}</div><textarea class="form-control lab-textarea mt-4" data-save="transform-reflection" placeholder="Explica qué evidencia necesitarías…"></textarea>${next(3)}`) +
      station(4, "Justifica", `<h2 class="section-title fs-1">Decisión, propósito y evidencia</h2>${check("¿Cuál decisión está mejor justificada?", "A", ["Ajustar tesitura tras compararla con la extensión del coro", "Acelerar porque toda versión debe ser rápida", "Añadir voces sin revisar armonía ni texto"])}<textarea class="form-control lab-textarea mt-4" data-save="justification" placeholder="Ajustaría… porque… y lo comprobaría mediante…"></textarea>${next(4)}`) +
      station(5, "Diseña", finalCard("Diseña un esquema coral o comentario técnico que explique qué conservar, qué transformar y cómo comprobar el resultado.", ["Rol de la arreglista", "Transformaciones", "Justificación", "Respeto a la obra de origen"]))
  };

  document.title = `${lab.nav} · Voces y Melodías Lojanas`;
  $("#lab-nav-title").textContent = lab.nav;
  $("#lab-eyebrow").textContent = `Recurso educativo interactivo · ${lab.discipline}`;
  $("#lab-title").textContent = lab.title;
  $("#lab-lead").textContent = lab.lead;
  $("#station-tabs").innerHTML = lab.tabs.map((label, index) => `<button class="btn station-btn${index === 0 ? " active" : ""}" data-station="${index + 1}" role="tab" aria-selected="${index === 0}">${index + 1}. ${label}</button>`).join("");
  $("#laboratory-content").innerHTML = templates[lab.kind]();

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
  $$("[data-save]").forEach(input => { const saved = localStorage.getItem(key + input.dataset.save); if (saved !== null) input.value = saved; input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => { localStorage.setItem(key + input.dataset.save, input.value); updateWords(); }); });
  $$("[data-choice]").forEach(button => { const storageKey = key + button.dataset.choice; const active = localStorage.getItem(storageKey) === "1"; button.classList.toggle("selected", active); button.setAttribute("aria-pressed", String(active)); button.addEventListener("click", () => { const selected = !button.classList.contains("selected"); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); localStorage.setItem(storageKey, selected ? "1" : "0"); }); });
  function updateWords() { const field = $("#final-product"); const output = $("#word-count"); if (!field || !output) return; const count = field.value.trim() ? field.value.trim().split(/\s+/).length : 0; output.textContent = `${count} palabras`; }
  $("#complete-lab")?.addEventListener("click", () => { localStorage.setItem(key + "complete", "1"); $("#completion-message").innerHTML = '<div class="alert alert-light">Completado en este navegador. Puedes revisar o copiar tus respuestas.</div>'; });
  showStation(Math.min(5, Math.max(1, Number(localStorage.getItem(key + "station") || 1))), false); updateWords();

  function renderCreator(data) {
    const creator = (data.creators || []).find(item => item.id === lab.creatorId);
    const resource = (data.resources || []).find(item => item.id === requestedId);
    const profile = creator || { name: "Creadora del catálogo", discipline: lab.discipline };
    $("#context-bio").innerHTML = `<p><strong>${VML.safe(profile.name || "Creadora del catálogo")}</strong> · ${VML.safe(profile.discipline || profile.category || lab.discipline)}.</p><p>${VML.safe(profile.bio || "La ficha pública identifica el registro; la ampliación biográfica permanece sujeta a revisión documental y editorial.")}</p>${profile.source ? `<p class="source-note"><strong>Fuente:</strong> ${VML.safe(profile.source)}</p>` : ""}`;
    const works = profile.works || [];
    $("#context-works").innerHTML = works.length ? works.slice(0, 6).map(work => `<div class="border-bottom py-2"><strong>${VML.safe(VML.clean(work.title))}</strong><br><small>${VML.safe(work.genre || work.type || "Registro preliminar")}</small></div>`).join("") : `<p>${VML.safe(resource?.objective || "Las obras y materiales se incorporarán cuando hayan sido verificados y autorizados.")}</p>`;
    $("#lab-status").textContent = `${VML.modeLabel()} · ${resource?.prototype ? "materiales simulados identificados" : "recurso educativo"}`;
    $("#lab-status").classList.add("is-ready");
  }
  VML.load().then(renderCreator).catch(error => { $("#lab-status").textContent = `Laboratorio disponible · catálogo temporalmente no accesible (${error.message})`; renderCreator({ creators: [], resources: VML.publicResources }); });
})();
