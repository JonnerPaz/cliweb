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
    const awards = results.awards || [];

    let winnerHtml = "";
    let timeHtml = "";
    let playersHtml = "";
    let awardsHtml = "";

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
          <article class="results-player">
            <h3>${p.playerName}</h3>
            <ul>
              <li><strong>Pares:</strong> ${pairs}</li>
              <li><strong>Puntos:</strong> ${p.points}</li>
              <li><strong>Movimientos:</strong> ${p.movements}</li>
              <li><strong>Precisión:</strong> ${hitRate(pairs, p.movements)}%</li>
            </ul>
          </article>
        `;
      })
      .join("");

    // Generar HTML de awards
    if (awards.length > 0) {
      awardsHtml = `
        <section class="results-awards">
          <h3>🏅 Logros Desbloqueados</h3>
          <ul class="awards-grid">
            ${awards.map(award => `
              <li class="award-item award-${award.rarity}">
                <span class="award-icon" aria-hidden="true">${award.icon}</span>
                <div class="award-info">
                  <h4>${award.name}</h4>
                  <p>${award.description}</p>
                </div>
              </li>
            `).join('')}
          </ul>
        </section>
      `;
    } else {
      awardsHtml = `
        <section class="results-awards">
          <h3>🏅 Logros Desbloqueados</h3>
          <p class="no-awards">Sigue jugando para desbloquear logros</p>
        </section>
      `;
    }
    
    const totalPairs = results.totalPairs ?? 0;
    const totalMovements = results.totalMovements ?? 0;

    container.innerHTML = `
      <section class="results-container">    
        <header>
          <h1>¡Resultados!</h1>
          ${winnerHtml}
        </header>
        <article class="results-card">
          <ul>
            <li><strong>Total pares:</strong> ${totalPairs}</li>
            <li><strong>Total movimientos:</strong> ${totalMovements}</li>
            <li><strong>Precisión global:</strong> ${hitRate(totalPairs, totalMovements)}%</li>
            ${timeHtml}
          </ul>
        </article>

        <section class="results-players">
          ${playersHtml}
        </section>
        
        ${awardsHtml}

        <nav class="results-actions" aria-label="Acciones de fin de juego">
          <button class="pokemon-button" id="btn-play-again">Jugar de nuevo</button>
          <button class="pokemon-button" id="btn-back-menu">Volver al menú</button>
        </nav>

      </section>
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
