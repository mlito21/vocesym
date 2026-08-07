const $=s=>document.querySelector(s);
let locations=[], map, markers=[];

function jsonp(baseUrl,params={},timeout=12000){
 return new Promise((resolve,reject)=>{
  const cb="__map_"+Date.now()+"_"+Math.random().toString(36).slice(2);
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
function n(v){const x=Number(String(v).replace(",","."));return Number.isFinite(x)?x:null}

async function init(){
 map=L.map("cultural-map",{scrollWheelZoom:false}).setView([-3.99313,-79.20422],13);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
   maxZoom:19,
   attribution:'&copy; OpenStreetMap contributors'
 }).addTo(map);

 try{
  const data=await jsonp(window.VML_CONFIG.API_URL,{mode:window.VML_CONFIG.API_MODE||"preview"});
  locations=(data.locations||[]).filter(x=>n(x.LATITUD)!==null&&n(x.LONGITUD)!==null);
  $("#map-status").textContent=`Modo vista previa · ${locations.length} lugar(es) georreferenciado(s) desde Google Sheets`;
  renderLocations();
 }catch(e){
  $("#map-status").textContent="No fue posible cargar los lugares: "+e.message;
 }
}

function renderLocations(){
 markers.forEach(m=>m.remove());markers=[];
 $("#location-list").innerHTML=locations.length?locations.map((l,i)=>`
 <article class="location-item ${i===0?"active":""}" data-index="${i}">
   <div class="d-flex justify-content-between gap-2"><strong>${l.LUGAR}</strong><span class="precision-badge">${l.PRECISIÓN||"Sin precisión"}</span></div>
   <div class="small text-secondary mt-1">${l.NOMBRE_CREADORA} · ${l.TIPO_RELACIÓN}</div>
 </article>`).join(""):`<div class="alert alert-light">No hay lugares georreferenciados en esta vista.</div>`;

 locations.forEach((l,i)=>{
  const marker=L.marker([n(l.LATITUD),n(l.LONGITUD)]).addTo(map);
  marker.bindPopup(`<strong>${l.LUGAR}</strong><br>${l.NOMBRE_CREADORA}<br><small>${l.TIPO_RELACIÓN} · precisión: ${l.PRECISIÓN}</small>`);
  marker.on("click",()=>selectLocation(i,false));
  markers.push(marker);
 });
 document.querySelectorAll(".location-item").forEach(x=>x.addEventListener("click",()=>selectLocation(Number(x.dataset.index),true)));
 if(locations.length){
   const group=L.featureGroup(markers);
   if(locations.length>1) map.fitBounds(group.getBounds().pad(.25));
   else map.setView([n(locations[0].LATITUD),n(locations[0].LONGITUD)],13);
 }
}
function selectLocation(i,openPopup=true){
 document.querySelectorAll(".location-item").forEach((x,j)=>x.classList.toggle("active",j===i));
 const l=locations[i];if(!l)return;
 map.setView([n(l.LATITUD),n(l.LONGITUD)],14,{animate:true});
 if(openPopup)markers[i].openPopup();
}
init();