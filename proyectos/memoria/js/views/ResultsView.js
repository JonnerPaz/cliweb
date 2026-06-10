import gameState from "../state/GameState.js";

function hitRate(pairs, movements) {
  if (!movements || movements === 0) return "0.0";
  return ((pairs / movements) * 100).toFixed(1);
}

function formatTime(seconds) {
  const m = Math.floor((seconds || 0) / 60).toString().padStart(2, "0");
  const s = ((seconds || 0) % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export class ResultsView {
  constructor() {
    this.container = null;
  }

  mount(container) {
    this.container = container;
    const results = gameState.results || {};
    const mode = results.gameMode;
    const players = results.players || [];

    let winnerHtml = "";
    let timeHtml = "";
    let playersHtml = "";

    if (mode === "pvp" && players.length === 2) {
      if (results.winner) {
        winnerHtml = `<h2 class="results-winner">🏆 ¡${results.winner} gana!</h2>`;
      } else {
        winnerHtml = `<h2 class="results-winner">🤝 ¡Empate!</h2>`;
      }
    }

    if (mode === "solo") {
      timeHtml = `<p><strong>Tiempo:</strong> ${formatTime(results.time)}</p>`;
    }

    playersHtml = players
      .map((p) => {
        const pairs = Math.floor(p.points / 10);
        return `
          <div class="results-player">
            <h3>${p.playerName}</h3>
            <p><strong>Pares:</strong> ${pairs}</p>
            <p><strong>Puntos:</strong> ${p.points}</p>
            <p><strong>Movimientos:</strong> ${p.movements}</p>
            <p><strong>Precisión:</strong> ${hitRate(pairs, p.movements)}%</p>
          </div>
        `;
      })
      .join("");

    const totalPairs = results.totalPairs ?? 0;
    const totalMovements = results.totalMovements ?? 0;

    container.innerHTML = `
      <div class="results-container">
        <h1>¡Resultados!</h1>
        ${winnerHtml}
        <div class="results-card">
          <p><strong>Total pares:</strong> ${totalPairs}</p>
          <p><strong>Total movimientos:</strong> ${totalMovements}</p>
          <p><strong>Precisión global:</strong> ${hitRate(totalPairs, totalMovements)}%</p>
          ${timeHtml}
        </div>
        <div class="results-players">${playersHtml}</div>
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
