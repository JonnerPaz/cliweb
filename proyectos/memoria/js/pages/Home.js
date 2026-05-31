export class Home extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <h1 class="pokemon-text">Pokemory</h1>
    <button class="pokemon-button">Jugar</button>
`;
  }
}

customElements.define("home-page", Home);
