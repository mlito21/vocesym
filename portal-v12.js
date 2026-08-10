VML.load()
  .then(data => {
    const creators = data.creators || [];
    const resources = data.resources || [];
    const questions = data.questions || [];
    const works = creators.reduce((total, creator) => total + (creator.works || []).length, 0);

    document.querySelector("#portal-live-status").textContent =
      `${VML.modeLabel()} · ${creators.length} creadoras · ${works} obras · ${resources.length} recursos educativos`;

    document.querySelector("#stat-creators-v12").textContent = creators.length;
    document.querySelector("#stat-works-v12").textContent = works;
    document.querySelector("#stat-resources-v12").textContent = resources.length;

    const aprende = document.querySelector("#aprende");
    if (aprende && !document.querySelector("#interactua")) {
      const section = document.createElement("section");
      section.id = "interactua";
      section.className = "chapter";
      section.innerHTML = `
        <div class="container-xxl">
          <div class="row g-5 align-items-start">
            <div class="col-lg-3"><div class="chapter-no">04</div><div class="eyebrow mt-3">Interactúa</div></div>
            <div class="col-lg-9">
              <h2 class="chapter-title">Descubre jugando.</h2>
              <p class="section-intro mt-4">Una pregunta cambia en cada visita y te invita a seguir explorando creadoras, obras y conexiones del archivo.</p>
              <div id="home-quiz" class="mt-4"></div>
            </div>
          </div>
        </div>`;
      aprende.parentNode.insertBefore(section, aprende);

      const aprendeNo = aprende.querySelector(".chapter-no");
      const trazabilidadNo = document.querySelector("#trazabilidad .chapter-no");
      if (aprendeNo) aprendeNo.textContent = "05";
      if (trazabilidadNo) trazabilidadNo.textContent = "06";

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
