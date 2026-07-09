import "../components/art-card.js";

export class ByArtistView {
  constructor({ api, router, name }) {
    this.api = api;
    this.router = router;
    this.artistName = decodeURIComponent(name);
    this.currentPage = 1;
    this.pageSize = 12;
    this.allIds = [];
    this.total = 0;
  }

  mount(container) {
    this.abortController = new AbortController();
    this.container = container;
    this.container.innerHTML = "";

    this.hero = document.createElement("section");
    this.hero.className = "artist-hero";
    const h1 = document.createElement("h1");
    h1.textContent = this.artistName;
    const bio = document.createElement("p");
    bio.className = "bio";
    this.hero.appendChild(h1);
    this.hero.appendChild(bio);
    this.container.appendChild(this.hero);

    this.viewWrapper = document.createElement("div");
    this.viewWrapper.className = "view-wrapper";
    this.container.appendChild(this.viewWrapper);

    const loading = document.createElement("loading-state");
    loading.setAttribute(
      "message",
      `Cargando obras de ${this.artistName}\u2026`
    );
    this.viewWrapper.appendChild(loading);

    this._loadData();
  }

  async _loadData() {
    try {
      const { bio, total, allIds } = await this.api.getArtworksByArtist(
        this.artistName
      );

      this.viewWrapper.innerHTML = "";

      if (total === 0) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = `No se encontraron obras para ${this.artistName}.`;
        this.viewWrapper.appendChild(errorMsg);
        return;
      }

      if (bio) this.hero.querySelector(".bio").textContent = bio;
      const totalInfo = document.createElement("p");
      totalInfo.className = "artist-total";
      totalInfo.textContent = `${total} obras encontradas`;
      this.hero.appendChild(totalInfo);

      const backBtn = document.createElement("button");
      backBtn.className = "back-btn";
      backBtn.textContent = "\u2190 Volver";
      backBtn.addEventListener("click", () => window.history.back());
      this.viewWrapper.appendChild(backBtn);

      this.allIds = allIds;
      this.total = total;
      this.currentPage = 1;
      this.#renderPage();
    } catch (e) {
      if (e.name === "AbortError") return;
      console.error("Error al cargar obras:", e);
      const errorMsg = document.createElement("error-state");
      errorMsg.setAttribute("message", "Ocurrio un error al cargar las obras.");
      errorMsg.setAttribute("retry", "");
      errorMsg.onRetry(() => {
        this.viewWrapper.innerHTML = "";
        const loading = document.createElement("loading-state");
        loading.setAttribute(
          "message",
          `Cargando obras de ${this.artistName}...`
        );
        this.viewWrapper.appendChild(loading);
        this._loadData();
      });
      this.viewWrapper.appendChild(errorMsg);
    }
  }

  #renderPage() {
    const oldGrid = this.viewWrapper.querySelector(".card-grid");
    const oldPagination = this.viewWrapper.querySelector(".pagination");
    if (oldGrid) oldGrid.remove();
    if (oldPagination) oldPagination.remove();

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    const pageIds = this.allIds.slice(startIdx, endIdx);

    if (pageIds.length === 0) {
      this.currentPage = 1;
      this.#renderPage();
      return;
    }

    const loading = document.createElement("loading-state");
    loading.setAttribute("message", "Cargando obras...");
    this.viewWrapper.appendChild(loading);

    this.api.getObjectsByIds(pageIds).then((objects) => {
      const existingLoading = this.viewWrapper.querySelector("loading-state");
      if (existingLoading) existingLoading.remove();

      const grid = document.createElement("div");
      grid.className = "card-grid";
      objects.forEach((obj) => {
        const card = document.createElement("art-card");
        card.data = obj;
        grid.appendChild(card);
      });
      this.viewWrapper.appendChild(grid);

      const totalPages = Math.ceil(this.total / this.pageSize);
      this.#buildPagination(this.currentPage, totalPages);
    });
  }

  #buildPagination(current, total) {
    const pagDiv = document.createElement("div");
    pagDiv.className = "pagination";

    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.textContent = "\u2190 Anterior";
    prevBtn.disabled = current <= 1;
    prevBtn.addEventListener("click", () => {
      if (current > 1) {
        this.currentPage--;
        this.#renderPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    const info = document.createElement("span");
    info.className = "page-info";
    info.textContent = `P\u00e1gina ${current} de ${total}`;

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.textContent = "Siguiente \u2192";
    nextBtn.disabled = current >= total;
    nextBtn.addEventListener("click", () => {
      if (current < total) {
        this.currentPage++;
        this.#renderPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    pagDiv.appendChild(prevBtn);
    pagDiv.appendChild(info);
    pagDiv.appendChild(nextBtn);
    this.viewWrapper.appendChild(pagDiv);
  }

  unmount() {
    this.abortController.abort();
  }
}
