import gameState from "../state/GameState.js";

class AudioController {
  constructor() {
    this.bgMusic = new Audio("assets/pokemon-center-bgmusic.m4a");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    // Escuchamos el evento disparado desde el panel de Settings
    window.addEventListener("music-setting-changed", (e) => {
      this.toggleMusic(e.detail.enabled);
    });
  }

  init() {
    // Si la música ya estaba activada en el state, intentamos reproducirla
    if (gameState.musicEnabled) {
      this.toggleMusic(true);
    }
  }

  toggleMusic(enabled) {
    if (enabled) {
      this.bgMusic.play();
      this.bgMusic.catch((err) => {
        console.warn(
          "Reproducción automática bloqueada por el navegador. El usuario debe interactuar con la página primero.",
          err
        );
      });
    } else {
      this.bgMusic.pause();
    }
  }

  changeMusic(song) {
    if (this.bgMusic.src === song || !song) return;
    this.bgMusic.src = song;
    this.bgMusic.play();
  }
}

export const audioController = new AudioController();
