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
    this.render();
  }

  async render() {
    const { getActiveLeagueId, getById } = await import("../db.js");
    const leagueId = getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `
        <div class="empty-state">
          <h2>No hay liga activa</h2>
          <p>Crea o selecciona una liga para comenzar.</p>
          <button class="btn btn-primary" id="go-leagues">Ir a Ligas</button>
        </div>
      `;
      this.container
        .querySelector("#go-leagues")
        ?.addEventListener("click", () => this.router.navigateTo("/leagues"));
      return;
    }

    const league = await getById("leagues", Number(leagueId));
    if (!league) {
      this.container.innerHTML = `<div class="empty-state"><p>La liga activa no existe.</p></div>`;
      return;
    }

    const navBar = document.querySelector("nav-bar");
    if (navBar) navBar.setActiveLeague(league.name, league.sport);

    this.container.innerHTML = `
      <div class="page-header">
        <h1>${league.name}</h1>
        <span>${league.sport} — ${league.temporada}</span>
      </div>
      <section id="dashboard-content">
        <p>Aquí irán los gráficos y resúmenes del dashboard.</p>
      </section>
    `;
  }

  unmount() {
    this.container = null;
  }
}
