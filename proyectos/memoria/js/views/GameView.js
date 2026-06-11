import { renderBoard } from "../components/board.js";
import gameState from "../state/GameState.js";
import gameEngine from "../core/gameEngine.js";
import { createPlayers } from "../state/playerFactory.js";
import { startTimer } from "../core/timer.js";
import { createHudMenu } from "../components/hudMenu.js";
import { router } from "../app.js";
import { showAwardToasts } from "../components/toast.js";
import { buildResults } from "../utils/resultsBuilder.js";

export class GameView {
  constructor() {
    this.container = null;
    this.boardCleanup = null;
    this.timerController = null;
    this.hud = null;
    this.pairsCount = 0;
  }

  onWin() {
    const { results, newAwards } = buildResults({
      gameMode: gameState.gameMode,
      difficulty: gameState.difficulty,
      players: gameState.players,
      timerSeconds: this.timerController?.seconds ?? 0,
      pairsCount: this.pairsCount,
      totalMovements: gameEngine.turns,
      firstMatchTurn: gameEngine.firstMatchTurn,
    });

    gameState.results = results;
    showAwardToasts(newAwards);

    if (gameState.gameMode === "free") {
      gameState.rounds += 1;
      this.hud?.updatePlayerStats();
      setTimeout(() => this.reloadBoard(), 1500);
    } else {
      this.timerController?.stop();
      this.hud?.updatePlayerStats();
      router.navigateTo("/results");
    }
  }

  onTurnUpdate(turns, activePlayer) {
    if (this.hud) {
      this.hud.updatePlayerStats();
      if (gameState.gameMode === "pvp" && activePlayer !== undefined) {
        this.hud.updateTurn(activePlayer);
      }
    }
  }

  setupDifficulty(difficulty) {
    let themeClass = "theme-easy";
    let gridSize = 4;
    switch (difficulty) {
      case "Medio":
        gameState.difficulty = "Medio";
        gridSize = 6;
        themeClass = "theme-medium";
        break;
      case "Dificil":
        gameState.difficulty = "Dificil";
        gridSize = 8;
        themeClass = "theme-hard";
        break;
      case "Facil":
      default:
        gameState.difficulty = "Facil";
        break;
    }

    document.body.className = themeClass;
    this.pairsCount = (gridSize * gridSize) / 2;
    return;
  }

  async reloadBoard() {
    if (this.boardCleanup) this.boardCleanup();
    this.setupDifficulty(gameState.difficulty);

    const boardContainer = this.container.querySelector("#board-container");
    const boardState = await renderBoard(
      boardContainer,
      this.pairsCount,
      this.onWin.bind(this),
      this.onTurnUpdate.bind(this),
      this.onAwardUnlock.bind(this)
    );

    this.boardCleanup = boardState.cleanup;
  }

  handleFinish() {
    this.timerController?.stop();

    const { results, newAwards } = buildResults({
      gameMode: "free",
      difficulty: gameState.difficulty,
      players: gameState.players,
      pairsCount: this.pairsCount,
      totalMovements: gameEngine.turns,
      firstMatchTurn: gameEngine.firstMatchTurn,
    });

    gameState.results = results;
    showAwardToasts(newAwards);
    router.navigateTo("/results");
  }

  onAwardUnlock(award) {
    showAwardToasts([award]);
  }

  setupHUD() {
    // Configurar HUD y Layout de Juego
    const hudController = document.createElement("div");
    hudController.innerHTML = `
      <button id="btn-back" class="pokemon-button">⬅ Volver</button>
      <div class="hud-wrapper"></div>
      <main id="board-container" class="game-main"></main>
    `;

    this.container.appendChild(hudController);

    const hudWrapper = this.container.querySelector(".hud-wrapper");
    this.hud = createHudMenu({
      onFinish: () => this.handleFinish(),
    });
    hudWrapper.appendChild(this.hud.element);

    return;
  }

  setupEvents() {
    this.btnBack = this.container.querySelector("#btn-back");
    this.btnBack.addEventListener("click", () => this.handleBack());
  }

  async mount(container) {
    this.container = container;

    // render HUD
    this.setupHUD();

    // Eventos
    this.setupEvents();

    // Configurar dificultad
    this.setupDifficulty(gameState.difficulty);

    // Configurar Jugadores
    gameState.players = createPlayers(
      gameState.gameMode,
      gameState.playerNames
    );

    if (gameState.gameMode === "solo" || gameState.gameMode === "free") {
      this.timerController = startTimer((segundos) => {
        this.hud.updateTimer(segundos);
      });
    }

    // Montar el Tablero en el DOM
    const boardContainer = this.container.querySelector("#board-container");
    const boardState = await renderBoard(
      boardContainer,
      this.pairsCount,
      this.onWin.bind(this),
      this.onTurnUpdate.bind(this),
      this.onAwardUnlock.bind(this)
    );
    this.boardCleanup = boardState.cleanup;
  }

  handleBack() {
    this.timerController?.stop();
    router.navigateTo("/");
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

    document.body.className = ""; // Limpiamos al salir
    this.container.innerHTML = "";
  }
}
