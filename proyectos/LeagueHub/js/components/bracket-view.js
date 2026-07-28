export class BracketView extends HTMLElement {
  set data(matches) {
    this.matches = matches;
    this.buildDOM();
  }

  buildDOM() {
    this.innerHTML = `<p>Bracket — implementación pendiente.</p>`;
  }
}
customElements.define('bracket-view', BracketView);
