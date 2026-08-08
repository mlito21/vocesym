const $ = selector => document.querySelector(selector);

function resourceHref(resource) {
  if (!resource) return "recursos.html";
  if (resource.id === "RE-001") return "laboratorio-matilde.html";
  if (resource.id === "RE-047") return "laboratorio-blanca.html";
  if (resource.id === "RE-058") return "laboratorio-emily.html";
  return `recurso.html?id=${encodeURIComponent(resource.id)}`;
}

function splitFeaturedWorks(value) {
  return String(value || "")
    .split(/;|\n/)
    .map(item => item.trim())
    .filter(Boolean);
}

function renderWorks(creator, mediation) {
  const works = creator.works || [];
  const featuredNames = new Set(splitFeaturedWorks(mediation?.featuredWorks).map(x => x.toLowerCase()));
  const sorted = [...works].sort((a, b) => {
    const aFeatured = featuredNames.has(VML.clean(a.title).toLowerCase()) ? 1 : 0;
    const bFeatured = featuredNames.has(VML.clean(b.title).toLowerCase()) ? 1 : 0;
    return bFeatured - aFeatured || (a.title || "").localeCompare(b.title || "");
  });

  if (!sorted.length) {
    return '<div class="alert alert-light">Las obras de esta creadora están todavía en proceso de sistematización.</div>';
  }

  return sorted.map(work => `
    <div class="col-md-6 col-xl-4">
      <article class="work-public-card">
        <div class="eyebrow">${VML.safe(work.genre || work.type || "Obra")}</div>
        <h3 class="h4 mt-2">${VML.safe(VML.clean(work.title))}</h3>
        <p class="small text-secondary mb-0">
          ${work.year ? `<strong>Año:</strong> ${VML.safe(work.year)}<br>` : ""}
          ${work.role ? `<strong>Rol:</strong> ${VML.safe(work.role)}` : ""}
        </p>
      </article>
    </div>
  `).join("");
}

function renderExperiences(mediation) {
  const items = [mediation?.experience1, mediation?.experience2, mediation?.experience3].filter(Boolean);
  if (!items.length) return "";

  return `
    <section class="public-section bg-white">
      <div class="container-xxl">
        <div class="eyebrow">Explora</div>
        <h2 class="public-section-title mt-2">Tres formas de acercarte a su trayectoria</h2>
        <div class="row g-4 mt-3">
          ${items.map((item, index) => `
            <div class="col-lg-4">
              <article class="experience-public-card">
                <div class="experience-number">0${index + 1}</div>
                <p class="mb-0 fs-5">${VML.safe(item)}</p>
              </article>
            </div>
          `).join("")}
        </div>
      </div>
    </section>`;
}

