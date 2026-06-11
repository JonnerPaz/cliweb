import { User } from "./User.js";

/**
 * @class GameState - Estado del juego
 * @description Clase que representa el estado del juego. NO CREAR UNA NUEVA INSTANCIA, USAR GameState.instance
 * @property {string} gameMode - Modo del juego
 * @property {string} difficulty - Dificultad del juego
 * @property {string} theme - Temática del juego
 * @property {{player1:string, player2:string}} playerNames - Nombres de los jugadores
 * @property {number} playerCount - Cantidad de jugadores (derivado de players.length)
 * @property {boolean} musicEnabled - Si la música de fondo está activada
 * @property {number} turns - Turnos del juego
 * @property {import("./User.js").User[]} players - Jugadores del juego
 * @constructor
 */
class GameState {
  #gameMode = "solo"; // "solo" | "pvp" | "free"
  #difficulty = "facil"; // facil, medio, dificil
  #theme = "random"; // "random" | tipo pokemon
  #playerNames = { player1: "", player2: "" };
  #musicEnabled = false;
  #musicTrack = "pokemon-center-bgmusic";
  #turns = 0;
  #rounds = 0;
  #results = null;
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

  get playerNames() {
    return this.#playerNames;
  }

  set playerNames(names) {
    if (!names || typeof names !== "object") return;
    this.#playerNames = {
      player1:
        typeof names.player1 === "string" ? names.player1.slice(0, 20) : "",
      player2:
        typeof names.player2 === "string" ? names.player2.slice(0, 20) : "",
    };
  }

  get playerCount() {
    return this.#players.length > 0 ? this.#players.length : 1;
  }

  get musicEnabled() {
    return this.#musicEnabled;
  }

  set musicEnabled(musicEnabled) {
    this.#musicEnabled = Boolean(musicEnabled);
  }

  get musicTrack() {
    return this.#musicTrack;
  }

  set musicTrack(track) {
    if (typeof track !== "string") return;
    this.#musicTrack = track;
  }

  get rounds() {
    return this.#rounds;
  }

  set rounds(rounds) {
    this.#rounds = rounds;
  }

  get results() {
    return this.#results;
  }

  set results(results) {
    this.#results = results;
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
    this.#playerNames = { player1: "", player2: "" };
    this.#musicEnabled = false;
    this.#musicTrack = "pokemon-center-bgmusic";
    this.#turns = 0;
    this.#rounds = 0;
    this.#results = null;
    this.#players = [];
  }
}

// Singleton
export default new GameState();
