const $=s=>document.querySelector(s);
let data=null;
const featured=new Set(["RE-001","RE-047","RE-058"]);

async function init(){
  try{
    data=await VML.load();
    const rs=data.resources||[];
    const mode=VML.modeLabel(data);
    $("#resources-status").textContent=`${mode} · ${rs.length} recursos educativos cargados desde la Base Maestra`;
    const types=[...new Set(rs.map(r=>r.title).filter(Boolean))].sort();
    $("#resource-type").innerHTML='<option value="">Todos</option>'+types.map(t=>`<option>${VML.safe(t)}</option>`).join("");
    render();
  }catch(e){
    $("#resources-status").textContent="No fue posible cargar los recursos: "+e.message;
  }
}

function href(r){
  if(r.id==="RE-001")return"laboratorio-matilde.html";
  if(r.id==="RE-047")return"laboratorio-blanca.html";
  if(r.id==="RE-058")return"laboratorio-emily.html";
  return`recurso.html?id=${encodeURIComponent(r.id)}`;
}

function filtered(){
  const q=$("#resource-search").value.toLowerCase().trim();
  const t=$("#resource-type").value;
  const s=$("#resource-state").value;
  return(data.resources||[]).filter(r=>{
    const f=featured.has(r.id);
    return(!q||[r.creator,r.title,r.areas,r.workBase].join(" ").toLowerCase().includes(q))&&
      (!t||r.title===t)&&
      (!s||(s==="complete"?f:!f));
  });
}

function render(){
  const rs=filtered();
  $("#resource-count").textContent=rs.length;
  $("#resources-grid").innerHTML=rs.map(r=>{
    const f=featured.has(r.id);
    return`<div class="col-md-6 col-xl-4"><article class="resource-card ${f?"featured":""}">
      <div class="d-flex justify-content-between gap-2 align-items-start">
        <div class="resource-type">${VML.safe(r.title||"Recurso educativo")}</div>
        <span class="completeness">${f?"Experiencia completa":"Diseño base"}</span>
      </div>
      <h3 class="h3 mt-3">${VML.safe(r.creator||"Creadora")}</h3>
      <p class="text-secondary">${VML.safe(r.objective||"Objetivo por definir.")}</p>
      <div class="small"><strong>Áreas:</strong> ${VML.safe(r.areas||"Por definir")}<br><strong>Nivel:</strong> ${VML.safe(r.level||"Por definir")}</div>
      <a class="btn ${f?"btn-brand":"btn-outline-brand"} rounded-pill mt-4" href="${href(r)}">${f?"Abrir experiencia":"Ver recurso"}</a>
    </article></div>`;
  }).join("")||'<div class="col-12"><div class="alert alert-light">No hay recursos disponibles con estos filtros en la vista actual.</div></div>';
}

$("#resource-search").addEventListener("input",render);
$("#resource-type").addEventListener("change",render);
$("#resource-state").addEventListener("change",render);
init();