async function init() {
  const creatorId = new URLSearchParams(window.location.search).get("id");
  if (!creatorId) {
    $("#creator-hook").textContent = "No se indicó qué creadora desea consultar.";
    return;
  }

  try {
    const data = await VML.load();
    const creator = (data.creators || []).find(item => item.id === creatorId);
    if (!creator) {
      $("#creator-public-title").textContent = "Perfil no disponible";
      $("#creator-hook").textContent = VML.isPublic()
        ? "Esta creadora todavía no forma parte del catálogo público verificado."
        : "No se encontró este identificador en la vista actual.";
      return;
    }

    const mediation = creator.mediation || (data.mediations || []).find(item => item.creatorId === creator.id) || null;
    const resource = (creator.resources || [])[0] || null;

    document.title = `${creator.name} · Voces y Melodías Lojanas`;
    $("#creator-mode").textContent = `${VML.modeLabel()} · ${creator.discipline || creator.category || "Creadora"}`;
    $("#creator-public-title").textContent = mediation?.title || creator.name;
    $("#creator-hook").textContent = mediation?.hook || `Conoce la trayectoria y las obras documentadas de ${creator.name}.`;

    const biography = mediation?.biography || creator.bio || "La síntesis biográfica de esta creadora se encuentra todavía en preparación editorial.";
    const contribution = mediation?.contribution || "El aporte patrimonial de esta creadora está en proceso de investigación y redacción curatorial. El archivo conserva sus obras y fuentes disponibles sin completar los vacíos mediante inferencias.";
    const question = mediation?.guideQuestion || `¿Qué podemos conocer de ${creator.name} a partir de las obras y fuentes que conserva el archivo?`;
    const legacy = mediation?.legacy || "Su legado se presenta como parte de un proceso de recuperación documental en curso.";
    const audience = mediation?.audience || "Público general y comunidad educativa.";
    const multimedia = mediation?.multimedia || "Los materiales visuales, sonoros o textuales se incorporarán únicamente cuando su fuente y condiciones de uso estén verificadas.";

    $("#creator-public-content").innerHTML = `
      <section class="public-section">
        <div class="container-xxl">
          <div class="row g-5 align-items-start">
            <div class="col-lg-4"><div class="creator-monogram-large">${VML.safe(creator.initials || "VM")}</div></div>
            <div class="col-lg-8">
              <div class="eyebrow">Conoce su historia</div>
              <h2 class="public-section-title mt-2">${VML.safe(creator.name)}</h2>
              <p class="fs-5 lh-lg">${VML.safe(biography)}</p>
              <div class="row g-3 mt-3">
                <div class="col-md-4"><div class="info-box"><span>Nacimiento</span><strong>${VML.safe(creator.birth || "Por verificar")}</strong></div></div>
                <div class="col-md-4"><div class="info-box"><span>Lugar</span><strong>${VML.safe(creator.place || "Por verificar")}</strong></div></div>
                <div class="col-md-4"><div class="info-box"><span>Disciplina</span><strong>${VML.safe(creator.discipline || creator.category || "Por clasificar")}</strong></div></div>
              </div>
              <div class="guide-question mt-4">${VML.safe(question)}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="public-section bg-white">
        <div class="container-xxl">
          <div class="row g-5">
            <div class="col-lg-4"><div class="eyebrow">Por qué importa</div><h2 class="public-section-title mt-2">Su aporte al patrimonio lojano</h2></div>
            <div class="col-lg-8"><p class="fs-5 lh-lg mb-0">${VML.safe(contribution)}</p></div>
          </div>
        </div>
      </section>

      <section class="public-section">
        <div class="container-xxl">
          <div class="eyebrow">Descubre su obra</div>
          <h2 class="public-section-title mt-2">Obras documentadas</h2>
          <p class="section-intro mt-3">Explora títulos, géneros y datos disponibles. La ausencia de un año o de un material digital indica que el dato todavía está siendo investigado o que su uso no está autorizado.</p>
          <div class="row g-4 mt-2">${renderWorks(creator, mediation)}</div>
        </div>
      </section>

      ${renderExperiences(mediation)}

      <section class="public-section">
        <div class="container-xxl">
          <div class="legacy-band">
            <div class="row g-4 align-items-center">
              <div class="col-lg-8"><div class="eyebrow text-white-50">Explora su legado</div><h2 class="h1 mt-2">Más allá de una lista de obras</h2><p class="text-white-50 fs-5 mb-0">${VML.safe(legacy)}</p></div>
              <div class="col-lg-4 d-flex gap-2 flex-wrap justify-content-lg-end"><a class="btn btn-light rounded-pill" href="linea-tiempo.html">Ver cronología</a><a class="btn btn-light rounded-pill" href="conexiones.html">Ver conexiones</a></div>
            </div>
          </div>
        </div>
      </section>

      <section class="public-section bg-white">
        <div class="container-xxl">
          <div class="row g-5">
            <div class="col-lg-7">
              <div class="eyebrow">Mira, escucha y lee</div>
              <h2 class="public-section-title mt-2">Materiales disponibles</h2>
              <p class="fs-5 lh-lg">${VML.safe(multimedia)}</p>
              <p class="small text-secondary"><strong>Dirigido a:</strong> ${VML.safe(audience)}</p>
            </div>
            <div class="col-lg-5">
              <div class="research-box">
                <div class="eyebrow">Para aprender</div>
                <h3 class="h3 mt-2">¿Quieres trabajar esta creadora en un contexto educativo?</h3>
                <p>Las actividades didácticas se mantienen en una capa separada de la experiencia patrimonial.</p>
                ${resource ? `<a class="btn btn-brand rounded-pill" href="${resourceHref(resource)}">Abrir recurso educativo</a>` : '<p class="small text-secondary mb-0">Recurso educativo todavía en preparación.</p>'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="public-section">
        <div class="container-xxl">
          <div class="row g-5">
            <div class="col-lg-4"><div class="eyebrow">Investiga</div><h2 class="public-section-title mt-2">Fuentes y estado documental</h2></div>
            <div class="col-lg-8">
              <div class="research-box">
                <p><strong>Fuente principal:</strong><br><span class="text-secondary">${VML.safe(creator.source || "Fuente en proceso de normalización.")}</span></p>
                ${mediation ? `<p><strong>Estado de la mediación:</strong> ${VML.safe(mediation.verificationStatus || "En revisión")}</p>` : ""}
                ${VML.isPreview() ? '<div class="alert alert-warning mb-0"><strong>PREVIEW:</strong> esta experiencia puede contener información en revisión y no equivale a publicación editorial definitiva.</div>' : ''}
              </div>
            </div>
          </div>
        </div>
      </section>`;
  } catch (error) {
    console.error(error);
    $("#creator-public-title").textContent = "No fue posible cargar el perfil";
    $("#creator-hook").textContent = error.message;
  }
}

init();
