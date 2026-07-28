export class TeamCard extends HTMLElement {
  set data(team) {
    this.team = team;
    this.buildDOM();
  }

  buildDOM() {
    this.className = 'card';
    this.innerHTML = `
      <h3>${this.team.name}</h3>
    `;
  }
}
customElements.define('team-card', TeamCard);
