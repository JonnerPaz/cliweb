export class StandingsTable extends HTMLElement {
  set data(teams) {
    this.teams = teams;
    this.buildDOM();
  }

  buildDOM() {
    this.innerHTML = `<p>Tabla de posiciones — implementación pendiente.</p>`;
  }
}
customElements.define('standings-table', StandingsTable);
