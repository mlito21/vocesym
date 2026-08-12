const $=s=>document.querySelector(s);

function renderEmbed(resource){
  const url=String(resource.embedUrl||"").trim();
  const isSafe=/^https:\/\//i.test(url);
  const format=resource.embedFormat||"H5P / Lumi";
  const rawHeight=Number.parseInt(resource.embedHeight,10);
  const height=Number.isFinite(rawHeight)?Math.max(400,Math.min(rawHeight,1200)):620;

  if(!isSafe){
    return `<div class="resource-stage"><div class="eyebrow">Experiencia interactiva</div><h2 class="h2 mt-2">Recurso en preparación</h2><p class="text-secondary mb-0">Cuando el recurso H5P/Lumi esté validado, su URL HTTPS se registrará en la Base Maestra y aparecerá aquí automáticamente.</p></div>`;
  }

  return `<div class="resource-stage"><div class="eyebrow">Experiencia interactiva</div><h2 class="h2 mt-2">Explora el recurso</h2><p class="text-secondary">Interactúa con la experiencia y vuelve después a la ficha de la creadora para seguir explorando su vida y obra.</p><div class="ratio rounded-4 overflow-hidden border mt-3" style="--bs-aspect-ratio:${Math.min(100,Math.max(45,(height/900)*100))}%"><iframe src="${VML.safe(url)}" title="${VML.safe(resource.title||"Recurso educativo interactivo")}" loading="lazy" allowfullscreen allow="fullscreen" style="border:0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"></iframe></div></div>`;
}

function renderTeacherInfo(r){
  const steps=String(r.sequence||"").split(/→|>|;/).map(s=>s.trim()).filter(Boolean);
  return `<div class="accordion teacher-panel mt-5" id="teacher-info">
    <div class="accordion-item border rounded-4 overflow-hidden">
      <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#teacher-collapse" aria-expanded="false" aria-controls="teacher-collapse">Información pedagógica para docentes y mediadores</button></h2>
      <div id="teacher-collapse" class="accordion-collapse collapse" data-bs-parent="#teacher-info">
        <div class="accordion-body p-4">
          <div class="teacher-grid">
            <div class="teacher-item"><span>Nivel</span><strong>${VML.safe(r.level||"Por definir")}</strong></div>
            <div class="teacher-item"><span>Áreas</span><strong>${VML.safe(r.areas||"Por definir")}</strong></div>
            <div class="teacher-item"><span>Obra base</span><strong>${VML.safe(r.workBase||"Por definir")}</strong></div>
            <div class="teacher-item"><span>Tecnología</span><strong>${VML.safe(r.technology||"Por definir")}</strong></div>
          </div>
          <h3 class="h4 mt-4">Objetivo de aprendizaje</h3><p>${VML.safe(r.objective||"Por definir")}</p>
          ${steps.length?`<h3 class="h4 mt-4">Secuencia pedagógica</h3>${steps.map((s,i)=>`<div class="step"><span class="step-num">${i+1}</span><div><strong>${VML.safe(s)}</strong></div></div>`).join("")}`:""}
          <h3 class="h4 mt-4">Actividad</h3><p>${VML.safe(r.activity||"Por definir")}</p>
          <div class="teacher-grid mt-4">
            <div class="teacher-item"><span>Evidencia</span><strong>${VML.safe(r.evidence||"Por definir")}</strong></div>
            <div class="teacher-item"><span>Evaluación</span><strong>${VML.safe(r.assessment||"Por definir")}</strong></div>
          </div>
          <h3 class="h4 mt-4">Accesibilidad</h3><p class="mb-0">${VML.safe(r.accessibility||"Por definir")}</p>
        </div>
      </div>
    </div>
  </div>`;
}

async function init(){
  const id=new URLSearchParams(location.search).get("id");
  if(!id){fail("Falta el identificador del recurso.");return}
  try{
    const data=await VML.load();
    const r=(data.resources||[]).find(x=>x.id===id);
    if(!r){fail("No se encontró el recurso "+id);return}

    if(VML.prototypeResourceIds.has(r.id)){location.replace(VML.resourceHref(r));return}

    const c=(data.creators||[]).find(x=>x.id===r.creatorId);
    $("#resource-kind").textContent=r.title||"Experiencia educativa";
    $("#resource-title").textContent=c?.name||r.creator||"Recurso educativo";
    $("#resource-creator").textContent=r.objective||"Explora una experiencia educativa vinculada con la vida y obra de esta creadora.";
    $("#generic-status").textContent=`${VML.modeLabel()} · recurso cargado desde Google Sheets`;

    $("#generic-content").innerHTML=`
      <div class="row g-5 align-items-start mb-5">
        <div class="col-lg-8">
          ${renderEmbed(r)}
        </div>
        <div class="col-lg-4">
          <div class="generic-box">
            <div class="eyebrow">Antes de empezar</div>
            <h2 class="h3 mt-2">Qué vas a explorar</h2>
            <p>${VML.safe(r.activity||"Conoce a la creadora, explora su obra y relaciona la experiencia con el patrimonio cultural lojano.")}</p>
            ${c?`<a href="${VML.withMode(`creadora.html?id=${encodeURIComponent(c.id)}`)}" class="btn btn-outline-brand rounded-pill">Conocer a ${VML.safe(c.name)}</a>`:""}
          </div>
        </div>
      </div>
      ${renderTeacherInfo(r)}
      ${VML.isPreview()?'<div class="alert alert-warning mt-4"><strong>PREVIEW:</strong> este recurso puede ser todavía una demostración o estar en proceso de validación pedagógica y editorial.</div>':""}`;
  }catch(e){fail(e.message)}
}

function fail(m){
  $("#generic-status").textContent=m;
  $("#generic-content").innerHTML='<div class="alert alert-danger">No fue posible mostrar este recurso.</div>';
}

init();
