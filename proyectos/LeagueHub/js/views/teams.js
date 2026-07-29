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
      for (const t of teams) {
        const players = await getByIndex('players', 'teamId', t.id);
        const card = document.createElement('team-card');
        card.data = { ...t, playerCount: players.length };
        card.addEventListener('click', () => this.router.navigateTo(`/team/${t.id}`));
        list.appendChild(card);
      }
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();
    this.container.appendChild(list);
  }

  unmount() {
    this.container = null;
  }
}
