const $=s=>document.querySelector(s);
let data=null;
const specificExperiences=new Set(["RE-001","RE-047","RE-058"]);

function hasEmbed(r){
  return /^https:\/\//i.test(String(r.embedUrl||"").trim());
}

function isAvailable(r){
  return specificExperiences.has(r.id)||hasEmbed(r);
}

async function init(){
  try{
    data=await VML.load();
    const rs=data.resources||[];
    const available=rs.filter(isAvailable).length;
    $("#resources-status").textContent=`${VML.modeLabel()} · ${rs.length} recursos registrados · ${available} disponibles para abrir`;
    const types=[...new Set(rs.map(r=>r.title).filter(Boolean))].sort();
    $("#resource-type").innerHTML='<option value="">Todos</option>'+types.map(t=>`<option>${VML.safe(t)}</option>`).join("");
    render();
    mountDiscoveryQuiz();
  }catch(e){
    $("#resources-status").textContent="No fue posible cargar los recursos: "+e.message;
  }
}

function href(r){
  if(r.id==="RE-001")return VML.withMode("laboratorio-matilde.html");
  if(r.id==="RE-047")return VML.withMode("laboratorio-blanca.html");
  if(r.id==="RE-058")return VML.withMode("laboratorio-emily.html");
  return VML.withMode(`recurso.html?id=${encodeURIComponent(r.id)}`);
}

function filtered(){
  const q=$("#resource-search").value.toLowerCase().trim();
  const t=$("#resource-type").value;
  const s=$("#resource-state").value;
  return(data.resources||[]).filter(r=>{
    const available=isAvailable(r);
    return(!q||[r.creator,r.title,r.areas,r.workBase,r.objective].join(" ").toLowerCase().includes(q))&&
      (!t||r.title===t)&&
      (!s||(s==="available"?available:!available));
  });
}

function stateLabel(r){
  if(hasEmbed(r)) return {label:"Interactivo disponible",available:true};
  if(specificExperiences.has(r.id)) return {label:"Experiencia específica",available:true};
  return {label:"En preparación",available:false};
}

function render(){
  const rs=filtered();
  $("#resource-count").textContent=rs.length;
  $("#resources-grid").innerHTML=rs.map(r=>{
    const state=stateLabel(r);
    return`<div class="col-md-6 col-xl-4"><article class="resource-card ${state.available?"available":""}">
      <div class="d-flex justify-content-between gap-2 align-items-start">
        <div class="resource-type">${VML.safe(r.title||"Recurso educativo")}</div>
        <span class="completeness ${state.available?"available":""}">${state.label}</span>
      </div>
      <h3 class="h3 mt-3">${VML.safe(r.creator||"Creadora")}</h3>
      <p class="text-secondary">${VML.safe(r.objective||"La experiencia educativa se encuentra todavía en preparación.")}</p>
      <div class="small"><strong>Áreas:</strong> ${VML.safe(r.areas||"Por definir")}<br><strong>Nivel:</strong> ${VML.safe(r.level||"Por definir")}</div>
      <div class="resource-action"><a class="btn ${state.available?"btn-brand":"btn-outline-brand"} rounded-pill" href="${href(r)}">${state.available?"Abrir experiencia":"Ver ficha del recurso"}</a></div>
    </article></div>`;
  }).join("")||'<div class="col-12"><div class="alert alert-light">No hay recursos disponibles con estos filtros en la vista actual.</div></div>';
}

function mountDiscoveryQuiz(){
  const slot=$("#resources-discovery-slot");
  if(!slot)return;
  slot.innerHTML=`<div class="row g-4 align-items-start"><div class="col-lg-4"><div class="eyebrow">Interactúa</div><h2 class="section-title fs-1 mt-2">Descubre jugando</h2><p class="text-secondary">Cinco preguntas aleatorias sobre creadoras, obras y conexiones. Es una experiencia transversal para el público general y no sustituye a los recursos educativos estructurados.</p></div><div class="col-lg-8"><div id="resources-quiz"></div></div></div>`;
  VML.mountQuiz("#resources-quiz",data.questions||[],{count:5,eyebrow:"Recorrido interactivo",title:"Pon a prueba lo que has descubierto"});
}

$("#resource-search").addEventListener("input",render);
$("#resource-type").addEventListener("change",render);
$("#resource-state").addEventListener("change",render);
init();