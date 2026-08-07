const $=s=>document.querySelector(s);
let creators=[], events=[];

function jsonp(baseUrl,params={},timeout=12000){
 return new Promise((resolve,reject)=>{
  const cb="__time_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const s=document.createElement("script");
  const q=new URLSearchParams({...params,callback:cb});
  s.src=baseUrl+(baseUrl.includes("?")?"&":"?")+q.toString();
  let done=false;
  const clean=()=>{if(done)return;done=true;if(s.parentNode)s.remove();try{delete window[cb]}catch(_){}clearTimeout(t)};
  window[cb]=d=>{clean();resolve(d)};
  s.onerror=()=>{clean();reject(new Error("No se pudo cargar la API"))};
  const t=setTimeout(()=>{clean();reject(new Error("Tiempo de espera agotado"))},timeout);
  document.head.appendChild(s);
 });
}
function yearNum(v){
 const m=String(v||"").match(/\b(18|19|20)\d{2}\b/);
 return m?Number(m[0]):null;
}
function cleanTitle(s){return String(s||"").replace(/^["']|["']$/g,"").replace(/\.$/,"").trim()}

async function init(){
 try{
  const data=await jsonp(window.VML_CONFIG.API_URL,{mode:window.VML_CONFIG.API_MODE||"preview"});
  creators=data.creators||[];
  buildEvents();
  populateCreators();
  $("#timeline-status").textContent=`Modo vista previa · ${events.length} eventos fechados generados desde Google Sheets`;
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
   events.push({
    year:by,type:"Nacimiento",creator:c.name,creatorId:c.id,
    title:`Nacimiento de ${c.name}`,
    subtitle:c.place && !String(c.place).toLowerCase().includes("pendiente") ? c.place : "Lugar pendiente de validación",
    source:c.source||"Fuente pendiente",
    description:`Registro biográfico de ${c.name}.`
   });
  }
  (c.works||[]).forEach(w=>{
   const wy=yearNum(w.year);
   if(wy){
    events.push({
     year:wy,type:"Obra",creator:c.name,creatorId:c.id,
     title:cleanTitle(w.title),
     subtitle:`${w.genre||w.type||"Obra"} · ${w.role||"Rol por verificar"}`,
     source:w.source||c.source||"Fuente pendiente",
     description:`Obra vinculada a ${c.name}.`
    });
   }
  });
 });
 events.sort((a,b)=>a.year-b.year || a.creator.localeCompare(b.creator));
}

function populateCreators(){
 const names=[...new Set(events.map(e=>e.creator))].sort();
 $("#filter-creator").innerHTML='<option value="Todas">Todas</option>'+names.map(n=>`<option>${n}</option>`).join("");
}

function filtered(){
 const t=$("#filter-type").value,c=$("#filter-creator").value;
 return events.filter(e=>(t==="Todos"||e.type===t)&&(c==="Todas"||e.creator===c));
}

function render(){
 const list=filtered();
 $("#timeline-events").innerHTML=list.length?list.map((e,i)=>`
 <div class="timeline-event">
   <div class="event-card" data-index="${events.indexOf(e)}">
     <span class="event-type">${e.type}</span>
     <div class="event-title">${e.title}</div>
     <div class="event-meta">${e.creator}<br>${e.subtitle}</div>
   </div>
   <div class="event-year">${e.year}</div>
   <div class="event-empty"></div>
 </div>`).join(""):`<div class="alert alert-light">No existen eventos con estos filtros.</div>`;
 document.querySelectorAll(".event-card").forEach(x=>x.addEventListener("click",()=>showDetail(Number(x.dataset.index))));
}

function showDetail(i){
 const e=events[i]; if(!e)return;
 $("#timeline-detail").innerHTML=`
 <div class="eyebrow text-white-50">${e.type} · ${e.year}</div>
 <h2 class="h2 mt-2">${e.title}</h2>
 <p>${e.description}</p>
 <hr class="border-light opacity-25">
 <p class="mb-1"><strong>Creadora:</strong> ${e.creator}</p>
 <p class="mb-1"><strong>Contexto:</strong> ${e.subtitle}</p>
 <p class="small mt-3"><strong>Fuente:</strong> ${e.source}</p>
 <div class="alert alert-warning mt-4 mb-0">Vista PREVIEW: el evento conserva el estado documental de la base y puede requerir revisión editorial.</div>`;
}

$("#filter-type").addEventListener("change",render);
$("#filter-creator").addEventListener("change",render);
init();