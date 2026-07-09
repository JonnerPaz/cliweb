import "../components/art-card.js";

export class ByArtistView {
  constructor({ api, router, name }) {
    this.api = api;
    this.router = router;
    this.artistName = decodeURIComponent(name);
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
      const { artworks, bio, total } = await this.api.getArtworksByArtist(
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

      const backBtn = document.createElement("button");
      backBtn.className = "back-btn";
      backBtn.textContent = "\u2190 Volver";
      backBtn.addEventListener("click", () => window.history.back());
      this.viewWrapper.appendChild(backBtn);

      const grid = document.createElement("div");
      grid.className = "card-grid";
      this.viewWrapper.appendChild(grid);

      artworks.forEach((art) => {
        const card = document.createElement("art-card");
        card.data = art;
        grid.appendChild(card);
      });
    } catch (e) {
      if (e.name === "AbortError") return;
      console.error("Error al cargar obras:", e);
      const errorMsg = document.createElement("p");
      errorMsg.textContent =
        "Ocurrió un error al cargar las obras. Intenta más tarde.";
      this.viewWrapper.appendChild(errorMsg);
    }
  }

  unmount() {
    this.abortController.abort();
  }
}
