import { renderBoard } from "../components/board.js";
import gameState from "../state/GameState.js";
import { User } from "../state/User.js";
import { startTimer } from "../core/timer.js";
import { createHudMenu } from "../components/hudMenu.js";
import { router } from "../app.js";

export class GameView {
  constructor() {
    this.container = null;
    this.boardCleanup = null;
    this.timerController = null;
    this.hud = null;
  }

  onWin(turn) {
    const player = gameState.players[0];
    gameState.results = {
      playerName: player.name,
      points: player.points,
      movements: player.movements,
      time: this.timerController ? this.timerController.seconds : 0,
      rounds: gameState.rounds,
      gameMode: gameState.gameMode,
    };

    if (gameState.gameMode === "free") {
      gameState.rounds += 1;
      if (this.hud) this.hud.updatePlayerStats();
      setTimeout(() => this.reloadBoard(), 1500);
    } else {
      if (this.timerController) this.timerController.stop();
      if (this.hud) this.hud.updatePlayerStats();
      router.navigateTo("/results");
    }
  }

  onTurnUpdate(turns, activePlayerIndex) {
    if (this.hud) {
      this.hud.updatePlayerStats();
      if (gameState.gameMode === "pvp" && activePlayerIndex !== undefined) {
        this.hud.updateTurn(activePlayerIndex);
      }
    }
  }

  async reloadBoard() {
    if (this.boardCleanup) this.boardCleanup();
    let gridSize = 4;
    const diff = gameState.difficulty || "Facil";
    if (diff === "Medio") gridSize = 6;
    if (diff === "Dificil") gridSize = 8;
    const pairsCount = (gridSize * gridSize) / 2;
    const boardContainer = this.container.querySelector("#board-container");
    const boardState = await renderBoard(
      boardContainer,
      pairsCount,
      this.onWin.bind(this),
      this.onTurnUpdate.bind(this)
    );
    this.boardCleanup = boardState.cleanup;
  }

  handleFinish() {
    if (this.timerController) this.timerController.stop();
    const player = gameState.players[0];
    gameState.results = {
      playerName: player.name,
      points: player.points,
      movements: player.movements,
      time: this.timerController ? this.timerController.seconds : 0,
      rounds: gameState.rounds,
      gameMode: "free",
    };
    router.navigateTo("/results");
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
    const names = gameState.playerNames;
    const p1 = new User(names.player1?.trim() || "Entrenador 1", 0, 0, 0);
    const players =
      gameState.gameMode === "pvp"
        ? [
            p1,
            new User(names.player2?.trim() || "Entrenador 2", 0, 0, 0),
          ]
        : [p1];
    gameState.players = players;

    // Montar el HUD Menu
    const hudWrapper = this.container.querySelector(".hud-wrapper");

    this.hud = createHudMenu({ onFinish: () => this.handleFinish() });
    hudWrapper.appendChild(this.hud.element);

    if (gameState.gameMode === "solo" || gameState.gameMode === "free") {
      this.timerController = startTimer((segundos) => {
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
    if (this.timerController) {
      this.timerController.stop();
    }

    this.container.innerHTML = "";
  }
}
