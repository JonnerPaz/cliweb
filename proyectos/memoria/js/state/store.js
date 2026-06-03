/**
 * @class GameState - Estado del juego
 * @description Clase que representa el estado del juego. NO CREAR UNA NUEVA INSTANCIA, USAR GameState.instance
 * @property {string} gameMode - Modo del juego
 * @property {string} difficulty - Dificultad del juego
 * @property {string} theme - Tematica del juego
 * @property {number} turns - Turnos del juego
 * @property {import("./User.js").User[]} players - Jugadores del juego
 * @constructor
 */
class GameState {
  #gameMode = null; // "solo" | "pvp" | "free"
  #difficulty = null; // Facil, Medio, Dificil
  #theme = null; // Temática general, por tipo pokemon, etc.
  #turns = 0;
  #players = [];

  static instance = null;

  constructor() {
    if (GameState.instance) {
      return GameState.instance;
    }

    this.gameMode = null; // "solo" | "pvp" | "free"
    this.difficulty = null; // Facil, Medio, Dificil
    this.theme = null; // Temática general, por tipo pokemon, etc.
    this.turns = 0;
    this.players = [];

    GameState.instance = this;
  }

  get gameMode() {
    return this.#gameMode;
  }

  set gameMode(gameMode) {
    this.#gameMode = gameMode;
  }

  get difficulty() {
    return this.#difficulty;
  }

  set difficulty(difficulty) {
    this.#difficulty = difficulty;
  }

  get theme() {
    return this.#theme;
  }

  set theme(theme) {
    this.#theme = theme;
  }

  get turns() {
    return this.#turns;
  }

  set turns(turns) {
    if (turns < 0 || isNaN(turns) || turns < this.#turns) return;
    this.#turns = turns;
  }

  get players() {
    return this.#players;
  }

  /**
   * @param {import("./User.js").User} player
   * @returns {void}
   */
  setNewPlayer(player) {
    if (
      !player ||
      !(player instanceof User) ||
      this.#players.includes(player)
    ) {
      return;
    }
    this.#players.push(player);
  }

  reset() {
    this.#gameMode = null;
    this.#difficulty = null;
    this.#theme = null;
    this.#turns = 0;
    this.#players = [];
  }
}

// Singleton
export default new GameState();
