
const state = { data:null, filter:"Todas" };
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

async function loadData(){
  const status = $("#data-status");
  try{
    const url = window.VML_CONFIG.API_URL || window.VML_CONFIG.DEMO_URL;
    const res = await fetch(url);
    if(!res.ok) throw new Error("HTTP "+res.status);
    state.data = await res.json();
    status.textContent = window.VML_CONFIG.API_URL.includes("mode=preview")
      ? "Modo vista previa · datos preliminares desde Google Sheets"
      : (window.VML_CONFIG.API_URL
          ? "Modo conectado · datos publicados desde Google Sheets"
          : "Modo demostración · datos preliminares");
    renderCreators();
    renderWorks();
  } catch(err){
    status.textContent = "No fue posible cargar los datos: "+err.message;
  }
}
function creatorCard(c){
  return `<article class="creator-card" tabindex="0" data-id="${c.id}" aria-label="Abrir ficha de ${c.name}">
    <div class="portrait" aria-hidden="true">${c.initials || c.name.split(" ").slice(0,2).map(x=>x[0]).join("")}</div>
    <div class="content">
      <span class="badge">${c.discipline}</span>
      <h3>${c.name}</h3>
      <p>${c.birth || "Fecha por verificar"} · ${c.works?.length || 0} obra(s) en prototipo</p>
    </div>
  </article>`;
}
function renderCreators(){
  const list = state.data.creators.filter(c => state.filter==="Todas" || c.discipline.includes(state.filter));
  $("#creator-grid").innerHTML = list.map(creatorCard).join("");
  $$(".creator-card").forEach(el=>{
    el.addEventListener("click",()=>openProfile(el.dataset.id));
    el.addEventListener("keydown",e=>{if(e.key==="Enter")openProfile(el.dataset.id)});
  });
}
function renderWorks(){
  const works = state.data.creators.flatMap(c => (c.works||[]).map(w=>({...w,creator:c.name,creatorId:c.id})));
  $("#works-list").innerHTML = works.map(w=>`<article class="work">
    <span class="work-id">${w.id}</span>
    <div><h3>${w.title}</h3><span>${w.creator}</span></div>
    <span>${w.type} · ${w.role}</span>
  </article>`).join("");
}
function openProfile(id){
  const c=state.data.creators.find(x=>x.id===id); if(!c) return;
  $("#creator-profile").innerHTML = `<div class="profile-grid">
    <div class="profile-portrait" aria-hidden="true">${c.initials}</div>
    <div>
      <p class="eyebrow">${c.discipline}</p>
      <h2>${c.name}</h2>
      <div class="notice">Ficha piloto con información preliminar. No constituye todavía una ficha pública validada.</div>
      <p>${c.bio}</p>
      <div class="profile-meta">
        <div class="meta-box"><b>ID</b>${c.id}</div>
        <div class="meta-box"><b>Nacimiento</b>${c.birth || "Por verificar"}</div>
        <div class="meta-box"><b>Lugar</b>${c.place}</div>
        <div class="meta-box"><b>Obras piloto</b>${c.works.length}</div>
      </div>
      <h3>Fuente preliminar</h3><p>${c.source}</p>
      <h3>Obras relacionadas</h3>
      <ul>${c.works.map(w=>`<li><strong>${w.title}</strong> — ${w.type}</li>`).join("")}</ul>
    </div></div>`;
  $("#perfil").hidden=false;
  $("#perfil").scrollIntoView({behavior:"smooth"});
}
function openLearning(id){
  const c=state.data.creators.find(x=>x.id===id); if(!c) return;
  const p=$("#learning-panel");
  p.innerHTML=`<p class="eyebrow">${c.name}</p><h3>${c.learning.title}</h3>
    <p>Secuencia pedagógica piloto:</p><ol>${c.learning.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
    <p><strong>Resultado previsto:</strong> una evidencia interpretativa o creativa vinculada con la obra y sustentada en el archivo digital.</p>`;
  p.hidden=false; p.scrollIntoView({behavior:"smooth",block:"nearest"});
}
$$(".chip").forEach(b=>b.addEventListener("click",()=>{
  $$(".chip").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  state.filter=b.dataset.filter; renderCreators();
}));
$("#close-profile").addEventListener("click",()=>{$("#perfil").hidden=true; $("#descubre").scrollIntoView({behavior:"smooth"})});
$$("[data-open-learning]").forEach(b=>b.addEventListener("click",()=>openLearning(b.dataset.openLearning)));
loadData();
