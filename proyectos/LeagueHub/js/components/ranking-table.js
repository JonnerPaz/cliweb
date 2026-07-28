export class RankingTable extends HTMLElement {
  set data(players) {
    this.players = players;
    this.buildDOM();
  }

  buildDOM() {
    this.innerHTML = `<p>Ranking — implementación pendiente.</p>`;
  }
}
customElements.define('ranking-table', RankingTable);
