const $=s=>document.querySelector(s);

function renderEmbed(resource){
  const url=String(resource.embedUrl||"").trim();
  const isSafe=/^https:\/\//i.test(url);
  const format=resource.embedFormat||"H5P / Lumi";
  const rawHeight=Number.parseInt(resource.embedHeight,10);
  const height=Number.isFinite(rawHeight)?Math.max(400,Math.min(rawHeight,1200)):620;

  if(!isSafe){
    return `<div class="generic-box mt-4"><div class="eyebrow">Experiencia interactiva</div><h3 class="h3 mt-2">Espacio preparado para ${VML.safe(format)}</h3><p class="text-secondary mb-0">Cuando el recurso esté validado, registre su URL HTTPS en <code>EMBED_URL</code> y se mostrará aquí sin modificar el HTML.</p></div>`;
  }

  return `<div class="generic-box mt-4"><div class="eyebrow">Experiencia interactiva</div><h3 class="h3 mt-2">${VML.safe(format)}</h3><div class="ratio rounded-4 overflow-hidden border mt-3" style="--bs-aspect-ratio:${Math.min(100,Math.max(45,(height/900)*100))}%"><iframe src="${VML.safe(url)}" title="${VML.safe(resource.title||"Recurso educativo interactivo")}" loading="lazy" allowfullscreen allow="fullscreen" style="border:0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe></div></div>`;
}

async function init(){
  const id=new URLSearchParams(location.search).get("id");
  if(!id){fail("Falta el identificador del recurso.");return}
  try{
    const data=await VML.load();
    const r=(data.resources||[]).find(x=>x.id===id);
    if(!r){fail("No se encontró el recurso "+id);return}

    if(r.id==="RE-001"){location.replace(VML.withMode("laboratorio-matilde.html"));return}
    if(r.id==="RE-047"){location.replace(VML.withMode("laboratorio-blanca.html"));return}
    if(r.id==="RE-058"){location.replace(VML.withMode("laboratorio-emily.html"));return}

    const c=(data.creators||[]).find(x=>x.id===r.creatorId);
    $("#resource-kind").textContent=r.title||"Recurso educativo";
    $("#resource-title").textContent=r.creator||c?.name||"Recurso educativo";
    $("#resource-creator").textContent=`${r.id} · diseño educativo generado desde la Base Maestra`;
    $("#generic-status").textContent=`${VML.modeLabel()} · recurso cargado desde Google Sheets`;

    const steps=String(r.sequence||"Explorar → contextualizar → interpretar → crear").split(/→|>|;/).map(s=>s.trim()).filter(Boolean);
    $("#generic-content").innerHTML=`
      <div class="row g-4">
        <div class="col-lg-7"><div class="generic-box"><div class="eyebrow">Propósito</div><h2 class="h2 mt-2">Objetivo de aprendizaje</h2><p class="fs-5">${VML.safe(r.objective||"Objetivo pendiente de definición.")}</p><h3 class="h4 mt-4">Secuencia pedagógica</h3>${steps.map((s,i)=>`<div class="step"><span class="step-num">${i+1}</span><div><strong>${VML.safe(s)}</strong></div></div>`).join("")}<h3 class="h4 mt-4">Actividad propuesta</h3><p>${VML.safe(r.activity||"Actividad pendiente de diseño detallado.")}</p></div></div>
        <div class="col-lg-5"><div class="generic-box mb-4"><div class="eyebrow">Contexto</div><p class="mt-3"><strong>Áreas:</strong> ${VML.safe(r.areas||"Por definir")}</p><p><strong>Nivel:</strong> ${VML.safe(r.level||"Por definir")}</p><p><strong>Obra base:</strong> ${VML.safe(r.workBase||"Por definir")}</p><p><strong>Tecnología:</strong> ${VML.safe(r.technology||"Por definir")}</p></div><div class="generic-box"><div class="eyebrow">Evaluación y accesibilidad</div><p class="mt-3"><strong>Evidencia:</strong> ${VML.safe(r.evidence||"Por definir")}</p><p><strong>Instrumento:</strong> ${VML.safe(r.assessment||"Por definir")}</p><p><strong>Accesibilidad:</strong> ${VML.safe(r.accessibility||"Por definir")}</p></div></div>
      </div>
      ${renderEmbed(r)}
      <div class="alert alert-warning mt-4"><strong>Diseño base.</strong> La ficha pedagógica y la experiencia H5P/Lumi son capas distintas: el recurso embebido solo se muestra cuando su URL está registrada y validada.</div>
      ${c?`<a href="${VML.withMode(`creadora.html?id=${encodeURIComponent(c.id)}`)}" class="btn btn-outline-brand rounded-pill">Volver a la creadora</a>`:""}`;
  }catch(e){fail(e.message)}
}

function fail(m){
  $("#generic-status").textContent=m;
  $("#generic-content").innerHTML='<div class="alert alert-danger">No fue posible mostrar este recurso.</div>';
}

init();