VML.load()
  .then(data => {
    const creators = data.creators || [];
    const resources = data.resources || [];
    const questions = data.questions || [];
    const works = creators.reduce((total, creator) => total + (creator.works || []).length, 0);

    document.querySelector("#portal-live-status").textContent =
      VML.isPublic()
        ? `${VML.modeLabel()} · ${creators.length} creadoras registradas · ${resources.length} laboratorios educativos`
        : `${VML.modeLabel()} · ${creators.length} creadoras · ${works} obras · ${resources.length} recursos educativos`;
    document.querySelector("#portal-live-status").classList.add("is-ready");

    document.querySelector("#stat-creators-v12").textContent = creators.length;
    document.querySelector("#stat-works-v12").textContent = VML.isPublic() ? resources.length : works;
    document.querySelector("#stat-resources-v12").textContent = resources.length;

    const aprende = document.querySelector("#aprende");
    if (aprende && !document.querySelector("#interactua")) {
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
