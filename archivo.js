const $ = s => document.querySelector(s);
let data = null;

function validPhoto(url) {
  return /^https:\/\//i.test(String(url || "").trim());
}

function creatorVisual(creator, variant = "card") {
  const initials = VML.safe(creator.initials || "VM");
  const photo = String(creator.photoSource || "").trim();
  const hasPhoto = validPhoto(photo);
  const visualClass = variant === "profile" ? "creator-visual-profile" : "creator-visual-card";
  return `
    <div class="creator-visual ${visualClass}${hasPhoto ? "" : " no-photo"}">
      ${hasPhoto ? `<img class="creator-photo" src="${VML.safe(photo)}" alt="Retrato de ${VML.safe(creator.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : ""}
      <div class="monogram creator-photo-fallback"${hasPhoto ? "" : ' style="display:grid"'}>${initials}</div>
    </div>`;
}

async function init() {
  try {
    data = await VML.load();
    const creators = data.creators || [];

    $("#archive-status").textContent = VML.isPublic()
      ? `Catálogo público preliminar · ${creators.length} creadoras registradas`
      : `${VML.modeLabel()} · ${creators.length} creadoras disponibles`;
    $("#archive-status").classList.add("is-ready");

    populateFilters(creators);
    render();
  } catch (e) {
    $("#archive-status").textContent = "No fue posible cargar el archivo: " + e.message;
    $("#archive-status").classList.add("is-error");
  }
}

function populateFilters(creators) {
  const categories = [...new Set(
    creators.map(c => c.category || c.discipline).filter(Boolean)
  )].sort();

  $("#category").innerHTML = '<option value="">Todas</option>' +
    categories.map(category => `<option>${VML.safe(category)}</option>`).join("");
}

function filtered() {
  let creators = [...(data.creators || [])];
  const query = $("#search").value.trim().toLowerCase();
  const category = $("#category").value;
  const sort = $("#sort").value;

  if (query) {
    creators = creators.filter(c =>
      [c.name, c.category, c.discipline, c.place]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  if (category) creators = creators.filter(c => (c.category || c.discipline) === category);
  if (sort === "name") creators.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  if (sort === "works") creators.sort((a, b) => (b.works || []).length - (a.works || []).length);
  if (sort === "resources") creators.sort((a, b) => (b.resources || []).length - (a.resources || []).length);

  return creators;
}

function render() {
  const creators = filtered();
  $("#result-count").textContent = creators.length;

  $("#creator-grid-v11").innerHTML = creators.map(c => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <article class="creator-card-v11" data-id="${VML.safe(c.id)}" tabindex="0">
        ${creatorVisual(c, "card")}
        <div class="card-body-v11">
          <div class="d-flex gap-2 flex-wrap align-items-center">
            <span class="tag">${VML.safe(c.discipline || c.category || (VML.isPreview() ? "Por clasificar" : "Categoría en revisión"))}</span>
          </div>
          <h3>${VML.safe(c.name)}</h3>
          ${VML.isPublic()
            ? '<div class="small text-secondary">Corpus preliminar</div><div class="small mt-2">Ficha patrimonial en investigación</div>'
            : `<div class="small text-secondary">${VML.safe(c.birth || "Fecha por verificar")} · ${(c.works || []).length} obra(s)</div><div class="small mt-2">${c.mediation ? "Experiencia patrimonial disponible" : "Ficha patrimonial en preparación"}</div>`}
        </div>
      </article>
    </div>
  `).join("") || '<div class="col-12"><div class="alert alert-light">No hay coincidencias.</div></div>';

  document.querySelectorAll(".creator-card-v11").forEach(card => {
    const open = () => openCreator(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function openCreator(id) {
  const creator = (data.creators || []).find(c => c.id === id);
  if (!creator) return;

  if (VML.isPublic()) {
    $("#detail-content").innerHTML = `
      <div class="row g-5 align-items-start">
        <div class="col-lg-4">${creatorVisual(creator, "profile")}</div>
        <div class="col-lg-8">
          <span class="tag">${VML.safe(creator.discipline || creator.category || "Categoría en revisión")}</span>
          <h2 class="section-title fs-1 mt-3">${VML.safe(creator.name)}</h2>
          <div class="public-record-note mt-4">
            <strong>Corpus preliminar</strong>
            <p class="mb-0 mt-2">Este registro documenta su inclusión en el corpus de investigación de Voces y Melodías Lojanas. La biografía, las obras, las fuentes y los recursos educativos se publicarán progresivamente después de su verificación documental y editorial.</p>
          </div>
        </div>
      </div>`;
    $("#creator-detail").hidden = false;
    $("#creator-detail").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const resources = creator.resources || [];
  const works = creator.works || [];
  const mainResource = resources[0] || null;
  const learningHref = learningHrefForCreator(creator, mainResource);
  const mapHref = VML.withMode(`mapa.html?creator=${encodeURIComponent(creator.id)}`);

  $("#detail-content").innerHTML = `
    <div class="row g-5">
      <div class="col-lg-4">
        ${creatorVisual(creator, "profile")}
        <div class="mt-3"><span class="tag">${VML.safe(creator.discipline || creator.category || "")}</span></div>
        ${validPhoto(creator.photoSource) ? `<p class="small text-secondary mt-2 mb-0">Imagen registrada en el Archivo Digital. Los créditos y condiciones de uso se presentan en la ficha documental.</p>` : ""}
      </div>
      <div class="col-lg-8">
        <div class="eyebrow">${VML.safe(creator.id)}</div>
        <h2 class="section-title fs-1">${VML.safe(creator.name)}</h2>
        <p class="fs-5">${VML.safe(creator.bio || "Biografía pendiente de validación y redacción editorial.")}</p>

        <div class="d-flex gap-2 flex-wrap my-4">
          <a class="btn btn-brand rounded-pill" href="${VML.withMode(`creadora.html?id=${encodeURIComponent(creator.id)}`)}">Conocer su vida y obra</a>
          ${learningHref ? `<a class="btn btn-outline-brand rounded-pill" href="${learningHref}">Aprender con su obra</a>` : ""}
          ${creator.place ? `<a class="btn btn-outline-brand rounded-pill" href="${mapHref}">Ver ubicación</a>` : ""}
        </div>

        <div class="row g-3 my-3">
          <div class="col-md-6"><div class="info-box"><span>Nacimiento</span><strong>${VML.safe(creator.birth || "Por verificar")}</strong></div></div>
          <div class="col-md-6"><div class="info-box"><span>Lugar</span><strong>${VML.safe(creator.place || "Por verificar")}</strong></div></div>
        </div>

        <h3 class="h4 mt-4">Obras (${works.length})</h3>
        <div class="list-group list-group-flush">
          ${works.length
            ? works.map(work => `
                <div class="list-group-item px-0 bg-transparent">
                  <strong>${VML.safe(VML.clean(work.title))}</strong><br>
                  <small class="text-secondary">${VML.safe(work.type || work.genre || "Por clasificar")}</small>
                </div>
              `).join("")
            : '<p class="text-secondary">Sin obras cargadas.</p>'}
        </div>

        <h3 class="h4 mt-4">Para aprender</h3>
        ${learningHref
          ? `<a class="resource-pill text-decoration-none text-dark" href="${learningHref}">${VML.safe(mainResource?.title || (creator.id === "CR-052" ? "Laboratorio de adaptación didáctica para piano" : "Laboratorio del arreglo coral"))}</a>`
          : resources.length
          ? resources.map(resource => `
              <a class="resource-pill text-decoration-none text-dark" href="${resourceHref(resource)}">${VML.safe(resource.title || "Recurso educativo")}</a>
            `).join("")
          : '<p class="text-secondary">Sin actividad educativa asociada todavía.</p>'}

        <h3 class="h4 mt-4">Fuentes e investigación</h3>
        <p class="small text-secondary">${VML.safe(creator.source || "Pendiente de normalización.")}</p>

        ${VML.isPreview()
          ? '<div class="alert alert-warning mt-4 mb-0"><strong>PREVIEW:</strong> esta ficha puede contener información todavía en revisión. Su presencia aquí no equivale a aprobación para publicación definitiva.</div>'
          : ''}
      </div>
    </div>
  `;

  $("#creator-detail").hidden = false;
  $("#creator-detail").scrollIntoView({ behavior: "smooth" });
}

function resourceHref(resource) {
  return VML.resourceHref(resource);
}

function learningHrefForCreator(creator, resource) {
  const linked = resource || VML.publicResources.find(item => item.creatorId === creator?.id);
  return linked ? resourceHref(linked) : "";
}

["search", "category", "sort"].forEach(id => {
  $("#" + id).addEventListener(id === "search" ? "input" : "change", render);
});

$("#close-detail").addEventListener("click", () => {
  $("#creator-detail").hidden = true;
});

init();
