import '../components/dept-card.js';

export class DepartmentsView {
  constructor({ api, router }) {
    this.api = api;
    this.router = router;
  }

  async mount(container) {
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    container.appendChild(grid); // Agregamos el grid al contenedor principal

    try {
      const departments = await this.api.getDepartments();
      departments.forEach((dept) => {
        // Usamos el Web Component creado
        const card = document.createElement('dept-card');
        card.data = dept; 
        
        grid.appendChild(card);
      });
    } catch (e) {
      console.error("Error al cargar departamentos:", e);
      container.innerHTML = `<p>Error al cargar los departamentos. Intenta más tarde.</p>`;
    }
  }

  unmount() {
  }
}