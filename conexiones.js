const $ = s => document.querySelector(s);
let relations = [];

async function init() {
  try {
    const data = await VML.load();
    relations = data.relations || [];

    $("#connection-status").textContent = relations.length
      ? `${VML.modeLabel()} · ${relations.length} relaciones cargadas desde la Base Maestra`
      : `${VML.modeLabel()} · relaciones documentales en preparación`;
    renderList();

    if (relations.length) {
      selectRelation(0);
    } else {
      $("#network-flow").innerHTML = VML.isPublic()
        ? '<div class="alert alert-light mb-0"><strong>Explorador en preparación.</strong> Las conexiones entre creadoras, obras y arreglos se publicarán con su fuente y estado de verificación. No se generan vínculos por semejanza o inferencia.</div>'
        : '<div class="alert alert-light mb-0">No existen relaciones disponibles en esta vista.</div>';
      $("#relation-detail").innerHTML = '';
    }
  } catch (e) {
    $("#connection-status").textContent = "No fue posible cargar las relaciones: " + e.message;
  }
}

function renderList() {
  $("#relation-list").innerHTML = relations.map((r, i) => `
    <article class="relation-item ${i === 0 ? "active" : ""}" data-index="${i}" tabindex="0">
      <div class="role-label">${VML.safe(r.ID_RELACIÓN || "")}</div>
      <strong>${VML.safe(r.OBRA_BASE || "Obra")}</strong>
      <div class="text-secondary small mt-1">${VML.safe(r.RELACIÓN || "Relación documentada")}</div>
    </article>
  `).join("");

  document.querySelectorAll(".relation-item").forEach(item => {
    const open = () => selectRelation(Number(item.dataset.index));
    item.addEventListener("click", open);
    item.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function selectRelation(index) {
  document.querySelectorAll(".relation-item").forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  const r = relations[index];
  if (!r) return;

  $("#network-flow").innerHTML = `
    <div class="node person">
      <div class="role-label">${VML.safe(r.TIPO_ORIGEN || "Creadora")}</div>
      <h3 class="h4 mt-2">${VML.safe(r.NOMBRE_ORIGEN || "")}</h3>
    </div>
    <div class="arrow" aria-hidden="true">→</div>
    <div class="node work">
      <div class="role-label">Obra</div>
      <h3 class="h3 mt-2">${VML.safe(r.OBRA_BASE || "")}</h3>
      <small>${VML.safe(r.ID_OBRA_BASE || "")}</small>
    </div>
    <div class="arrow" aria-hidden="true">→</div>
    <div class="node person">
      <div class="role-label">${VML.safe(r.TIPO_DESTINO || "Creadora relacionada")}</div>
      <h3 class="h4 mt-2">${VML.safe(r.NOMBRE_DESTINO || "")}</h3>
    </div>
  `;

  const state = VML.safe(r.ESTADO_VERIFICACIÓN || "Preliminar");
  const source = VML.safe(r.FUENTE || "Pendiente de normalización");

  $("#relation-detail").innerHTML = `
    <div class="eyebrow">Resultado de la relación</div>
    <h3 class="h2 mt-2">${VML.safe(r.OBRA_DERIVADA_O_RESULTADO || "Relación documentada")}</h3>
    <p>${VML.safe(r.RELACIÓN || "")}</p>
    <p class="text-secondary small"><strong>Fuente:</strong> ${source}</p>
    ${VML.isPreview()
      ? `<div class="alert alert-warning mb-0"><strong>PREVIEW:</strong> estado documental: ${state}. La relación aún puede requerir revisión editorial y de derechos.</div>`
      : `<div class="alert alert-success mb-0">Relación publicada desde la vista WEB.</div>`}
  `;
}

init();
