import '../components/dept-card.js';

export class DepartmentsView {
  constructor({ api, router }) {
    this.api = api;
    this.router = router;
  }

  mount(container) {
    this.ac = new AbortController();
    this.container = container;
    this.container.innerHTML = "";

    const viewWrapper = document.createElement('div');
    viewWrapper.className = 'view-wrapper';
    this.container.appendChild(viewWrapper);

    const loading = document.createElement("loading-state");
    loading.setAttribute("message", "Cargando departamentos\u2026");
    viewWrapper.appendChild(loading);

    this._loadData(viewWrapper);
  }

  async _loadData(container) {
    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.textContent = "\u2190 Volver";
    backBtn.addEventListener("click", () => window.history.back());
    
    const grid = document.createElement('div');
    grid.className = 'card-grid';

    try {
      const departments = await this.api.getDepartments({ signal: this.ac.signal });
      
      container.innerHTML = "";
      container.appendChild(backBtn);
      container.appendChild(grid);

      departments.forEach((dept) => {
        const card = document.createElement('dept-card');
        card.data = dept;
        grid.appendChild(card);
      });
    } catch (e) {
      if (e.name === 'AbortError') return; 
      console.error("Error al cargar departamentos:", e);
      container.innerHTML = `<p>Error al cargar los departamentos. Intenta más tarde.</p>`;
    }
  }

  unmount() {
    this.ac.abort();
  }
}