import gameState from "../state/GameState.js";

export class ResultsView {
  constructor() {
    this.container = null;
  }

  mount(container) {
    this.container = container;
    const results = gameState.results || {};
    const minutes = Math.floor((results.time || 0) / 60).toString().padStart(2, "0");
    const seconds = ((results.time || 0) % 60).toString().padStart(2, "0");

    container.innerHTML = `
      <div class="results-container">
        <h1>¡Resultados!</h1>
        <div class="results-card">
          <p><strong>Jugador:</strong> ${results.playerName || "---"}</p>
          <p><strong>Puntos:</strong> ${results.points ?? 0}</p>
          <p><strong>Movimientos:</strong> ${results.movements ?? 0}</p>
          <p><strong>Tiempo:</strong> ${minutes}:${seconds}</p>
          <p><strong>Rondas:</strong> ${results.rounds ?? 1}</p>
        </div>
        <div class="results-actions">
          <button class="pokemon-button" id="btn-play-again">Jugar de nuevo</button>
          <button class="pokemon-button" id="btn-back-menu">Volver al menú</button>
        </div>
      </div>
    `;

    container.querySelector("#btn-play-again").addEventListener("click", () => {
      import("../app.js").then(({ router }) => router.navigateTo("/game"));
    });

    container.querySelector("#btn-back-menu").addEventListener("click", () => {
      import("../app.js").then(({ router }) => router.navigateTo("/"));
    });
  }

  unmount() {
    if (this.container) this.container.innerHTML = "";
  }
}
