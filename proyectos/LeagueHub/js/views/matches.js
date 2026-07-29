import db from '../db.js';

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
    const leagueId = db.getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const matches = await db.getByIndex("matches", "leagueId", Number(leagueId));

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
