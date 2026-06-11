import gameState from "../state/GameState.js";
import awardChecker from "./awards.js";

class GameEngine {
  static pointsPerMatch = 10;

  constructor() {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = 0;
    this.onWin = null;
    this.onTurnUpdate = null;
    this.onAwardUnlock = null;
    this.activePlayerIndex = 0;
    this.firstMatchTurn = false;
    this.turns = 0;
  }

  init(pairsCount, onWin, onTurnUpdate, onAwardUnlock) {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = pairsCount;
    this.onWin = onWin;
    this.onTurnUpdate = onTurnUpdate;
    this.onAwardUnlock = onAwardUnlock;
    this.activePlayerIndex = 0;
    this.firstMatchTurn = false;
    this.turns = 0;
    awardChecker.reset();
    this.#notifyTurnUpdate();
  }

  handleCardClick(cardApi) {
    if (this.isLocked || cardApi.isFlipped || cardApi.isMatched) return;

    cardApi.flip();
    this.flippedCards.push(cardApi);

    if (this.flippedCards.length === 2) {
      this.#evaluateMatch();
    }
  }

  #evaluateMatch() {
    this.isLocked = true;
    this.turns += 1;

    const [card1, card2] = this.flippedCards;
    const isMatch = card1.pokemon.id === card2.pokemon.id;
    const activePlayer = this.#getActivePlayer();

    activePlayer?.addMovements(1);

    if (isMatch) {
      this.#handleMatch(card1, card2, activePlayer);
    } else {
      this.#handleMismatch(card1, card2);
    }
  }

  #handleMatch(card1, card2, activePlayer) {
    this.matches += 1;
    this.firstMatchTurn = this.turns === 1;
    card1.markAsMatched();
    card2.markAsMatched();

    activePlayer?.addPoints(GameEngine.pointsPerMatch);

    awardChecker.onMatch();
    this.#checkMidGameAwards();
    this.#resetBoardState();
    this.#notifyTurnUpdate();

    if (this.matches === this.pairsCount) {
      setTimeout(() => this.onWin?.(this.turns), 500);
    }
  }

  #handleMismatch(card1, card2) {
    awardChecker.onMismatch();
    setTimeout(() => {
      card1.unflip();
      card2.unflip();
      this.#resetBoardState();
      this.#switchToNextPlayer();
      this.#notifyTurnUpdate();
    }, 1000);
  }

  #switchToNextPlayer() {
    const playerCount = gameState.players.length;
    if (playerCount > 1) {
      this.activePlayerIndex = (this.activePlayerIndex + 1) % playerCount;
    }
  }

  #getActivePlayer() {
    return gameState.players[this.activePlayerIndex];
  }

  #checkMidGameAwards() {
    const awards = awardChecker.checkMidGameAwards({
      firstMoveMatch: this.firstMatchTurn,
      difficulty: gameState.difficulty,
      gameMode: gameState.gameMode,
    });

    if (this.onAwardUnlock && awards.length > 0) {
      awards.forEach((award) => this.onAwardUnlock(award));
    }
  }

  #resetBoardState() {
    this.flippedCards = [];
    this.isLocked = false;
  }

  #notifyTurnUpdate() {
    this.onTurnUpdate?.(this.turns, this.activePlayerIndex);
  }
}

export default new GameEngine();
