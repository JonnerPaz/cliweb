export class MatchesView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Partidos</h1>
        <button class="btn btn-primary" id="create-match">+ Nuevo Partido</button>
      </div>
      <loading-state message="Cargando partidos..."></loading-state>
    `;
    this.render();
  }

  async render() {
    const { getActiveLeagueId, getByIndex } = await import("../db.js");
    const leagueId = getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const matches = await getByIndex("matches", "leagueId", Number(leagueId));

    const loader = this.container.querySelector("loading-state");
    if (loader) loader.remove();

    if (matches.length === 0) {
      this.container.innerHTML += `<div class="empty-state"><p>No hay partidos en esta liga.</p></div>`;
      return;
    }

    const list = document.createElement("div");
    list.className = "card-grid";
    list.innerHTML = matches
      .map(
        (m) => `
      <div class="card" data-id="${m.id}">
        <p>${m.homeTeamId} vs ${m.awayTeamId}</p>
        <p>${m.date || "Sin fecha"} — ${m.status || "Programado"}</p>
      </div>
    `,
      )
      .join("");

    list.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => this.router.navigateTo(`/match/${card.dataset.id}`));
    });

    this.container.appendChild(list);
  }

  unmount() {
    this.container = null;
  }
}

import { LeaguesView } from "./views/leagues.js";
import { TeamsView } from "./views/teams.js";
import { TeamDetailView } from "./views/team-detail.js";
import { PlayersView } from "./views/players.js";
import { PlayerDetailView } from "./views/player-detail.js";
import { MatchesView } from "./views/matches.js";
import { MatchDetailView } from "./views/match-detail.js";
import { StatsView } from "./views/stats.js";

    { pattern: "/leagues", handler: () => new LeaguesView({ router }) },
    { pattern: "/teams", handler: () => new TeamsView({ router }) },
    { pattern: "/team/:id", handler: (p) => new TeamDetailView({ router, id: p.id }) },
    { pattern: "/players", handler: () => new PlayersView({ router }) },
    { pattern: "/player/:id", handler: (p) => new PlayerDetailView({ router, id: p.id }) },
    { pattern: "/matches", handler: () => new MatchesView({ router }) },
    { pattern: "/match/:id", handler: (p) => new MatchDetailView({ router, id: p.id }) },
    { pattern: "/stats", handler: () => new StatsView({ router }) },
