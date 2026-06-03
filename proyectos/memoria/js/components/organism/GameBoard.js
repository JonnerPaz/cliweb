import gameState from "../../state/store.js";
import { PokeApi } from "../../api/pokeapi.js";
import { Card } from "../atoms/Card.js";

export class GameBoard extends HTMLElement {
  constructor() {
    super();
    this.api = new PokeApi();
    this.cardsData = [];
    this.flippedCards = [];
    this.isLocked = false;
    this.matches = 0;
    this.gridSize = 4; // Por defecto 4x4 (facil)
    this.pairsCount = 8;
  }

  async connectedCallback() {
    this.setupDifficulty();
    this.renderLoading();
    await this.initGame();
    this.render();
    this.setupEvents();
  }

  setupDifficulty() {
    // Definimos el grid basado en la dificultad
    const diff = gameState.difficulty || "Facil"; // Default a Facil si no está configurado
    switch (diff) {
      case "Medio":
        this.gridSize = 6;
        break;
      case "Dificil":
        this.gridSize = 8;
        break;
      case "Facil":
      default:
        this.gridSize = 4;
        break;
    }

    // Total de pares necesarios = (columnas * columnas) / 2
    this.pairsCount = (this.gridSize * this.gridSize) / 2;
  }

  renderLoading() {
    this.innerHTML = `
      <div class="gameboard-loading">
        <h2>Cargando Pokémon...</h2>
      </div>
    `;
  }

  async initGame() {
    try {
      const promises = [];
      // Solicitamos N pokemones únicos (o aleatorios)
      for (let i = 0; i < this.pairsCount; i++) {
        promises.push(this.api.getRandomPokemon(PokeApi.MAX_POKEMON_NUM));
      }

      const results = await Promise.all(promises);

      // Filtramos solo los que fueron exitosos y extraemos el valor
      const validPokemons = results
        .filter((res) => res.isSuccess)
        .map((res) => res.value);

      // Duplicamos para hacer los pares
      const deck = [...validPokemons, ...validPokemons];

      // Mezclamos (Fisher-Yates)
      this.cardsData = this.shuffle(deck);
      this.matches = 0;
      this.flippedCards = [];
      this.isLocked = false;
      gameState.turns = 0; // Reiniciamos turnos
    } catch (error) {
      console.error("Error inicializando el tablero:", error);
      this.innerHTML = `<div class="error">Error cargando el juego. Intenta de nuevo.</div>`;
    }
  }

  /**
   * @description Mezcla un array usando el algoritmo de Fisher-Yates
   * @param {Array} array
   * @returns {Array}
   */
  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  setupEvents() {
    // Usamos delegación de eventos en el contenedor
    this.addEventListener("click", (e) => {
      // Buscamos si hicimos click en una tarjeta
      const cardElement = e.target.closest("pokemon-card");
      if (!cardElement) return;

      this.handleCardClick(cardElement);
    });
  }

  handleCardClick(card) {
    // Si el tablero está bloqueado, o la tarjeta ya está volteada, o es la misma tarjeta que ya se clickeó
    if (this.isLocked) return;
    // Asumiremos que le pondremos una clase 'is-flipped' o 'is-matched' cuando adaptemos Card.js
    if (
      card.classList.contains("is-flipped") ||
      card.classList.contains("is-matched")
    )
      return;

    // Volteamos la carta (simulamos la acción visual añadiendo la clase por ahora)
    card.classList.add("is-flipped");
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    gameState.turns += 1; // Incrementamos un turno

    const card1 = this.flippedCards[0];
    const card2 = this.flippedCards[1];

    const isMatch = card1.dataset.pokemonId === card2.dataset.pokemonId;

    if (isMatch) {
      this.disableCards();
    } else {
      this.unflipCards();
    }
  }

  disableCards() {
    this.flippedCards[0].classList.add("is-matched");
    this.flippedCards[1].classList.add("is-matched");
    this.matches += 1;
    this.resetBoard();

    if (this.matches === this.pairsCount) {
      setTimeout(() => alert(`¡Ganaste en ${gameState.turns} turnos!`), 500);
    }
  }

  unflipCards() {
    setTimeout(() => {
      this.flippedCards[0].classList.remove("is-flipped");
      this.flippedCards[1].classList.remove("is-flipped");
      this.resetBoard();
    }, 1000);
  }

  resetBoard() {
    this.flippedCards = [];
    this.isLocked = false;
  }

  render() {
    // Generamos las columnas dinámicas para el Grid
    const gridStyle = `grid-template-columns: repeat(${this.gridSize}, 1fr);`;

    this.innerHTML = `
      <div class="gameboard" style="${gridStyle}">
        ${this.cardsData
          .map(
            (pokemon, index) => `
          <!-- Nota: Adaptaremos Card.js más adelante para que lea estos data-attributes -->
          <pokemon-card
            data-index="${index}"
            data-pokemon-id="${pokemon.id}"
            data-pokemon-name="${pokemon.name}"
            class="gameboard__card"
          ></pokemon-card>
        `
          )
          .join("")}
      </div>
    `;
  }
}

customElements.define("game-board", GameBoard);
