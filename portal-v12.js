VML.load()
  .then(data => {
    const creators = data.creators || [];
    const resources = data.resources || [];
    const works = creators.reduce((total, creator) => total + (creator.works || []).length, 0);

    document.querySelector("#portal-live-status").textContent =
      `${VML.modeLabel()} · ${creators.length} creadoras · ${works} obras · ${resources.length} recursos educativos`;

    document.querySelector("#stat-creators-v12").textContent = creators.length;
    document.querySelector("#stat-works-v12").textContent = works;
    document.querySelector("#stat-resources-v12").textContent = resources.length;
  })
  .catch(error => {
    console.error(error);
    document.querySelector("#portal-live-status").textContent =
      "No fue posible consultar los indicadores dinámicos.";
  });
