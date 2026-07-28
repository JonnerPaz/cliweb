export class MatchCard extends HTMLElement {
  set data(match) {
    this.match = match;
    this.buildDOM();
  }

  buildDOM() {
    this.className = 'card';
    this.innerHTML = `
      <p>${this.match.homeTeamId} vs ${this.match.awayTeamId}</p>
      <p>${this.match.status || 'Programado'}</p>
    `;
  }
}
customElements.define('match-card', MatchCard);
