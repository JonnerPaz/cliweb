export class TeamsView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Equipos</h1>
        <button class="btn btn-primary" id="create-team">+ Nuevo Equipo</button>
      </div>
      <loading-state message="Cargando equipos..."></loading-state>
    `;
    this.render();
  }

  async render() {
    const { getActiveLeagueId, getByIndex } = await import('../db.js');
    const leagueId = getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa. Selecciona una desde Ligas.</p></div>`;
      return;
    }

    const teams = await getByIndex('teams', 'leagueId', Number(leagueId));
    const list = document.createElement('div');
    list.className = 'card-grid';

    if (teams.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>No hay equipos en esta liga.</p></div>`;
    } else {
      list.innerHTML = teams.map(t => `
        <div class="card" data-id="${t.id}">
          <h3>${t.name}</h3>
        </div>
      `).join('');

      list.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => this.router.navigateTo(`/team/${card.dataset.id}`));
      });
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();
    this.container.appendChild(list);
  }

  unmount() {
    this.container = null;
  }
}
