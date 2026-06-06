import { renderBoard } from "../components/board.js";
import gameState from "../state/GameState.js";
import { User } from "../state/User.js";

export class GameView {
  constructor() {
    this.container = null;
    this.boardCleanup = null;
  }

  async mount(container) {
    this.container = container;

    // Configurar HUD y Layout de Juego
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <header class="game-header">
        <button id="btn-back" class="pokemon-button" style="padding: 0.5rem 1rem;">⬅ Volver</button>
        <nav class="hud-menu">
          <div class="hud-item">Turnos: <span id="hud-turns">0</span></div>
        </nav>
      </header>
      <main id="board-container" class="game-main"></main>
    `;

    this.container.appendChild(wrapper);

    // Eventos
    this.btnBack = this.container.querySelector("#btn-back");
    this.btnBack.addEventListener("click", this.handleBack);

    this.hudTurns = this.container.querySelector("#hud-turns");

    // Determinar dificultad
    let gridSize = 4;
    const diff = gameState.difficulty || "Facil";
    if (diff === "Medio") gridSize = 6;
    if (diff === "Dificil") gridSize = 8;
    const pairsCount = (gridSize * gridSize) / 2;

    // Construir jugadores a partir de los nombres del settings
    const p1 = new User(gameState.playerName.trim() || "Entrenador 1", 0, 0, 0);
    const players =
      gameState.gameMode === "pvp"
        ? [
            p1,
            new User(gameState.player2Name.trim() || "Entrenador 2", 0, 0, 0),
          ]
        : [p1];
    gameState.players = players;

    // Callbacks del juego
    const onWin = (turnos) => {
      // Usaremos un timeout simple para la victoria por ahora
      setTimeout(() => alert(`¡Ganaste en ${turnos} turnos!`), 300);
    };

    const onTurnUpdate = (turnos) => {
      if (this.hudTurns) {
        this.hudTurns.textContent = turnos;
      }
    };

    // Montar el tablero
    const boardContainer = this.container.querySelector("#board-container");
    const boardState = await renderBoard(
      boardContainer,
      pairsCount,
      onWin,
      onTurnUpdate
    );
    this.boardCleanup = boardState.cleanup;
  }

  handleBack = () => {
    import("../app.js").then(({ router }) => {
      router.navigateTo("/");
    });
  };

  unmount() {
    if (this.btnBack) {
      this.btnBack.removeEventListener("click", this.handleBack);
    }

    if (this.boardCleanup) {
      this.boardCleanup();
    }

    this.container.innerHTML = "";
  }
}
