const CURRENT_YEAR = 2026;

export class ExploreView {
  #searchTimer;
  constructor({ api, router }) {
    this.api = api;
    this.router = router;
    this.abortController = null;

    this.filters = {
      q: "",
      departmentId: "",
      dateBegin: -5000,
      dateEnd: CURRENT_YEAR,
      isHighlight: false,
      hasImages: false,
    };

    this.currentPage = 1;
    this.pageSize = 12;
    this.allIds = [];
    this.total = 0;
    this.searching = false;
  }

  mount(container) {
    this.abortController = new AbortController();
    this.container = container;
    container.innerHTML = "";

    const layout = document.createElement("div");
    layout.className = "explore-layout";

    const filterPanel = document.createElement("aside");
    filterPanel.className = "filter-panel";
    this.#buildFilters(filterPanel);
    layout.appendChild(filterPanel);

    const resultsSection = document.createElement("section");
    resultsSection.className = "results-section";

    const aggregatesPanel = document.createElement("div");
    aggregatesPanel.className = "aggregates-panel";
    resultsSection.appendChild(aggregatesPanel);

    const galleryTitle = document.createElement("h2");
    galleryTitle.textContent = "Resultados";
    resultsSection.appendChild(galleryTitle);

    const galleryContainer = document.createElement("div");
    galleryContainer.className = "explore-gallery";
    resultsSection.appendChild(galleryContainer);

    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    resultsSection.appendChild(paginationContainer);

    layout.appendChild(resultsSection);
    container.appendChild(layout);

    this.#loadDepartments().then(() => {
      if (this.filters.departmentId) {
        this.deptSelect.value = this.filters.departmentId;
      }
      this.#search();
    });
  }

  #buildFilters(panel) {
    const title = document.createElement("h2");
    title.textContent = "Filtros";
    panel.appendChild(title);

    const clearBtn = document.createElement("button");
    clearBtn.className = "clear-filters-btn";
    clearBtn.textContent = "Limpiar filtros";
    clearBtn.addEventListener("click", () => this.#clearFilters());
    panel.appendChild(clearBtn);

    const searchGroup = document.createElement("div");
    searchGroup.className = "filter-group";
    const searchLabel = document.createElement("label");
    searchLabel.textContent = "Buscar";
    searchGroup.appendChild(searchLabel);
    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.className = "filter-input";
    this.searchInput.placeholder = "Por nombre, artista, tema\u2026";
    this.searchInput.addEventListener("input", () => {
      if (this.#searchTimer) clearTimeout(this.#searchTimer);
      this.#searchTimer = setTimeout(() => {
        this.filters.q = this.searchInput.value;
        this.currentPage = 1;
        this.#search();
      }, 400);
    });
    searchGroup.appendChild(this.searchInput);
    panel.appendChild(searchGroup);

    const deptGroup = document.createElement("div");
    deptGroup.className = "filter-group";
    const deptLabel = document.createElement("label");
    deptLabel.textContent = "Departamento";
    deptGroup.appendChild(deptLabel);
    this.deptSelect = document.createElement("select");
    this.deptSelect.className = "filter-select";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "Todos los departamentos";
    this.deptSelect.appendChild(defaultOpt);
    this.deptSelect.addEventListener("change", () => {
      this.filters.departmentId = this.deptSelect.value;
      this.currentPage = 1;
      this.#search();
    });
    deptGroup.appendChild(this.deptSelect);
    panel.appendChild(deptGroup);

    const yearGroup = document.createElement("div");
    yearGroup.className = "filter-group";
    const yearLabel = document.createElement("label");
    yearLabel.textContent = "Rango de a\u00f1os";
    yearGroup.appendChild(yearLabel);

    const yearValues = document.createElement("div");
    yearValues.className = "year-values";

    this.yearMinLabel = document.createElement("span");
    this.yearMinLabel.className = "year-value";
    this.yearMinLabel.textContent = "-5000";
    yearValues.appendChild(this.yearMinLabel);

    this.yearMaxLabel = document.createElement("span");
    this.yearMaxLabel.className = "year-value";
    this.yearMaxLabel.textContent = "2026";
    yearValues.appendChild(this.yearMaxLabel);

    yearGroup.appendChild(yearValues);

    const sliderTrack = document.createElement("div");
    sliderTrack.className = "slider-track";

    this.yearMinInput = document.createElement("input");
    this.yearMinInput.type = "range";
    this.yearMinInput.className = "year-slider year-slider-min";
    this.yearMinInput.min = -5000;
    this.yearMinInput.max = CURRENT_YEAR;
    this.yearMinInput.value = -5000;
    this.yearMinInput.addEventListener("input", () => {
      const val = parseInt(this.yearMinInput.value);
      if (val > parseInt(this.yearMaxInput.value)) {
        this.yearMinInput.value = this.yearMaxInput.value;
      }
      this.yearMinLabel.textContent = this.yearMinInput.value;
      this.filters.dateBegin = parseInt(this.yearMinInput.value);
      this.currentPage = 1;
      this.#search();
    });

    this.yearMaxInput = document.createElement("input");
    this.yearMaxInput.type = "range";
    this.yearMaxInput.className = "year-slider year-slider-max";
    this.yearMaxInput.min = -5000;
    this.yearMaxInput.max = CURRENT_YEAR;
    this.yearMaxInput.value = CURRENT_YEAR;
    this.yearMaxInput.addEventListener("input", () => {
      const val = parseInt(this.yearMaxInput.value);
      if (val < parseInt(this.yearMinInput.value)) {
        this.yearMaxInput.value = this.yearMinInput.value;
      }
      this.yearMaxLabel.textContent = this.yearMaxInput.value;
      this.filters.dateEnd = parseInt(this.yearMaxInput.value);
      this.currentPage = 1;
      this.#search();
    });

    sliderTrack.appendChild(this.yearMinInput);
    sliderTrack.appendChild(this.yearMaxInput);
    yearGroup.appendChild(sliderTrack);
    panel.appendChild(yearGroup);

    const hlGroup = document.createElement("div");
    hlGroup.className = "filter-group filter-checkbox";
    this.hlCheckbox = document.createElement("input");
    this.hlCheckbox.type = "checkbox";
    this.hlCheckbox.id = "filter-highlight";
    this.hlCheckbox.addEventListener("change", () => {
      this.filters.isHighlight = this.hlCheckbox.checked;
      this.currentPage = 1;
      this.#search();
    });
    const hlLabel = document.createElement("label");
    hlLabel.htmlFor = "filter-highlight";
    hlLabel.textContent = "Solo obras destacadas";
    hlGroup.appendChild(this.hlCheckbox);
    hlGroup.appendChild(hlLabel);
    panel.appendChild(hlGroup);

    const imgGroup = document.createElement("div");
    imgGroup.className = "filter-group filter-checkbox";
    this.imgCheckbox = document.createElement("input");
    this.imgCheckbox.type = "checkbox";
    this.imgCheckbox.id = "filter-hasimage";
    this.imgCheckbox.addEventListener("change", () => {
      this.filters.hasImages = this.imgCheckbox.checked;
      this.currentPage = 1;
      this.#search();
    });
    const imgLabel = document.createElement("label");
    imgLabel.htmlFor = "filter-hasimage";
    imgLabel.textContent = "Solo con imagen";
    imgGroup.appendChild(this.imgCheckbox);
    imgGroup.appendChild(imgLabel);
    panel.appendChild(imgGroup);
  }

  #buildAggregates(objects) {
    const panel = this.container.querySelector(".aggregates-panel");
    panel.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Agregados en Vivo";
    panel.appendChild(title);

    const total = this.total;
    const loaded = objects.length;

    let dominantDept = "\u2014";
    let dominantCentury = "\u2014";
    let dominantCulture = "\u2014";

    if (objects.length > 0) {
      const deptCounts = {};
      const centuryCounts = {};
      const cultureCounts = {};

      objects.forEach((o) => {
        if (o.department)
          deptCounts[o.department] = (deptCounts[o.department] || 0) + 1;

        const year = o.objectBeginDate || o.objectEndDate;
        if (year) {
          const c = year > 0 ? Math.ceil(year / 100) : Math.floor(year / 100);
          const key = c > 0 ? `${c}\u00ba` : `${Math.abs(c) + 1}\u00ba AC`;
          centuryCounts[key] = (centuryCounts[key] || 0) + 1;
        }

        if (o.culture)
          cultureCounts[o.culture] = (cultureCounts[o.culture] || 0) + 1;
      });

      const sortByFreq = (obj) =>
        Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || "\u2014";

      dominantDept = sortByFreq(deptCounts);
      dominantCentury = sortByFreq(centuryCounts);
      dominantCulture = sortByFreq(cultureCounts);
    }

    const items = [
      { label: "Total de resultados", value: total },
      { label: "Cargados", value: loaded },
      { label: "Departamento dominante", value: dominantDept },
      { label: "Siglo m\u00e1s frecuente", value: dominantCentury },
      { label: "Cultura m\u00e1s frecuente", value: dominantCulture },
    ];

    items.forEach(({ label, value }) => {
      const row = document.createElement("div");
      row.className = "aggregate-row";
      const lbl = document.createElement("span");
      lbl.className = "aggregate-label";
      lbl.textContent = label;
      const val = document.createElement("span");
      val.className = "aggregate-value";
      val.textContent = value;
      row.appendChild(lbl);
      row.appendChild(val);
      panel.appendChild(row);
    });

    const note = document.createElement("p");
    note.className = "aggregate-note";
    note.textContent =
      "Agregados calculados sobre los visibles. Total se refiere al search completo.";
    panel.appendChild(note);
  }

  async #loadDepartments() {
    try {
      const departments = await this.api.getDepartments();
      departments.forEach((dept) => {
        const opt = document.createElement("option");
        opt.value = dept.departmentId;
        opt.textContent = dept.displayName;
        this.deptSelect.appendChild(opt);
      });
    } catch (e) {
      // silently fail, the select just stays with "Todos los departamentos"
    }
  }

  async #search() {
    if (this.searching) return;
    this.searching = true;

    const gallery = this.container.querySelector(".explore-gallery");
    gallery.innerHTML = "";
    const loading = document.createElement("loading-state");
    loading.setAttribute("message", "Buscando obras\u2026");
    gallery.appendChild(loading);

    try {
      const result = await this.api.searchObjects({
        q: this.filters.q || "*",
        departmentId: this.filters.departmentId || null,
        isHighlight: this.filters.isHighlight,
        hasImages: this.filters.hasImages,
        dateBegin: this.filters.dateBegin,
        dateEnd: this.filters.dateEnd,
      });

      this.allIds = result.objectIDs;
      this.total = result.total;
      this.#renderPage();
    } catch (err) {
      gallery.innerHTML = "";
      const errorEl = document.createElement("error-state");
      errorEl.setAttribute("message", "Error al buscar obras.");
      errorEl.setAttribute("retry", "");
      errorEl.onRetry(() => this.#search());
      gallery.appendChild(errorEl);
    } finally {
      this.searching = false;
    }
  }

  #renderPage() {
    const gallery = this.container.querySelector(".explore-gallery");
    gallery.innerHTML = "";

    const pagination = this.container.querySelector(".pagination");
    pagination.innerHTML = "";

    if (this.total === 0 || this.allIds.length === 0) {
      gallery.innerHTML = "";
      const msg = document.createElement("p");
      msg.className = "no-results";
      msg.textContent = "No se encontraron obras con los filtros aplicados.";
      gallery.appendChild(msg);
      this.#buildAggregates([]);
      return;
    }

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    const pageIds = this.allIds.slice(startIdx, endIdx);

    if (pageIds.length === 0) {
      this.currentPage = 1;
      this.#renderPage();
      return;
    }

    const loading = document.createElement("loading-state");
    loading.setAttribute("message", "Cargando obras\u2026");
    gallery.appendChild(loading);

    this.#resolveObjects(pageIds, gallery, pagination);
  }

  async #resolveObjects(ids, gallery, pagination) {
    let objects;
    try {
      objects = await this.api.getObjectsByIds(ids);
    } catch (e) {
      objects = [];
    }

    gallery.innerHTML = "";

    if (objects.length === 0) {
      const msg = document.createElement("p");
      msg.className = "no-results";
      msg.textContent = "No se pudieron cargar los resultados.";
      gallery.appendChild(msg);
      this.#buildAggregates([]);
      return;
    }

    const totalPages = Math.ceil(this.total / this.pageSize);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    const failedCount = ids.length - objects.length;
    const note = document.createElement("p");
    note.className = "load-note";

    objects.forEach((obj) => {
      if (!obj) return;
      const card = document.createElement("art-card");
      card.data = obj;
      grid.appendChild(card);
    });

    gallery.appendChild(grid);

    if (failedCount > 0) {
      note.textContent = `${failedCount} obra${failedCount > 1 ? "s" : ""} no se pudo${failedCount > 1 ? "ieron" : ""} cargar.`;
      gallery.appendChild(note);
    }

    this.#buildAggregates(objects);
    this.#buildPagination(pagination, this.currentPage, totalPages);
  }

  #buildPagination(container, current, total) {
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

    container.appendChild(prevBtn);
    container.appendChild(info);
    container.appendChild(nextBtn);
  }

  #clearFilters() {
    this.filters = {
      q: "",
      departmentId: "",
      dateBegin: -5000,
      dateEnd: CURRENT_YEAR,
      isHighlight: false,
      hasImages: false,
    };

    this.searchInput.value = "";
    this.deptSelect.value = "";
    this.yearMinInput.value = -5000;
    this.yearMaxInput.value = CURRENT_YEAR;
    this.yearMinLabel.textContent = "-5000";
    this.yearMaxLabel.textContent = "2026";
    this.hlCheckbox.checked = false;
    this.imgCheckbox.checked = false;

    this.currentPage = 1;
    this.#search();
  }

  unmount() {
    if (this.#searchTimer) clearTimeout(this.#searchTimer);
    this.abortController?.abort();
  }
}
