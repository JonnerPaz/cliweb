import gameState from "../state/GameState.js";

class GameEngine {
  constructor() {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = 0;
    this.onWin = null;
    this.onTurnUpdate = null;
  }

  init(pairsCount, onWin, onTurnUpdate) {
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.pairsCount = pairsCount;
    this.onWin = onWin;
    this.onTurnUpdate = onTurnUpdate;
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
    if (this.onTurnUpdate) this.onTurnUpdate(gameState.turns);

    const [card1, card2] = this.flippedCards;
    const isMatch = card1.pokemon.id === card2.pokemon.id;

    if (isMatch) {
      this.matches += 1;
      card1.markAsMatched();
      card2.markAsMatched();
      this.resetBoardState();

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
      }, 1000);
    }
  }

  resetBoardState() {
    this.flippedCards = [];
    this.isLocked = false;
  }
}

export default new GameEngine();
