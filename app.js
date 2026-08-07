const state = { data:null, filter:"Todas" };
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function loadJsonp(baseUrl, mode="preview", timeoutMs=12000) {
  return new Promise((resolve, reject) => {
    const callbackName = "__vml_jsonp_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const sep = baseUrl.includes("?") ? "&" : "?";
    script.src = `${baseUrl}${sep}mode=${encodeURIComponent(mode)}&callback=${encodeURIComponent(callbackName)}`;
    script.async = true;
    let done=false;
    const cleanup=()=>{ if(done)return; done=true; if(script.parentNode)script.remove(); try{delete window[callbackName]}catch(_){window[callbackName]=undefined} clearTimeout(timer); };
    window[callbackName]=payload=>{cleanup();resolve(payload)};
    script.onerror=()=>{cleanup();reject(new Error("No se pudo cargar la API JSONP"))};
    const timer=setTimeout(()=>{cleanup();reject(new Error("La API no respondió dentro del tiempo esperado"))},timeoutMs);
    document.head.appendChild(script);
  });
}

async function loadDemo(){
  const res=await fetch(window.VML_CONFIG.DEMO_URL,{cache:"no-store"});
  if(!res.ok)throw new Error("HTTP "+res.status);
  return res.json();
}

async function loadData(){
  const status=$("#data-status");
  try{
    state.data=window.VML_CONFIG.API_URL
      ? await loadJsonp(window.VML_CONFIG.API_URL,window.VML_CONFIG.API_MODE||"preview",window.VML_CONFIG.JSONP_TIMEOUT_MS||12000)
      : await loadDemo();
    if(!state.data || !Array.isArray(state.data.creators)) throw new Error("Respuesta inesperada");
    status.textContent=state.data.mode==="preview" ? "Modo vista previa · datos preliminares desde Google Sheets" : "Datos publicados desde Google Sheets";
    renderAll();
  }catch(err){
    console.error(err);
    status.textContent="No se pudo consultar la API. Mostrando respaldo local.";
    state.data=await loadDemo();
    renderAll();
  }
}
function renderAll(){renderCreators();renderWorks();renderStats()}
function renderStats(){
  const creators=state.data.creators||[];
  const works=creators.reduce((n,c)=>n+(c.works||[]).length,0);
  $("#stat-creators").textContent=creators.length;
  $("#stat-works").textContent=works;
}
function initials(c){return c.initials || (c.name||"").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("")}
function creatorCard(c,i){
  return `<div class="col-md-6 col-xl-4">
    <article class="creator-card" tabindex="0" data-id="${c.id}">
      <div class="creator-visual">
        <span class="creator-index">${String(i+1).padStart(2,"0")}</span>
        <div class="creator-initials">${initials(c)}</div>
      </div>
      <div class="creator-body">
        <span class="creator-badge">${c.discipline||"Disciplina por verificar"}</span>
        <h3 class="creator-name">${c.name}</h3>
        <div class="creator-meta">${c.birth||"Fecha por verificar"} · ${(c.works||[]).length} obra(s)</div>
        <div class="creator-action">Conocer su trayectoria →</div>
      </div>
    </article>
  </div>`;
}
function renderCreators(){
  const creators=(state.data.creators||[]).filter(c=>state.filter==="Todas"||(c.discipline||"").includes(state.filter));
  $("#creator-grid").innerHTML=creators.length?creators.map(creatorCard).join(""):`<div class="col-12"><div class="alert alert-light">No hay creadoras disponibles para este filtro.</div></div>`;
  $$(".creator-card").forEach(el=>{
    el.addEventListener("click",()=>openProfile(el.dataset.id));
    el.addEventListener("keydown",e=>{if(e.key==="Enter")openProfile(el.dataset.id)});
  });
}
function renderWorks(){
  const works=(state.data.creators||[]).flatMap(c=>(c.works||[]).map(w=>({...w,creator:c.name})));
  $("#works-list").innerHTML=works.length?works.map(w=>`<div class="col-md-6 col-xl-4"><article class="work-card">
    <div class="work-id">${w.id||"—"}</div>
    <div class="work-title">${cleanTitle(w.title)||"Título por verificar"}</div>
    <div class="creator-badge mb-2">${w.type||"Por clasificar"}</div>
    <div class="work-meta">${w.creator}<br>${w.role||"Rol por verificar"}</div>
  </article></div>`).join(""):`<div class="col-12"><p>No hay obras disponibles.</p></div>`;
}
function cleanTitle(s){return (s||"").replace(/^["']|["']$/g,"").replace(/\s*\((pasillo|pasacalle)\)\.?$/i,"").trim()}
function openProfile(id){
  const c=(state.data.creators||[]).find(x=>x.id===id); if(!c)return;
  const works=c.works||[];
  const isBlanca=c.id==="CR-047";
  $("#creator-profile").innerHTML=`<div class="profile-shell"><div class="row g-0">
    <div class="col-lg-4">
      <aside class="profile-aside">
        <div class="profile-monogram">${initials(c)}</div>
        <div class="mt-4"><span class="creator-badge">${c.discipline||""}</span></div>
        <p class="mt-3 mb-1 opacity-75">Identificador</p><strong>${c.id}</strong>
        ${isBlanca?`<div class="mt-4 p-3 rounded-4" style="background:rgba(255,255,255,.10)"><small>CASO PILOTO DESTACADO</small><br><strong>Laboratorio sonoro</strong></div>`:""}
      </aside>
    </div>
    <div class="col-lg-8">
      <div class="profile-content">
        <div class="eyebrow">${c.category||c.discipline||""}</div>
        <h2 class="profile-title">${c.name}</h2>
        ${state.data.mode==="preview"?`<div class="preview-alert my-4"><strong>Vista previa.</strong> La ficha contiene información preliminar. La biografía, las fechas y los derechos deben validarse antes de la publicación pública.</div>`:""}
        <p class="fs-5">${c.bio||"Biografía pendiente de validación y redacción editorial. Este espacio se completará únicamente con información contrastada y fuentes identificables."}</p>
        <div class="info-grid my-4">
          <div class="info-box"><span>Nacimiento</span><strong>${c.birth||"Por verificar"}</strong></div>
          <div class="info-box"><span>Lugar</span><strong>${c.place||"Por verificar"}</strong></div>
          <div class="info-box"><span>Disciplina</span><strong>${c.discipline||"Por verificar"}</strong></div>
          <div class="info-box"><span>Obras relacionadas</span><strong>${works.length}</strong></div>
        </div>
        <h3 class="h4 mt-4">Obras relacionadas</h3>
        <div class="list-group list-group-flush mb-4">${works.length?works.map(w=>`<div class="list-group-item px-0 bg-transparent"><strong>${cleanTitle(w.title)}</strong><br><small class="text-secondary">${w.type||"Por clasificar"} · ${w.role||"Rol por verificar"}</small></div>`).join(""):`<div class="text-secondary">Sin obras cargadas.</div>`}</div>
        <h3 class="h4">Fuente preliminar</h3>
        <p class="text-secondary">${c.source||"Pendiente de normalización bibliográfica."}</p>
        ${isBlanca?`<button class="btn btn-brand rounded-pill mt-2" data-profile-learning="CR-047">Abrir Laboratorio sonoro</button>`:""}
      </div>
    </div>
  </div></div>`;
  $("#perfil").hidden=false;
  const btn=document.querySelector("[data-profile-learning]");
  if(btn)btn.addEventListener("click",()=>openLearning(btn.dataset.profileLearning));
  $("#perfil").scrollIntoView({behavior:"smooth"});
}
function defaultLearning(c){
  if((c.discipline||"").includes("Poeta"))return{title:"Laboratorio de poesía",steps:["Leer","Escuchar","Interpretar","Situar","Crear"]};
  if((c.discipline||"").includes("Arreglista"))return{title:"Laboratorio del arreglo",steps:["Escuchar","Comparar","Identificar transformaciones","Reconstruir"]};
  return{title:"Laboratorio sonoro",steps:["Escuchar","Observar","Comprender","Interpretar","Crear"]};
}
function openLearning(id){
  const c=(state.data.creators||[]).find(x=>x.id===id);if(!c)return;
  const r=c.learning||{};const fb=defaultLearning(c);
  const sequence=(r.sequence||fb.steps.join(" → ")).split("→").map(x=>x.trim()).filter(Boolean);
  $("#learning-panel").innerHTML=`<div class="row g-4">
    <div class="col-lg-4"><div class="eyebrow">${c.name}</div><h3 class="display-6">${r.title||fb.title}</h3><p>${r.areas?`Áreas sugeridas: ${r.areas}`:"Experiencia educativa piloto vinculada con el archivo digital."}</p></div>
    <div class="col-lg-8">
      <div class="d-flex flex-wrap gap-2 mb-4">${sequence.map((s,i)=>`<span class="badge rounded-pill text-bg-light p-3">${i+1}. ${s}</span>`).join("")}</div>
      ${r.objective?`<p><strong>Objetivo:</strong> ${r.objective}</p>`:""}
      ${r.activity?`<p><strong>Actividad:</strong> ${r.activity}</p>`:""}
      ${r.evidence?`<p><strong>Evidencia:</strong> ${r.evidence}</p>`:""}
      ${r.assessment?`<p><strong>Evaluación:</strong> ${r.assessment}</p>`:""}
      ${r.accessibility?`<p><strong>Accesibilidad:</strong> ${r.accessibility}</p>`:""}
    </div></div>`;
  $("#learning-panel").hidden=false;
  $("#aprende").scrollIntoView({behavior:"smooth"});
}
$$(".filter-chip").forEach(b=>b.addEventListener("click",()=>{$$(".filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.filter=b.dataset.filter;renderCreators()}));
$("#close-profile").addEventListener("click",()=>{$("#perfil").hidden=true;$("#descubre").scrollIntoView({behavior:"smooth"})});
$$("[data-open-learning]").forEach(b=>b.addEventListener("click",()=>openLearning(b.dataset.openLearning)));
loadData();
