export class HomeView {
  constructor({ api, router }) {
    this.api = api;
    this.router = router;
    this.abortController = null;
  }

  mount(container) {
    this.abortController = new AbortController();
    this.container = container;
    container.innerHTML = "";

    const hero = document.createElement("section");
    hero.className = "hero";
    const h1 = document.createElement("h1");
    h1.textContent = "Explora la colección del Met";
    const heroDescription = document.createElement("p");
    heroDescription.textContent =
      "El Metropolitan Museum of Art de Nueva York alberga una de las colecciones de arte más importantes del mundo. Descubre sus más de 470,000 obras a través de MetHub.";
    hero.appendChild(h1);
    hero.appendChild(heroDescription);
    container.appendChild(hero);

    const statsSection = document.createElement("section");
    statsSection.className = "stats-section";
    const statsTitle = document.createElement("h2");
    statsTitle.textContent = "El Museo en Números";
    statsSection.appendChild(statsTitle);
    const statsLoading = document.createElement("loading-state");
    statsLoading.setAttribute("message", "Calculando estadísticas\u2026");
    statsSection.appendChild(statsLoading);
    container.appendChild(statsSection);

    const gallerySection = document.createElement("section");
    gallerySection.className = "gallery-section";
    const galleryTitle = document.createElement("h2");
    galleryTitle.textContent = "Obras Destacadas";
    gallerySection.appendChild(galleryTitle);
    const galleryLoading = document.createElement("loading-state");
    galleryLoading.setAttribute("message", "Cargando obras destacadas\u2026");
    gallerySection.appendChild(galleryLoading);
    container.appendChild(gallerySection);

    this.#fetchData();
  }

  async #fetchData() {
    const statsSection = this.container.querySelector(".stats-section");
    const gallerySection = this.container.querySelector(".gallery-section");

    const [deptResult, searchResult] = await Promise.allSettled([
      this.api.getDepartments(),
      this.api.searchObjects({ isHighlight: true, hasImages: true }),
    ]);

    const statsLoading = statsSection.querySelector("loading-state");
    if (statsLoading) statsLoading.remove();

    const statsGrid = document.createElement("div");
    statsGrid.className = "stats-grid";

    // Si alguna de las peticiones falla, se muestra un "not found"
    const totalDeptos =
      deptResult.status === "fulfilled" ? deptResult.value.length : "Not found";
    const totalHighlights =
      searchResult.status === "fulfilled"
        ? searchResult.value.total
        : "Not found";

    const statsData = [
      { value: totalDeptos, label: "Departamentos" },
      { value: totalHighlights, label: "Obras Destacadas con Imagen" },
    ];

    statsData.forEach(({ value, label }) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      const num = document.createElement("span");
      num.className = "stat-number";
      num.textContent = value;
      const desc = document.createElement("span");
      desc.className = "stat-label";
      desc.textContent = label;
      card.appendChild(num);
      card.appendChild(desc);
      statsGrid.appendChild(card);
    });

    statsSection.appendChild(statsGrid);

    const galleryLoading = gallerySection.querySelector("loading-state");
    if (galleryLoading) galleryLoading.remove();

    if (
      searchResult.status !== "fulfilled" ||
      searchResult.value.objectIDs.length === 0
    ) {
      const error = document.createElement("error-state");
      error.setAttribute(
        "message",
        "No se pudieron cargar las obras destacadas"
      );
      error.setAttribute("retry", "");
      error.onRetry(() => {
        const old = gallerySection.querySelector("error-state");
        if (old) old.remove();
        const loader = document.createElement("loading-state");
        loader.setAttribute("message", "Cargando obras destacadas\u2026");
        gallerySection.appendChild(loader);
        this.#fetchData();
      });
      gallerySection.appendChild(error);
      return;
    }

    const ids = searchResult.value.objectIDs.slice(0, 12);
    const objects = await this.api.getObjectsByIds(ids);

    if (objects.length === 0) {
      const error = document.createElement("error-state");
      error.setAttribute(
        "message",
        "No se pudieron cargar las obras destacadas"
      );
      error.setAttribute("retry", "");
      error.onRetry(() => {
        const old = gallerySection.querySelector("error-state");
        if (old) old.remove();
        const loader = document.createElement("loading-state");
        loader.setAttribute("message", "Cargando obras destacadas\u2026");
        gallerySection.appendChild(loader);
        this.#fetchData();
      });
      gallerySection.appendChild(error);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "card-grid";
    objects.forEach((obj) => {
      if (!obj) return;
      const card = document.createElement("art-card");
      card.data = obj;
      grid.appendChild(card);
    });
    gallerySection.appendChild(grid);
  }

  unmount() {
    this.abortController?.abort();
  }
}
