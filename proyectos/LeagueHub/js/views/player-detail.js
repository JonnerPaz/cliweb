export class PlayerDetailView {
  constructor({ router, id }) {
    this.router = router;
    this.id = id;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <button class="btn btn-secondary" id="back-btn">← Volver</button>
      <loading-state message="Cargando jugador..."></loading-state>
    `;
    container.querySelector('#back-btn').addEventListener('click', () => this.router.navigateTo('/players'));
    this.render();
  }

  async render() {
    const { getById } = await import('../db.js');
    const player = await getById('players', Number(this.id));

    if (!player) {
      this.container.innerHTML = `<div class="empty-state"><p>Jugador no encontrado.</p></div>`;
      return;
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();

    const section = document.createElement('section');
    section.innerHTML = `
      <div class="page-header">
        <h1>${player.name}</h1>
      </div>
      <p>Detalle del jugador — implementación pendiente.</p>
    `;
    this.container.appendChild(section);
  }

  unmount() {
    this.container = null;
  }
}
