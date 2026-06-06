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
            <section class="home-settings hidden" id="settings-container"></section>
            <div>
              <button id="btn-settings" class="pokemon-button">Start</button>
              <button id="btn-play" class="pokemon-button hidden">Play</button>
            </div>
          </section>

        </main>

        <footer class="home-footer">
          <p class="pokemon-footer-text">Creado por Jonner Paz y Vanessa Pérez</p>
        </footer>
      </section>
    `;

    this.container.appendChild(wrapper);

    // Abre la sección modos y configuración
    this.btnSettings = this.container.querySelector("#btn-settings");
    this.btnSettings.addEventListener("click", () =>
      this.toggleSettings(this.container)
    );

    // Inicia el juego
    this.btnPlay = this.container.querySelector("#btn-play");
    this.btnPlay.addEventListener("click", this.handlePlay);

    const settingsContainer = this.container.querySelector(
      "#settings-container"
    );

    this.settingsCleanup = renderSettings(settingsContainer);
  }

  handlePlay() {
    const result = this.settingsCleanup?.validate?.() ?? { ok: true };
    if (!result.ok) return;
    router.navigateTo("/game");
  }

  toggleSettings(container) {
    container.querySelector(".home-settings").classList.toggle("hidden");
    container.querySelector("#btn-settings").classList.toggle("hidden");
    container.querySelector("#btn-play").classList.toggle("hidden");
  }

  unmount() {
    if (this.btnPlay) {
      this.btnPlay.removeEventListener("click", this.handlePlay);
    }

    if (this.settingsCleanup) {
      this.settingsCleanup.cleanup?.();
    }

    this.container.innerHTML = "";
  }
}
