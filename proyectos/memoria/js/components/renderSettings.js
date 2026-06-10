import gameState from "../state/GameState.js";

const POKEMON_TYPES = [
  { value: "random", label: "Aleatoria" },
  { value: "normal", label: "Normal" },
  { value: "fire", label: "Fuego" },
  { value: "water", label: "Agua" },
  { value: "grass", label: "Planta" },
  { value: "electric", label: "Eléctrico" },
  { value: "ice", label: "Hielo" },
  { value: "fighting", label: "Lucha" },
  { value: "poison", label: "Veneno" },
  { value: "ground", label: "Tierra" },
  { value: "flying", label: "Volador" },
  { value: "psychic", label: "Psíquico" },
  { value: "bug", label: "Bicho" },
  { value: "rock", label: "Roca" },
  { value: "ghost", label: "Fantasma" },
  { value: "dragon", label: "Dragón" },
  { value: "dark", label: "Siniestro" },
  { value: "steel", label: "Acero" },
  { value: "fairy", label: "Hada" },
];

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

let activePlayersContainer = null;

function buildPlayerItem({ id, label, placeholder }) {
  return `
    <div class="settings__item">
      <label class="settings__item--label" for="${id}">
        <span class="settings__item-icon">👤</span>
        ${label}
      </label>
      <input
        type="text"
        id="${id}"
        class="settings__input"
        maxlength="20"
        placeholder="${placeholder}"
        value=""
      />
    </div>
  `;
}

function renderPlayersSection() {
  const container = activePlayersContainer;
  if (!container) return;

  if (container._listeners) {
    for (const [el, ev, fn] of container._listeners) {
      el.removeEventListener(ev, fn);
    }
    container._listeners = null;
  }

  container.innerHTML = "";

  const mode = gameState.gameMode;
  const items = [];

  if (mode === "pvp") {
    items.push(
      buildPlayerItem({
        id: "settings-player-1-name",
        label: "Jugador 1",
        placeholder: "Entrenador 1",
      })
    );
    items.push(
      buildPlayerItem({
        id: "settings-player-2-name",
        label: "Jugador 2",
        placeholder: "Entrenador 2",
      })
    );
  } else {
    items.push(
      buildPlayerItem({
        id: "settings-player-name",
        label: "Tu nombre",
        placeholder: "Entrenador",
      })
    );
  }

  container.innerHTML = items.join("");

  const listeners = [];
  const player1 = container.querySelector("#settings-player-1-name");
  const player2 = container.querySelector("#settings-player-2-name");
  const playerName = container.querySelector("#settings-player-name");

  if (player1) {
    const fn = (e) =>
      (gameState.playerNames = { ...gameState.playerNames, player1: e.target.value });
    player1.addEventListener("input", fn);
    listeners.push([player1, "input", fn]);
  }
  if (player2) {
    const fn = (e) =>
      (gameState.playerNames = { ...gameState.playerNames, player2: e.target.value });
    player2.addEventListener("input", fn);
    listeners.push([player2, "input", fn]);
  }
  if (playerName) {
    const fn = (e) =>
      (gameState.playerNames = { player1: e.target.value });
    playerName.addEventListener("input", fn);
    listeners.push([playerName, "input", fn]);
  }

  container._listeners = listeners;
}

const handleModeChange = (e) => {
  gameState.gameMode = e.target.value;
  renderPlayersSection();
};

const handleDiffChange = (e) => (gameState.difficulty = e.target.value);
const handleThemeChange = (e) => (gameState.theme = e.target.value);
const handleMusicChange = (e) => {
  const enabled = e.target.checked;
  gameState.musicEnabled = enabled;
  window.dispatchEvent(
    new CustomEvent("music-setting-changed", { detail: { enabled } })
  );
};

const handleMusicTrackChange = (e) => {
  const track = e.target.value;
  gameState.musicTrack = track;
  window.dispatchEvent(
    new CustomEvent("music-track-changed", { detail: { track } })
  );
};

const themeOptions = POKEMON_TYPES.map(
  (t) =>
    `<option value="${escapeAttr(t.value)}"${
      t.value === gameState.theme ? " selected" : ""
    }>${t.label}</option>`
).join("");

