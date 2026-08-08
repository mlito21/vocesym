const $=s=>document.querySelector(s);
let map,markers=[],locations=[],creators=[],dataset=null;
function n(v){const x=Number(String(v||"").replace(",","."));return Number.isFinite(x)?x:null}

async function init(){
  map=L.map("cultural-map",{scrollWheelZoom:false}).setView([-3.99313,-79.20422],12.5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
  try{
    dataset=await VML.load();
    creators=dataset.creators||[];
    locations=(dataset.locations||[]).filter(l=>n(l.LATITUD)!==null&&n(l.LONGITUD)!==null);
    const locatedIds=new Set(locations.map(l=>l.ID_CREADORA).filter(Boolean));
    const pending=creators.filter(c=>!locatedIds.has(c.id));
    const pct=creators.length?Math.round(locatedIds.size/creators.length*100):0;
    $("#total-creators-map").textContent=creators.length;
    $("#located-count").textContent=locatedIds.size;
    $("#pending-count").textContent=pending.length;
    $("#coverage-percent").textContent=pct+"%";
    $("#coverage-fill").style.width=pct+"%";
    $("#map-status").textContent=`${VML.modeLabel(dataset)} · ${locations.length} registro(s) geográfico(s) · ${pending.length} creadora(s) sin localización georreferenciada en la vista actual`;
    renderLocations();
    renderPending(pending);
    renderInterpretation(locatedIds.size,pending.length);
  }catch(e){
    $("#map-status").textContent="No fue posible cargar la cobertura territorial: "+e.message;
  }
}

function renderLocations(){
  $("#location-list").innerHTML=locations.length?locations.map((l,i)=>`<article class="location-item ${i===0?"active":""}" data-index="${i}"><strong>${VML.safe(l.LUGAR||"Lugar")}</strong><div class="small text-secondary mt-1">${VML.safe(l.NOMBRE_CREADORA||"")} · ${VML.safe(l.TIPO_RELACIÓN||"")}</div><div class="small mt-1"><strong>Precisión:</strong> ${VML.safe(l.PRECISIÓN||"Por definir")}</div></article>`).join(""):'<div class="alert alert-light">No hay lugares georreferenciados disponibles en la vista actual.</div>';
  locations.forEach((l,i)=>{
    const m=L.marker([n(l.LATITUD),n(l.LONGITUD)]).addTo(map).bindPopup(`<strong>${VML.safe(l.LUGAR||"Lugar")}</strong><br>${VML.safe(l.NOMBRE_CREADORA||"")}<br><small>${VML.safe(l.TIPO_RELACIÓN||"")} · precisión: ${VML.safe(l.PRECISIÓN||"")}</small>`);
    m.on("click",()=>selectLocation(i,false));markers.push(m);
  });
  document.querySelectorAll(".location-item").forEach(x=>x.addEventListener("click",()=>selectLocation(Number(x.dataset.index),true)));
  if(locations.length===1)map.setView([n(locations[0].LATITUD),n(locations[0].LONGITUD)],13);
  else if(locations.length>1)map.fitBounds(L.featureGroup(markers).getBounds().pad(.2));
}

function renderPending(pending){
  $("#pending-list").innerHTML=pending.length?pending.map(c=>`<div class="pending-name"><strong>${VML.safe(c.name)}</strong><br><span class="text-secondary">${VML.safe(c.discipline||c.category||"")}</span></div>`).join(""):'<div class="small text-secondary">No existen perfiles pendientes en la vista actual.</div>';
}

function renderInterpretation(located,pending){
  const el=$("#map-interpretation");
  if(!el)return;
  if(!creators.length){el.innerHTML='<strong>Interpretación:</strong> la vista actual no contiene creadoras publicadas, por lo que todavía no existen puntos que representar.';return;}
  el.innerHTML=`<strong>Interpretación:</strong> la vista actual contiene ${creators.length} creadora(s); ${located} cuentan con localización georreferenciada y ${pending} permanecen sin coordenadas verificadas. La ausencia de un marcador no se completa por inferencia: se conserva como una necesidad de investigación documental.`;
}

function selectLocation(i,popup=true){
  document.querySelectorAll(".location-item").forEach((x,j)=>x.classList.toggle("active",i===j));
  const l=locations[i];if(!l)return;
  map.setView([n(l.LATITUD),n(l.LONGITUD)],14,{animate:true});if(popup)markers[i].openPopup();
}
init();