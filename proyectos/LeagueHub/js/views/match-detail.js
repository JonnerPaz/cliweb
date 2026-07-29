import db from '../db.js';

export class MatchDetailView {
  constructor({ router, id }) {
    this.router = router;
    this.id = id;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <button class="btn btn-secondary" id="back-btn">← Volver</button>
      <loading-state message="Cargando partido..."></loading-state>
    `;
    container.querySelector('#back-btn').addEventListener('click', () => this.router.navigateTo('/matches'));
    this.render();
  }

  async render() {
    const match = await db.getById('matches', Number(this.id));

    if (!match) {
      this.container.innerHTML = `<div class="empty-state"><p>Partido no encontrado.</p></div>`;
      return;
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();

    const section = document.createElement('section');
    section.innerHTML = `
      <div class="page-header">
        <h1>Partido #${this.id}</h1>
      </div>
      <p>Detalle del partido — implementación pendiente.</p>
    `;
    this.container.appendChild(section);
  }

  unmount() {
    this.container = null;
  }
}
