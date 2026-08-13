VML.load()
  .then(data => {
    const creators = data.creators || [];
    const resources = data.resources || [];
    const questions = data.questions || [];
    const works = creators.reduce((total, creator) => total + (creator.works || []).length, 0);

    document.querySelector("#portal-live-status").textContent =
      VML.isPublic()
        ? `${VML.modeLabel()} · ${creators.length} creadoras · ${works} obras · ${resources.length} recursos educativos`
        : `${VML.modeLabel()} · ${creators.length} creadoras · ${works} obras · ${resources.length} recursos educativos`;
    document.querySelector("#portal-live-status").classList.add("is-ready");

    document.querySelector("#stat-creators-v12").textContent = creators.length;
    document.querySelector("#stat-works-v12").textContent = works;
    document.querySelector("#stat-resources-v12").textContent = resources.length;

    const featured = document.querySelector("#featured-resources");
    if (featured) {
      featured.innerHTML = resources.slice(0, 3).map(resource => {
        const creator = creators.find(item => item.id === resource.creatorId);
        const href = VML.resourceHref(resource);
        const format = /^https:\/\//i.test(String(resource.embedUrl || "").trim())
          ? "Experiencia interactiva"
          : "Laboratorio guiado";
        return `<div class="col-lg-4"><article class="story-card d-flex flex-column">
          <span class="tag">${VML.safe(resource.title || "Recurso educativo")}</span>
          <h3 class="h3 mt-3">${VML.safe(creator?.name || resource.creator || "Creadora")}</h3>
          <p>${VML.safe(resource.objective || "Experiencia educativa vinculada con el patrimonio cultural femenino lojano.")}</p>
          <div class="small text-secondary mb-3"><strong>${format}</strong>${resource.level ? ` · ${VML.safe(resource.level)}` : ""}</div>
          <a href="${href}" class="btn btn-outline-brand rounded-pill mt-auto align-self-start">Abrir experiencia</a>
        </article></div>`;
      }).join("") || '<div class="col-12"><div class="alert alert-light">No hay recursos educativos publicados en este momento. Al marcar un recurso como publicable en la Base Maestra, aparecerá aquí automáticamente.</div></div>';
    }

    const aprende = document.querySelector("#aprende");
    if (questions.length && aprende && !document.querySelector("#interactua")) {
      const section = document.createElement("section");
      section.id = "interactua";
      section.className = "chapter";
      section.innerHTML = `
        <div class="container-xxl">
          <div class="row g-5 align-items-start">
            <div class="col-lg-3"><div class="chapter-no">✓</div><div class="eyebrow mt-3">Comprueba</div></div>
            <div class="col-lg-9">
              <h2 class="chapter-title">Comprueba lo que descubriste.</h2>
              <p class="section-intro mt-4">Una actividad autocorregible ofrece retroalimentación inmediata y conduce a la ficha que sustenta la respuesta.</p>
              <div id="home-quiz" class="mt-4"></div>
            </div>
          </div>
        </div>`;
      aprende.parentNode.insertBefore(section, aprende.nextSibling);

      VML.mountQuiz("#home-quiz", questions, {
        count: 1,
        eyebrow: "Pregunta aleatoria",
        title: "¿Cuánto conoces a las creadoras lojanas?"
      });
    }
  })
  .catch(error => {
    console.error(error);
    document.querySelector("#portal-live-status").textContent =
      "No fue posible consultar los indicadores dinámicos.";
  });
