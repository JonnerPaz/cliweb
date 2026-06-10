import { renderBoard } from "../components/board.js";
import gameState from "../state/GameState.js";
import { User } from "../state/User.js";
import { startTimer} from "../core/timer.js";
import { createHudMenu } from "../components/hudMenu.js";

export class GameView {
  constructor() {
    this.container = null;
    this.boardCleanup = null;
    this.timerInterval = null;
    this.hud = null; 
  }

  onWin(turn) {
    if(this.timerInterval) clearInterval(this.timerInterval);
    setTimeout(() => alert(`¡Ganaste en ${turn} turnos!`));
  }

  onTurnUpdate() {
    if (this.hud) {
      this.hud.updatePlayerStats();
      // Si es PvP, actualiza quien tiene el turno visualmente
      if (gameState.gameMode === "pvp") {
        this.hud.updateTurn(gameState.currentPlayerIndex);
      }
    }
  }

  async mount(container) {
    this.container = container;

    // Configurar HUD y Layout de Juego
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <button id="btn-back" class="pokemon-button">⬅ Volver</button>
      <div class="hud-wrapper"></div>
      <main id="board-container" class="game-main"></main>
    `;

    this.container.appendChild(wrapper);

    // Eventos
    this.btnBack = this.container.querySelector("#btn-back");
    this.btnBack.addEventListener("click", () => this.handleBack());

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

    // Montar el HUD Menu
    const hudWrapper = this.container.querySelector(".hud-wrapper");
    
    // Inyectamos el componente pasandole el arreglo de jugadores y el modo
    this.hud = createHudMenu();
    hudWrapper.appendChild(this.hud.element);

    // Iniciar el Timer si aplica
    if (gameState.gameMode === 'solo') {
      this.timerInterval = startTimer((segundos) => {
          this.hud.updateTimer(segundos);
      });
    }

    // Montar el Tablero
    const boardContainer = this.container.querySelector("#board-container");
    const boardState = await renderBoard(
      boardContainer,
      pairsCount,
      this.onWin.bind(this),
      this.onTurnUpdate.bind(this)
    );
    this.boardCleanup = boardState.cleanup;
  }

  handleBack() {
    import("../app.js").then(({ router }) => {
      router.navigateTo("/");
    });
  }

  unmount() {
    if (this.btnBack) {
      this.btnBack.removeEventListener("click", this.handleBack);
    }

    if (this.boardCleanup) {
      this.boardCleanup();
    }
    // Previene fugas de memoria si el usuario sale usando el boton volver
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.container.innerHTML = "";
  }
}
