import gameState from "../state/GameState.js";

class AudioController {
  constructor() {
    this.bgMusic = new Audio("assets/audio/pokemon-center-bgmusic.m4a");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    window.addEventListener("music-setting-changed", (e) => {
      this.toggleMusic(e.detail.enabled);
    });

    window.addEventListener("music-track-changed", (e) => {
      this.changeMusic(e.detail.track);
    });
  }

  init() {
    if (gameState.musicEnabled) {
      this.toggleMusic(true);
    }
  }

  toggleMusic(enabled) {
    if (enabled) {
      this.bgMusic.play();
      this.bgMusic.catch((err) => {
        console.warn(
          "Reproducción automática bloqueada por el navegador.",
          err
        );
      });
    } else {
      this.bgMusic.pause();
    }
  }

  changeMusic(track) {
    if (!track) return;
    const src = `assets/audio/${track}.m4a`;
    if (this.bgMusic.src.endsWith(`/${track}.m4a`)) return;
    const wasPlaying = !this.bgMusic.paused;
    this.bgMusic.src = src;
    if (wasPlaying || gameState.musicEnabled) {
      this.bgMusic.play().catch(() => {});
    }
  }
}

export const audioController = new AudioController();
