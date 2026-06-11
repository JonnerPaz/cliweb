import { User } from "./User.js";

class GameState {
  #gameMode = "solo";
  #difficulty = "facil";
  #theme = "random";
  #musicEnabled = false;
  #musicTrack = "pokemon-center-bgmusic";
  #turns = 0;
  #rounds = 0;
  #results = null;
  #players = { player1: null, player2: null };

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

  get playerCount() {
    let count = 0;
    if (this.#players.player1) count++;
    if (this.#players.player2) count++;
    return count > 0 ? count : 1;
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
    if (!players || typeof players !== "object") return;
    this.#players = {
      player1: players.player1 instanceof User ? players.player1 : null,
      player2: players.player2 instanceof User ? players.player2 : null,
    };
  }

  reset() {
    this.#gameMode = "solo";
    this.#difficulty = "facil";
    this.#theme = "random";
    this.#musicEnabled = false;
    this.#musicTrack = "pokemon-center-bgmusic";
    this.#turns = 0;
    this.#rounds = 0;
    this.#results = null;
    this.#players = { player1: null, player2: null };
  }
}

export default new GameState();
