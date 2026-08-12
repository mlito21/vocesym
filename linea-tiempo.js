const $=s=>document.querySelector(s);
let creators=[],events=[],dataset=null;

function yearNum(v){
  const m=String(v||"").match(/\b(18|19|20)\d{2}\b/);
  return m?Number(m[0]):null;
}

async function init(){
  try{
    dataset=await VML.load();
    creators=dataset.creators||[];
    buildEvents();
    populateCreators();
    $("#timeline-status").textContent=events.length
      ? `${VML.modeLabel(dataset)} · ${events.length} eventos fechados generados desde la Base Maestra`
      : `${VML.modeLabel(dataset)} · cronología documental en preparación`;
    render();
  }catch(e){
    $("#timeline-status").textContent="No fue posible cargar la cronología: "+e.message;
  }
}

function buildEvents(){
  events=[];
  creators.forEach(c=>{
    const by=yearNum(c.birth);
    if(by){
      events.push({year:by,type:"Nacimiento",creator:c.name,creatorId:c.id,title:`Nacimiento de ${c.name}`,
        subtitle:c.place&&!String(c.place).toLowerCase().includes("pendiente")?c.place:"Lugar pendiente de validación",
        source:c.source||"Fuente pendiente",description:`Registro biográfico de ${c.name}.`});
    }
    (c.works||[]).forEach(w=>{
      const wy=yearNum(w.year);
      if(wy){
        events.push({year:wy,type:"Obra",creator:c.name,creatorId:c.id,title:VML.clean(w.title),
          subtitle:`${w.genre||w.type||"Obra"} · ${w.role||"Rol por verificar"}`,
          source:w.source||c.source||"Fuente pendiente",description:`Obra vinculada a ${c.name}.`});
      }
    });
  });
  events.sort((a,b)=>a.year-b.year||a.creator.localeCompare(b.creator));
}

function populateCreators(){
  const names=[...new Set(events.map(e=>e.creator))].sort();
  $("#filter-creator").innerHTML='<option value="Todas">Todas</option>'+names.map(n=>`<option>${VML.safe(n)}</option>`).join("");
}

function filtered(){
  const t=$("#filter-type").value,c=$("#filter-creator").value;
  return events.filter(e=>(t==="Todos"||e.type===t)&&(c==="Todas"||e.creator===c));
}

function render(){
  const list=filtered();
  const emptyMessage=VML.isPublic()
    ? '<div class="alert alert-light"><strong>Cronología en preparación.</strong> Las fechas biográficas y de obra se publicarán cuando hayan sido verificadas. El proyecto no completa hitos por inferencia.</div>'
    : '<div class="alert alert-light">No existen eventos con estos filtros en la vista actual.</div>';
  $("#timeline-events").innerHTML=list.length?list.map(e=>`<div class="timeline-event">
    <div class="event-card" data-index="${events.indexOf(e)}"><span class="event-type">${VML.safe(e.type)}</span><div class="event-title">${VML.safe(e.title)}</div><div class="event-meta">${VML.safe(e.creator)}<br>${VML.safe(e.subtitle)}</div></div>
    <div class="event-year">${e.year}</div><div class="event-empty"></div></div>`).join(""):emptyMessage;
  document.querySelectorAll(".event-card").forEach(x=>x.addEventListener("click",()=>showDetail(Number(x.dataset.index))));
}

function showDetail(i){
  const e=events[i];if(!e)return;
  const previewNotice=dataset&&dataset.mode==="preview"?'<div class="alert alert-warning mt-4 mb-0">Entorno PREVIEW: el evento puede requerir revisión editorial adicional.</div>':'';
  $("#timeline-detail").innerHTML=`<div class="eyebrow text-white-50">${VML.safe(e.type)} · ${e.year}</div><h2 class="h2 mt-2">${VML.safe(e.title)}</h2><p>${VML.safe(e.description)}</p><hr class="border-light opacity-25"><p class="mb-1"><strong>Creadora:</strong> ${VML.safe(e.creator)}</p><p class="mb-1"><strong>Contexto:</strong> ${VML.safe(e.subtitle)}</p><p class="small mt-3"><strong>Fuente:</strong> ${VML.safe(e.source)}</p>${previewNotice}`;
}

$("#filter-type").addEventListener("change",render);
$("#filter-creator").addEventListener("change",render);
init();
