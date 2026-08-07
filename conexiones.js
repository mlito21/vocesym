const $=s=>document.querySelector(s);
let relations=[]; let creators=[];

function jsonp(baseUrl,params={},timeout=12000){
 return new Promise((resolve,reject)=>{
  const cb="__rel_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const s=document.createElement("script"); const q=new URLSearchParams({...params,callback:cb});
  s.src=baseUrl+(baseUrl.includes("?")?"&":"?")+q.toString(); let done=false;
  const clean=()=>{if(done)return;done=true;if(s.parentNode)s.remove();try{delete window[cb]}catch(_){}clearTimeout(t)};
  window[cb]=d=>{clean();resolve(d)};s.onerror=()=>{clean();reject(new Error("No se pudo cargar la API"))};
  const t=setTimeout(()=>{clean();reject(new Error("Tiempo de espera agotado"))},timeout);document.head.appendChild(s);
 });
}
async function init(){
 try{
  const data=await jsonp(window.VML_CONFIG.API_URL,{mode:window.VML_CONFIG.API_MODE||"preview"});
  relations=data.relations||[]; creators=data.creators||[];
  $("#connection-status").textContent=`Modo vista previa · ${relations.length} relaciones cargadas desde Google Sheets`;
  renderList(); if(relations.length) selectRelation(0);
 }catch(e){$("#connection-status").textContent="No fue posible cargar las relaciones: "+e.message}
}
function renderList(){
 $("#relation-list").innerHTML=relations.map((r,i)=>`<article class="relation-item ${i===0?"active":""}" data-index="${i}">
   <div class="role-label">${r.ID_RELACIÓN||""}</div>
   <strong>${r.OBRA_BASE||"Obra"}</strong>
   <div class="text-secondary small mt-1">Composición → arreglo coral</div>
 </article>`).join("");
 document.querySelectorAll(".relation-item").forEach(x=>x.addEventListener("click",()=>selectRelation(Number(x.dataset.index))));
}
function selectRelation(i){
 document.querySelectorAll(".relation-item").forEach((x,j)=>x.classList.toggle("active",j===i));
 const r=relations[i]; if(!r)return;
 $("#network-flow").innerHTML=`
 <div class="node person"><div class="role-label">${r.TIPO_ORIGEN||"Compositora"}</div><h3 class="h4 mt-2">${r.NOMBRE_ORIGEN||""}</h3></div>
 <div class="arrow">→</div>
 <div class="node work"><div class="role-label">Obra</div><h3 class="h3 mt-2">${r.OBRA_BASE||""}</h3><small>${r.ID_OBRA_BASE||""}</small></div>
 <div class="arrow">→</div>
 <div class="node person"><div class="role-label">${r.TIPO_DESTINO||"Arreglista"}</div><h3 class="h4 mt-2">${r.NOMBRE_DESTINO||""}</h3></div>`;
 $("#relation-detail").innerHTML=`<div class="eyebrow">Resultado de la relación</div><h3 class="h2 mt-2">${r.OBRA_DERIVADA_O_RESULTADO||""}</h3><p>${r.RELACIÓN||""}</p><p class="text-secondary small"><strong>Fuente:</strong> ${r.FUENTE||"Pendiente"}</p><div class="alert alert-warning mb-0">Estado: ${r.ESTADO_VERIFICACIÓN||"Preliminar"}. Esta conexión se muestra únicamente en el entorno PREVIEW.</div>`;
}
init();