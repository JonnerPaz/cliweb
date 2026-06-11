class MusicService {
  constructor() {
    this._enabled = false;
    this._track = "pokemon-center-bgmusic";
    this._audio = new Audio(`assets/audio/${this._track}.m4a`);
    this._audio.loop = true;
    this._audio.volume = 0.3;
    this._listeners = [];
  }

  get enabled() {
    return this._enabled;
  }

  get track() {
    return this._track;
  }

  toggle() {
    this.setEnabled(!this._enabled);
  }

  setEnabled(enabled) {
    this._enabled = enabled;
    if (enabled) {
      this._audio.play().catch(() => {});
    } else {
      this._audio.pause();
    }
    this._notify();
  }

  setTrack(track) {
    if (!track || track === this._track) return;
    const wasPlaying = !this._audio.paused;
    this._audio.src = `assets/audio/${track}.m4a`;
    this._track = track;
    if (wasPlaying || this._enabled) {
      this._audio.play().catch(() => {});
    }
    this._notify();
  }

  onChange(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter((cb) => cb !== callback);
    };
  }

  _notify() {
    this._listeners.forEach((cb) => cb(this));
  }
}

export const musicService = new MusicService();
