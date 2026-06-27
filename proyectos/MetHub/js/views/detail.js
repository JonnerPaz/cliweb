export class DetailView {
  constructor({ api, router, id }) {
    this.api = api;
    this.router = router;
    this.id = id;
    this.ac = null;
  }

  mount(container) {
    this.ac = new AbortController();
    this.container = container;
    container.innerHTML = "";

    const loading = document.createElement("loading-state");
    loading.setAttribute("message", "Cargando obra\u2026");
    container.appendChild(loading);

    this._loadData();
  }

  async _loadData() {
    const container = this.container;

    try {
      const data = await this.api.getObjectById(this.id);

      if (data === null) {
        this._showError("La obra solicitada no existe.", false);
        return;
      }

      this._buildView(data);
    } catch (err) {
      this._showError("Ocurri\u00f3 un error al cargar la obra.", true);
    }
  }

  _showError(message, retry) {
    const container = this.container;
    container.innerHTML = "";
    const err = document.createElement("error-state");
    err.setAttribute("message", message);
    if (retry) {
      err.setAttribute("retry", "");
      err.onRetry(() => {
        container.innerHTML = "";
        const loading = document.createElement("loading-state");
        loading.setAttribute("message", "Cargando obra\u2026");
        container.appendChild(loading);
        this._loadData();
      });
    }
    container.appendChild(err);
  }

  _buildView(data) {
    const container = this.container;
    container.innerHTML = "";

    const view = document.createElement("div");
    view.className = "detail-view";

    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.textContent = "\u2190 Volver";
    backBtn.addEventListener("click", () => window.history.back());
    view.appendChild(backBtn);

    const content = document.createElement("div");
    content.className = "detail-content";

    const imgCol = document.createElement("div");
    imgCol.className = "detail-image-col";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "primary-image-wrapper";

    const img = data.primaryImage || data.primaryImageSmall;
    if (img) {
      const imgEl = document.createElement("img");
      imgEl.src = img;
      imgEl.alt = data.title || "Obra de arte";
      imgEl.className = "primary-image";
      imgEl.addEventListener("error", () => {
        imgEl.style.display = "none";
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "Sin imagen disponible";
        imgWrapper.appendChild(placeholder);
      });
      imgWrapper.appendChild(imgEl);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = "Sin imagen disponible";
      imgWrapper.appendChild(placeholder);
    }

    imgCol.appendChild(imgWrapper);

    if (
      Array.isArray(data.additionalImages) &&
      data.additionalImages.length > 0
    ) {
      const addGallery = document.createElement("div");
      addGallery.className = "additional-images";
      const addTitle = document.createElement("h3");
      addTitle.textContent = "Im\u00e1genes adicionales";
      addGallery.appendChild(addTitle);
      const addGrid = document.createElement("div");
      addGrid.className = "additional-grid";

      const maxAdd = Math.min(data.additionalImages.length, 8);
      for (let i = 0; i < maxAdd; i++) {
        const thumb = document.createElement("img");
        thumb.src = data.additionalImages[i];
        thumb.alt = `${data.title || "Obra"} - imagen ${i + 1}`;
        thumb.className = "additional-thumb";
        thumb.addEventListener("click", () => {
          const mainImg = imgWrapper.querySelector("img");
          if (mainImg) {
            mainImg.src = data.additionalImages[i];
          }
        });
        addGrid.appendChild(thumb);
      }
      addGallery.appendChild(addGrid);
      imgCol.appendChild(addGallery);
    }

    content.appendChild(imgCol);

    const infoCol = document.createElement("div");
    infoCol.className = "detail-info-col";

    const title = document.createElement("h1");
    title.className = "detail-title";
    title.textContent = data.title || "T\u00edtulo desconocido";
    infoCol.appendChild(title);

    if (data.artistDisplayName) {
      const artistLink = document.createElement("a");
      artistLink.className = "artist-link";
      artistLink.textContent = data.artistDisplayName;
      artistLink.href = `#artist/${encodeURIComponent(data.artistDisplayName)}`;
      infoCol.appendChild(artistLink);
    }

    if (data.artistDisplayBio) {
      const bio = document.createElement("p");
      bio.className = "artist-bio";
      bio.textContent = data.artistDisplayBio;
      infoCol.appendChild(bio);
    }

    const fields = [
      { label: "Fecha", value: data.objectDate },
      { label: "T\u00e9cnica", value: data.medium },
      { label: "Dimensiones", value: data.dimensions },
      { label: "Departamento", value: data.department },
      { label: "Cultura", value: data.culture },
      { label: "Periodo", value: data.period },
      { label: "Clasificaci\u00f3n", value: data.classification },
      { label: "Adquisici\u00f3n", value: data.creditLine },
    ];

    const hasFields = fields.some((f) => f.value);
    if (hasFields) {
      const table = document.createElement("dl");
      table.className = "info-table";
      fields.forEach(({ label, value }) => {
        if (!value) return;
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        table.appendChild(dt);
        table.appendChild(dd);
      });
      infoCol.appendChild(table);
    }

    if (Array.isArray(data.tags) && data.tags.length > 0) {
      const tagsSection = document.createElement("div");
      tagsSection.className = "tags-section";
      const tagsTitle = document.createElement("h3");
      tagsTitle.textContent = "Etiquetas";
      tagsSection.appendChild(tagsTitle);
      const tagsWrap = document.createElement("div");
      tagsWrap.className = "tags-wrap";
      const maxTags = Math.min(data.tags.length, 12);
      for (let i = 0; i < maxTags; i++) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = data.tags[i].term;
        tagsWrap.appendChild(tag);
      }
      tagsSection.appendChild(tagsWrap);
      infoCol.appendChild(tagsSection);
    }

    if (data.objectURL) {
      const extLink = document.createElement("a");
      extLink.className = "external-link";
      extLink.href = data.objectURL;
      extLink.target = "_blank";
      extLink.textContent = "Ver en el sitio del museo";
      infoCol.appendChild(extLink);
    }

    const actions = document.createElement("div");
    actions.className = "detail-actions";

    if (data.artistDisplayName) {
      const moreBtn = document.createElement("button");
      moreBtn.className = "action-btn";
      moreBtn.textContent = "Ver m\u00e1s obras del artista";
      moreBtn.addEventListener("click", () => {
        window.location.hash = `#artist/${encodeURIComponent(data.artistDisplayName)}`;
      });
      actions.appendChild(moreBtn);
    }

    const compareBtn = document.createElement("button");
    compareBtn.className = "action-btn action-btn-secondary";
    compareBtn.textContent = "Comparar";
    compareBtn.addEventListener("click", () => {
      window.location.hash = `#compare?preselect=${data.objectID}`;
    });
    actions.appendChild(compareBtn);

    infoCol.appendChild(actions);
    content.appendChild(infoCol);
    view.appendChild(content);
    container.appendChild(view);
  }

  unmount() {
    this.ac?.abort();
  }
}
