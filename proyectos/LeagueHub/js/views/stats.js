export class StatsView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Estadísticas</h1>
      </div>
      <loading-state message="Cargando estadísticas..."></loading-state>
    `;
    this.render();
  }

  async render() {
    const { getActiveLeagueId, getById } = await import('../db.js');
    const leagueId = getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const league = await getById('leagues', Number(leagueId));
    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();

    const section = document.createElement('section');
    section.innerHTML = `
      <p>Estadísticas de ${league?.name || 'la liga'} — implementación pendiente.</p>
    `;
    this.container.appendChild(section);
  }

  unmount() {
    this.container = null;
  }
}