export function renderSettings(container) {
  const gameMode = gameState.gameMode ?? "solo";
  const difficulty = gameState.difficulty ?? "Facil";
  const musicEnabled = Boolean(gameState.musicEnabled);
  const musicTrack = gameState.musicTrack;

  const MUSIC_TRACKS = [
    { value: "pokemon-center-bgmusic", label: "Centro Pokémon" },
    { value: "aspertia-city", label: "Ciudad Aspertia" },
    { value: "driftveil-city", label: "Ciudad Espiral" },
    { value: "summer-in-kagome", label: "Verano en Kagome" },
  ];

  const musicTrackOptions = MUSIC_TRACKS.map(
    (t) =>
      `<option value="${escapeAttr(t.value)}"${
        t.value === musicTrack ? " selected" : ""
      }>${t.label}</option>`
  ).join("");

  container.innerHTML = `
    <section class="settings" aria-label="Configuración de la partida">
      <h2 class="settings__title">
        <span class="settings__title-icon" aria-hidden="true">⚙️</span>
        Settings
      </h2>

      <div class="settings__container">
        <div class="settings__item">
          <label class="settings__item--label" for="settings-mode">
            <span class="settings__item-icon" aria-hidden="true">🎮</span>
            Modo de juego
          </label>
          <select id="settings-mode" class="settings__select">
            <option value="solo"${gameMode === "solo" ? " selected" : ""}>Solitario</option>
            <option value="pvp"${gameMode === "pvp" ? " selected" : ""}>PvP</option>
            <option value="free"${gameMode === "free" ? " selected" : ""}>Libre</option>
          </select>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-difficulty">
            <span class="settings__item-icon">🏆</span>
            Dificultad
          </label>
          <select id="settings-difficulty" class="settings__select">
            <option value="Facil"${difficulty === "Facil" ? " selected" : ""}>Fácil (4×4)</option>
            <option value="Medio"${difficulty === "Medio" ? " selected" : ""}>Medio (6×6)</option>
            <option value="Dificil"${difficulty === "Dificil" ? " selected" : ""}>Difícil (8×8)</option>
          </select>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-theme">
            <span class="settings__item-icon" aria-hidden="true">🎨</span>
            Temática
          </label>
          <select id="settings-theme" class="settings__select">
            ${themeOptions}
          </select>
        </div>

        <div id="settings-players"></div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-music">
            <span class="settings__item-icon" aria-hidden="true">🎵</span>
            Música de fondo
          </label>
          <label class="settings__switch">
            <input
              type="checkbox"
              id="settings-music"
              class="settings__switch-input"
              ${musicEnabled ? "checked" : ""}
            />
            <span class="settings__switch-slider" aria-hidden="true"></span>
          </label>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-music-track">
            <span class="settings__item-icon" aria-hidden="true">🎶</span>
            Pista musical
          </label>
          <select id="settings-music-track" class="settings__select">
            ${musicTrackOptions}
          </select>
        </div>
      </div>
    </section>
  `;

  const modeSelect = container.querySelector("#settings-mode");
  const difficultySelect = container.querySelector("#settings-difficulty");
  const themeSelect = container.querySelector("#settings-theme");
  const musicSwitch = container.querySelector("#settings-music");
  const musicTrackSelect = container.querySelector("#settings-music-track");
  const playersContainer = container.querySelector("#settings-players");

  activePlayersContainer = playersContainer;
  renderPlayersSection();

  modeSelect.addEventListener("change", handleModeChange);
  difficultySelect.addEventListener("change", handleDiffChange);
  themeSelect.addEventListener("change", handleThemeChange);
  musicSwitch.addEventListener("change", handleMusicChange);
  musicTrackSelect.addEventListener("change", handleMusicTrackChange);

  function validate() {
    const mode = gameState.gameMode;
    const errors = {};
    const player1 = playersContainer.querySelector("#settings-player-1-name");
    const player2 = playersContainer.querySelector("#settings-player-2-name");
    const playerName = playersContainer.querySelector("#settings-player-name");

    [player1, player2, playerName].forEach((el) => {
      if (el) el.classList.remove("settings__input--error");
    });

    if (mode === "pvp") {
      if (!player1 || player1.value.trim() === "") {
        errors.playerName = true;
        if (player1) player1.classList.add("settings__input--error");
      }
      if (!player2 || player2.value.trim() === "") {
        errors.player2Name = true;
        if (player2) player2.classList.add("settings__input--error");
      }
    } else {
      if (!playerName || playerName.value.trim() === "") {
        errors.playerName = true;
        if (playerName) playerName.classList.add("settings__input--error");
      }
    }

    return { ok: Object.keys(errors).length === 0, errors };
  }

  return {
    cleanup: function () {
      modeSelect.removeEventListener("change", handleModeChange);
      difficultySelect.removeEventListener("change", handleDiffChange);
      themeSelect.removeEventListener("change", handleThemeChange);
      musicSwitch.removeEventListener("change", handleMusicChange);
      musicTrackSelect.removeEventListener("change", handleMusicTrackChange);

      if (playersContainer._listeners) {
        for (const [el, ev, fn] of playersContainer._listeners) {
          el.removeEventListener(ev, fn);
        }
        playersContainer._listeners = null;
      }

      if (activePlayersContainer === playersContainer) {
        activePlayersContainer = null;
      }

      container.innerHTML = "";
    },
    validate,
  };
}
