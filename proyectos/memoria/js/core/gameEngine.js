import gameState from "../state/GameState.js";

class GameEngine {
  static pointsPerMatch = 10;

  constructor() {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = 0;
    this.onWin = null;
    this.onTurnUpdate = null;
    this.activePlayerIndex = 0;
  }

  init(pairsCount, onWin, onTurnUpdate) {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = pairsCount;
    this.onWin = onWin;
    this.onTurnUpdate = onTurnUpdate;
    this.activePlayerIndex = 0;
    gameState.turns = 0;
    if (this.onTurnUpdate) this.onTurnUpdate(gameState.turns);
  }

  handleCardClick(cardApi) {
    if (this.isLocked || cardApi.isFlipped || cardApi.isMatched) return;

    cardApi.flip();
    this.flippedCards.push(cardApi);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    gameState.turns += 1;

    const [card1, card2] = this.flippedCards;
    const isMatch = card1.pokemon.id === card2.pokemon.id;

    const players = gameState.players;
    const active = players[this.activePlayerIndex];

    if (active) active.addMovements(1);

    if (isMatch) {
      this.matches += 1;
      card1.markAsMatched();
      card2.markAsMatched();

      if (active) active.addPoints(GameEngine.pointsPerMatch);

      this.resetBoardState();

      if (this.onTurnUpdate)
        this.onTurnUpdate(gameState.turns, this.activePlayerIndex);

      if (this.matches === this.pairsCount) {
        setTimeout(() => {
          if (this.onWin) this.onWin(gameState.turns);
        }, 500);
      }
    } else {
      setTimeout(() => {
        card1.unflip();
        card2.unflip();
        this.resetBoardState();

        if (players.length > 1) {
          this.activePlayerIndex =
            (this.activePlayerIndex + 1) % players.length;
        }

        if (this.onTurnUpdate)
          this.onTurnUpdate(gameState.turns, this.activePlayerIndex);
      }, 1000);
    }
  }

  resetBoardState() {
    this.flippedCards = [];
    this.isLocked = false;
  }
}

export default new GameEngine();
