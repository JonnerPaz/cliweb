import { router } from "../app.js";
import { renderSettings } from "../components/renderSettings.js";

export class HomeView {
  constructor() {
    this.container = null;
    this.settingsCleanup = null;
  }

  mount(container) {
    this.container = container;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <section class="home-page">
        <header class="home-header">
          <div class="pokemon-text-container">
            <h1 class="pokemon-text">POKEMORY</h1>
          </div>
        </header>

        <main class="home-main">
          <section class="home-section">
            <section class="home-settings" id="settings-container"></section>
            <div>
              <button id="btn-play" class="pokemon-button">Play</button>
            </div>
          </section>

        </main>

        <footer class="home-footer">
          <p class="pokemon-footer-text">Creado por Jonner Paz y Vanessa Pérez</p>
        </footer>
      </section>
    `;

    this.container.appendChild(wrapper);

    this.btnPlay = this.container.querySelector("#btn-play");
    this.btnPlay.addEventListener("click", this.handlePlay);

    const settingsContainer = this.container.querySelector(
      "#settings-container"
    );

    this.settingsCleanup = renderSettings(settingsContainer);
  }

  handlePlay = () => {
    router.navigateTo("/game");
  };

  unmount() {
    if (this.btnPlay) {
      this.btnPlay.removeEventListener("click", this.handlePlay);
    }

    if (this.settingsCleanup) {
      this.settingsCleanup();
    }

    this.container.innerHTML = "";
  }
}
