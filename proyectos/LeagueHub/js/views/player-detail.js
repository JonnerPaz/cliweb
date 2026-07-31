import db from "../db.js";
import "../components/chart-container.js";
import { getSportTerms } from "../sports-terms.js";
import { formatDate } from "../utils/helpers.js";

export class PlayerDetailView {
  constructor({ router, id }) {
    this.router = router;
    this.id = id;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <button class="btn btn-secondary back-link" id="back-btn">← Volver</button>
      <loading-state message="Cargando jugador..."></loading-state>
    `;
    container
      .querySelector("#back-btn")
      .addEventListener("click", () => this.router.navigateTo("/players"));
    this.render();
  }

  async render() {
    const container = this.container;
    if (!container) return;

    const player = await db.getById("players", Number(this.id));
    if (!player) {
      container.innerHTML = `<div class="empty-state"><p>Jugador no encontrado.</p></div>`;
      return;
    }

    const team = player.teamId ? await db.getById("teams", Number(player.teamId)) : null;
    const leagueId = team?.leagueId || db.getActiveLeagueId();
    const league = leagueId ? await db.getById("leagues", Number(leagueId)) : null;
    const terms = getSportTerms(league?.sport);
    this.player = player;
    this.terms = terms;

    const events = await db.getByIndex("events", "playerId", player.id);
    const goalsByMatch = {};
    events.forEach((e) => {
      goalsByMatch[e.matchId] = (goalsByMatch[e.matchId] || 0) + 1;
    });
    const matchIds = Object.keys(goalsByMatch).map(Number);

    const played = matchIds.length;
    const totalGoals = events.length;
    const average = played > 0 ? (totalGoals / played).toFixed(1) : "0.0";

    const history = [];
    for (const matchId of matchIds) {
      const match = await db.getById("matches", matchId);
      if (!match) continue;
      const rivalId =
        match.homeTeamId === player.teamId ? match.awayTeamId : match.homeTeamId;
      const rival = rivalId ? await db.getById("teams", rivalId) : null;
      history.push({ match, rival, goals: goalsByMatch[matchId] });
    }
    history.sort((a, b) => {
      const da = a.match.date || "";
      const dbDate = b.match.date || "";
      if (da && dbDate) return da < dbDate ? 1 : da > dbDate ? -1 : 0;
      if (da) return -1;
      if (dbDate) return 1;
      return b.match.id - a.match.id;
    });

    container.innerHTML = `
      <div class="detail-header">
        <div class="detail-avatar">${this.#renderAvatar(player, team)}</div>
        <div class="detail-header-info">
          <h1>${player.name}</h1>
          <div class="detail-meta">
            <span class="detail-number">#${player.number ?? "?"}</span>
            ${player.position ? `<span>${player.position}</span>` : ""}
          </div>
          ${team ? this.#renderTeamLink(team) : ""}
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">${played}</div>
          <div class="stat-label">Partidos jugados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalGoals}</div>
          <div class="stat-label">${terms.eventNamePlural}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${average}</div>
          <div class="stat-label">Promedio por partido</div>
        </div>
      </div>

      <section class="detail-section">
        <h2>${terms.scorers} — historial</h2>
        <div class="detail-panel" id="player-history"></div>
      </section>

      <section class="detail-section">
        <h2>${terms.eventNamePlural} por partido</h2>
        <div class="detail-panel">
          <div class="chart-wrapper" id="player-chart"></div>
        </div>
      </section>
    `;

    this.#renderHistory(container, history);
    this.#renderChart(container, history, team, terms);
  }

  #renderAvatar(player, team) {
    if (player.photo) {
      return `<img src="${player.photo}" alt="${player.name}" />`;
    }
    const initials = (player.name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `<div class="avatar-placeholder" style="background:${team ? team.colorPrincipal : "#6c5ce7"}">${initials}</div>`;
  }

  #renderTeamLink(team) {
    const initials = (team.name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `
      <a class="detail-team" href="#/team/${team.id}" data-team-link>
        <span class="team-badge" style="background:${team.colorSecundario || "#6c5ce7"}">
          ${team.escudo ? `<img src="${team.escudo}" alt="${team.name}" />` : initials}
        </span>
        ${team.name}
      </a>
    `;
  }

  #renderHistory(container, history) {
    const panel = container.querySelector("#player-history");
    if (!panel) return;

    if (history.length === 0) {
      panel.innerHTML = `<div class="empty-state"><p>Este jugador aún no ha anotado en ningún partido.</p></div>`;
      return;
    }

    const list = document.createElement("ul");
    list.className = "history-list";

    history.forEach(({ match, rival, goals }) => {
      const result = this.#resultOf(match);
      const isFinalized = result !== null;
      const li = document.createElement("li");
      li.className = "history-row";
      li.innerHTML = `
        <span class="history-rival">${rival?.name || "Por definir"}</span>
        <span class="history-goals">${goals} ${goals === 1 ? this.terms.eventName : this.terms.eventNamePlural}</span>
        <span class="history-date">${match.date ? formatDate(match.date) : "Sin fecha"}</span>
        ${
          isFinalized
            ? `<span class="history-score">${match.homeScore} - ${match.awayScore}</span>
               <span class="result result-${result.key.toLowerCase()}">${result.label}</span>`
            : `<span class="history-score">Programado</span>`
        }
      `;
      li.addEventListener("click", () => this.router.navigateTo(`/match/${match.id}`));
      list.appendChild(li);
    });

    panel.appendChild(list);
  }

  #renderChart(container, history, team, terms) {
    const wrapper = container.querySelector("#player-chart");
    if (!wrapper) return;

    if (history.length === 0) {
      wrapper.innerHTML = `<div class="empty-state"><p>No hay datos suficientes.</p></div>`;
      return;
    }

    const chartEl = document.createElement("chart-container");
    wrapper.appendChild(chartEl);

    const labels = history.map(({ match, rival }) =>
      match.date
        ? `${new Date(match.date).toLocaleDateString("es-ES")}`
        : rival?.name || `Partido #${match.id}`,
    );
    const data = history.map((h) => h.goals);

    chartEl.render({
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: terms.eventNamePlural,
            data,
            backgroundColor: team?.colorPrincipal || "#6c5ce7",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });
  }

  #resultOf(match) {
    const finalized =
      match.status === "Finalizado" ||
      match.status === "finalized" ||
      match.status === "finished";
    if (!finalized || match.homeScore == null || match.awayScore == null) return null;

    const playerScore =
      match.homeTeamId === this.player?.teamId ? match.homeScore : match.awayScore;
    const rivalScore =
      match.homeTeamId === this.player?.teamId ? match.awayScore : match.homeScore;

    if (playerScore > rivalScore) return { key: "V", label: "Victoria" };
    if (playerScore < rivalScore) return { key: "D", label: "Derrota" };
    return { key: "E", label: "Empate" };
  }

  unmount() {
    this.container = null;
  }
}
