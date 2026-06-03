export class MusicToggle extends HTMLElement {
  constructor() {
    super();
    this.isPlaying = false;
    // Creamos el elemento audio internamente
    this.audio = new Audio("../../../assets/pokemon-center-bgmusic.m4a");
    this.audio.loop = true; // Para que la música no se corte
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  render() {
    this.innerHTML = `
      <button id="music-btn" class="music-control">
        <span id="status-icon">🔇</span>
      </button>
    `;
  }

  setupListeners() {
    this.querySelector("#music-btn").addEventListener("click", () =>
      this.toggleMusic()
    );
  }

  toggleMusic() {
    const icon = this.querySelector("#status-icon");

    if (this.isPlaying) {
      this.audio.pause();
      icon.textContent = "🔇";
    } else {
      this.audio
        .play()
        .catch((e) => console.log("El navegador requiere interacción previa"));
      icon.textContent = "🔊";
    }

    this.isPlaying = !this.isPlaying;
  }
}

customElements.define("music-toggle", MusicToggle);
