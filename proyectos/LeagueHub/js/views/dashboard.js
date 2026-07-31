import db from "../db.js";
import "../components/league-form.js";
import "../components/league-switcher.js";

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

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${league.name}</h1>
          <span class="dashboard-subtitle">${league.sport} — ${league.temporada}</span>
        </div>
        <div class="dashboard-actions">
          <button class="btn btn-secondary" id="change-league">Cambiar liga</button>
          <button class="btn btn-primary" id="create-league">+ Crear Liga</button>
        </div>
      </div>
      <section id="dashboard-content">
        <p>Aquí irán los gráficos y resúmenes del dashboard.</p>
      </section>
    `;

    container
      .querySelector("#change-league")
      .addEventListener("click", () => this.openLeagueSwitcher());
    container
      .querySelector("#create-league")
      .addEventListener("click", () => this.openCreateLeague());
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
