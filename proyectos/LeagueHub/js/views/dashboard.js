import db from "../db.js";
import "../components/league-form.js";
import "../components/league-switcher.js";
import { getSportTerms } from "../sports-terms.js";
import { formatDate } from "../utils/helpers.js";

export class DashboardView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>
      <loading-state message="Cargando dashboard..."></loading-state>
    `;
    this.onLeagueChanged = () => {
      if (this.container) this.render();
    };
    document.addEventListener("league:changed", this.onLeagueChanged);
    this.render();
  }

  async render() {
    const container = this.container;
    if (!container) return;

    const leagueId = db.getActiveLeagueId();

    if (!leagueId) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>No hay liga activa</h2>
          <p>Crea o selecciona una liga para comenzar.</p>
          <div class="empty-actions">
            <button class="btn btn-primary" id="create-first">+ Crear Liga</button>
            <button class="btn btn-secondary" id="go-leagues">Ir a Ligas</button>
          </div>
        </div>
      `;
      container
        .querySelector("#go-leagues")
        ?.addEventListener("click", () => this.router.navigateTo("/leagues"));
      container
        .querySelector("#create-first")
        ?.addEventListener("click", () => this.openCreateLeague());
      return;
    }

    const league = await db.getById("leagues", Number(leagueId));
    if (!league) {
      container.innerHTML = `<div class="empty-state"><p>La liga activa no existe.</p></div>`;
      return;
    }

    const navBar = document.querySelector("nav-bar");
    if (navBar) navBar.setActiveLeague(league.name, league.sport);

    const terms = getSportTerms(league.sport);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${terms.icon} ${league.name}</h1>
          <span class="dashboard-subtitle">${terms.name} — ${league.temporada}</span>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-secondary" id="change-league">Cambiar liga</button>
          <button class="btn btn-primary" id="create-league">+ Crear Liga</button>
        </div>
      </div>
      <section id="dashboard-content"></section>
    `;

    container
      .querySelector("#change-league")
      .addEventListener("click", () => this.openLeagueSwitcher());
    container
      .querySelector("#create-league")
      .addEventListener("click", () => this.openCreateLeague());

    const teams = await db.getByIndex("teams", "leagueId", Number(leagueId));
    const matches = await db.getByIndex("matches", "leagueId", Number(leagueId));

    const content = container.querySelector("#dashboard-content");
    if (content) {
      content.appendChild(this.#buildNextLast(matches, this.#teamById(teams), terms));
    }
  }

  #isFinalized(match) {
    return (
      match.status === "Finalizado" ||
      match.status === "finalized" ||
      match.status === "finished"
    );
  }

  #teamById(teams) {
    const map = {};
    teams.forEach((t) => (map[t.id] = t));
    return map;
  }

  #initials(name) {
    return (name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  #byDateAsc(a, b) {
    const da = a.date || "";
    const dbD = b.date || "";
    if (da && dbD) return da < dbD ? -1 : da > dbD ? 1 : 0;
    if (da) return -1;
    if (dbD) return 1;
    return a.id - b.id;
  }

  #byDateDesc(a, b) {
    const da = a.date || "";
    const dbD = b.date || "";
    if (da && dbD) return da < dbD ? 1 : da > dbD ? -1 : 0;
    if (da) return -1;
    if (dbD) return 1;
    return b.id - a.id;
  }

  #emptyMsg(text) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const p = document.createElement("p");
    p.textContent = text;
    empty.appendChild(p);
    return empty;
  }

  #teamChip(team) {
    const chip = document.createElement("div");
    chip.className = "dash-team";

    const avatar = document.createElement("span");
    avatar.className = "dash-team-avatar";
    if (team?.escudo) {
      const img = document.createElement("img");
      img.src = team.escudo;
      img.alt = team.name || "Equipo";
      avatar.appendChild(img);
    } else {
      avatar.textContent = this.#initials(team?.name);
      if (team?.colorPrincipal) avatar.style.background = team.colorPrincipal;
    }

    const name = document.createElement("span");
    name.className = "dash-team-name";
    name.textContent = team?.name || "Por definir";

    chip.appendChild(avatar);
    chip.appendChild(name);
    return chip;
  }

  #buildNextLast(matches, teamById, terms) {
    const section = document.createElement("section");
    section.className = "detail-section";

    const grid = document.createElement("div");
    grid.className = "dash-cards";

    grid.appendChild(this.#nextMatchCard(matches, teamById, terms));
    grid.appendChild(this.#lastResultCard(matches, teamById, terms));

    section.appendChild(grid);
    return section;
  }

  #nextMatchCard(matches, teamById, terms) {
    const card = document.createElement("div");
    card.className = "card dash-card";

    const h3 = document.createElement("h3");
    h3.textContent = "Próximo partido";
    card.appendChild(h3);

    const upcoming = matches.filter((m) => !this.#isFinalized(m)).sort(this.#byDateAsc);

    if (upcoming.length === 0) {
      card.appendChild(this.#emptyMsg("Sin partidos programados."));
      return card;
    }

    const match = upcoming[0];

    const matchup = document.createElement("div");
    matchup.className = "dash-matchup";
    matchup.appendChild(this.#teamChip(teamById[match.homeTeamId]));

    const vs = document.createElement("span");
    vs.className = "dash-vs";
    vs.textContent = "vs";
    matchup.appendChild(vs);

    matchup.appendChild(this.#teamChip(teamById[match.awayTeamId]));
    card.appendChild(matchup);

    const date = document.createElement("div");
    date.className = "dash-date";
    date.textContent = match.date ? formatDate(match.date) : "Sin fecha programada";
    card.appendChild(date);

    card.classList.add("clickable");
    card.addEventListener("click", () => this.router.navigateTo(`/match/${match.id}`));
    return card;
  }

  #lastResultCard(matches, teamById, terms) {
    const card = document.createElement("div");
    card.className = "card dash-card";

    const h3 = document.createElement("h3");
    h3.textContent = "Último resultado";
    card.appendChild(h3);

    const finalized = matches
      .filter((m) => this.#isFinalized(m) && m.homeScore != null && m.awayScore != null)
      .sort(this.#byDateDesc);

    if (finalized.length === 0) {
      card.appendChild(this.#emptyMsg("No hay partidos finalizados."));
      return card;
    }

    const match = finalized[0];

    const matchup = document.createElement("div");
    matchup.className = "dash-matchup";
    matchup.appendChild(this.#teamChip(teamById[match.homeTeamId]));

    const score = document.createElement("span");
    score.className = "dash-score";
    score.textContent = `${match.homeScore} - ${match.awayScore}`;
    matchup.appendChild(score);

    matchup.appendChild(this.#teamChip(teamById[match.awayTeamId]));
    card.appendChild(matchup);

    if (match.date) {
      const date = document.createElement("div");
      date.className = "dash-date";
      date.textContent = formatDate(match.date);
      card.appendChild(date);
    }

    card.classList.add("clickable");
    card.addEventListener("click", () => this.router.navigateTo(`/match/${match.id}`));
    return card;
  }

  openLeagueSwitcher() {
    const switcher = document.createElement("league-switcher");
    this.container.appendChild(switcher);
  }

  openCreateLeague() {
    const form = document.createElement("league-form");
    form.addEventListener("league-created", async (e) => {
      await db.runTransaction(["leagues"], "readwrite", (stores) => {
        const all = stores.leagues.getAll();
        all.onsuccess = () => {
          all.result.forEach((l) => {
            stores.leagues.put({ ...l, isActive: l.id === e.detail.league.id });
          });
        };
      });
      db.setActiveLeagueId(e.detail.league.id);
      document.dispatchEvent(new CustomEvent("league:changed"));
    });
    this.container.appendChild(form);
  }

  unmount() {
    document.removeEventListener("league:changed", this.onLeagueChanged);
    this.container = null;
  }
}
