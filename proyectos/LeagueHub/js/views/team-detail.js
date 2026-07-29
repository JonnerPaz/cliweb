import db from '../db.js';

export class TeamDetailView {
  constructor({ router, id }) {
    this.router = router;
    this.id = id;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <button class="btn btn-secondary" id="back-btn">← Volver</button>
      <loading-state message="Cargando equipo..."></loading-state>
    `;
    container.querySelector('#back-btn').addEventListener('click', () => this.router.navigateTo('/teams'));
    this.render();
  }

  async render() {
    const team = await db.getById('teams', Number(this.id));

    if (!team) {
      this.container.innerHTML = `<div class="empty-state"><p>Equipo no encontrado.</p></div>`;
      return;
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();

    const section = document.createElement('section');
    section.innerHTML = `
      <div class="page-header">
        <h1>${team.name}</h1>
      </div>
      <p>Detalle del equipo — implementación pendiente.</p>
    `;
    this.container.appendChild(section);
  }

  unmount() {
    this.container = null;
  }
}
