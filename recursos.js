const $=s=>document.querySelector(s);
let data=null;

function hasEmbed(r){
  return VML.isEmbeddedResource(r);
}

async function init(){
  try{
    data=await VML.load();
    const rs=data.resources||[];
    $("#resources-status").textContent=`${VML.modeLabel()} · ${rs.length} recursos educativos publicados`;
    const types=[...new Set(rs.map(r=>r.title).filter(Boolean))].sort();
    $("#resource-type").innerHTML='<option value="">Todos</option>'+types.map(t=>`<option>${VML.safe(t)}</option>`).join("");
    render();
    mountDiscoveryQuiz();
  }catch(e){
    $("#resources-status").textContent="No fue posible cargar los recursos: "+e.message;
  }
}

function href(r){
  return VML.resourceHref(r);
}

function filtered(){
  const q=$("#resource-search").value.toLowerCase().trim();
  const t=$("#resource-type").value;
  const s=$("#resource-state").value;
  return(data.resources||[]).filter(r=>{
    return(!q||[r.creator,r.title,r.areas,r.workBase,r.objective].join(" ").toLowerCase().includes(q))&&
      (!t||r.title===t)&&
      (!s||(s==="interactive"?hasEmbed(r):!hasEmbed(r)));
  });
}

function stateLabel(r){
  if(hasEmbed(r)) return {label:"Interactivo disponible",available:true};
  return {label:"Laboratorio guiado",available:true};
}

function render(){
  const rs=filtered();
  $("#resource-count").textContent=rs.length;
  $("#resources-grid").innerHTML=rs.map(r=>{
    const state=stateLabel(r);
    const creator=(data.creators||[]).find(item=>item.id===r.creatorId);
    return`<div class="col-md-6 col-xl-4"><article class="resource-card ${state.available?"available":""}">
      <div class="d-flex justify-content-between gap-2 align-items-start">
        <div class="resource-type">${VML.safe(r.title||"Recurso educativo")}</div>
        <span class="completeness ${state.available?"available":""}">${state.label}</span>
      </div>
      <h3 class="h3 mt-3">${VML.safe(creator?.name||r.creator||"Creadora")}</h3>
      <p class="text-secondary">${VML.safe(r.objective||"La experiencia educativa se encuentra todavía en preparación.")}</p>
      <div class="small"><strong>Áreas:</strong> ${VML.safe(r.areas||"Por definir")}<br><strong>Nivel:</strong> ${VML.safe(r.level||"Por definir")}</div>
      <div class="resource-action"><a class="btn btn-brand rounded-pill" href="${href(r)}">Abrir experiencia</a></div>
    </article></div>`;
  }).join("")||'<div class="col-12"><div class="alert alert-light">No hay recursos disponibles con estos filtros en la vista actual.</div></div>';
}

function mountDiscoveryQuiz(){
  const slot=$("#resources-discovery-slot");
  if(!slot)return;
  if(!(data.questions||[]).length){slot.remove();return;}
  slot.innerHTML=`<div class="row g-4 align-items-start"><div class="col-lg-4"><div class="eyebrow">Interactúa</div><h2 class="section-title fs-1 mt-2">Descubre jugando</h2><p class="text-secondary">Cinco preguntas aleatorias sobre creadoras, obras y conexiones. Es una experiencia transversal para el público general y no sustituye a los recursos educativos estructurados.</p></div><div class="col-lg-8"><div id="resources-quiz"></div></div></div>`;
  VML.mountQuiz("#resources-quiz",data.questions||[],{count:5,eyebrow:"Recorrido interactivo",title:"Pon a prueba lo que has descubierto"});
}

$("#resource-search").addEventListener("input",render);
$("#resource-type").addEventListener("change",render);
$("#resource-state").addEventListener("change",render);
init();
