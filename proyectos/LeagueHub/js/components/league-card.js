export class LeagueCard extends HTMLElement {
  set data(league) {
    this.league = league;
    this.buildDOM();
  }

  buildDOM() {
    this.className = 'card';
    this.innerHTML = `
      <h3>${this.league.name}</h3>
      <p>${this.league.sport} — ${this.league.temporada || ''}</p>
    `;
  }
}
customElements.define('league-card', LeagueCard);
