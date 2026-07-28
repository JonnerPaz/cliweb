export class PlayerCard extends HTMLElement {
  set data(player) {
    this.player = player;
    this.buildDOM();
  }

  buildDOM() {
    this.className = 'card';
    this.innerHTML = `
      <h3>${this.player.name}</h3>
      <p>#${this.player.number} — ${this.player.position || ''}</p>
    `;
  }
}
customElements.define('player-card', PlayerCard);
