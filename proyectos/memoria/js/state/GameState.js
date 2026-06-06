import { User } from "./User.js";

/**
 * @class GameState - Estado del juego
 * @description Clase que representa el estado del juego. NO CREAR UNA NUEVA INSTANCIA, USAR GameState.instance
 * @property {string} gameMode - Modo del juego
 * @property {string} difficulty - Dificultad del juego
 * @property {string} theme - Temática del juego
 * @property {string} playerName - Nombre del jugador (modo Solitario)
 * @property {number} playerCount - Cantidad de jugadores (modo PvP)
 * @property {boolean} musicEnabled - Si la música de fondo está activada
 * @property {number} turns - Turnos del juego
 * @property {import("./User.js").User[]} players - Jugadores del juego
 * @constructor
 */
class GameState {
  #gameMode = "solo"; // "solo" | "pvp" | "free"
  #difficulty = "facil"; // facil, medio, dificil
  #theme = "random"; // "random" | tipo pokemon
  #playerName = "Entrenador sin nombre";
  #playerCount = 1;
  #musicEnabled = false;
  #turns = 0;
  #players = [];

  static instance = null;

  constructor() {
    if (GameState.instance) {
      return GameState.instance;
    }

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

  get playerName() {
    return this.#playerName;
  }

  set playerName(playerName) {
    if (typeof playerName !== "string") return;
    this.#playerName = playerName.slice(0, 20);
  }

  get playerCount() {
    return this.#playerCount;
  }

  set playerCount(playerCount) {
    const n = Number(playerCount);
    if (!Number.isInteger(n) || (n !== 1 && n !== 2)) return;
    this.#playerCount = n;
  }

  get musicEnabled() {
    return this.#musicEnabled;
  }

  set musicEnabled(musicEnabled) {
    this.#musicEnabled = Boolean(musicEnabled);
  }

  get players() {
    return this.#players;
  }

  set players(players) {
    if (!Array.isArray(players)) return;
    this.#players = players;
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
    this.#gameMode = "solo";
    this.#difficulty = "facil";
    this.#theme = "random";
    this.#playerName = "Entrenador sin nombre";
    this.#playerCount = 1;
    this.#musicEnabled = false;
    this.#turns = 0;
    this.#players = [];
  }
}

// Singleton
export default new GameState();
