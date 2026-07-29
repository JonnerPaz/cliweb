import db from "../db.js";

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
    const leagueId = db.getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const teams = await db.getByIndex("teams", "leagueId", Number(leagueId));
    const teamIds = teams.map((t) => t.id);
    const allPlayers = [];
    const teamMap = {};
    teams.forEach((t) => {
      teamMap[t.id] = t;
    });

    for (const teamId of teamIds) {
      const players = await db.getByIndex("players", "teamId", teamId);
      allPlayers.push(...players);
    }

    const loader = this.container.querySelector("loading-state");
    if (loader) loader.remove();

    if (allPlayers.length === 0) {
      this.container.innerHTML += `<div class="empty-state"><p>No hay jugadores en esta liga.</p></div>`;
      return;
    }

    const grid = document.createElement("div");
    grid.className = "card-grid";

    for (const p of allPlayers) {
      const team = teamMap[p.teamId] || {};
      const card = document.createElement("player-card");
      card.data = {
        ...p,
        teamName: team.name,
        teamEscudo: team.escudo,
        teamColor: team.colorPrincipal,
        teamColorSecundario: team.colorSecundario,
      };
      card.addEventListener("click", () => this.router.navigateTo(`/player/${p.id}`));
      grid.appendChild(card);
    }

    this.container.appendChild(grid);
  }

  unmount() {
    this.container = null;
  }
}
