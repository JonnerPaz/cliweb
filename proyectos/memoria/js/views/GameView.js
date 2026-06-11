import { renderBoard } from "../components/board.js";
import gameState from "../state/GameState.js";
import gameEngine from "../core/gameEngine.js";
import { User } from "../state/User.js";
import { startTimer } from "../core/timer.js";
import { createHudMenu } from "../components/hudMenu.js";
import { router } from "../app.js";
import { showToast } from "../components/toast.js";
import awardChecker from "../core/awards.js";

export class GameView {
  constructor() {
    this.container = null;
    this.boardCleanup = null;
    this.timerController = null;
    this.hud = null;
    this.pairsCount = 0;
  }

  onWin() {
    const players = gameState.players;
    const results = {
      gameMode: gameState.gameMode,
      difficulty: gameState.difficulty,
      players: players.map((p) => ({
        playerName: p.name,
        points: p.points,
        movements: p.movements,
      })),
      time: this.timerController ? this.timerController.seconds : 0,
      totalPairs: this.pairsCount,
      totalMovements: gameState.turns,
      firstMoveMatch: gameEngine.firstMatchTurn,
    };

    if (gameState.gameMode === "pvp" && players.length === 2) {
      if (players[0].points > players[1].points) {
        results.winner = players[0].name;
      } else if (players[1].points > players[0].points) {
        results.winner = players[1].name;
      } else {
        results.winner = null;
      }
    }

    // Verificar awards
    const newAwards = awardChecker.checkAwards(results);
    results.awards = awardChecker.getUnlockedAwards();

    // Mostrar notificaciones de toast para nuevos awards
    newAwards.forEach(award => {
      showToast(`${award.icon} ${award.name} desbloqueado!`, 'success');
    });

    gameState.results = results;

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
    this.pairsCount = (gridSize * gridSize) / 2;
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
    if (this.timerController) this.timerController.stop();
    const player = gameState.players[0];
    gameState.results = {
      gameMode: "free",
      difficulty: gameState.difficulty,
      players: [
        {
          playerName: player.name,
          points: player.points,
          movements: player.movements,
        },
      ],
      time: 0,
      totalPairs: this.pairsCount,
      totalMovements: gameState.turns,
      firstMoveMatch: gameEngine.firstMatchTurn,
    };

    // Verificar awards
    const newAwards = awardChecker.checkAwards(gameState.results);
    gameState.results.awards = awardChecker.getUnlockedAwards();

    // Mostrar notificaciones de toast para nuevos awards
    newAwards.forEach(award => {
      showToast(`${award.icon} ${award.name} desbloqueado!`, 'success');
    });

    router.navigateTo("/results");
  }

  onAwardUnlock(award) {
    showToast(`${award.icon} ${award.name} desbloqueado!`, 'success');
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
    this.pairsCount = (gridSize * gridSize) / 2;

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
      this.pairsCount,
      this.onWin.bind(this),
      this.onTurnUpdate.bind(this),
      this.onAwardUnlock.bind(this)
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
