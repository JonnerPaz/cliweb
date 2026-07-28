export class PlayersView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Jugadores</h1>
        <button class="btn btn-primary" id="create-player">+ Nuevo Jugador</button>
      </div>
      <loading-state message="Cargando jugadores..."></loading-state>
    `;
    this.render();
  }

  async render() {
    const { getActiveLeagueId, getByIndex, getAll } = await import('../db.js');
    const leagueId = getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const teams = await getByIndex('teams', 'leagueId', Number(leagueId));
    const teamIds = teams.map(t => t.id);
    const allPlayers = [];

    for (const teamId of teamIds) {
      const players = await getByIndex('players', 'teamId', teamId);
      allPlayers.push(...players);
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();

    if (allPlayers.length === 0) {
      this.container.innerHTML += `<div class="empty-state"><p>No hay jugadores en esta liga.</p></div>`;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'card-grid';
    grid.innerHTML = allPlayers.map(p => `
      <div class="card" data-id="${p.id}">
        <h3>${p.name}</h3>
        <p>#${p.number} — ${p.position || ''}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => this.router.navigateTo(`/player/${card.dataset.id}`));
    });

    this.container.appendChild(grid);
  }

  unmount() {
    this.container = null;
  }
}
