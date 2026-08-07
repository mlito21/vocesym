
const state = { data:null, filter:"Todas" };
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function loadJsonp(baseUrl, mode="preview", timeoutMs=12000) {
  return new Promise((resolve, reject) => {
    const callbackName = "__vml_jsonp_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}mode=${encodeURIComponent(mode)}&callback=${encodeURIComponent(callbackName)}`;

    let finished = false;
    const cleanup = () => {
      if (finished) return;
      finished = true;
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
      clearTimeout(timer);
    };

    window[callbackName] = payload => {
      cleanup();
      resolve(payload);
    };

    script.src = url;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("No se pudo cargar la API JSONP"));
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("La API no respondió dentro del tiempo esperado"));
    }, timeoutMs);

    document.head.appendChild(script);
  });
}

async function loadDemo() {
  const res = await fetch(window.VML_CONFIG.DEMO_URL, {cache:"no-store"});
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

async function loadData(){
  const status = $("#data-status");
  status.textContent = "Conectando con la Base Maestra…";

  try{
    if (window.VML_CONFIG.API_URL) {
      state.data = await loadJsonp(
        window.VML_CONFIG.API_URL,
        window.VML_CONFIG.API_MODE || "preview",
        window.VML_CONFIG.JSONP_TIMEOUT_MS || 12000
      );
      status.textContent = state.data.mode === "preview"
        ? "Modo vista previa · datos preliminares desde Google Sheets"
        : "Modo conectado · datos publicados desde Google Sheets";
    } else {
      state.data = await loadDemo();
      status.textContent = "Modo demostración · datos preliminares";
    }

    if (!state.data || !Array.isArray(state.data.creators)) {
      throw new Error("La respuesta de la API no tiene la estructura esperada");
    }

    renderCreators();
    renderWorks();
  } catch(err){
    console.error("VML API:", err);
    status.textContent = "No se pudo consultar la API. Mostrando respaldo local.";
    try {
      state.data = await loadDemo();
      renderCreators();
      renderWorks();
    } catch (fallbackError) {
      console.error("VML demo:", fallbackError);
      status.textContent = "No fue posible cargar los datos.";
    }
  }
}

function creatorCard(c){
  const initials = c.initials || c.name.split(" ").slice(0,2).map(x=>x[0]).join("");
  return `<article class="creator-card" tabindex="0" data-id="${c.id}" aria-label="Abrir ficha de ${c.name}">
    <div class="portrait" aria-hidden="true">${initials}</div>
    <div class="content">
      <span class="badge">${c.discipline || "Disciplina por verificar"}</span>
      <h3>${c.name}</h3>
      <p>${c.birth || "Fecha por verificar"} · ${(c.works || []).length} obra(s)</p>
    </div>
  </article>`;
}

function renderCreators(){
  const creators = state.data.creators || [];
  const list = creators.filter(c => state.filter==="Todas" || (c.discipline || "").includes(state.filter));

  $("#creator-grid").innerHTML = list.length
    ? list.map(creatorCard).join("")
    : `<p>No hay creadoras disponibles para este filtro.</p>`;

  $$(".creator-card").forEach(el=>{
    el.addEventListener("click",()=>openProfile(el.dataset.id));
    el.addEventListener("keydown",e=>{if(e.key==="Enter")openProfile(el.dataset.id)});
  });
}

function renderWorks(){
  const creators = state.data.creators || [];
  const works = creators.flatMap(c => (c.works||[]).map(w=>({...w,creator:c.name,creatorId:c.id})));

  $("#works-list").innerHTML = works.length
    ? works.map(w=>`<article class="work">
        <span class="work-id">${w.id || "—"}</span>
        <div><h3>${w.title || "Título por verificar"}</h3><span>${w.creator}</span></div>
        <span>${w.type || "Tipo por verificar"} · ${w.role || "Rol por verificar"}</span>
      </article>`).join("")
    : `<p>No hay obras disponibles en esta vista.</p>`;
}

function openProfile(id){
  const c=(state.data.creators || []).find(x=>x.id===id);
  if(!c) return;

  const initials = c.initials || c.name.split(" ").slice(0,2).map(x=>x[0]).join("");
  const works = c.works || [];

  $("#creator-profile").innerHTML = `<div class="profile-grid">
    <div class="profile-portrait" aria-hidden="true">${initials}</div>
    <div>
      <p class="eyebrow">${c.discipline || ""}</p>
      <h2>${c.name}</h2>
      ${state.data.mode === "preview" ? `<div class="notice">Ficha en vista previa: contiene información preliminar y no equivale a publicación validada.</div>` : ""}
      <p>${c.bio || "Biografía pendiente de validación y redacción editorial."}</p>
      <div class="profile-meta">
        <div class="meta-box"><b>ID</b>${c.id}</div>
        <div class="meta-box"><b>Nacimiento</b>${c.birth || "Por verificar"}</div>
        <div class="meta-box"><b>Lugar</b>${c.place || "Por verificar"}</div>
        <div class="meta-box"><b>Obras relacionadas</b>${works.length}</div>
      </div>
      <h3>Fuente preliminar</h3>
      <p>${c.source || "Pendiente de normalización bibliográfica."}</p>
      <h3>Obras relacionadas</h3>
      <ul>${works.length ? works.map(w=>`<li><strong>${w.title}</strong> — ${w.type || "Por clasificar"}</li>`).join("") : "<li>Sin obras cargadas en esta vista.</li>"}</ul>
    </div>
  </div>`;

  $("#perfil").hidden=false;
  $("#perfil").scrollIntoView({behavior:"smooth"});
}

function defaultLearning(c) {
  if ((c.discipline || "").includes("Poeta")) {
    return {title:"Laboratorio de poesía", steps:["Leer","Escuchar","Interpretar","Situar","Crear"]};
  }
  if ((c.discipline || "").includes("Arreglista")) {
    return {title:"Laboratorio del arreglo", steps:["Escuchar","Comparar","Identificar transformaciones","Reconstruir"]};
  }
  return {title:"Laboratorio sonoro", steps:["Escuchar","Observar","Comprender","Interpretar","Crear"]};
}

function openLearning(id){
  const c=(state.data.creators || []).find(x=>x.id===id);
  if(!c) return;

  const r = c.learning;
  const fallback = defaultLearning(c);

  const title = r?.title || fallback.title;
  let body = "";

  if (r?.sequence || r?.objective || r?.activity) {
    body = `
      ${r.sequence ? `<p><strong>Secuencia:</strong> ${r.sequence}</p>` : ""}
      ${r.areas ? `<p><strong>Áreas:</strong> ${r.areas}</p>` : ""}
      ${r.level ? `<p><strong>Nivel:</strong> ${r.level}</p>` : ""}
      ${r.objective ? `<p><strong>Objetivo de aprendizaje:</strong> ${r.objective}</p>` : ""}
      ${r.activity ? `<p><strong>Actividad:</strong> ${r.activity}</p>` : ""}
      ${r.evidence ? `<p><strong>Evidencia:</strong> ${r.evidence}</p>` : ""}
      ${r.assessment ? `<p><strong>Evaluación:</strong> ${r.assessment}</p>` : ""}
      ${r.accessibility ? `<p><strong>Accesibilidad:</strong> ${r.accessibility}</p>` : ""}
    `;
  } else {
    body = `<ol>${fallback.steps.map(s=>`<li>${s}</li>`).join("")}</ol>`;
  }

  const p=$("#learning-panel");
  p.innerHTML=`<p class="eyebrow">${c.name}</p><h3>${title}</h3>${body}`;
  p.hidden=false;
  p.scrollIntoView({behavior:"smooth",block:"nearest"});
}

$$(".chip").forEach(b=>b.addEventListener("click",()=>{
  $$(".chip").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  state.filter=b.dataset.filter;
  renderCreators();
}));

$("#close-profile").addEventListener("click",()=>{
  $("#perfil").hidden=true;
  $("#descubre").scrollIntoView({behavior:"smooth"});
});

$$("[data-open-learning]").forEach(b=>b.addEventListener("click",()=>openLearning(b.dataset.openLearning)));

loadData();
