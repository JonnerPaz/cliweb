import { router } from "../app.js";

export class Home extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  setupEvents() {
    const playButton = this.querySelector(".pokemon-button");
    playButton.addEventListener("click", () => {
      // Por ahora solo hacemos console.log, pero ya está listo
      // para cuando agreguemos la página del juego
      console.log("Navegando a la página del juego...");
      // router.navigateTo("/juego");
    });
  }

  render() {
    this.innerHTML = `
      <header class="home-header">
      <div class="pokemon-text-container">
        <h1 class="pokemon-text">POKEMORY</h1>
      </div>
      </header>

      <main class="home-main">
      <section class="home-section">
        <button class="pokemon-button">Play</button>
      </section>

        <section class="home-settings ">
            <h2 class="home-settings-title">Settings</h2>
            <div class="home-settings-container">
              <div class="home-settings-item">
              <label for="mode">Modo de juego</label>
                <select id="mode">
                  <option value="solo">Solitario</option>
                  <option value="pvp">PvP</option>
                  <option value="free">Libre</option>
                </select>
              </div>

            <div class="home-settings-item">
                <label for="difficulty">Dificultad</label>
                <select id="difficulty">
                  <option value="4x4">Fácil</option>
                  <option value="6x6">Medio</option>
                  <option value="8x8">Dificil</option>
                </select>
              </div>
            </div>
          </section>
      </main>

      <footer class="home-footer">
        <p class="pokemon-footer-text">Creado por Jonner Paz y Vanessa Pérez</p>
      </footer>
    `;
  }
}

customElements.define("home-page", Home);
